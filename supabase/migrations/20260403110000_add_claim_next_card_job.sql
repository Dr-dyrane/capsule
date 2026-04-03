create or replace function public.claim_next_card_job(p_session_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_job_id uuid;
begin
  update public.card_jobs
  set
    status = 'running',
    attempt_count = attempt_count + 1,
    claimed_at = timezone('utc', now()),
    finished_at = null,
    last_error = null
  where id = (
    select id
    from public.card_jobs
    where session_id = p_session_id
      and user_id = auth.uid()
      and status = 'queued'
    order by created_at asc
    limit 1
    for update skip locked
  )
  returning id into v_job_id;

  return v_job_id;
end;
$$;

grant execute on function public.claim_next_card_job(uuid) to authenticated;
