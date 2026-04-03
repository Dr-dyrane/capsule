create or replace function public.is_capsule_admin_email(p_email text)
returns boolean
language sql
stable
as $$
  select coalesce(
    lower(trim(p_email)) = any (array['drdyrane@gmail.com', 'hello@dyrane.tech']),
    false
  );
$$;

create or replace function public.is_capsule_admin()
returns boolean
language sql
stable
as $$
  select public.is_capsule_admin_email(auth.jwt() ->> 'email');
$$;

create table if not exists public.user_directory (
  user_id uuid primary key references auth.users(id) on delete cascade not null,
  email text unique not null,
  display_name text,
  avatar_url text,
  updated_at timestamptz not null default timezone('utc', now())
);

grant select on public.user_directory to authenticated;
alter table public.user_directory enable row level security;

drop policy if exists "user_directory_select_self_or_admin" on public.user_directory;
create policy "user_directory_select_self_or_admin"
on public.user_directory
for select
to authenticated
using (auth.uid() = user_id or public.is_capsule_admin());

create or replace function public.sync_current_user_directory(
  p_email text,
  p_display_name text default null,
  p_avatar_url text default null
)
returns public.user_directory
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.user_directory;
begin
  if v_uid is null then
    raise exception 'Unauthorized';
  end if;

  insert into public.user_directory (
    user_id,
    email,
    display_name,
    avatar_url,
    updated_at
  )
  values (
    v_uid,
    lower(trim(p_email)),
    nullif(trim(p_display_name), ''),
    nullif(trim(p_avatar_url), ''),
    timezone('utc', now())
  )
  on conflict (user_id) do update
  set
    email = excluded.email,
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    updated_at = timezone('utc', now())
  returning * into v_row;

  return v_row;
end;
$$;

grant execute on function public.sync_current_user_directory(text, text, text) to authenticated;

