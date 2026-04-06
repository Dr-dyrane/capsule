-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('d45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-06/2026-04-06T02-57-03-230715+00-00/ee-tarek-exam-hints-2019-page-063/source.png', 'complete', 'Others', 10, 10, '2026-04-06T03:21:16.579609+00:00', '2026-04-06T03:21:16.579609+00:00', 'published')
on conflict (id) do update
set
  user_id = excluded.user_id,
  source_url = excluded.source_url,
  status = excluded.status,
  session_context = excluded.session_context,
  point_count = excluded.point_count,
  card_count = excluded.card_count,
  updated_at = excluded.updated_at,
  visibility = excluded.visibility;

insert into public.points
  (id, session_id, text, category, concept, sort_order, card_count, created_at)
values
  ('c23c8cbc-96ce-51d1-a8a6-3fc9e3c6f4ff', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', 'If the patient is illiterate, u could explain the risks and benefits to him.', 'General', 'Other', 0, 1, '2026-04-06T03:21:16.579609+00:00'),
  ('23fadd90-f507-59ea-8355-9b8b72e0147b', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', 'Incompetent = غير كفء Incapable= غير قادرجسديا و عقليا علي ممارسة المهنة', 'General', 'Other', 1, 1, '2026-04-06T03:21:16.579609+00:00'),
  ('75c6e37a-a6cc-5c94-9487-9193cc044578', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', 'Each drug in the prescription has a dispensing fee. If one Rx, contain 3 drugs and the dispensing fee is 10$, then the total dispensing fees were 10$*3= 30$', 'Rules', 'Drug', 2, 1, '2026-04-06T03:21:16.579609+00:00'),
  ('7166595d-e0b1-56d4-a289-a79d79ffdb50', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', 'Unit-dose system: safest and decrease waste and errors but costy.', 'General', 'Other', 3, 1, '2026-04-06T03:21:16.579609+00:00'),
  ('5eb5beb3-6ae2-5d91-853d-e01352b79a9f', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', 'The best one to ask for a concern related to medicine is Pharmacist.', 'General', 'Other', 4, 1, '2026-04-06T03:21:16.579609+00:00'),
  ('919effae-1bb1-5879-8453-0b964c08fd4b', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', 'In multicultural society, you could hire multilingual staff.', 'General', 'Other', 5, 1, '2026-04-06T03:21:16.579609+00:00'),
  ('77b404ad-95d0-5e8e-a7b1-856573adacde', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', 'Floor stock system: drugs in stock in each floor (used in emergency for any patient)', 'General', 'Drug', 6, 1, '2026-04-06T03:21:16.579609+00:00'),
  ('cab275b3-9b74-5bb0-aa4a-ba9e44b2d169', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', 'Nonverbal skills during phone conversation: Do: smile (be sure friendly voice). Don’t: put patient on hold.', 'General', 'Other', 7, 1, '2026-04-06T03:21:16.579609+00:00'),
  ('0e012e60-e01a-598b-9dc8-30428307ab45', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', 'bCalculations and statistics:', 'General', 'Other', 8, 1, '2026-04-06T03:21:16.579609+00:00'),
  ('30dfdea7-93a3-5330-bbc8-e755ea187d77', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', 'If significance level (α)is 0.05, the corresponding confidence level is 95%. The data is significant when:', 'General', 'Other', 9, 1, '2026-04-06T03:21:16.579609+00:00')
on conflict (id) do update
set
  session_id = excluded.session_id,
  text = excluded.text,
  category = excluded.category,
  concept = excluded.concept,
  sort_order = excluded.sort_order,
  card_count = excluded.card_count,
  created_at = excluded.created_at;

insert into public.cards
  (id, point_id, session_id, image_url, title, card_order, status, visibility, published_at, published_by, community_template, community_hash, created_at)
values
  ('150fac1b-0af7-5430-8be3-d1cca5c749ff', 'c23c8cbc-96ce-51d1-a8a6-3fc9e3c6f4ff', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '/seed/2026-04-06/2026-04-06T02-57-03-230715+00-00/ee-tarek-exam-hints-2019-page-063/point-01.png', 'If the patient is illiterate, u could explain the risks and benefits to him.', 0, 'complete', 'published', '2026-04-06T03:21:16.579609+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:16.579609+00:00'),
  ('d3bd4ca2-a4e1-53a5-b264-1973d2ca2326', '23fadd90-f507-59ea-8355-9b8b72e0147b', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '/seed/2026-04-06/2026-04-06T02-57-03-230715+00-00/ee-tarek-exam-hints-2019-page-063/point-02.png', 'Incompetent = غير كفء Incapable= غير قادرجسديا و عقليا علي ممارسة المهنة', 1, 'complete', 'published', '2026-04-06T03:21:16.579609+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:16.579609+00:00'),
  ('88130fb3-edac-5783-9874-a7ad3af5d4cb', '75c6e37a-a6cc-5c94-9487-9193cc044578', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '/seed/2026-04-06/2026-04-06T02-57-03-230715+00-00/ee-tarek-exam-hints-2019-page-063/point-03.png', 'Each drug in the prescription has a dispensing fee. If one Rx, contain 3 drugs and the dispensing fee is 10$, then the total dispensing fees were 10$*3= 30$', 2, 'complete', 'published', '2026-04-06T03:21:16.579609+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'rules board', null, '2026-04-06T03:21:16.579609+00:00'),
  ('b3bfa6fe-3ae5-59b4-b7f9-7e1f92e8bf46', '7166595d-e0b1-56d4-a289-a79d79ffdb50', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '/seed/2026-04-06/2026-04-06T02-57-03-230715+00-00/ee-tarek-exam-hints-2019-page-063/point-04.png', 'Unit-dose system', 3, 'complete', 'published', '2026-04-06T03:21:16.579609+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:16.579609+00:00'),
  ('3da74df8-20e0-5ca2-9785-1ccb59d6c11d', '5eb5beb3-6ae2-5d91-853d-e01352b79a9f', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '/seed/2026-04-06/2026-04-06T02-57-03-230715+00-00/ee-tarek-exam-hints-2019-page-063/point-05.png', 'The best one to ask for a concern related to medicine is Pharmacist.', 4, 'complete', 'published', '2026-04-06T03:21:16.579609+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:16.579609+00:00'),
  ('cb8df03b-6431-5187-b6a8-21d439f4b0a3', '919effae-1bb1-5879-8453-0b964c08fd4b', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '/seed/2026-04-06/2026-04-06T02-57-03-230715+00-00/ee-tarek-exam-hints-2019-page-063/point-06.png', 'In multicultural society, you could hire multilingual staff.', 5, 'complete', 'published', '2026-04-06T03:21:16.579609+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:16.579609+00:00'),
  ('e6b527ff-d907-5b9d-981e-9af7b6804bb8', '77b404ad-95d0-5e8e-a7b1-856573adacde', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '/seed/2026-04-06/2026-04-06T02-57-03-230715+00-00/ee-tarek-exam-hints-2019-page-063/point-07.png', 'Floor stock system', 6, 'complete', 'published', '2026-04-06T03:21:16.579609+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:16.579609+00:00'),
  ('99596880-3daf-57fd-afb4-e71ed5af8033', 'cab275b3-9b74-5bb0-aa4a-ba9e44b2d169', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '/seed/2026-04-06/2026-04-06T02-57-03-230715+00-00/ee-tarek-exam-hints-2019-page-063/point-08.png', 'Nonverbal skills during phone conversation', 7, 'complete', 'published', '2026-04-06T03:21:16.579609+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:16.579609+00:00'),
  ('8221ddc5-434e-5b3a-b415-172addaff3ef', '0e012e60-e01a-598b-9dc8-30428307ab45', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '/seed/2026-04-06/2026-04-06T02-57-03-230715+00-00/ee-tarek-exam-hints-2019-page-063/point-09.png', 'bCalculations and statistics', 8, 'complete', 'published', '2026-04-06T03:21:16.579609+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:16.579609+00:00'),
  ('578124a8-f6de-5605-bd5c-10d067406d5a', '30dfdea7-93a3-5330-bbc8-e755ea187d77', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '/seed/2026-04-06/2026-04-06T02-57-03-230715+00-00/ee-tarek-exam-hints-2019-page-063/point-10.png', 'If significance level (α)is 0.05, the corresponding confidence level is 95%. The data is significant when', 9, 'complete', 'published', '2026-04-06T03:21:16.579609+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:16.579609+00:00')
on conflict (id) do update
set
  point_id = excluded.point_id,
  session_id = excluded.session_id,
  image_url = excluded.image_url,
  title = excluded.title,
  card_order = excluded.card_order,
  status = excluded.status,
  visibility = excluded.visibility,
  published_at = excluded.published_at,
  published_by = excluded.published_by,
  community_template = excluded.community_template,
  community_hash = excluded.community_hash,
  created_at = excluded.created_at;

insert into public.generation_costs
  (id, user_id, session_id, card_id, point_id, stage, model, quality, size, profile_id, template_id, route_level, prompt_version, pricing_version, estimated_cost_usd, input_tokens, output_tokens, total_tokens, input_text_tokens, input_image_tokens, output_text_tokens, output_image_tokens, metadata, created_at)
values
  ('7b6fafbe-d25a-589b-a127-9b9989883214', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '150fac1b-0af7-5430-8be3-d1cca5c749ff', 'c23c8cbc-96ce-51d1-a8a6-3fc9e3c6f4ff', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 063.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:63", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 63, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:16.579609+00:00'),
  ('ccab27f7-d8df-53a5-b856-f858439c0c25', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', 'd3bd4ca2-a4e1-53a5-b264-1973d2ca2326', '23fadd90-f507-59ea-8355-9b8b72e0147b', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 063.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:63", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 63, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:16.579609+00:00'),
  ('cf9c3a92-d148-5314-8662-cb632f0dd3bb', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '88130fb3-edac-5783-9874-a7ad3af5d4cb', '75c6e37a-a6cc-5c94-9487-9193cc044578', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'rules board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 063.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:63", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 63, "point_category": "Rules", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:16.579609+00:00'),
  ('fe175567-050e-5df2-8140-68b4e03b6b42', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', 'b3bfa6fe-3ae5-59b4-b7f9-7e1f92e8bf46', '7166595d-e0b1-56d4-a289-a79d79ffdb50', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 063.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:63", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 63, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:16.579609+00:00'),
  ('63c694f6-6039-5333-a81b-bf09b8d77057', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '3da74df8-20e0-5ca2-9785-1ccb59d6c11d', '5eb5beb3-6ae2-5d91-853d-e01352b79a9f', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 063.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:63", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 63, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:16.579609+00:00'),
  ('5a4bd6e1-546a-5b52-8dfd-7e1c9e298e99', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', 'cb8df03b-6431-5187-b6a8-21d439f4b0a3', '919effae-1bb1-5879-8453-0b964c08fd4b', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 063.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:63", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 63, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:16.579609+00:00'),
  ('0b47d062-c889-5568-b32e-6a9b993e5587', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', 'e6b527ff-d907-5b9d-981e-9af7b6804bb8', '77b404ad-95d0-5e8e-a7b1-856573adacde', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 063.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:63", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 63, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:16.579609+00:00'),
  ('a1f4a730-1874-57ab-ad5f-31081e1ff475', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '99596880-3daf-57fd-afb4-e71ed5af8033', 'cab275b3-9b74-5bb0-aa4a-ba9e44b2d169', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 063.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:63", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 63, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:16.579609+00:00'),
  ('123b2412-15ba-505c-a582-0296695cc484', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '8221ddc5-434e-5b3a-b415-172addaff3ef', '0e012e60-e01a-598b-9dc8-30428307ab45', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 063.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:63", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 63, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:16.579609+00:00'),
  ('b9ca3c64-01f5-56aa-b62d-5bcf3228f93f', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd45d0c7f-74c8-552b-b7a6-f167c8bb39c0', '578124a8-f6de-5605-bd5c-10d067406d5a', '30dfdea7-93a3-5330-bbc8-e755ea187d77', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 063.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:63", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 63, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:16.579609+00:00')
on conflict (id) do update
set
  user_id = excluded.user_id,
  session_id = excluded.session_id,
  card_id = excluded.card_id,
  point_id = excluded.point_id,
  stage = excluded.stage,
  model = excluded.model,
  quality = excluded.quality,
  size = excluded.size,
  profile_id = excluded.profile_id,
  template_id = excluded.template_id,
  route_level = excluded.route_level,
  prompt_version = excluded.prompt_version,
  pricing_version = excluded.pricing_version,
  estimated_cost_usd = excluded.estimated_cost_usd,
  input_tokens = excluded.input_tokens,
  output_tokens = excluded.output_tokens,
  total_tokens = excluded.total_tokens,
  input_text_tokens = excluded.input_text_tokens,
  input_image_tokens = excluded.input_image_tokens,
  output_text_tokens = excluded.output_text_tokens,
  output_image_tokens = excluded.output_image_tokens,
  metadata = excluded.metadata,
  created_at = excluded.created_at;

select public.refresh_public_card_relationships('d45d0c7f-74c8-552b-b7a6-f167c8bb39c0'::uuid);
