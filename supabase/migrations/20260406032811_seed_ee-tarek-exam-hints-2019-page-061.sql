-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('43b38812-f3ca-5029-8cfa-6708f848d046', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-06/2026-04-06T02-48-49-489354+00-00/ee-tarek-exam-hints-2019-page-061/source.png', 'complete', 'Public Health expenditure mainly used by Hospitals, then drugs, then physicians. While for private', 10, 10, '2026-04-06T03:21:10.062320+00:00', '2026-04-06T03:21:10.062320+00:00', 'published')
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
  ('f9580983-a9d9-57ca-af76-1bb9e788eaa1', '43b38812-f3ca-5029-8cfa-6708f848d046', 'insurance company highest expenditure is Dental.', 'General', 'Other', 0, 1, '2026-04-06T03:21:10.062320+00:00'),
  ('540a6d03-ecce-5107-a3b8-1f53e7ab7cf4', '43b38812-f3ca-5029-8cfa-6708f848d046', 'Pharmacist and not technician, can do prescription adaptation: change dosage form, strength, therapeutic equivalent.', 'Rules', 'Other', 1, 1, '2026-04-06T03:21:10.062320+00:00'),
  ('ec1b610c-4e3c-59e6-8f1f-c838cb996daa', '43b38812-f3ca-5029-8cfa-6708f848d046', 'Merchandising: visual selling, visual display of products in store.', 'General', 'Other', 2, 1, '2026-04-06T03:21:10.062320+00:00'),
  ('76731912-a870-56c2-a82d-53018795e385', '43b38812-f3ca-5029-8cfa-6708f848d046', 'Ambulatory care = (outpatient care) or (same day emergency care) = patient assessed, diagnosed, treated and discharged on same day without admission into hospital bed.', 'Diagnostic', 'Diagnostic', 3, 1, '2026-04-06T03:21:10.062320+00:00'),
  ('5bcb24c4-670e-52c2-8448-18b061e2fde6', '43b38812-f3ca-5029-8cfa-6708f848d046', 'Collaborative care = interprofessional cooperation, aim to improve patient outcome and its most recent issue these days in Canada.', 'General', 'Other', 4, 1, '2026-04-06T03:21:10.062320+00:00'),
  ('483d34ef-fb72-5e32-9b6b-030e801c494c', '43b38812-f3ca-5029-8cfa-6708f848d046', 'Hospital monitoring and quality done by provincial authority or hospital management.', 'Diagnostic', 'Diagnostic', 5, 1, '2026-04-06T03:21:10.062320+00:00'),
  ('2af7b957-cc0f-5b7e-b5fd-29394bbd31e4', '43b38812-f3ca-5029-8cfa-6708f848d046', 'Health Related Quality of Life (HRQOL): focus on nonclinical information; such as well being, return to work. It’s a questionnaire divided into General Health Statues Instrument: measure global health status and Disease Specific Instrument: target disease specific issues.', 'Diagnostic', 'Diagnostic', 6, 1, '2026-04-06T03:21:10.062320+00:00'),
  ('31333f2a-4cd9-5390-8c8a-faeceae51251', '43b38812-f3ca-5029-8cfa-6708f848d046', 'If pt come to pharmacy complain about wrong dispensed medication, first I should establish if the pt took any of incorrect medication.', 'General', 'Other', 7, 1, '2026-04-06T03:21:10.062320+00:00'),
  ('cc8aaa67-c17b-5b42-8f0e-6c6eed57f69d', '43b38812-f3ca-5029-8cfa-6708f848d046', 'Confounding: inability to determine the true effect on the outcome.', 'General', 'Other', 8, 1, '2026-04-06T03:21:10.062320+00:00'),
  ('aadf4261-62ef-5cad-a729-53fc1580fd6e', '43b38812-f3ca-5029-8cfa-6708f848d046', 'Pharmacotherapy ultimate goal based on patient decision.', 'Management', 'Management', 9, 1, '2026-04-06T03:21:10.062320+00:00')
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
  ('b7ae4edc-ea15-586e-8104-c38a934a5fba', 'f9580983-a9d9-57ca-af76-1bb9e788eaa1', '43b38812-f3ca-5029-8cfa-6708f848d046', '/seed/2026-04-06/2026-04-06T02-48-49-489354+00-00/ee-tarek-exam-hints-2019-page-061/point-01.png', 'insurance company highest expenditure is Dental.', 0, 'complete', 'published', '2026-04-06T03:21:10.062320+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:10.062320+00:00'),
  ('7d96bf38-cc15-52ca-b2ca-cb242f2bb030', '540a6d03-ecce-5107-a3b8-1f53e7ab7cf4', '43b38812-f3ca-5029-8cfa-6708f848d046', '/seed/2026-04-06/2026-04-06T02-48-49-489354+00-00/ee-tarek-exam-hints-2019-page-061/point-02.png', 'Pharmacist and not technician, can do prescription adaptation', 1, 'complete', 'published', '2026-04-06T03:21:10.062320+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'rules board', null, '2026-04-06T03:21:10.062320+00:00'),
  ('3c10f1e6-3865-58d9-b77c-cede0f1f580a', 'ec1b610c-4e3c-59e6-8f1f-c838cb996daa', '43b38812-f3ca-5029-8cfa-6708f848d046', '/seed/2026-04-06/2026-04-06T02-48-49-489354+00-00/ee-tarek-exam-hints-2019-page-061/point-03.png', 'Merchandising', 2, 'complete', 'published', '2026-04-06T03:21:10.062320+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:10.062320+00:00'),
  ('13d2d6d9-3696-5ead-9d88-678eefc9ed44', '76731912-a870-56c2-a82d-53018795e385', '43b38812-f3ca-5029-8cfa-6708f848d046', '/seed/2026-04-06/2026-04-06T02-48-49-489354+00-00/ee-tarek-exam-hints-2019-page-061/point-04.png', 'Ambulatory care = (outpatient care) or (same day emergency care) = patient assessed, diagnosed, treated and discharged on same day without admission into hospital bed.', 3, 'complete', 'published', '2026-04-06T03:21:10.062320+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'diagnostic flow', null, '2026-04-06T03:21:10.062320+00:00'),
  ('bb5ce315-893d-5f95-ac6c-59b24c4e55ef', '5bcb24c4-670e-52c2-8448-18b061e2fde6', '43b38812-f3ca-5029-8cfa-6708f848d046', '/seed/2026-04-06/2026-04-06T02-48-49-489354+00-00/ee-tarek-exam-hints-2019-page-061/point-05.png', 'Collaborative care = interprofessional cooperation, aim to improve patient outcome and its most recent issue these days in Canada.', 4, 'complete', 'published', '2026-04-06T03:21:10.062320+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:10.062320+00:00'),
  ('c961c905-3fa8-53b6-9fda-636f4e30945f', '483d34ef-fb72-5e32-9b6b-030e801c494c', '43b38812-f3ca-5029-8cfa-6708f848d046', '/seed/2026-04-06/2026-04-06T02-48-49-489354+00-00/ee-tarek-exam-hints-2019-page-061/point-06.png', 'Hospital monitoring and quality done by provincial authority or hospital management.', 5, 'complete', 'published', '2026-04-06T03:21:10.062320+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'diagnostic flow', null, '2026-04-06T03:21:10.062320+00:00'),
  ('95b56d95-eb56-5e28-a7ba-5004f4a51587', '2af7b957-cc0f-5b7e-b5fd-29394bbd31e4', '43b38812-f3ca-5029-8cfa-6708f848d046', '/seed/2026-04-06/2026-04-06T02-48-49-489354+00-00/ee-tarek-exam-hints-2019-page-061/point-07.png', 'Health Related Quality of Life (HRQOL)', 6, 'complete', 'published', '2026-04-06T03:21:10.062320+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'diagnostic flow', null, '2026-04-06T03:21:10.062320+00:00'),
  ('b027e6f7-6651-5787-a647-54f7e04d7ac1', '31333f2a-4cd9-5390-8c8a-faeceae51251', '43b38812-f3ca-5029-8cfa-6708f848d046', '/seed/2026-04-06/2026-04-06T02-48-49-489354+00-00/ee-tarek-exam-hints-2019-page-061/point-08.png', 'If pt come to pharmacy complain about wrong dispensed medication, first I should establish if the pt took any of incorrect medication.', 7, 'complete', 'published', '2026-04-06T03:21:10.062320+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:10.062320+00:00'),
  ('cd296b23-2b5f-5a44-86e1-e16caa7fc1a4', 'cc8aaa67-c17b-5b42-8f0e-6c6eed57f69d', '43b38812-f3ca-5029-8cfa-6708f848d046', '/seed/2026-04-06/2026-04-06T02-48-49-489354+00-00/ee-tarek-exam-hints-2019-page-061/point-09.png', 'Confounding', 8, 'complete', 'published', '2026-04-06T03:21:10.062320+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:10.062320+00:00'),
  ('0fc0074d-8744-586d-9bd3-bbd421538073', 'aadf4261-62ef-5cad-a729-53fc1580fd6e', '43b38812-f3ca-5029-8cfa-6708f848d046', '/seed/2026-04-06/2026-04-06T02-48-49-489354+00-00/ee-tarek-exam-hints-2019-page-061/point-10.png', 'Pharmacotherapy ultimate goal based on patient decision.', 9, 'complete', 'published', '2026-04-06T03:21:10.062320+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'treatment ladder', null, '2026-04-06T03:21:10.062320+00:00')
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
  ('6511cc8f-7b06-5308-90e8-8ce969132e4b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '43b38812-f3ca-5029-8cfa-6708f848d046', 'b7ae4edc-ea15-586e-8104-c38a934a5fba', 'f9580983-a9d9-57ca-af76-1bb9e788eaa1', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 061.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:61", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 61, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:10.062320+00:00'),
  ('96ca159a-6985-52ed-9e45-9ba53cbf4343', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '43b38812-f3ca-5029-8cfa-6708f848d046', '7d96bf38-cc15-52ca-b2ca-cb242f2bb030', '540a6d03-ecce-5107-a3b8-1f53e7ab7cf4', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'rules board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 061.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:61", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 61, "point_category": "Rules", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:10.062320+00:00'),
  ('46002928-bd37-57d4-a3bc-1369560be747', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '43b38812-f3ca-5029-8cfa-6708f848d046', '3c10f1e6-3865-58d9-b77c-cede0f1f580a', 'ec1b610c-4e3c-59e6-8f1f-c838cb996daa', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 061.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:61", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 61, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:10.062320+00:00'),
  ('78f088cc-342f-5c20-94a8-61d31a9fc4f4', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '43b38812-f3ca-5029-8cfa-6708f848d046', '13d2d6d9-3696-5ead-9d88-678eefc9ed44', '76731912-a870-56c2-a82d-53018795e385', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'diagnostic flow', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 061.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:61", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 61, "point_category": "Diagnostic", "point_concept": "Diagnostic", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:10.062320+00:00'),
  ('4060a864-71ca-53de-90b4-cbd352c1fb06', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '43b38812-f3ca-5029-8cfa-6708f848d046', 'bb5ce315-893d-5f95-ac6c-59b24c4e55ef', '5bcb24c4-670e-52c2-8448-18b061e2fde6', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 061.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:61", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 61, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:10.062320+00:00'),
  ('a5ca28be-2c39-5ef4-8b95-a9be4564db53', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '43b38812-f3ca-5029-8cfa-6708f848d046', 'c961c905-3fa8-53b6-9fda-636f4e30945f', '483d34ef-fb72-5e32-9b6b-030e801c494c', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'diagnostic flow', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 061.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:61", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 61, "point_category": "Diagnostic", "point_concept": "Diagnostic", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:10.062320+00:00'),
  ('d00aba15-cde3-55a8-a21c-61539bdb5bc6', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '43b38812-f3ca-5029-8cfa-6708f848d046', '95b56d95-eb56-5e28-a7ba-5004f4a51587', '2af7b957-cc0f-5b7e-b5fd-29394bbd31e4', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'diagnostic flow', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 061.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:61", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 61, "point_category": "Diagnostic", "point_concept": "Diagnostic", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:10.062320+00:00'),
  ('5d5cad5b-aba4-5c2e-b5c8-9308207dd6b7', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '43b38812-f3ca-5029-8cfa-6708f848d046', 'b027e6f7-6651-5787-a647-54f7e04d7ac1', '31333f2a-4cd9-5390-8c8a-faeceae51251', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 061.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:61", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 61, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:10.062320+00:00'),
  ('b2169bdf-9fcb-5609-b42e-54c1e655599b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '43b38812-f3ca-5029-8cfa-6708f848d046', 'cd296b23-2b5f-5a44-86e1-e16caa7fc1a4', 'cc8aaa67-c17b-5b42-8f0e-6c6eed57f69d', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 061.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:61", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 61, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:10.062320+00:00'),
  ('bfa64f99-6249-5164-98f6-56f0048a7089', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '43b38812-f3ca-5029-8cfa-6708f848d046', '0fc0074d-8744-586d-9bd3-bbd421538073', 'aadf4261-62ef-5cad-a729-53fc1580fd6e', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'treatment ladder', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 061.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:61", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 61, "point_category": "Management", "point_concept": "Management", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:10.062320+00:00')
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

select public.refresh_public_card_relationships('43b38812-f3ca-5029-8cfa-6708f848d046'::uuid);
