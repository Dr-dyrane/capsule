-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('725d94fb-5b29-56ee-96e7-63eb060bddd2', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-06/2026-04-06T02-44-44-029073+00-00/ee-tarek-exam-hints-2019-page-060/source.png', 'complete', 'Cost of illness Analysis (CIA, COI): measure the economic burden of illness to society.', 10, 10, '2026-04-06T03:21:07.829109+00:00', '2026-04-06T03:21:07.829109+00:00', 'published')
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
  ('ccdd45c4-37f1-596f-8175-6169d03e19f5', '725d94fb-5b29-56ee-96e7-63eb060bddd2', 'Perspective: refer to stakeholder whose interest is most represented in study’s conclusion', 'General', 'Other', 0, 1, '2026-04-06T03:21:07.829109+00:00'),
  ('62c24a81-6c03-5033-8d4c-3f1b98d4ec44', '725d94fb-5b29-56ee-96e7-63eb060bddd2', 'Hospital are covered by Federal, provincial taxes and some users pay', 'General', 'Other', 1, 1, '2026-04-06T03:21:07.829109+00:00'),
  ('1261b8ef-dc66-5dfe-9ad5-626704c51146', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '“X” sign in prescription means refill.', 'Rules', 'Other', 2, 1, '2026-04-06T03:21:07.829109+00:00'),
  ('96b0411b-003f-51a0-a509-7dae624f264e', '725d94fb-5b29-56ee-96e7-63eb060bddd2', 'Autocracy: absolute power concentrated in the hand of one person. The leader dictate what’s done and how to be done. Needed when immediate decision needs to be done.', 'General', 'Other', 3, 1, '2026-04-06T03:21:07.829109+00:00'),
  ('ee1c7828-25a1-5c2f-9646-0a1e27448411', '725d94fb-5b29-56ee-96e7-63eb060bddd2', 'Insurance cover vacation supply up to 6 months.', 'General', 'Other', 4, 1, '2026-04-06T03:21:07.829109+00:00'),
  ('763f081f-e0e9-5888-8a20-29e6ddb56566', '725d94fb-5b29-56ee-96e7-63eb060bddd2', 'SOAP format: Subjective: patient info (age, gender, symptoms, complain), past medical history, past surgical history. Objective: lab tests, vital signs, Assessment: symptoms, risk factors Plan: therapeutic plan, medication needed, patient counseling.', 'Diagnostic', 'Diagnostic', 5, 1, '2026-04-06T03:21:07.829109+00:00'),
  ('21a69225-bb4b-5f16-a801-954a1a0d85e0', '725d94fb-5b29-56ee-96e7-63eb060bddd2', 'Inventory shrinkage could be due to: internal theft, external theft, paper work error, fraud. Policies need to be applied such as: employee bag check, external visitor sign-in and sign-out policies.', 'General', 'Other', 6, 1, '2026-04-06T03:21:07.829109+00:00'),
  ('46c21d51-1de6-5d43-ba06-1b1060a57401', '725d94fb-5b29-56ee-96e7-63eb060bddd2', 'Polypharmacy: simultaneous use of multiple drugs for 1 condition.', 'General', 'Drug', 7, 1, '2026-04-06T03:21:07.829109+00:00'),
  ('d6460283-daa6-5c39-aa59-771c46b5dd2c', '725d94fb-5b29-56ee-96e7-63eb060bddd2', 'EpiPen: epinephrine injection to treat sever allergy. Should be stored in Room temperature, Don’t refrigerate.', 'General', 'Other', 8, 1, '2026-04-06T03:21:07.829109+00:00'),
  ('32fc6d1e-2740-536b-8f74-3d7853ac36a4', '725d94fb-5b29-56ee-96e7-63eb060bddd2', 'Non-formulary drug could be requested in hospital if:', 'General', 'Drug', 9, 1, '2026-04-06T03:21:07.829109+00:00')
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
  ('d77e5d79-15db-5c4a-96a5-4574157dea9c', 'ccdd45c4-37f1-596f-8175-6169d03e19f5', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '/seed/2026-04-06/2026-04-06T02-44-44-029073+00-00/ee-tarek-exam-hints-2019-page-060/point-01.png', 'Perspective', 0, 'complete', 'published', '2026-04-06T03:21:07.829109+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:07.829109+00:00'),
  ('277130c4-566b-534f-9991-ad286c0220f2', '62c24a81-6c03-5033-8d4c-3f1b98d4ec44', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '/seed/2026-04-06/2026-04-06T02-44-44-029073+00-00/ee-tarek-exam-hints-2019-page-060/point-02.png', 'Hospital are covered by Federal, provincial taxes and some users pay', 1, 'complete', 'published', '2026-04-06T03:21:07.829109+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:07.829109+00:00'),
  ('55e95c38-bd37-565d-81e4-c21aadc26dbd', '1261b8ef-dc66-5dfe-9ad5-626704c51146', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '/seed/2026-04-06/2026-04-06T02-44-44-029073+00-00/ee-tarek-exam-hints-2019-page-060/point-03.png', '“X” sign in prescription means refill.', 2, 'complete', 'published', '2026-04-06T03:21:07.829109+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'rules board', null, '2026-04-06T03:21:07.829109+00:00'),
  ('bbbac90f-7c7a-564b-9024-34bab60276e5', '96b0411b-003f-51a0-a509-7dae624f264e', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '/seed/2026-04-06/2026-04-06T02-44-44-029073+00-00/ee-tarek-exam-hints-2019-page-060/point-04.png', 'Autocracy', 3, 'complete', 'published', '2026-04-06T03:21:07.829109+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:07.829109+00:00'),
  ('df5990c8-ee31-50a7-a6a5-5f0b9f7e3c33', 'ee1c7828-25a1-5c2f-9646-0a1e27448411', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '/seed/2026-04-06/2026-04-06T02-44-44-029073+00-00/ee-tarek-exam-hints-2019-page-060/point-05.png', 'Insurance cover vacation supply up to 6 months.', 4, 'complete', 'published', '2026-04-06T03:21:07.829109+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:07.829109+00:00'),
  ('3324984b-9929-5984-bdba-af5b994f638c', '763f081f-e0e9-5888-8a20-29e6ddb56566', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '/seed/2026-04-06/2026-04-06T02-44-44-029073+00-00/ee-tarek-exam-hints-2019-page-060/point-06.png', 'SOAP format', 5, 'complete', 'published', '2026-04-06T03:21:07.829109+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'diagnostic flow', null, '2026-04-06T03:21:07.829109+00:00'),
  ('6dd5c879-882d-579b-befb-f6435740c560', '21a69225-bb4b-5f16-a801-954a1a0d85e0', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '/seed/2026-04-06/2026-04-06T02-44-44-029073+00-00/ee-tarek-exam-hints-2019-page-060/point-07.png', 'Inventory shrinkage could be due to', 6, 'complete', 'published', '2026-04-06T03:21:07.829109+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:07.829109+00:00'),
  ('51a72b8e-d110-5d43-a43c-7feca8b9f056', '46c21d51-1de6-5d43-ba06-1b1060a57401', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '/seed/2026-04-06/2026-04-06T02-44-44-029073+00-00/ee-tarek-exam-hints-2019-page-060/point-08.png', 'Polypharmacy', 7, 'complete', 'published', '2026-04-06T03:21:07.829109+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:07.829109+00:00'),
  ('3404da4a-90d4-5949-b70f-70aa80df4e2c', 'd6460283-daa6-5c39-aa59-771c46b5dd2c', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '/seed/2026-04-06/2026-04-06T02-44-44-029073+00-00/ee-tarek-exam-hints-2019-page-060/point-09.png', 'EpiPen', 8, 'complete', 'published', '2026-04-06T03:21:07.829109+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:07.829109+00:00'),
  ('c3510070-3eba-5c6b-9dbb-db1c5a6544e1', '32fc6d1e-2740-536b-8f74-3d7853ac36a4', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '/seed/2026-04-06/2026-04-06T02-44-44-029073+00-00/ee-tarek-exam-hints-2019-page-060/point-10.png', 'Non-formulary drug could be requested in hospital if', 9, 'complete', 'published', '2026-04-06T03:21:07.829109+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:07.829109+00:00')
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
  ('dd0b1cfe-4d45-5f2c-b747-345c6b5deb12', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '725d94fb-5b29-56ee-96e7-63eb060bddd2', 'd77e5d79-15db-5c4a-96a5-4574157dea9c', 'ccdd45c4-37f1-596f-8175-6169d03e19f5', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 060.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:60", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 60, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:07.829109+00:00'),
  ('c38ea726-eac0-5b89-8c7d-158968c22607', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '277130c4-566b-534f-9991-ad286c0220f2', '62c24a81-6c03-5033-8d4c-3f1b98d4ec44', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 060.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:60", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 60, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:07.829109+00:00'),
  ('e073209b-2c54-5874-859a-447e480a890d', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '55e95c38-bd37-565d-81e4-c21aadc26dbd', '1261b8ef-dc66-5dfe-9ad5-626704c51146', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'rules board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 060.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:60", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 60, "point_category": "Rules", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:07.829109+00:00'),
  ('00db484e-01d4-55e8-a6c1-73ff5cdbb02f', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '725d94fb-5b29-56ee-96e7-63eb060bddd2', 'bbbac90f-7c7a-564b-9024-34bab60276e5', '96b0411b-003f-51a0-a509-7dae624f264e', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 060.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:60", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 60, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:07.829109+00:00'),
  ('7d9e3ca7-7df3-53ed-b637-482e0ce6b1f8', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '725d94fb-5b29-56ee-96e7-63eb060bddd2', 'df5990c8-ee31-50a7-a6a5-5f0b9f7e3c33', 'ee1c7828-25a1-5c2f-9646-0a1e27448411', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 060.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:60", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 60, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:07.829109+00:00'),
  ('53aad791-e16a-55c8-86fc-b9dddb0ed420', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '3324984b-9929-5984-bdba-af5b994f638c', '763f081f-e0e9-5888-8a20-29e6ddb56566', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'diagnostic flow', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 060.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:60", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 60, "point_category": "Diagnostic", "point_concept": "Diagnostic", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:07.829109+00:00'),
  ('3a80901c-2389-5d7c-a108-85c455fbc12b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '6dd5c879-882d-579b-befb-f6435740c560', '21a69225-bb4b-5f16-a801-954a1a0d85e0', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 060.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:60", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 60, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:07.829109+00:00'),
  ('a72e3066-33d0-508d-8e38-9acfbd9dfad9', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '51a72b8e-d110-5d43-a43c-7feca8b9f056', '46c21d51-1de6-5d43-ba06-1b1060a57401', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 060.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:60", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 60, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:07.829109+00:00'),
  ('e14cfbd8-30a4-5b5a-9286-80c06c844518', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '725d94fb-5b29-56ee-96e7-63eb060bddd2', '3404da4a-90d4-5949-b70f-70aa80df4e2c', 'd6460283-daa6-5c39-aa59-771c46b5dd2c', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 060.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:60", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 60, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:07.829109+00:00'),
  ('f76212b8-6e4d-50ff-9ae4-211f6df9e8f2', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '725d94fb-5b29-56ee-96e7-63eb060bddd2', 'c3510070-3eba-5c6b-9dbb-db1c5a6544e1', '32fc6d1e-2740-536b-8f74-3d7853ac36a4', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 060.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:60", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 60, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:07.829109+00:00')
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

select public.refresh_public_card_relationships('725d94fb-5b29-56ee-96e7-63eb060bddd2'::uuid);
