-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('a476f59f-e7a7-5a1b-949e-61153f638aac', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-12-17-280456+00-00/source.png', 'complete', 'Dextromethorphan', 10, 10, '2026-04-10T07:12:17.280456+00:00', '2026-04-10T07:12:17.280456+00:00', 'published')
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
  ('b145eb3e-60b4-51b6-a998-609ea5e92825', 'a476f59f-e7a7-5a1b-949e-61153f638aac', 'Cough suppressant and increase serotonin NSAIDS:', 'General', 'Other', 0, 1, '2026-04-10T07:12:17.280456+00:00'),
  ('dc3bc380-e196-5480-ae87-e4f0ebf5fea7', 'a476f59f-e7a7-5a1b-949e-61153f638aac', 'Generally, Ibuprofen has the lowest risk. Pyridoxine Vit B6', 'General', 'Other', 1, 1, '2026-04-10T07:12:17.280456+00:00'),
  ('b8c793f2-610d-5243-969f-524899983d88', 'a476f59f-e7a7-5a1b-949e-61153f638aac', 'Isoniazid cause neurotoxicity, that’s why pyridoxine B6 is good with it.', 'General', 'Other', 2, 1, '2026-04-10T07:12:17.280456+00:00'),
  ('1345d03e-5b5b-5569-8349-2a569ceaddba', 'a476f59f-e7a7-5a1b-949e-61153f638aac', 'It increase Levodopa breakdown; therefore, it increase its peripheral side effect. Folic acid:', 'General', 'Other', 3, 1, '2026-04-10T07:12:17.280456+00:00'),
  ('d83a604d-1234-55bd-b1e6-6bdcce294775', 'a476f59f-e7a7-5a1b-949e-61153f638aac', 'Diabetic pregnant: 5 mg for 3 months before gestation then continue for 12 weeks. After 12 weeks use', 'General', 'Other', 4, 1, '2026-04-10T07:12:17.280456+00:00'),
  ('789ba2b4-ead4-58da-b7a7-e3ea162f6fff', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '4-1 mg throughout pregnancy and 6 months postpartum or till finish breastfeeding.', 'General', 'Other', 5, 1, '2026-04-10T07:12:17.280456+00:00'),
  ('ac831d8d-414c-54d0-80aa-324956ff8928', 'a476f59f-e7a7-5a1b-949e-61153f638aac', 'Pregnant woman taking AED should take 1 mg folic acid daily, 3 months before gestation and at first 12 weeks of pregnancy. If the patient taking Valproic acid or have history of neural tube defect, 4 mg daily is recommended. From 12 weeks to as long as breast feeding continue, 0.4:1mg folic daily recommended.', 'General', 'Other', 6, 1, '2026-04-10T07:12:17.280456+00:00'),
  ('97afa2bd-72b0-5dfa-875d-290ba989b25d', 'a476f59f-e7a7-5a1b-949e-61153f638aac', 'Used with Vit B12 in pernicious anemia (high MCV)', 'General', 'Other', 7, 1, '2026-04-10T07:12:17.280456+00:00'),
  ('f7533a4c-459c-544e-b999-e5e435eb05f8', 'a476f59f-e7a7-5a1b-949e-61153f638aac', 'Counteract Methotrexate GIT side effects such as mucositis (mouth ulcers) Structures', 'General', 'Other', 8, 1, '2026-04-10T07:12:17.280456+00:00'),
  ('a1c67aae-f9b4-541c-8fba-ae452ae36e7d', 'a476f59f-e7a7-5a1b-949e-61153f638aac', 'Xanthine oxidase inhibitor', 'Pathophysiology', 'Mechanism', 9, 1, '2026-04-10T07:12:17.280456+00:00')
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
  ('5e9ff365-533f-58aa-9502-482c4f52086b', 'b145eb3e-60b4-51b6-a998-609ea5e92825', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-12-17-280456+00-00/ee-tarek-exam-hints-2019-page-079/point-01.png', 'Cough suppressant and increase serotonin NSAIDS', 0, 'complete', 'published', '2026-04-10T07:12:17.280456+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:12:17.280456+00:00'),
  ('e8e44adb-6580-52c6-abe7-e3d1ff529b79', 'dc3bc380-e196-5480-ae87-e4f0ebf5fea7', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-12-17-280456+00-00/ee-tarek-exam-hints-2019-page-079/point-02.png', 'Generally, Ibuprofen has the lowest risk. Pyridoxine Vit B6', 1, 'complete', 'published', '2026-04-10T07:12:17.280456+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:12:17.280456+00:00'),
  ('64c46f24-6625-5e14-9fa6-3ff8b6bd8193', 'b8c793f2-610d-5243-969f-524899983d88', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-12-17-280456+00-00/ee-tarek-exam-hints-2019-page-079/point-03.png', 'Isoniazid cause neurotoxicity, that’s why pyridoxine B6 is good with it.', 2, 'complete', 'published', '2026-04-10T07:12:17.280456+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:12:17.280456+00:00'),
  ('1cdcb407-bd53-5d9a-bda8-65838f83e500', '1345d03e-5b5b-5569-8349-2a569ceaddba', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-12-17-280456+00-00/ee-tarek-exam-hints-2019-page-079/point-04.png', 'It increase Levodopa breakdown; therefore, it increase its peripheral side effect. Folic acid', 3, 'complete', 'published', '2026-04-10T07:12:17.280456+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:12:17.280456+00:00'),
  ('e56b2699-905d-5eb1-850e-d4d63087a012', 'd83a604d-1234-55bd-b1e6-6bdcce294775', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-12-17-280456+00-00/ee-tarek-exam-hints-2019-page-079/point-05.png', 'Diabetic pregnant', 4, 'complete', 'published', '2026-04-10T07:12:17.280456+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:12:17.280456+00:00'),
  ('93f273e0-5f7f-5cb8-aaa4-949a2e1e0857', '789ba2b4-ead4-58da-b7a7-e3ea162f6fff', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-12-17-280456+00-00/ee-tarek-exam-hints-2019-page-079/point-06.png', '4-1 mg throughout pregnancy and 6 months postpartum or till finish breastfeeding.', 5, 'complete', 'published', '2026-04-10T07:12:17.280456+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:12:17.280456+00:00'),
  ('149ee5ad-010a-5a42-8464-daef8afa563b', 'ac831d8d-414c-54d0-80aa-324956ff8928', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-12-17-280456+00-00/ee-tarek-exam-hints-2019-page-079/point-07.png', 'Pregnant woman taking AED should take 1 mg folic acid daily, 3 months before gestation and at first 12 weeks of pregnancy. If the patient taking Valproic acid or have history of neural tube defect, 4 mg daily is recommended. From 12 weeks to as long as breast feeding continue, 0.4', 6, 'complete', 'published', '2026-04-10T07:12:17.280456+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:12:17.280456+00:00'),
  ('826d6b80-ace3-568b-8c01-83b67d9fd3a8', '97afa2bd-72b0-5dfa-875d-290ba989b25d', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-12-17-280456+00-00/ee-tarek-exam-hints-2019-page-079/point-08.png', 'Used with Vit B12 in pernicious anemia (high MCV)', 7, 'complete', 'published', '2026-04-10T07:12:17.280456+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:12:17.280456+00:00'),
  ('d280d5ed-83ee-5168-b241-15f4fa0b3f19', 'f7533a4c-459c-544e-b999-e5e435eb05f8', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-12-17-280456+00-00/ee-tarek-exam-hints-2019-page-079/point-09.png', 'Counteract Methotrexate GIT side effects such as mucositis (mouth ulcers) Structures', 8, 'complete', 'published', '2026-04-10T07:12:17.280456+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:12:17.280456+00:00'),
  ('0820fa24-c2d6-503f-8dd4-f775de712d86', 'a1c67aae-f9b4-541c-8fba-ae452ae36e7d', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-12-17-280456+00-00/ee-tarek-exam-hints-2019-page-079/point-10.png', 'Xanthine oxidase inhibitor', 9, 'complete', 'published', '2026-04-10T07:12:17.280456+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism board', null, '2026-04-10T07:12:17.280456+00:00')
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
  ('222f7492-ab1c-5330-b530-5d1817af25f7', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '5e9ff365-533f-58aa-9502-482c4f52086b', 'b145eb3e-60b4-51b6-a998-609ea5e92825', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 079.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:79", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 79, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.280456+00:00'),
  ('ed6272d4-45ae-5880-bb34-517f4de7a141', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'a476f59f-e7a7-5a1b-949e-61153f638aac', 'e8e44adb-6580-52c6-abe7-e3d1ff529b79', 'dc3bc380-e196-5480-ae87-e4f0ebf5fea7', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 079.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:79", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 79, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.280456+00:00'),
  ('03970ffc-2b52-5956-abad-1ed2076ec06b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '64c46f24-6625-5e14-9fa6-3ff8b6bd8193', 'b8c793f2-610d-5243-969f-524899983d88', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 079.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:79", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 79, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.280456+00:00'),
  ('4b5715d1-40d3-57f4-8ff4-393d2a2ee942', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '1cdcb407-bd53-5d9a-bda8-65838f83e500', '1345d03e-5b5b-5569-8349-2a569ceaddba', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 079.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:79", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 79, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.280456+00:00'),
  ('dbe7be3c-d5ad-5081-85d8-8aa5717177d0', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'a476f59f-e7a7-5a1b-949e-61153f638aac', 'e56b2699-905d-5eb1-850e-d4d63087a012', 'd83a604d-1234-55bd-b1e6-6bdcce294775', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 079.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:79", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 79, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.280456+00:00'),
  ('f2d0c9cf-506a-5a8d-9a9c-f3c5ff6a9a81', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '93f273e0-5f7f-5cb8-aaa4-949a2e1e0857', '789ba2b4-ead4-58da-b7a7-e3ea162f6fff', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 079.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:79", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 79, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.280456+00:00'),
  ('59331c43-e760-5071-8389-5a6981ce6c1d', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '149ee5ad-010a-5a42-8464-daef8afa563b', 'ac831d8d-414c-54d0-80aa-324956ff8928', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 079.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:79", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 79, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.280456+00:00'),
  ('b558c51d-a66f-5e4d-bf6b-1afda1130745', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '826d6b80-ace3-568b-8c01-83b67d9fd3a8', '97afa2bd-72b0-5dfa-875d-290ba989b25d', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 079.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:79", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 79, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.280456+00:00'),
  ('5227561b-ba02-523a-85be-87c52d4866e3', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'a476f59f-e7a7-5a1b-949e-61153f638aac', 'd280d5ed-83ee-5168-b241-15f4fa0b3f19', 'f7533a4c-459c-544e-b999-e5e435eb05f8', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 079.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:79", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 79, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.280456+00:00'),
  ('a0d4c767-4adf-5021-b8de-77274a2f8c5f', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'a476f59f-e7a7-5a1b-949e-61153f638aac', '0820fa24-c2d6-503f-8dd4-f775de712d86', 'a1c67aae-f9b4-541c-8fba-ae452ae36e7d', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'mechanism board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 079.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:79", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 79, "point_category": "Pathophysiology", "point_concept": "Mechanism", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.280456+00:00')
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

select public.refresh_public_card_relationships('a476f59f-e7a7-5a1b-949e-61153f638aac'::uuid);
