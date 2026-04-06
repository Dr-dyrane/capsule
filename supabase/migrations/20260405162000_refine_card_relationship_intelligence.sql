create or replace function public.card_pathophysiology_tags(p_text text)
returns text[]
language sql
immutable
as $$
  with normalized as (
    select lower(coalesce(p_text, '')) as text_value
  )
  select array_remove(array[
    case when text_value ~ '(immune|immunity|immune[- ]mediated)' then 'immune' end,
    case when text_value ~ '(inflamm|inflamed|inflammation)' then 'inflammation' end,
    case when text_value ~ '(autoimmune|auto-antibody|autoantibody)' then 'autoimmune' end,
    case when text_value ~ '(cytokine|interleukin|tnf|jak|signal|signaling)' then 'signaling' end,
    case when text_value ~ '(demyelin|myelin)' then 'demyelination' end,
    case when text_value ~ '(fibrosis|fibrotic|scarring)' then 'fibrosis' end,
    case when text_value ~ '(synovial|synovium|joint destruction|erosion)' then 'joint_damage' end,
    case when text_value ~ '(keratinocyte|epidermal|plaque|psoriatic)' then 'skin_inflammation' end,
    case when text_value ~ '(antibody|b cell|t cell)' then 'adaptive_immunity' end,
    case when text_value ~ '(receptor|ligand|site of action|mechanism)' then 'mechanism' end
  ], null)
  from normalized;
$$;

create or replace function public.card_natural_history_tags(p_text text)
returns text[]
language sql
immutable
as $$
  with normalized as (
    select lower(coalesce(p_text, '')) as text_value
  )
  select array_remove(array[
    case when text_value ~ '(timeline|disease course|natural history|course)' then 'timeline' end,
    case when text_value ~ '(^|[^a-z])(early|initial|onset)([^a-z]|$)' then 'early' end,
    case when text_value ~ '(^|[^a-z])(intermediate|middle)([^a-z]|$)' then 'intermediate' end,
    case when text_value ~ '(^|[^a-z])(late|advanced|end stage)([^a-z]|$)' then 'late' end,
    case when text_value ~ '(progression|progresses|worsens|deteriorat)' then 'progression' end,
    case when text_value ~ '(flare|relapse|remission)' then 'relapse_remission' end,
    case when text_value ~ '(acute|chronic)' then 'tempo' end,
    case when text_value ~ '(weeks|months|years)' then 'time_window' end,
    case when text_value ~ '(stage|staging)' then 'staging' end
  ], null)
  from normalized;
$$;

create or replace function public.card_ruleset_tags(p_text text)
returns text[]
language sql
immutable
as $$
  with normalized as (
    select lower(coalesce(p_text, '')) as text_value
  )
  select array_remove(array[
    case when text_value ~ '(controlled|controlled drug|controlled substance)' then 'controlled' end,
    case when text_value ~ '(narcotic|opioid)' then 'narcotic' end,
    case when text_value ~ '(written prescription|written rx|written only)' then 'written_only' end,
    case when text_value ~ '(refill|no refills|refills?)' then 'refill' end,
    case when text_value ~ '(transfer|transfers?)' then 'transfer' end,
    case when text_value ~ '(schedule|part i|part ii|part iii|benzodiazepine|bdz)' then 'schedule_class' end,
    case when text_value ~ '(record[- ]keeping|documentation|logbook|records?)' then 'recordkeeping' end,
    case when text_value ~ '(dispens|dispensing|supply)' then 'dispensing' end,
    case when text_value ~ '(report|reporting|notify)' then 'reporting' end,
    case when text_value ~ '(ethical|ethics|legal|law|regulation)' then 'legal_ethics' end,
    case when text_value ~ '(exempted|exemption)' then 'exempted' end
  ], null)
  from normalized;
$$;

create or replace function public.first_shared_tag(p_left text[], p_right text[])
returns text
language sql
immutable
as $$
  select shared.tag
  from unnest(coalesce(p_left, array[]::text[])) as shared(tag)
  where shared.tag = any(coalesce(p_right, array[]::text[]))
  limit 1;
$$;