create table if not exists public.user_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade not null,
  plan text not null default 'student_free',
  funding_source text not null default 'student_free',
  hero_auto_per_note integer not null default 1,
  support_renders_remaining integer not null default 12,
  premium_renders_remaining integer not null default 0,
  community_reuse_unlimited boolean not null default true,
  can_publish boolean not null default true,
  can_high_quality boolean not null default false,
  expires_at timestamptz,
  notes text,
  updated_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'user_entitlements_plan_check'
  ) then
    alter table public.user_entitlements
      add constraint user_entitlements_plan_check
      check (plan in ('student_free', 'sponsored', 'premium_manual', 'admin'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'user_entitlements_funding_source_check'
  ) then
    alter table public.user_entitlements
      add constraint user_entitlements_funding_source_check
      check (funding_source in ('student_free', 'manual', 'sponsor', 'donor', 'school', 'admin'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'user_entitlements_support_remaining_check'
  ) then
    alter table public.user_entitlements
      add constraint user_entitlements_support_remaining_check
      check (support_renders_remaining >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'user_entitlements_premium_remaining_check'
  ) then
    alter table public.user_entitlements
      add constraint user_entitlements_premium_remaining_check
      check (premium_renders_remaining >= 0);
  end if;
end $$;

grant select on public.user_entitlements to authenticated;
alter table public.user_entitlements enable row level security;

drop policy if exists "user_entitlements_select_self_or_admin" on public.user_entitlements;
create policy "user_entitlements_select_self_or_admin"
on public.user_entitlements
for select
to authenticated
using (auth.uid() = user_id or public.is_capsule_admin());

create or replace function public.get_or_create_user_entitlement()
returns public.user_entitlements
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.user_entitlements;
begin
  if v_uid is null then
    raise exception 'Unauthorized';
  end if;

  insert into public.user_entitlements (
    user_id,
    plan,
    funding_source,
    hero_auto_per_note,
    support_renders_remaining,
    premium_renders_remaining,
    community_reuse_unlimited,
    can_publish,
    can_high_quality,
    updated_at
  )
  values (
    v_uid,
    case when public.is_capsule_admin() then 'admin' else 'student_free' end,
    case when public.is_capsule_admin() then 'admin' else 'student_free' end,
    1,
    case when public.is_capsule_admin() then 9999 else 12 end,
    case when public.is_capsule_admin() then 999 else 0 end,
    true,
    true,
    public.is_capsule_admin(),
    timezone('utc', now())
  )
  on conflict (user_id) do nothing;

  select *
  into v_row
  from public.user_entitlements
  where user_id = v_uid;

  return v_row;
end;
$$;

grant execute on function public.get_or_create_user_entitlement() to authenticated;

create table if not exists public.entitlement_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  granted_by uuid not null references auth.users(id) on delete cascade,
  grant_type text not null default 'manual_grant',
  support_renders integer not null default 0,
  premium_renders integer not null default 0,
  plan text,
  funding_source text,
  reason text,
  source_reference text,
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

grant select on public.entitlement_grants to authenticated;
alter table public.entitlement_grants enable row level security;

drop policy if exists "entitlement_grants_select_self_or_admin" on public.entitlement_grants;
create policy "entitlement_grants_select_self_or_admin"
on public.entitlement_grants
for select
to authenticated
using (auth.uid() = user_id or public.is_capsule_admin());

create or replace function public.get_or_create_user_entitlement_for(p_user_id uuid)
returns public.user_entitlements
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.user_entitlements;
  v_email text;
begin
  select lower(email)
  into v_email
  from public.user_directory
  where user_id = p_user_id;

  insert into public.user_entitlements (
    user_id,
    plan,
    funding_source,
    hero_auto_per_note,
    support_renders_remaining,
    premium_renders_remaining,
    community_reuse_unlimited,
    can_publish,
    can_high_quality,
    updated_at
  )
  values (
    p_user_id,
    case when public.is_capsule_admin_email(v_email) then 'admin' else 'student_free' end,
    case when public.is_capsule_admin_email(v_email) then 'admin' else 'student_free' end,
    1,
    case when public.is_capsule_admin_email(v_email) then 9999 else 12 end,
    case when public.is_capsule_admin_email(v_email) then 999 else 0 end,
    true,
    true,
    public.is_capsule_admin_email(v_email),
    timezone('utc', now())
  )
  on conflict (user_id) do nothing;

  select *
  into v_row
  from public.user_entitlements
  where user_id = p_user_id;

  return v_row;
end;
$$;

grant execute on function public.get_or_create_user_entitlement_for(uuid) to authenticated;

create or replace function public.admin_grant_user_entitlement(
  p_email text,
  p_plan text default null,
  p_support_renders integer default 0,
  p_premium_renders integer default 0,
  p_funding_source text default 'manual',
  p_reason text default null,
  p_source_reference text default null,
  p_expires_at timestamptz default null,
  p_grant_type text default 'manual_grant'
)
returns table (
  user_id uuid,
  email text,
  plan text,
  funding_source text,
  support_renders_remaining integer,
  premium_renders_remaining integer,
  can_high_quality boolean,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid := auth.uid();
  v_target public.user_directory;
  v_row public.user_entitlements;
  v_plan text;
  v_funding text;
begin
  if v_admin is null or not public.is_capsule_admin() then
    raise exception 'Unauthorized';
  end if;

  select *
  into v_target
  from public.user_directory
  where lower(email) = lower(trim(p_email))
  limit 1;

  if v_target.user_id is null then
    raise exception 'User not found';
  end if;

  perform public.get_or_create_user_entitlement_for(v_target.user_id);

  select *
  into v_row
  from public.user_entitlements
  where user_id = v_target.user_id;

  v_plan := coalesce(nullif(trim(p_plan), ''), v_row.plan);
  v_funding := coalesce(nullif(trim(p_funding_source), ''), v_row.funding_source);

  update public.user_entitlements
  set
    plan = v_plan,
    funding_source = v_funding,
    support_renders_remaining = support_renders_remaining + greatest(coalesce(p_support_renders, 0), 0),
    premium_renders_remaining = premium_renders_remaining + greatest(coalesce(p_premium_renders, 0), 0),
    can_high_quality = case
      when v_plan in ('sponsored', 'premium_manual', 'admin') then true
      when premium_renders_remaining + greatest(coalesce(p_premium_renders, 0), 0) > 0 then true
      else can_high_quality
    end,
    expires_at = coalesce(p_expires_at, expires_at),
    notes = coalesce(nullif(trim(p_reason), ''), notes),
    updated_at = timezone('utc', now())
  where user_id = v_target.user_id
  returning *
  into v_row;

  insert into public.entitlement_grants (
    user_id,
    granted_by,
    grant_type,
    support_renders,
    premium_renders,
    plan,
    funding_source,
    reason,
    source_reference,
    expires_at
  )
  values (
    v_target.user_id,
    v_admin,
    coalesce(nullif(trim(p_grant_type), ''), 'manual_grant'),
    greatest(coalesce(p_support_renders, 0), 0),
    greatest(coalesce(p_premium_renders, 0), 0),
    v_plan,
    v_funding,
    nullif(trim(p_reason), ''),
    nullif(trim(p_source_reference), ''),
    p_expires_at
  );

  return query
  select
    v_target.user_id,
    v_target.email,
    v_row.plan,
    v_row.funding_source,
    v_row.support_renders_remaining,
    v_row.premium_renders_remaining,
    v_row.can_high_quality,
    v_row.expires_at;
end;
$$;
grant execute on function public.admin_grant_user_entitlement(text, text, integer, integer, text, text, text, timestamptz, text) to authenticated;

create or replace function public.consume_generation_credit(p_kind text)
returns public.user_entitlements
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.user_entitlements;
begin
  if v_uid is null then
    raise exception 'Unauthorized';
  end if;

  perform public.get_or_create_user_entitlement();

  select *
  into v_row
  from public.user_entitlements
  where user_id = v_uid;

  if v_row.expires_at is not null and v_row.expires_at < timezone('utc', now()) and v_row.plan <> 'admin' then
    raise exception 'Access expired';
  end if;

  if v_row.plan = 'admin' then
    return v_row;
  end if;

  if p_kind = 'premium' then
    if v_row.premium_renders_remaining <= 0 then
      raise exception 'No premium renders remaining';
    end if;

    update public.user_entitlements
    set
      premium_renders_remaining = premium_renders_remaining - 1,
      updated_at = timezone('utc', now())
    where user_id = v_uid
    returning *
    into v_row;

    return v_row;
  end if;

  if p_kind = 'support' then
    if v_row.support_renders_remaining <= 0 then
      raise exception 'No support renders remaining';
    end if;

    update public.user_entitlements
    set
      support_renders_remaining = support_renders_remaining - 1,
      updated_at = timezone('utc', now())
    where user_id = v_uid
    returning *
    into v_row;

    return v_row;
  end if;

  return v_row;
end;
$$;

create or replace function public.refund_generation_credit(
  p_kind text,
  p_units integer default 1
)
returns public.user_entitlements
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.user_entitlements;
  v_units integer := greatest(coalesce(p_units, 1), 1);
begin
  if v_uid is null then
    raise exception 'Unauthorized';
  end if;

  perform public.get_or_create_user_entitlement();

  select *
  into v_row
  from public.user_entitlements
  where user_id = v_uid;

  if v_row.plan = 'admin' then
    return v_row;
  end if;

  if p_kind = 'premium' then
    update public.user_entitlements
    set
      premium_renders_remaining = premium_renders_remaining + v_units,
      updated_at = timezone('utc', now())
    where user_id = v_uid
    returning *
    into v_row;

    return v_row;
  end if;

  if p_kind = 'support' then
    update public.user_entitlements
    set
      support_renders_remaining = support_renders_remaining + v_units,
      updated_at = timezone('utc', now())
    where user_id = v_uid
    returning *
    into v_row;

    return v_row;
  end if;

  return v_row;
end;
$$;

grant execute on function public.consume_generation_credit(text) to authenticated;
grant execute on function public.refund_generation_credit(text, integer) to authenticated;

alter table public.card_jobs
  add column if not exists entitlement_kind text,
  add column if not exists entitlement_units integer not null default 0;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'card_jobs_entitlement_kind_check'
  ) then
    alter table public.card_jobs
      add constraint card_jobs_entitlement_kind_check
      check (entitlement_kind in ('support', 'premium') or entitlement_kind is null);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'card_jobs_entitlement_units_check'
  ) then
    alter table public.card_jobs
      add constraint card_jobs_entitlement_units_check
      check (entitlement_units >= 0);
  end if;
end $$;

create index if not exists idx_user_directory_email on public.user_directory (email);
create index if not exists idx_entitlement_grants_user_id on public.entitlement_grants (user_id, created_at desc);
create index if not exists idx_card_jobs_entitlement_kind on public.card_jobs (entitlement_kind);

insert into public.user_directory (user_id, email, display_name, avatar_url, updated_at)
select
  au.id,
  lower(au.email),
  coalesce(au.raw_user_meta_data ->> 'full_name', p.username),
  coalesce(p.avatar_url, au.raw_user_meta_data ->> 'avatar_url'),
  timezone('utc', now())
from auth.users au
left join public.profiles p on p.id = au.id
where au.email is not null
on conflict (user_id) do update
set
  email = excluded.email,
  display_name = excluded.display_name,
  avatar_url = excluded.avatar_url,
  updated_at = timezone('utc', now());

insert into public.user_entitlements (
  user_id,
  plan,
  funding_source,
  hero_auto_per_note,
  support_renders_remaining,
  premium_renders_remaining,
  community_reuse_unlimited,
  can_publish,
  can_high_quality,
  updated_at
)
select
  ud.user_id,
  case when public.is_capsule_admin_email(ud.email) then 'admin' else 'student_free' end,
  case when public.is_capsule_admin_email(ud.email) then 'admin' else 'student_free' end,
  1,
  case when public.is_capsule_admin_email(ud.email) then 9999 else 12 end,
  case when public.is_capsule_admin_email(ud.email) then 999 else 0 end,
  true,
  true,
  public.is_capsule_admin_email(ud.email),
  timezone('utc', now())
from public.user_directory ud
on conflict (user_id) do nothing;
