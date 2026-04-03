update public.sessions
set visibility = 'published'
where visibility <> 'published' or visibility is null;
