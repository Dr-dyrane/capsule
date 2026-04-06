-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-06/2026-04-06T03-10-06-210841+00-00/ee-tarek-exam-hints-2019-page-066/source.png', 'complete', '2- Categorical (Discrete) (finite options, don’t have fraction): number of children, number of pts,', 10, 10, '2026-04-06T03:21:26.123067+00:00', '2026-04-06T03:21:26.123067+00:00', 'published')
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
  ('2cf0838f-18f0-5722-a999-784dfc608082', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', 'number of asthma attack per week, could be words not numbers.', 'General', 'Other', 0, 1, '2026-04-06T03:21:26.123067+00:00'),
  ('b146d8c8-8537-53c1-b750-cd8dec0e9830', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', 'a) Ordinal (ordered categories): pain severity, grade of breast cancer', 'General', 'Other', 1, 1, '2026-04-06T03:21:26.123067+00:00'),
  ('385c812f-280e-5703-8ae9-960c4c5f59b7', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', 'b) Nominal (no ordered categories): Blood groups, eye color.', 'General', 'Other', 2, 1, '2026-04-06T03:21:26.123067+00:00'),
  ('02d7be0c-cdfd-58f6-bb61-c32cac2b4538', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', 'c) Binary (only 2 options): Yes/No, Pass/Fail', 'General', 'Other', 3, 1, '2026-04-06T03:21:26.123067+00:00'),
  ('a7b8a428-6f03-53a1-9a4c-c78183779540', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', 'Permissible statistics: Mode, Median, Chi Square, Z test, Cochrane, fisher', 'Diagnostic', 'Diagnostic', 4, 1, '2026-04-06T03:21:26.123067+00:00'),
  ('b9f56ba2-0347-5950-a89c-29da4653e4b9', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', 'Nominal: 2 groups = fisher. Chi Square test: more than 2 samples. If the groups related then use Cochrane. Z test: 1 or 2 samples.', 'Diagnostic', 'Diagnostic', 5, 1, '2026-04-06T03:21:26.123067+00:00'),
  ('88e5742a-5b04-5b58-ab66-ccd4e914a1f7', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', 'Ordinal: 2 groups = Wilcoxon. More than 2 groups Friedman', 'General', 'Other', 6, 1, '2026-04-06T03:21:26.123067+00:00'),
  ('d025fb05-89eb-52d7-8e92-f84cab7b6cae', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', 'Intention-to-treat analysis: to avoid bias for patient who are non adherent/complaint to medication in clinical trial. (To include all the patient assigned for the study regardless of their adherence or withdrawal from treatment)', 'Management', 'Management', 7, 1, '2026-04-06T03:21:26.123067+00:00'),
  ('9d9473f1-a8bb-5eec-9b98-3730bcddf399', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', 'Cmax and Tmax depend on the rate and extent of drug absorption.', 'General', 'Drug', 8, 1, '2026-04-06T03:21:26.123067+00:00'),
  ('24eaa5f5-9675-50b2-828e-53fe4c1b2773', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', 'Concentration: W/V % = 100 * gm/ml V/V % = 100 * ml/ml W/W %= 100 * gm/gm', 'General', 'Other', 9, 1, '2026-04-06T03:21:26.123067+00:00')
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
  ('d407cae3-bb30-5397-9303-3c9b5a2e7d96', '2cf0838f-18f0-5722-a999-784dfc608082', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '/seed/2026-04-06/2026-04-06T03-10-06-210841+00-00/ee-tarek-exam-hints-2019-page-066/point-01.png', 'number of asthma attack per week, could be words not numbers.', 0, 'complete', 'published', '2026-04-06T03:21:26.123067+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:26.123067+00:00'),
  ('f7ffad3f-0e14-5631-9f93-4fbef731c326', 'b146d8c8-8537-53c1-b750-cd8dec0e9830', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '/seed/2026-04-06/2026-04-06T03-10-06-210841+00-00/ee-tarek-exam-hints-2019-page-066/point-02.png', 'a) Ordinal (ordered categories)', 1, 'complete', 'published', '2026-04-06T03:21:26.123067+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:26.123067+00:00'),
  ('7578ba48-c6a1-558f-8474-075939337720', '385c812f-280e-5703-8ae9-960c4c5f59b7', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '/seed/2026-04-06/2026-04-06T03-10-06-210841+00-00/ee-tarek-exam-hints-2019-page-066/point-03.png', 'b) Nominal (no ordered categories)', 2, 'complete', 'published', '2026-04-06T03:21:26.123067+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:26.123067+00:00'),
  ('2fad17c8-2d06-58fd-a770-9bfe1d8bf9c1', '02d7be0c-cdfd-58f6-bb61-c32cac2b4538', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '/seed/2026-04-06/2026-04-06T03-10-06-210841+00-00/ee-tarek-exam-hints-2019-page-066/point-04.png', 'c) Binary (only 2 options)', 3, 'complete', 'published', '2026-04-06T03:21:26.123067+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:26.123067+00:00'),
  ('43131c84-bc6d-5f52-ad3c-f6d79499e97c', 'a7b8a428-6f03-53a1-9a4c-c78183779540', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '/seed/2026-04-06/2026-04-06T03-10-06-210841+00-00/ee-tarek-exam-hints-2019-page-066/point-05.png', 'Permissible statistics', 4, 'complete', 'published', '2026-04-06T03:21:26.123067+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'diagnostic flow', null, '2026-04-06T03:21:26.123067+00:00'),
  ('3ff424eb-6cf8-536b-a947-bbd0f6797daf', 'b9f56ba2-0347-5950-a89c-29da4653e4b9', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '/seed/2026-04-06/2026-04-06T03-10-06-210841+00-00/ee-tarek-exam-hints-2019-page-066/point-06.png', 'Nominal', 5, 'complete', 'published', '2026-04-06T03:21:26.123067+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'diagnostic flow', null, '2026-04-06T03:21:26.123067+00:00'),
  ('62a620c3-7996-5d03-9a08-ecaebe90d6a1', '88e5742a-5b04-5b58-ab66-ccd4e914a1f7', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '/seed/2026-04-06/2026-04-06T03-10-06-210841+00-00/ee-tarek-exam-hints-2019-page-066/point-07.png', 'Ordinal', 6, 'complete', 'published', '2026-04-06T03:21:26.123067+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:26.123067+00:00'),
  ('7e63f9f4-0011-5e80-8985-123b97029d0f', 'd025fb05-89eb-52d7-8e92-f84cab7b6cae', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '/seed/2026-04-06/2026-04-06T03-10-06-210841+00-00/ee-tarek-exam-hints-2019-page-066/point-08.png', 'Intention-to-treat analysis', 7, 'complete', 'published', '2026-04-06T03:21:26.123067+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'treatment ladder', null, '2026-04-06T03:21:26.123067+00:00'),
  ('87044cbd-3cab-50ae-9057-df3134bad53f', '9d9473f1-a8bb-5eec-9b98-3730bcddf399', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '/seed/2026-04-06/2026-04-06T03-10-06-210841+00-00/ee-tarek-exam-hints-2019-page-066/point-09.png', 'Cmax and Tmax depend on the rate and extent of drug absorption.', 8, 'complete', 'published', '2026-04-06T03:21:26.123067+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:26.123067+00:00'),
  ('4a19433e-b235-5d72-ae41-2d39b49498c7', '24eaa5f5-9675-50b2-828e-53fe4c1b2773', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '/seed/2026-04-06/2026-04-06T03-10-06-210841+00-00/ee-tarek-exam-hints-2019-page-066/point-10.png', 'Concentration', 9, 'complete', 'published', '2026-04-06T03:21:26.123067+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:26.123067+00:00')
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
  ('407cc0b3-a01b-555f-a998-15c770c35860', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', 'd407cae3-bb30-5397-9303-3c9b5a2e7d96', '2cf0838f-18f0-5722-a999-784dfc608082', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 066.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:66", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 66, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:26.123067+00:00'),
  ('864148bd-49ce-53fb-8deb-87bb095741a1', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', 'f7ffad3f-0e14-5631-9f93-4fbef731c326', 'b146d8c8-8537-53c1-b750-cd8dec0e9830', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 066.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:66", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 66, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:26.123067+00:00'),
  ('f370bd75-a19e-50c7-81ac-a5aa3de990e9', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '7578ba48-c6a1-558f-8474-075939337720', '385c812f-280e-5703-8ae9-960c4c5f59b7', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 066.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:66", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 66, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:26.123067+00:00'),
  ('10dbeca1-0ab8-5f8e-bc05-6ab2784f1c98', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '2fad17c8-2d06-58fd-a770-9bfe1d8bf9c1', '02d7be0c-cdfd-58f6-bb61-c32cac2b4538', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 066.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:66", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 66, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:26.123067+00:00'),
  ('de00716d-af8e-5c02-a33d-15cc0260fccf', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '43131c84-bc6d-5f52-ad3c-f6d79499e97c', 'a7b8a428-6f03-53a1-9a4c-c78183779540', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'diagnostic flow', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 066.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:66", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 66, "point_category": "Diagnostic", "point_concept": "Diagnostic", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:26.123067+00:00'),
  ('66fe2b5b-29c3-5adb-9718-fd8e2b626aa4', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '3ff424eb-6cf8-536b-a947-bbd0f6797daf', 'b9f56ba2-0347-5950-a89c-29da4653e4b9', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'diagnostic flow', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 066.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:66", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 66, "point_category": "Diagnostic", "point_concept": "Diagnostic", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:26.123067+00:00'),
  ('9fd19cbe-d23d-5910-b956-070cffbcdf91', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '62a620c3-7996-5d03-9a08-ecaebe90d6a1', '88e5742a-5b04-5b58-ab66-ccd4e914a1f7', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 066.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:66", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 66, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:26.123067+00:00'),
  ('a89af9a1-2817-52e1-b991-7621cd1d2c7d', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '7e63f9f4-0011-5e80-8985-123b97029d0f', 'd025fb05-89eb-52d7-8e92-f84cab7b6cae', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'treatment ladder', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 066.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:66", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 66, "point_category": "Management", "point_concept": "Management", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:26.123067+00:00'),
  ('60306327-3045-52eb-a26a-cbf8bc81b587', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '87044cbd-3cab-50ae-9057-df3134bad53f', '9d9473f1-a8bb-5eec-9b98-3730bcddf399', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 066.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:66", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 66, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:26.123067+00:00'),
  ('ff2d9f62-5562-574e-8d1e-e55b3fba129e', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '28a6e51b-5bd6-5ede-889c-a0c5ff2f5209', '4a19433e-b235-5d72-ae41-2d39b49498c7', '24eaa5f5-9675-50b2-828e-53fe4c1b2773', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 066.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:66", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 66, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:26.123067+00:00')
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

select public.refresh_public_card_relationships('28a6e51b-5bd6-5ede-889c-a0c5ff2f5209'::uuid);
