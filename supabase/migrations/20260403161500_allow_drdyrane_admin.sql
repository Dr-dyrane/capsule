create or replace function public.is_capsule_admin()
returns boolean
language sql
stable
as $$
  select public.is_capsule_admin_email(auth.jwt() ->> 'email');
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
