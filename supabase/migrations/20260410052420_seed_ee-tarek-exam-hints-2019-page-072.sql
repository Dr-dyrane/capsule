-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('575bd357-e4c8-5d68-93d7-59e830b260f1', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-10/2026-04-10T05-18-53-542646+00-00/ee-tarek-exam-hints-2019-page-072/source.png', 'complete', 'Epidural: in spine.', 10, 10, '2026-04-10T05:18:53.542646+00:00', '2026-04-10T05:18:53.542646+00:00', 'published')
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
  ('ae305df2-a055-5cd6-950e-21618bc902e2', '575bd357-e4c8-5d68-93d7-59e830b260f1', 'Spinal “Intrathecal”: injection reach CSF.', 'General', 'Other', 0, 1, '2026-04-10T05:18:53.542646+00:00'),
  ('edcd2a15-7f43-5b41-bf6f-9889c6dbb487', '575bd357-e4c8-5d68-93d7-59e830b260f1', 'Sublingual: has rapid onset, used when needed. Patch or ointment: slow absorption, for chronic therapies, has systemic effects.', 'General', 'Timeline', 1, 1, '2026-04-10T05:18:53.542646+00:00'),
  ('e7fdd95c-429e-5eb1-b3d6-d6822da20cc5', '575bd357-e4c8-5d68-93d7-59e830b260f1', 'IV injection: the vehicle should be water. Ex. Oil in water emulsion.', 'General', 'Other', 2, 1, '2026-04-10T05:18:53.542646+00:00'),
  ('20e17fd4-2bbb-5cac-a344-5fafbb88f270', '575bd357-e4c8-5d68-93d7-59e830b260f1', 'Sustained release is best for drugs with short half life', 'General', 'Drug', 3, 1, '2026-04-10T05:18:53.542646+00:00'),
  ('1599f398-4ad7-51d7-8228-cd37e4f0b6d0', '575bd357-e4c8-5d68-93d7-59e830b260f1', 'Coating could mask the odor, taste, improve appearance, decrease release rate, protect the drug from stomach. But will not increase its release rate.', 'General', 'Drug', 4, 1, '2026-04-10T05:18:53.542646+00:00'),
  ('f646a0be-a6c3-5227-9cfa-a6d886784060', '575bd357-e4c8-5d68-93d7-59e830b260f1', 'intravenous piggyback mainly used with antibiotics.', 'General', 'Other', 5, 1, '2026-04-10T05:18:53.542646+00:00'),
  ('2026b7dc-9988-5041-8fd8-c52ba590fa49', '575bd357-e4c8-5d68-93d7-59e830b260f1', 'Capping: separation of top and bottom', 'General', 'Other', 6, 1, '2026-04-10T05:18:53.542646+00:00'),
  ('67153afe-40a9-58bc-b85e-5a887966487d', '575bd357-e4c8-5d68-93d7-59e830b260f1', 'Lamination: separation of tablet into 2 or more layers.', 'General', 'Drug', 7, 1, '2026-04-10T05:18:53.542646+00:00'),
  ('f07fa404-4851-5c40-93d2-6a6dfdb4a3d6', '575bd357-e4c8-5d68-93d7-59e830b260f1', 'Picking: removal of surface material by a punch', 'General', 'Other', 8, 1, '2026-04-10T05:18:53.542646+00:00'),
  ('2db63f86-0a57-5c98-884c-75d21521f445', '575bd357-e4c8-5d68-93d7-59e830b260f1', 'Sticking: adhesion to die wall', 'General', 'Other', 9, 1, '2026-04-10T05:18:53.542646+00:00')
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
  ('373d6210-0622-5016-bbd8-8083ef002a28', 'ae305df2-a055-5cd6-950e-21618bc902e2', '575bd357-e4c8-5d68-93d7-59e830b260f1', '/seed/2026-04-10/2026-04-10T05-18-53-542646+00-00/ee-tarek-exam-hints-2019-page-072/point-01.png', 'Spinal “Intrathecal”', 0, 'complete', 'published', '2026-04-10T05:18:53.542646+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:18:53.542646+00:00'),
  ('893558bf-71ec-59e6-87bc-796f2478eba1', 'edcd2a15-7f43-5b41-bf6f-9889c6dbb487', '575bd357-e4c8-5d68-93d7-59e830b260f1', '/seed/2026-04-10/2026-04-10T05-18-53-542646+00-00/ee-tarek-exam-hints-2019-page-072/point-02.png', 'Sublingual', 1, 'complete', 'published', '2026-04-10T05:18:53.542646+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'timeline strip', null, '2026-04-10T05:18:53.542646+00:00'),
  ('7b5af294-0ce6-52dc-b7cc-87b057c43c27', 'e7fdd95c-429e-5eb1-b3d6-d6822da20cc5', '575bd357-e4c8-5d68-93d7-59e830b260f1', '/seed/2026-04-10/2026-04-10T05-18-53-542646+00-00/ee-tarek-exam-hints-2019-page-072/point-03.png', 'IV injection', 2, 'complete', 'published', '2026-04-10T05:18:53.542646+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:18:53.542646+00:00'),
  ('a15c1a57-90e9-5280-82f9-4436008f2d3f', '20e17fd4-2bbb-5cac-a344-5fafbb88f270', '575bd357-e4c8-5d68-93d7-59e830b260f1', '/seed/2026-04-10/2026-04-10T05-18-53-542646+00-00/ee-tarek-exam-hints-2019-page-072/point-04.png', 'Sustained release is best for drugs with short half life', 3, 'complete', 'published', '2026-04-10T05:18:53.542646+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:18:53.542646+00:00'),
  ('419fe807-b3e9-5b30-986d-18fee95538cc', '1599f398-4ad7-51d7-8228-cd37e4f0b6d0', '575bd357-e4c8-5d68-93d7-59e830b260f1', '/seed/2026-04-10/2026-04-10T05-18-53-542646+00-00/ee-tarek-exam-hints-2019-page-072/point-05.png', 'Coating could mask the odor, taste, improve appearance, decrease release rate, protect the drug from stomach. But will not increase its release rate.', 4, 'complete', 'published', '2026-04-10T05:18:53.542646+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:18:53.542646+00:00'),
  ('08f403fb-7708-591d-87a6-79e2ef61f595', 'f646a0be-a6c3-5227-9cfa-a6d886784060', '575bd357-e4c8-5d68-93d7-59e830b260f1', '/seed/2026-04-10/2026-04-10T05-18-53-542646+00-00/ee-tarek-exam-hints-2019-page-072/point-06.png', 'intravenous piggyback mainly used with antibiotics.', 5, 'complete', 'published', '2026-04-10T05:18:53.542646+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:18:53.542646+00:00'),
  ('de395e77-e48d-550a-ae86-c7638a2c8511', '2026b7dc-9988-5041-8fd8-c52ba590fa49', '575bd357-e4c8-5d68-93d7-59e830b260f1', '/seed/2026-04-10/2026-04-10T05-18-53-542646+00-00/ee-tarek-exam-hints-2019-page-072/point-07.png', 'Capping', 6, 'complete', 'published', '2026-04-10T05:18:53.542646+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:18:53.542646+00:00'),
  ('4339b26a-c1e9-533d-9aba-0b3bc7768d1a', '67153afe-40a9-58bc-b85e-5a887966487d', '575bd357-e4c8-5d68-93d7-59e830b260f1', '/seed/2026-04-10/2026-04-10T05-18-53-542646+00-00/ee-tarek-exam-hints-2019-page-072/point-08.png', 'Lamination', 7, 'complete', 'published', '2026-04-10T05:18:53.542646+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:18:53.542646+00:00'),
  ('69047395-a1c2-5f34-aba5-97d34346ab98', 'f07fa404-4851-5c40-93d2-6a6dfdb4a3d6', '575bd357-e4c8-5d68-93d7-59e830b260f1', '/seed/2026-04-10/2026-04-10T05-18-53-542646+00-00/ee-tarek-exam-hints-2019-page-072/point-09.png', 'Picking', 8, 'complete', 'published', '2026-04-10T05:18:53.542646+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:18:53.542646+00:00'),
  ('b6918928-6313-5acf-8e52-0b9e33a19d3d', '2db63f86-0a57-5c98-884c-75d21521f445', '575bd357-e4c8-5d68-93d7-59e830b260f1', '/seed/2026-04-10/2026-04-10T05-18-53-542646+00-00/ee-tarek-exam-hints-2019-page-072/point-10.png', 'Sticking', 9, 'complete', 'published', '2026-04-10T05:18:53.542646+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:18:53.542646+00:00')
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
  ('baa4b447-a8dd-5cc2-8508-6733100cd0fe', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '575bd357-e4c8-5d68-93d7-59e830b260f1', '373d6210-0622-5016-bbd8-8083ef002a28', 'ae305df2-a055-5cd6-950e-21618bc902e2', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 072.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:72", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 72, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:18:53.542646+00:00'),
  ('040bc21f-a5fc-5316-9b7b-d80098af55e6', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '575bd357-e4c8-5d68-93d7-59e830b260f1', '893558bf-71ec-59e6-87bc-796f2478eba1', 'edcd2a15-7f43-5b41-bf6f-9889c6dbb487', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'timeline strip', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 072.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:72", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 72, "point_category": "General", "point_concept": "Timeline", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:18:53.542646+00:00'),
  ('8e131913-ef69-540b-a76b-89a7078d5ae5', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '575bd357-e4c8-5d68-93d7-59e830b260f1', '7b5af294-0ce6-52dc-b7cc-87b057c43c27', 'e7fdd95c-429e-5eb1-b3d6-d6822da20cc5', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 072.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:72", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 72, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:18:53.542646+00:00'),
  ('528eecba-ec57-5bd2-ac93-7c99a398e90c', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '575bd357-e4c8-5d68-93d7-59e830b260f1', 'a15c1a57-90e9-5280-82f9-4436008f2d3f', '20e17fd4-2bbb-5cac-a344-5fafbb88f270', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 072.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:72", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 72, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:18:53.542646+00:00'),
  ('072741a9-6a4a-5950-8fa7-f75e924faa6f', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '575bd357-e4c8-5d68-93d7-59e830b260f1', '419fe807-b3e9-5b30-986d-18fee95538cc', '1599f398-4ad7-51d7-8228-cd37e4f0b6d0', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 072.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:72", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 72, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:18:53.542646+00:00'),
  ('abaa5e90-791b-5956-8b4d-43d66f2b16c1', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '575bd357-e4c8-5d68-93d7-59e830b260f1', '08f403fb-7708-591d-87a6-79e2ef61f595', 'f646a0be-a6c3-5227-9cfa-a6d886784060', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 072.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:72", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 72, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:18:53.542646+00:00'),
  ('c700751b-d58a-5fed-becc-956303bb361a', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '575bd357-e4c8-5d68-93d7-59e830b260f1', 'de395e77-e48d-550a-ae86-c7638a2c8511', '2026b7dc-9988-5041-8fd8-c52ba590fa49', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 072.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:72", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 72, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:18:53.542646+00:00'),
  ('e3b3f376-bdc9-5335-aa05-01571fee50d1', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '575bd357-e4c8-5d68-93d7-59e830b260f1', '4339b26a-c1e9-533d-9aba-0b3bc7768d1a', '67153afe-40a9-58bc-b85e-5a887966487d', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 072.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:72", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 72, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:18:53.542646+00:00'),
  ('dd36e881-cc84-574e-b15e-ef4008aaf9b9', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '575bd357-e4c8-5d68-93d7-59e830b260f1', '69047395-a1c2-5f34-aba5-97d34346ab98', 'f07fa404-4851-5c40-93d2-6a6dfdb4a3d6', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 072.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:72", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 72, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:18:53.542646+00:00'),
  ('7cedf0d1-3ff9-5e43-82dc-03ae4e796147', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '575bd357-e4c8-5d68-93d7-59e830b260f1', 'b6918928-6313-5acf-8e52-0b9e33a19d3d', '2db63f86-0a57-5c98-884c-75d21521f445', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 072.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:72", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 72, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:18:53.542646+00:00')
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

select public.refresh_public_card_relationships('575bd357-e4c8-5d68-93d7-59e830b260f1'::uuid);
