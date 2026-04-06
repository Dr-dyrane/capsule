-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('e2954870-cb8a-5354-bac8-2983b7e57cd0', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-06/2026-04-06T02-36-38-354654+00-00/ee-tarek-exam-hints-2019-page-058/source.png', 'complete', 'Provide information and guidance on pharmacy profession regulation.', 10, 10, '2026-04-06T03:21:02.489447+00:00', '2026-04-06T03:21:02.489447+00:00', 'published')
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
  ('0122a3ad-b282-5d44-8622-ad2c3e711565', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', 'Set standard of professional qualification and competencies.', 'General', 'Other', 0, 1, '2026-04-06T03:21:02.489447+00:00'),
  ('02812ad2-7206-581d-af37-6e494fdb042e', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', 'Deductible: amount of money paid by the patient every year.', 'Regimen', 'Regimen', 1, 1, '2026-04-06T03:21:02.489447+00:00'),
  ('f84249fc-a48c-55e5-92c8-0b90a88b935c', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', 'Co-Payment: fixed amount of money paid by the patient for every prescription.', 'Rules', 'Regimen', 2, 1, '2026-04-06T03:21:02.489447+00:00'),
  ('b1e170d3-d0b5-52a9-bd1a-20ac89540fef', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', 'Co-insurance: patient pay specific percentage of the prescription.', 'Rules', 'Other', 3, 1, '2026-04-06T03:21:02.489447+00:00'),
  ('3b0b3ae6-fe2c-5f17-bdad-5226d30cf5e1', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', 'Total Yearly cap: maximum value covered by insurance company per year, pt pay exceeding amount.', 'General', 'Other', 4, 1, '2026-04-06T03:21:02.489447+00:00'),
  ('5b958384-f2d5-5893-af1c-67ece85c9c7d', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', 'Professional fee cap: max. professional fee paid by insurance company, pt pay exceeding amount.', 'General', 'Other', 5, 1, '2026-04-06T03:21:02.489447+00:00'),
  ('359244ea-3ff6-5535-8196-5ce1f33b9d15', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', 'Loss Leader: sell product below its market price to attract customer to buy other products.', 'General', 'Other', 6, 1, '2026-04-06T03:21:02.489447+00:00'),
  ('07f8d5d9-48cd-564b-8d33-7e79f8069f85', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', 'Cold Chain: system of transporting and storing vaccine at 2-80 C', 'General', 'Other', 7, 1, '2026-04-06T03:21:02.489447+00:00'),
  ('330fe622-7936-5bbf-907f-6dd076b493f1', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', 'Medication Reconciliation: Gather patient medication history, obtain all patient’s medication, including name, dosage, frequency and route = Best Possible Medication History (BPMH). Preformed by pharmacy technician. Objective: Avoid adverse drug events. It’s done in admission, transfer and discharge.', 'General', 'Drug', 8, 1, '2026-04-06T03:21:02.489447+00:00'),
  ('35b165e2-b76b-5dba-9a5f-423e9d961723', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', 'Highest expenditure (most expensive health services): Hospitals > Drugs (Prescribed + OTC) > physicians.', 'General', 'Drug', 9, 1, '2026-04-06T03:21:02.489447+00:00')
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
  ('87f9d0a7-8e4e-5f6a-bd30-2b4872b9313a', '0122a3ad-b282-5d44-8622-ad2c3e711565', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '/seed/2026-04-06/2026-04-06T02-36-38-354654+00-00/ee-tarek-exam-hints-2019-page-058/point-01.png', 'Set standard of professional qualification and competencies.', 0, 'complete', 'published', '2026-04-06T03:21:02.489447+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:02.489447+00:00'),
  ('f52e0e10-1af1-5999-8739-9178bc6d1e83', '02812ad2-7206-581d-af37-6e494fdb042e', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '/seed/2026-04-06/2026-04-06T02-36-38-354654+00-00/ee-tarek-exam-hints-2019-page-058/point-02.png', 'Deductible', 1, 'complete', 'published', '2026-04-06T03:21:02.489447+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'treatment ladder', null, '2026-04-06T03:21:02.489447+00:00'),
  ('678f7dbc-c284-5294-b9d9-5ff8f7360519', 'f84249fc-a48c-55e5-92c8-0b90a88b935c', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '/seed/2026-04-06/2026-04-06T02-36-38-354654+00-00/ee-tarek-exam-hints-2019-page-058/point-03.png', 'Co-Payment', 2, 'complete', 'published', '2026-04-06T03:21:02.489447+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'rules board', null, '2026-04-06T03:21:02.489447+00:00'),
  ('3d2fff89-9a66-5b64-a4b3-589c7f641579', 'b1e170d3-d0b5-52a9-bd1a-20ac89540fef', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '/seed/2026-04-06/2026-04-06T02-36-38-354654+00-00/ee-tarek-exam-hints-2019-page-058/point-04.png', 'Co-insurance', 3, 'complete', 'published', '2026-04-06T03:21:02.489447+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'rules board', null, '2026-04-06T03:21:02.489447+00:00'),
  ('7c62697c-6456-55c1-8b59-d33e45f63860', '3b0b3ae6-fe2c-5f17-bdad-5226d30cf5e1', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '/seed/2026-04-06/2026-04-06T02-36-38-354654+00-00/ee-tarek-exam-hints-2019-page-058/point-05.png', 'Total Yearly cap', 4, 'complete', 'published', '2026-04-06T03:21:02.489447+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:02.489447+00:00'),
  ('621695b4-1797-59a1-ad85-e338757c9a39', '5b958384-f2d5-5893-af1c-67ece85c9c7d', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '/seed/2026-04-06/2026-04-06T02-36-38-354654+00-00/ee-tarek-exam-hints-2019-page-058/point-06.png', 'Professional fee cap', 5, 'complete', 'published', '2026-04-06T03:21:02.489447+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:02.489447+00:00'),
  ('e7ae772f-553d-536c-8f0c-143d4be66a71', '359244ea-3ff6-5535-8196-5ce1f33b9d15', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '/seed/2026-04-06/2026-04-06T02-36-38-354654+00-00/ee-tarek-exam-hints-2019-page-058/point-07.png', 'Loss Leader', 6, 'complete', 'published', '2026-04-06T03:21:02.489447+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:02.489447+00:00'),
  ('6d94bbab-6dfb-5fb2-9621-e53d8626bea1', '07f8d5d9-48cd-564b-8d33-7e79f8069f85', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '/seed/2026-04-06/2026-04-06T02-36-38-354654+00-00/ee-tarek-exam-hints-2019-page-058/point-08.png', 'Cold Chain', 7, 'complete', 'published', '2026-04-06T03:21:02.489447+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:02.489447+00:00'),
  ('763a52f1-7665-51d5-bdd3-f555b542b301', '330fe622-7936-5bbf-907f-6dd076b493f1', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '/seed/2026-04-06/2026-04-06T02-36-38-354654+00-00/ee-tarek-exam-hints-2019-page-058/point-09.png', 'Medication Reconciliation', 8, 'complete', 'published', '2026-04-06T03:21:02.489447+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:02.489447+00:00'),
  ('7b9f75e2-97c1-5433-87db-4bcc62caffe7', '35b165e2-b76b-5dba-9a5f-423e9d961723', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '/seed/2026-04-06/2026-04-06T02-36-38-354654+00-00/ee-tarek-exam-hints-2019-page-058/point-10.png', 'Highest expenditure (most expensive health services)', 9, 'complete', 'published', '2026-04-06T03:21:02.489447+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:02.489447+00:00')
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
  ('6986eee8-cfb7-5ad6-8334-4631aa2d87e1', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '87f9d0a7-8e4e-5f6a-bd30-2b4872b9313a', '0122a3ad-b282-5d44-8622-ad2c3e711565', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 058.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:58", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 58, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:02.489447+00:00'),
  ('ba05325b-21d6-5337-83fe-baa6f9d9f8af', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', 'f52e0e10-1af1-5999-8739-9178bc6d1e83', '02812ad2-7206-581d-af37-6e494fdb042e', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'treatment ladder', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 058.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:58", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 58, "point_category": "Regimen", "point_concept": "Regimen", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:02.489447+00:00'),
  ('e8474ec4-a901-53d8-91bf-5b23f18aa9ff', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '678f7dbc-c284-5294-b9d9-5ff8f7360519', 'f84249fc-a48c-55e5-92c8-0b90a88b935c', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'rules board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 058.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:58", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 58, "point_category": "Rules", "point_concept": "Regimen", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:02.489447+00:00'),
  ('cde3a3af-7611-502d-8d5c-3ca4f9bfe0d6', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '3d2fff89-9a66-5b64-a4b3-589c7f641579', 'b1e170d3-d0b5-52a9-bd1a-20ac89540fef', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'rules board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 058.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:58", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 58, "point_category": "Rules", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:02.489447+00:00'),
  ('30aeadce-92fc-5e26-9a50-6bf0ca3429f7', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '7c62697c-6456-55c1-8b59-d33e45f63860', '3b0b3ae6-fe2c-5f17-bdad-5226d30cf5e1', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 058.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:58", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 58, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:02.489447+00:00'),
  ('20c9f831-bf9d-5b16-80ce-3a579d058453', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '621695b4-1797-59a1-ad85-e338757c9a39', '5b958384-f2d5-5893-af1c-67ece85c9c7d', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 058.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:58", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 58, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:02.489447+00:00'),
  ('64fdf3e4-eca4-54c2-bf7d-852fdaebfbc4', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', 'e7ae772f-553d-536c-8f0c-143d4be66a71', '359244ea-3ff6-5535-8196-5ce1f33b9d15', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 058.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:58", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 58, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:02.489447+00:00'),
  ('a16d3b13-5e64-5ac2-b7f2-49537a2cc664', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '6d94bbab-6dfb-5fb2-9621-e53d8626bea1', '07f8d5d9-48cd-564b-8d33-7e79f8069f85', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 058.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:58", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 58, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:02.489447+00:00'),
  ('cb6fa011-754e-5195-8e25-119063254225', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '763a52f1-7665-51d5-bdd3-f555b542b301', '330fe622-7936-5bbf-907f-6dd076b493f1', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 058.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:58", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 58, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:02.489447+00:00'),
  ('2b5c36ef-3ea5-5f06-a392-39e494681506', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e2954870-cb8a-5354-bac8-2983b7e57cd0', '7b9f75e2-97c1-5433-87db-4bcc62caffe7', '35b165e2-b76b-5dba-9a5f-423e9d961723', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 058.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:58", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 58, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:02.489447+00:00')
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

select public.refresh_public_card_relationships('e2954870-cb8a-5354-bac8-2983b7e57cd0'::uuid);
