-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('ceba733f-8bae-5328-b017-ffda581d6dbc', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-06/2026-04-06T02-32-14-396542+00-00/ee-tarek-exam-hints-2019-page-057/source.png', 'complete', 'While destroying expired narcotics, there should be a witness (pharmacy technician). Students can’t', 10, 10, '2026-04-06T03:25:59.287783+00:00', '2026-04-06T03:25:59.287783+00:00', 'published')
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
  ('06c0e21e-ed95-5ad0-9ff8-e4aad98782f5', 'ceba733f-8bae-5328-b017-ffda581d6dbc', 'be witnesses. All controlled drugs need witness for destruction.', 'Rules', 'Drug', 0, 1, '2026-04-06T03:25:59.287783+00:00'),
  ('316e2ea4-b260-5dda-a8ba-273c74b936d7', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '• The pharmacist should show empathy to patients.', 'General', 'Other', 1, 1, '2026-04-06T03:25:59.287783+00:00'),
  ('92c2fa4b-5507-5f79-b6f9-be883c30921d', 'ceba733f-8bae-5328-b017-ffda581d6dbc', 'Job analysis: determine all necessary requirement and aspects of the job. It’s study of pharmacy staffing needs. It comprised of job description and specification.', 'General', 'Other', 2, 1, '2026-04-06T03:25:59.287783+00:00'),
  ('dd5cac58-c8ed-5e14-b359-74e87a41143d', 'ceba733f-8bae-5328-b017-ffda581d6dbc', 'Position description (job Ad): describe the main component of each position. Nature of job, responsibilities, qualification, experiences.', 'General', 'Other', 3, 1, '2026-04-06T03:25:59.287783+00:00'),
  ('c5d23789-752b-5a64-ab1a-b6e1e64c91ca', 'ceba733f-8bae-5328-b017-ffda581d6dbc', 'Job description: include job title, location, summary, duties, working condition, hazards and reporting.', 'General', 'Other', 4, 1, '2026-04-06T03:25:59.287783+00:00'),
  ('2aa086ff-f877-5175-9001-b2a287817004', 'ceba733f-8bae-5328-b017-ffda581d6dbc', 'Job specification: Experiences, qualification, skills, training, emotional characteristics, responsibilities.', 'General', 'Other', 5, 1, '2026-04-06T03:25:59.287783+00:00'),
  ('c45ec166-5af7-5348-a878-bb98a6a4252a', 'ceba733f-8bae-5328-b017-ffda581d6dbc', 'Dispensing error: inform the Nurse immediately (to stop administration)', 'General', 'Other', 6, 1, '2026-04-06T03:25:59.287783+00:00'),
  ('b04eb655-3b61-57eb-9ad1-0243e204a5f1', 'ceba733f-8bae-5328-b017-ffda581d6dbc', 'Wrong drug already administered: inform the doctor, write report to P&T Committee.', 'Management', 'Management', 7, 1, '2026-04-06T03:25:59.287783+00:00'),
  ('705af7ed-2baf-54f6-af15-b00cde5f9367', 'ceba733f-8bae-5328-b017-ffda581d6dbc', 'Cold chain: store insulin and vaccines.', 'General', 'Drug', 8, 1, '2026-04-06T03:25:59.287783+00:00'),
  ('f5ec53a4-d6c9-596a-ae2f-0e9423917af5', 'ceba733f-8bae-5328-b017-ffda581d6dbc', 'Pharmacy administrative tasks:', 'General', 'Other', 9, 1, '2026-04-06T03:25:59.287783+00:00')
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
  ('41040c8e-1ea3-5675-8176-d7499d332ab8', '06c0e21e-ed95-5ad0-9ff8-e4aad98782f5', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '/seed/2026-04-06/2026-04-06T02-32-14-396542+00-00/ee-tarek-exam-hints-2019-page-057/point-01.png', 'be witnesses. All controlled drugs need witness for destruction.', 0, 'complete', 'published', '2026-04-06T03:25:59.287783+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'rules board', null, '2026-04-06T03:25:59.287783+00:00'),
  ('b57a3b48-9f10-5804-a3de-f9322157967d', '316e2ea4-b260-5dda-a8ba-273c74b936d7', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '/seed/2026-04-06/2026-04-06T02-32-14-396542+00-00/ee-tarek-exam-hints-2019-page-057/point-02.png', '• The pharmacist should show empathy to patients.', 1, 'complete', 'published', '2026-04-06T03:25:59.287783+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:25:59.287783+00:00'),
  ('dd6db12b-89af-53cc-a504-da424c580e7e', '92c2fa4b-5507-5f79-b6f9-be883c30921d', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '/seed/2026-04-06/2026-04-06T02-32-14-396542+00-00/ee-tarek-exam-hints-2019-page-057/point-03.png', 'Job analysis', 2, 'complete', 'published', '2026-04-06T03:25:59.287783+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:25:59.287783+00:00'),
  ('a1a14bb3-ddc6-5560-aeb5-2ac7e133a866', 'dd5cac58-c8ed-5e14-b359-74e87a41143d', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '/seed/2026-04-06/2026-04-06T02-32-14-396542+00-00/ee-tarek-exam-hints-2019-page-057/point-04.png', 'Position description (job Ad)', 3, 'complete', 'published', '2026-04-06T03:25:59.287783+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:25:59.287783+00:00'),
  ('d7098478-1e20-5c27-8f03-a57828782f42', 'c5d23789-752b-5a64-ab1a-b6e1e64c91ca', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '/seed/2026-04-06/2026-04-06T02-32-14-396542+00-00/ee-tarek-exam-hints-2019-page-057/point-05.png', 'Job description', 4, 'complete', 'published', '2026-04-06T03:25:59.287783+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:25:59.287783+00:00'),
  ('8a8085b4-5f50-5a39-9b4f-54fa1a69e3fe', '2aa086ff-f877-5175-9001-b2a287817004', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '/seed/2026-04-06/2026-04-06T02-32-14-396542+00-00/ee-tarek-exam-hints-2019-page-057/point-06.png', 'Job specification', 5, 'complete', 'published', '2026-04-06T03:25:59.287783+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:25:59.287783+00:00'),
  ('08257579-914b-54a9-9df5-da7e3b015f04', 'c45ec166-5af7-5348-a878-bb98a6a4252a', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '/seed/2026-04-06/2026-04-06T02-32-14-396542+00-00/ee-tarek-exam-hints-2019-page-057/point-07.png', 'Dispensing error', 6, 'complete', 'published', '2026-04-06T03:25:59.287783+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:25:59.287783+00:00'),
  ('182b9798-e66b-51f8-b974-3233026c60b0', 'b04eb655-3b61-57eb-9ad1-0243e204a5f1', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '/seed/2026-04-06/2026-04-06T02-32-14-396542+00-00/ee-tarek-exam-hints-2019-page-057/point-08.png', 'Wrong drug already administered', 7, 'complete', 'published', '2026-04-06T03:25:59.287783+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'treatment ladder', null, '2026-04-06T03:25:59.287783+00:00'),
  ('737ec6cb-3aa2-51d3-86b0-0f3111858f37', '705af7ed-2baf-54f6-af15-b00cde5f9367', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '/seed/2026-04-06/2026-04-06T02-32-14-396542+00-00/ee-tarek-exam-hints-2019-page-057/point-09.png', 'Cold chain', 8, 'complete', 'published', '2026-04-06T03:25:59.287783+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:25:59.287783+00:00'),
  ('f35a9eef-ca2f-58aa-8a00-ebde7cb46d7e', 'f5ec53a4-d6c9-596a-ae2f-0e9423917af5', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '/seed/2026-04-06/2026-04-06T02-32-14-396542+00-00/ee-tarek-exam-hints-2019-page-057/point-10.png', 'Pharmacy administrative tasks', 9, 'complete', 'published', '2026-04-06T03:25:59.287783+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:25:59.287783+00:00')
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
  ('d7367480-e87f-56f9-b9f2-5cac641129c7', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '41040c8e-1ea3-5675-8176-d7499d332ab8', '06c0e21e-ed95-5ad0-9ff8-e4aad98782f5', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'rules board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 057.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:57", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 57, "point_category": "Rules", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:25:59.287783+00:00'),
  ('3451f46a-a2d8-581e-9886-556b048cc917', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ceba733f-8bae-5328-b017-ffda581d6dbc', 'b57a3b48-9f10-5804-a3de-f9322157967d', '316e2ea4-b260-5dda-a8ba-273c74b936d7', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 057.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:57", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 57, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:25:59.287783+00:00'),
  ('d4cbcd6c-c04a-59aa-9b50-8c77b6fe0132', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ceba733f-8bae-5328-b017-ffda581d6dbc', 'dd6db12b-89af-53cc-a504-da424c580e7e', '92c2fa4b-5507-5f79-b6f9-be883c30921d', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 057.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:57", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 57, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:25:59.287783+00:00'),
  ('2c42d9b8-1a0a-59bf-8118-e12ca054ad90', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ceba733f-8bae-5328-b017-ffda581d6dbc', 'a1a14bb3-ddc6-5560-aeb5-2ac7e133a866', 'dd5cac58-c8ed-5e14-b359-74e87a41143d', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 057.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:57", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 57, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:25:59.287783+00:00'),
  ('9f7ced35-883d-55ff-93c5-fe6900ee5efa', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ceba733f-8bae-5328-b017-ffda581d6dbc', 'd7098478-1e20-5c27-8f03-a57828782f42', 'c5d23789-752b-5a64-ab1a-b6e1e64c91ca', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 057.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:57", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 57, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:25:59.287783+00:00'),
  ('6e20b531-a05a-5b16-87bc-c8ea942f247d', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '8a8085b4-5f50-5a39-9b4f-54fa1a69e3fe', '2aa086ff-f877-5175-9001-b2a287817004', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 057.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:57", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 57, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:25:59.287783+00:00'),
  ('1b76eb5e-0015-5a7b-8522-76062b331343', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '08257579-914b-54a9-9df5-da7e3b015f04', 'c45ec166-5af7-5348-a878-bb98a6a4252a', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 057.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:57", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 57, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:25:59.287783+00:00'),
  ('04403b54-a800-5ee1-97fb-06d6867602eb', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '182b9798-e66b-51f8-b974-3233026c60b0', 'b04eb655-3b61-57eb-9ad1-0243e204a5f1', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'treatment ladder', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 057.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:57", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 57, "point_category": "Management", "point_concept": "Management", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:25:59.287783+00:00'),
  ('5d09145c-7188-52cf-84bb-f60b9b94b6a1', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ceba733f-8bae-5328-b017-ffda581d6dbc', '737ec6cb-3aa2-51d3-86b0-0f3111858f37', '705af7ed-2baf-54f6-af15-b00cde5f9367', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 057.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:57", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 57, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:25:59.287783+00:00'),
  ('8577a8a1-3c7e-51a6-9559-95be28f84ac3', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ceba733f-8bae-5328-b017-ffda581d6dbc', 'f35a9eef-ca2f-58aa-8a00-ebde7cb46d7e', 'f5ec53a4-d6c9-596a-ae2f-0e9423917af5', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 057.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:57", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 57, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:25:59.287783+00:00')
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

select public.refresh_public_card_relationships('ceba733f-8bae-5328-b017-ffda581d6dbc'::uuid);
