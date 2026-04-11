-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('5461ada0-c90e-5060-8ac9-c909b57847a6', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-46-54-981742+00-00/source.png', 'complete', 'Page 68', 10, 10, '2026-04-10T21:05:53.918839+00:00', '2026-04-10T21:05:53.918839+00:00', 'published')
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
  ('2140059d-2469-52ab-9997-968ea60ae27f', '5461ada0-c90e-5060-8ac9-c909b57847a6', 'Ionized = water soluble = poor absorption and excrete faster.', 'General', 'Other', 0, 1, '2026-04-10T21:05:53.918839+00:00'),
  ('0b38b0dc-7a39-5fa3-9362-5b5e846add90', '5461ada0-c90e-5060-8ac9-c909b57847a6', 'Confidence Interval (CI), if CI 95%, then significance level (α) 0.05. if P value < α value (0.05) then data is statistically significant.', 'General', 'Other', 1, 1, '2026-04-10T21:05:53.918839+00:00'),
  ('b19e08d0-65ef-5c80-8455-d4dd85e586a4', '5461ada0-c90e-5060-8ac9-c909b57847a6', 'The significance of CI depend on the parameter being evaluated: 1- if it’s a difference (mean difference, difference in T1/2, Relative Risk Reduction RRR, Absolute Risk Reduction ARR). If CI include Zero (ex. CI 2 - 5), then results Not Statistically Significant. 2- If it’s ratio (Relative Risk RR, Odd Ration OR, Hazard Ration HR). If CI include 1 (ex. CI 0.5 - 1.1), then results Not Statistically Significant.', 'General', 'Other', 2, 1, '2026-04-10T21:05:53.918839+00:00'),
  ('53c6ff63-6173-5dd9-b79e-b22d4d0e0396', '5461ada0-c90e-5060-8ac9-c909b57847a6', 'What is the final concentration if you add 10 gm 2.5% hydrocortisone to 2 gm 5% hydrocortisone to 14 gm base ointment? answer: C1V1 + C2V2 + C3V3 = Cf Vf', 'General', 'Other', 3, 1, '2026-04-10T21:05:53.918839+00:00'),
  ('383ff93a-fc5e-5e8f-a9aa-903a2d6993e2', '5461ada0-c90e-5060-8ac9-c909b57847a6', '5 * 10 + 5 *2 + 0 * 14 = Cf * 26 Cf = 35/26 = 1.35%', 'General', 'Other', 4, 1, '2026-04-10T21:05:53.918839+00:00'),
  ('b4826283-c12c-5ded-88cc-09e7e789a93e', '5461ada0-c90e-5060-8ac9-c909b57847a6', 'Arrhenius equation: describe the effect of temperature on drug degradation.', 'General', 'Drug', 5, 1, '2026-04-10T21:05:53.918839+00:00'),
  ('57978dfb-21d9-5bd8-bb5a-6220a98ae124', '5461ada0-c90e-5060-8ac9-c909b57847a6', 'Noyes-whitney: determine rate of dissolution.', 'General', 'Other', 6, 1, '2026-04-10T21:05:53.918839+00:00'),
  ('d90307e7-cb3f-5202-8c90-9430105604b2', '5461ada0-c90e-5060-8ac9-c909b57847a6', 'Ficks law: determine rate of absorption', 'Rules', 'Other', 7, 1, '2026-04-10T21:05:53.918839+00:00'),
  ('b0bc0f06-f40e-5a7b-882d-112290c4e2e3', '5461ada0-c90e-5060-8ac9-c909b57847a6', 'Hasselback: Factors affect rate of absorption: pH effect and ionization/unionization.', 'General', 'Other', 8, 1, '2026-04-10T21:05:53.918839+00:00'),
  ('19496970-0196-5816-a0d6-019c8f96ad86', '5461ada0-c90e-5060-8ac9-c909b57847a6', 'Henderson Hasselbalch equation: estimate pH of a buffer solution based on acid and conjugate base. it describe the relation between ionized and non-ionized electrolytes.', 'General', 'Other', 9, 1, '2026-04-10T21:05:53.918839+00:00')
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
  ('79651574-51c3-54bc-90bb-cd7296ded584', '2140059d-2469-52ab-9997-968ea60ae27f', '5461ada0-c90e-5060-8ac9-c909b57847a6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-46-54-981742+00-00/ee-tarek-exam-hints-2019-page-068/point-01.png', 'Ionized = water soluble = poor absorption and excrete faster.', 0, 'complete', 'published', '2026-04-10T21:05:53.918839+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:05:53.918839+00:00'),
  ('9bff1b0a-898b-5d85-bf81-cd8bfb0458d6', '0b38b0dc-7a39-5fa3-9362-5b5e846add90', '5461ada0-c90e-5060-8ac9-c909b57847a6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-46-54-981742+00-00/ee-tarek-exam-hints-2019-page-068/point-02.png', 'Confidence Interval (CI), if CI 95%, then significance level (α) 0.05. if P value < α value (0.05) then data is statistically significant.', 1, 'complete', 'published', '2026-04-10T21:05:53.918839+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:05:53.918839+00:00'),
  ('95312b38-20e5-52ed-9c74-89e369bbcfe3', 'b19e08d0-65ef-5c80-8455-d4dd85e586a4', '5461ada0-c90e-5060-8ac9-c909b57847a6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-46-54-981742+00-00/ee-tarek-exam-hints-2019-page-068/point-03.png', 'The significance of CI depend on the parameter being evaluated', 2, 'complete', 'published', '2026-04-10T21:05:53.918839+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:05:53.918839+00:00'),
  ('7b459441-04a1-5f12-aeef-05a17aa325c6', '53c6ff63-6173-5dd9-b79e-b22d4d0e0396', '5461ada0-c90e-5060-8ac9-c909b57847a6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-46-54-981742+00-00/ee-tarek-exam-hints-2019-page-068/point-04.png', 'What is the final concentration if you add 10 gm 2.5% hydrocortisone to 2 gm 5% hydrocortisone to 14 gm base ointment? answer', 3, 'complete', 'published', '2026-04-10T21:05:53.918839+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:05:53.918839+00:00'),
  ('2fb855e6-b1a0-54d8-949d-56a4f1553526', '383ff93a-fc5e-5e8f-a9aa-903a2d6993e2', '5461ada0-c90e-5060-8ac9-c909b57847a6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-46-54-981742+00-00/ee-tarek-exam-hints-2019-page-068/point-05.png', '5 * 10 + 5 *2 + 0 * 14 = Cf * 26 Cf = 35/26 = 1.35%', 4, 'complete', 'published', '2026-04-10T21:05:53.918839+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:05:53.918839+00:00'),
  ('ec479c21-82f6-5e13-b8bc-c0006c345672', 'b4826283-c12c-5ded-88cc-09e7e789a93e', '5461ada0-c90e-5060-8ac9-c909b57847a6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-46-54-981742+00-00/ee-tarek-exam-hints-2019-page-068/point-06.png', 'Arrhenius equation', 5, 'complete', 'published', '2026-04-10T21:05:53.918839+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:05:53.918839+00:00'),
  ('41b8c7bf-b53c-583a-b056-92f9d90ebd15', '57978dfb-21d9-5bd8-bb5a-6220a98ae124', '5461ada0-c90e-5060-8ac9-c909b57847a6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-46-54-981742+00-00/ee-tarek-exam-hints-2019-page-068/point-07.png', 'Noyes-whitney', 6, 'complete', 'published', '2026-04-10T21:05:53.918839+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:05:53.918839+00:00'),
  ('9ed65ce7-0518-5afe-902d-d7d71ba35514', 'd90307e7-cb3f-5202-8c90-9430105604b2', '5461ada0-c90e-5060-8ac9-c909b57847a6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-46-54-981742+00-00/ee-tarek-exam-hints-2019-page-068/point-08.png', 'Ficks law', 7, 'complete', 'published', '2026-04-10T21:05:53.918839+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'rules board', null, '2026-04-10T21:05:53.918839+00:00'),
  ('89fc4e68-edd4-5872-a532-ae95ac260cef', 'b0bc0f06-f40e-5a7b-882d-112290c4e2e3', '5461ada0-c90e-5060-8ac9-c909b57847a6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-46-54-981742+00-00/ee-tarek-exam-hints-2019-page-068/point-09.png', 'Hasselback', 8, 'complete', 'published', '2026-04-10T21:05:53.918839+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:05:53.918839+00:00'),
  ('3cab914d-8ec3-5879-a920-51c90ab39568', '19496970-0196-5816-a0d6-019c8f96ad86', '5461ada0-c90e-5060-8ac9-c909b57847a6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-46-54-981742+00-00/ee-tarek-exam-hints-2019-page-068/point-10.png', 'Henderson Hasselbalch equation', 9, 'complete', 'published', '2026-04-10T21:05:53.918839+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:05:53.918839+00:00')
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
  ('04d25fb8-d714-5705-9066-7c73ce360371', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5461ada0-c90e-5060-8ac9-c909b57847a6', '79651574-51c3-54bc-90bb-cd7296ded584', '2140059d-2469-52ab-9997-968ea60ae27f', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 068.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:68", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 68, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:05:53.918839+00:00'),
  ('eaac72ae-0cb8-5ef1-9a47-1f4850eea868', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5461ada0-c90e-5060-8ac9-c909b57847a6', '9bff1b0a-898b-5d85-bf81-cd8bfb0458d6', '0b38b0dc-7a39-5fa3-9362-5b5e846add90', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 068.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:68", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 68, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:05:53.918839+00:00'),
  ('ceaa4fd7-0f72-57ff-9be9-434814cf1d27', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5461ada0-c90e-5060-8ac9-c909b57847a6', '95312b38-20e5-52ed-9c74-89e369bbcfe3', 'b19e08d0-65ef-5c80-8455-d4dd85e586a4', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 068.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:68", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 68, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:05:53.918839+00:00'),
  ('8ba54fd2-c3fd-55e0-9ee5-7ea5329eaa59', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5461ada0-c90e-5060-8ac9-c909b57847a6', '7b459441-04a1-5f12-aeef-05a17aa325c6', '53c6ff63-6173-5dd9-b79e-b22d4d0e0396', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 068.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:68", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 68, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:05:53.918839+00:00'),
  ('6bd065f5-bbae-519f-88b3-b3080840bc98', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5461ada0-c90e-5060-8ac9-c909b57847a6', '2fb855e6-b1a0-54d8-949d-56a4f1553526', '383ff93a-fc5e-5e8f-a9aa-903a2d6993e2', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 068.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:68", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 68, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:05:53.918839+00:00'),
  ('c8023fc4-d623-589f-b057-86a446f01f99', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5461ada0-c90e-5060-8ac9-c909b57847a6', 'ec479c21-82f6-5e13-b8bc-c0006c345672', 'b4826283-c12c-5ded-88cc-09e7e789a93e', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 068.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:68", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 68, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:05:53.918839+00:00'),
  ('0504134f-c644-52eb-bda4-2997ba412f32', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5461ada0-c90e-5060-8ac9-c909b57847a6', '41b8c7bf-b53c-583a-b056-92f9d90ebd15', '57978dfb-21d9-5bd8-bb5a-6220a98ae124', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 068.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:68", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 68, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:05:53.918839+00:00'),
  ('7a0dbabe-1f9a-5307-b55e-544bd62ca2a7', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5461ada0-c90e-5060-8ac9-c909b57847a6', '9ed65ce7-0518-5afe-902d-d7d71ba35514', 'd90307e7-cb3f-5202-8c90-9430105604b2', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'rules board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 068.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:68", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 68, "point_category": "Rules", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:05:53.918839+00:00'),
  ('09bf7a5d-b9d6-5ae4-9c7d-08dcdabd5315', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5461ada0-c90e-5060-8ac9-c909b57847a6', '89fc4e68-edd4-5872-a532-ae95ac260cef', 'b0bc0f06-f40e-5a7b-882d-112290c4e2e3', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 068.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:68", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 68, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:05:53.918839+00:00'),
  ('d04060a7-ab43-5c0b-ba35-99ca2485282b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5461ada0-c90e-5060-8ac9-c909b57847a6', '3cab914d-8ec3-5879-a920-51c90ab39568', '19496970-0196-5816-a0d6-019c8f96ad86', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 068.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:68", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 68, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:05:53.918839+00:00')
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

select public.refresh_public_card_relationships('5461ada0-c90e-5060-8ac9-c909b57847a6'::uuid);
