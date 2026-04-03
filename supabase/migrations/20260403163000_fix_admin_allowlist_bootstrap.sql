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

update public.user_entitlements ue
set
  plan = 'admin',
  funding_source = 'admin',
  support_renders_remaining = greatest(ue.support_renders_remaining, 9999),
  premium_renders_remaining = greatest(ue.premium_renders_remaining, 999),
  can_high_quality = true,
  can_publish = true,
  updated_at = timezone('utc', now())
from public.user_directory ud
where ue.user_id = ud.user_id
  and public.is_capsule_admin_email(ud.email);

update public.user_entitlements ue
set
  plan = 'student_free',
  funding_source = 'student_free',
  support_renders_remaining = greatest(ue.support_renders_remaining, 12),
  premium_renders_remaining = 0,
  can_high_quality = false,
  updated_at = timezone('utc', now())
from public.user_directory ud
where ue.user_id = ud.user_id
  and ue.plan = 'admin'
  and not public.is_capsule_admin_email(ud.email);
