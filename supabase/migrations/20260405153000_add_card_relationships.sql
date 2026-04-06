create table if not exists public.card_relationships (
  id uuid primary key default gen_random_uuid(),
  source_card_id uuid not null references public.cards(id) on delete cascade,
  related_card_id uuid not null references public.cards(id) on delete cascade,
  relationship_type text not null,
  reason text not null,
  strength double precision not null default 0.5,
  source text not null default 'heuristic',
  created_at timestamptz not null default timezone('utc', now()),
  unique (source_card_id, related_card_id, relationship_type),
  check (source_card_id <> related_card_id),
  check (strength >= 0 and strength <= 1)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.card_relationships'::regclass
      and conname = 'card_relationships_type_check'
  ) then
    alter table public.card_relationships
      add constraint card_relationships_type_check
      check (relationship_type in (
        'same_story',
        'same_pathophysiology',
        'same_natural_history',
        'same_ruleset'
      ));
  end if;
end
$$;

create index if not exists idx_card_relationships_source
on public.card_relationships (source_card_id, strength desc);

create index if not exists idx_card_relationships_related
on public.card_relationships (related_card_id);

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
      lower(trim(concat_ws(' ', review.title, review.point_text, review.category, review.concept))) as search_text
    from public.community_review_index review
  ),
  source_cards as (
    select *
    from review_cards
  ),
  candidate_cards as (
    select *
    from review_cards
  ),
  relationship_candidates as (
    select
      source.card_id as source_card_id,
      candidate.card_id as related_card_id,
      case
        when source.session_id = candidate.session_id then 'same_story'
        when source.concept_key <> ''
          and source.concept_key = candidate.concept_key
          and (
            source.category_key in ('mechanism', 'disease', 'pathophysiology')
            or candidate.category_key in ('mechanism', 'disease', 'pathophysiology')
            or source.search_text ~ '(mechanism|pathophysiolog|pathology|immune|inflamm|demyelin|fibrosis|autoimmune|damage|dysfunction|attack|cytokine)'
            or candidate.search_text ~ '(mechanism|pathophysiolog|pathology|immune|inflamm|demyelin|fibrosis|autoimmune|damage|dysfunction|attack|cytokine)'
          ) then 'same_pathophysiology'
        when source.concept_key <> ''
          and source.concept_key = candidate.concept_key
          and (
            source.search_text ~ '(natural history|disease course|timeline|progression|progresses|stage|staging|early|late|intermediate|weeks|months|years)'
            or candidate.search_text ~ '(natural history|disease course|timeline|progression|progresses|stage|staging|early|late|intermediate|weeks|months|years)'
          ) then 'same_natural_history'
        when source.search_text ~ '(rule|rules|regulation|legal|law|schedule|controlled|narcotic|prescription|refill|dispens|report|documentation|ethics|exempted|record[- ]keeping)'
          and candidate.search_text ~ '(rule|rules|regulation|legal|law|schedule|controlled|narcotic|prescription|refill|dispens|report|documentation|ethics|exempted|record[- ]keeping)'
          and (
            source.category_key = candidate.category_key
            or (source.concept_key <> '' and source.concept_key = candidate.concept_key)
            or source.session_id = candidate.session_id
          ) then 'same_ruleset'
        else null
      end as relationship_type
    from source_cards source
    join candidate_cards candidate
      on candidate.card_id <> source.card_id
    where p_session_id is null
      or source.session_id = p_session_id
      or candidate.session_id = p_session_id
  ),
  deduped as (
    select distinct on (source_card_id, related_card_id, relationship_type)
      source_card_id,
      related_card_id,
      relationship_type
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
      when 'same_pathophysiology' then 'Same pathophysiology thread'
      when 'same_natural_history' then 'Same disease course'
      when 'same_ruleset' then 'Same ruleset'
      else 'Part of the same note story'
    end as reason,
    case relationship_type
      when 'same_pathophysiology' then 0.95
      when 'same_ruleset' then 0.94
      when 'same_natural_history' then 0.92
      else 0.88
    end as strength,
    'heuristic' as source,
    timezone('utc', now()) as created_at
  from deduped
  on conflict (source_card_id, related_card_id, relationship_type) do update
  set
    reason = excluded.reason,
    strength = excluded.strength,
    source = excluded.source,
    created_at = excluded.created_at;
end;
$$;

grant execute on function public.refresh_public_card_relationships(uuid) to authenticated;

create or replace view public.community_card_relationship_index as
select
  relationships.source_card_id as card_id,
  relationships.related_card_id,
  relationships.relationship_type,
  relationships.reason as relationship_reason,
  relationships.strength as relationship_strength,
  related.session_id as related_session_id,
  related.image_url as related_image_url,
  related.title as related_title,
  related.published_at as related_published_at,
  related.published_by as related_published_by,
  related.community_template as related_community_template,
  related.category as related_category,
  related.concept as related_concept,
  related.author_name as related_author_name,
  related.author_avatar_url as related_author_avatar_url,
  related.like_count as related_like_count,
  related.save_count as related_save_count,
  related.report_count as related_report_count,
  related.trend_score as related_trend_score
from public.card_relationships relationships
join public.community_index source
  on source.card_id = relationships.source_card_id
join public.community_index related
  on related.card_id = relationships.related_card_id;

grant select on public.community_card_relationship_index to anon, authenticated;

select public.refresh_public_card_relationships();