create or replace function public.refresh_public_card_relationships(p_session_id uuid default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_session_id is null then
    delete from public.card_relationships
    where source = 'heuristic';
  else
    delete from public.card_relationships
    where source = 'heuristic'
      and (
        source_card_id in (
          select id
          from public.cards
          where session_id = p_session_id
        )
        or related_card_id in (
          select id
          from public.cards
          where session_id = p_session_id
        )
      );
  end if;

  with review_cards as (
    select
      review.card_id,
      review.session_id,
      lower(coalesce(review.title, '')) as title_key,
      lower(coalesce(review.point_text, '')) as point_key,
      lower(coalesce(review.category, '')) as category_key,
      lower(coalesce(review.concept, '')) as concept_key,
      lower(coalesce(review.note_role, '')) as note_role_key,
      lower(trim(concat_ws(' ', review.title, review.point_text, review.category, review.concept))) as search_text,
      public.card_pathophysiology_tags(concat_ws(' ', review.title, review.point_text, review.category, review.concept)) as pathophysiology_tags,
      public.card_natural_history_tags(concat_ws(' ', review.title, review.point_text, review.category, review.concept)) as natural_history_tags,
      public.card_ruleset_tags(concat_ws(' ', review.title, review.point_text, review.category, review.concept)) as ruleset_tags
    from public.community_review_index review
  ),
  relationship_candidates as (
    select
      source.card_id as source_card_id,
      candidate.card_id as related_card_id,
      public.first_shared_tag(source.pathophysiology_tags, candidate.pathophysiology_tags) as shared_pathophysiology_tag,
      public.first_shared_tag(source.natural_history_tags, candidate.natural_history_tags) as shared_natural_history_tag,
      public.first_shared_tag(source.ruleset_tags, candidate.ruleset_tags) as shared_ruleset_tag,
      source.concept_key,
      source.category_key,
      source.note_role_key,
      candidate.note_role_key as related_note_role_key,
      source.session_id,
      candidate.session_id as related_session_id,
      case
        when source.concept_key <> ''
          and source.concept_key = candidate.concept_key
          and public.first_shared_tag(source.pathophysiology_tags, candidate.pathophysiology_tags) is not null then 'same_pathophysiology'
        when source.concept_key <> ''
          and source.concept_key = candidate.concept_key
          and public.first_shared_tag(source.natural_history_tags, candidate.natural_history_tags) is not null then 'same_natural_history'
        when public.first_shared_tag(source.ruleset_tags, candidate.ruleset_tags) is not null
          and (
            source.category_key = candidate.category_key
            or (source.concept_key <> '' and source.concept_key = candidate.concept_key)
            or source.session_id = candidate.session_id
          ) then 'same_ruleset'
        when source.session_id = candidate.session_id
          and (
            (source.concept_key <> '' and source.concept_key = candidate.concept_key)
            or (source.category_key <> '' and source.category_key = candidate.category_key)
            or source.note_role_key = 'hero'
            or candidate.note_role_key = 'hero'
          ) then 'same_story'
        else null
      end as relationship_type
    from review_cards source
    join review_cards candidate
      on candidate.card_id <> source.card_id
    where p_session_id is null
      or source.session_id = p_session_id
      or candidate.session_id = p_session_id
  ),
  ranked as (
    select distinct on (source_card_id, related_card_id, relationship_type)
      source_card_id,
      related_card_id,
      relationship_type,
      shared_pathophysiology_tag,
      shared_natural_history_tag,
      shared_ruleset_tag,
      concept_key,
      category_key,
      note_role_key,
      related_note_role_key
    from relationship_candidates
    where relationship_type is not null
    order by source_card_id, related_card_id, relationship_type
  )
  insert into public.card_relationships (
    source_card_id,
    related_card_id,
    relationship_type,
    reason,
    strength,
    source,
    created_at
  )
  select
    source_card_id,
    related_card_id,
    relationship_type,
    case relationship_type
      when 'same_pathophysiology' then
        case
          when concept_key <> '' and shared_pathophysiology_tag is not null then
            'Shared '
            || initcap(replace(concept_key, '-', ' '))
            || ' pathophysiology'
            || ' · '
            || initcap(replace(shared_pathophysiology_tag, '_', ' '))
          when concept_key <> '' then
            'Shared ' || initcap(replace(concept_key, '-', ' ')) || ' pathophysiology'
          else
            'Shared pathophysiology thread'
        end
      when 'same_natural_history' then
        case
          when concept_key <> '' and shared_natural_history_tag is not null then
            'Shared '
            || initcap(replace(concept_key, '-', ' '))
            || ' disease course'
            || ' · '
            || initcap(replace(shared_natural_history_tag, '_', ' '))
          when concept_key <> '' then
            'Shared ' || initcap(replace(concept_key, '-', ' ')) || ' disease course'
          else
            'Shared disease course'
        end
      when 'same_ruleset' then
        case
          when shared_ruleset_tag is not null then
            'Shared rule focus'
            || ' · '
            || initcap(replace(shared_ruleset_tag, '_', ' '))
          else
            'Same ruleset'
        end
      else
        case
          when note_role_key = 'hero' or related_note_role_key = 'hero' then 'Part of the same note story'
          when concept_key <> '' then 'Same note thread · ' || initcap(replace(concept_key, '-', ' '))
          when category_key <> '' then 'Same note thread · ' || initcap(replace(category_key, '-', ' '))
          else 'Part of the same note story'
        end
    end as reason,
    case relationship_type
      when 'same_pathophysiology' then
        case when shared_pathophysiology_tag is not null then 0.98 else 0.93 end
      when 'same_ruleset' then
        case when shared_ruleset_tag is not null then 0.97 else 0.91 end
      when 'same_natural_history' then
        case when shared_natural_history_tag is not null then 0.96 else 0.9 end
      else
        case when note_role_key = 'hero' or related_note_role_key = 'hero' then 0.8 else 0.72 end
    end as strength,
    'heuristic' as source,
    timezone('utc', now()) as created_at
  from ranked
  on conflict (source_card_id, related_card_id, relationship_type) do update
  set
    reason = excluded.reason,
    strength = excluded.strength,
    source = excluded.source,
    created_at = excluded.created_at;
end;
$$;

select public.refresh_public_card_relationships();
