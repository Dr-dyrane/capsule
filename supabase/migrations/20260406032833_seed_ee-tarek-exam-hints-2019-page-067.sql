-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-06/2026-04-06T03-14-19-794702+00-00/ee-tarek-exam-hints-2019-page-067/source.png', 'complete', 'the proportion should be 5:5:50 (1:1:10) of 50%, 20% and 5% respectively.', 10, 10, '2026-04-06T03:21:28.734210+00:00', '2026-04-06T03:21:28.734210+00:00', 'published')
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
  ('f3d93e39-513a-5da3-b967-3f3cf2b5ee1b', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', 'Gram of substance to be added in 1000 g water to get isotonic solution = Molecular weight * 0.28', 'General', 'Other', 0, 1, '2026-04-06T03:21:28.734210+00:00'),
  ('0f78dc49-c154-5c4b-9fd6-872fc8e9890b', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', 'ex. Non electrolyte substance with molecular weight 90.3 g/mol. How much is required to make 100 g of water solution isotonic? ans. Grams = MWT * 0.28 = 90.3 * 0.28 = 25.28 (but this for 1000 g water) for 100 g we will use 2.528 g', 'General', 'Other', 1, 1, '2026-04-06T03:21:28.734210+00:00'),
  ('dedb83e5-6984-515f-b6ed-319cc3e5865b', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', 'NaCl Equivalent (E) = 0.23, it means 1 gm of the drug = 0.23 gm NaCl', 'General', 'Drug', 2, 1, '2026-04-06T03:21:28.734210+00:00'),
  ('c408a2aa-97b3-53f8-b648-77e002b989b9', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', 'Ex. Determine the volume of purified water and 0.9% w/v of NaCl solution needed to prepare 30 ml of a 1% w/v solution of hydromorphone hydrochloride (E= 0.22) Ans. 30 ml has = 1 gm *30/100 = 0.3 gm', 'General', 'Other', 3, 1, '2026-04-06T03:21:28.734210+00:00'),
  ('da17e65d-e9d0-5020-bcca-0b3272acca44', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '3 gm X 0.22 (E value) = 0.066 g NaCl equivalent Isotonic solution of 30 ml should have 0.9% NaCl that means = (0.9/100) X 30 = 0.27 g NaCl', 'General', 'Other', 4, 1, '2026-04-06T03:21:28.734210+00:00'),
  ('fe1a8f96-2335-5c47-a306-7e810d169e80', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '27 gm – 0.066 gm = 0.204 gm NaCl needed as long we have stock of 0.9% so we need to add = 0.204 X 100 /0.9 = 22.67 ml of 0.9% NaCl should be added, then we can add water by 30 – 22.67= 7.33 ml water', 'General', 'Other', 5, 1, '2026-04-06T03:21:28.734210+00:00'),
  ('71dece17-5ff6-5b74-9c29-a56073812294', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', 'mEq = mg * valence / MW', 'General', 'Other', 6, 1, '2026-04-06T03:21:28.734210+00:00'),
  ('488d4fad-86c0-5f38-82a6-4da53760e87f', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', 'mg = mEq* Molecular weight /valence, if you have mEq and MW, it’s easy to calculate mg', 'General', 'Other', 7, 1, '2026-04-06T03:21:28.734210+00:00'),
  ('02686fcb-ecda-59c4-91de-fe344e23b832', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', 'Ex. Doctor prescribed 20 mEq K, how many mg of K should be taken (M.W of K = 39) Ans. Mg = mEq * mw /valence = 20 * 39 /1= 780', 'Management', 'Management', 8, 1, '2026-04-06T03:21:28.734210+00:00'),
  ('d2c0db43-e1db-5eda-8c71-804073a30d42', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', 'Mmol = mEq/Valence = weight /MW', 'General', 'Other', 9, 1, '2026-04-06T03:21:28.734210+00:00')
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
  ('3e4d2bda-ddff-50b6-81a0-bc48bff28d03', 'f3d93e39-513a-5da3-b967-3f3cf2b5ee1b', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '/seed/2026-04-06/2026-04-06T03-14-19-794702+00-00/ee-tarek-exam-hints-2019-page-067/point-01.png', 'Gram of substance to be added in 1000 g water to get isotonic solution = Molecular weight * 0.28', 0, 'complete', 'published', '2026-04-06T03:21:28.734210+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:28.734210+00:00'),
  ('be6dce8c-9a8a-57d0-9c25-0d79bd1f1f27', '0f78dc49-c154-5c4b-9fd6-872fc8e9890b', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '/seed/2026-04-06/2026-04-06T03-14-19-794702+00-00/ee-tarek-exam-hints-2019-page-067/point-02.png', 'ex. Non electrolyte substance with molecular weight 90.3 g/mol. How much is required to make 100 g of water solution isotonic? ans. Grams = MWT * 0.28 = 90.3 * 0.28 = 25.28 (but this for 1000 g water) for 100 g we will use 2.528 g', 1, 'complete', 'published', '2026-04-06T03:21:28.734210+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:28.734210+00:00'),
  ('20c17d57-e2ce-5d97-a2b4-62e61791ba3a', 'dedb83e5-6984-515f-b6ed-319cc3e5865b', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '/seed/2026-04-06/2026-04-06T03-14-19-794702+00-00/ee-tarek-exam-hints-2019-page-067/point-03.png', 'NaCl Equivalent (E) = 0.23, it means 1 gm of the drug = 0.23 gm NaCl', 2, 'complete', 'published', '2026-04-06T03:21:28.734210+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:28.734210+00:00'),
  ('e9174e9b-eb5b-50b3-9231-ab388d994fb7', 'c408a2aa-97b3-53f8-b648-77e002b989b9', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '/seed/2026-04-06/2026-04-06T03-14-19-794702+00-00/ee-tarek-exam-hints-2019-page-067/point-04.png', 'Ex. Determine the volume of purified water and 0.9% w/v of NaCl solution needed to prepare 30 ml of a 1% w/v solution of hydromorphone hydrochloride (E= 0.22) Ans. 30 ml has = 1 gm *30/100 = 0.3 gm', 3, 'complete', 'published', '2026-04-06T03:21:28.734210+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:28.734210+00:00'),
  ('c18d450a-61d3-5fc9-8c80-2b728e7010bd', 'da17e65d-e9d0-5020-bcca-0b3272acca44', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '/seed/2026-04-06/2026-04-06T03-14-19-794702+00-00/ee-tarek-exam-hints-2019-page-067/point-05.png', '3 gm X 0.22 (E value) = 0.066 g NaCl equivalent Isotonic solution of 30 ml should have 0.9% NaCl that means = (0.9/100) X 30 = 0.27 g NaCl', 4, 'complete', 'published', '2026-04-06T03:21:28.734210+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:28.734210+00:00'),
  ('567fdc84-5909-5ffa-9980-193dedfda264', 'fe1a8f96-2335-5c47-a306-7e810d169e80', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '/seed/2026-04-06/2026-04-06T03-14-19-794702+00-00/ee-tarek-exam-hints-2019-page-067/point-06.png', '27 gm – 0.066 gm = 0.204 gm NaCl needed as long we have stock of 0.9% so we need to add = 0.204 X 100 /0.9 = 22.67 ml of 0.9% NaCl should be added, then we can add water by 30 – 22.67= 7.33 ml water', 5, 'complete', 'published', '2026-04-06T03:21:28.734210+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:28.734210+00:00'),
  ('7f6265c6-e94c-54d5-b77e-ea0f217f5927', '71dece17-5ff6-5b74-9c29-a56073812294', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '/seed/2026-04-06/2026-04-06T03-14-19-794702+00-00/ee-tarek-exam-hints-2019-page-067/point-07.png', 'mEq = mg * valence / MW', 6, 'complete', 'published', '2026-04-06T03:21:28.734210+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:28.734210+00:00'),
  ('a465eafd-044e-5444-8688-e74159b22016', '488d4fad-86c0-5f38-82a6-4da53760e87f', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '/seed/2026-04-06/2026-04-06T03-14-19-794702+00-00/ee-tarek-exam-hints-2019-page-067/point-08.png', 'mg = mEq* Molecular weight /valence, if you have mEq and MW, it’s easy to calculate mg', 7, 'complete', 'published', '2026-04-06T03:21:28.734210+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:28.734210+00:00'),
  ('28beeac6-7e1d-5bcd-94e7-da02d01106f6', '02686fcb-ecda-59c4-91de-fe344e23b832', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '/seed/2026-04-06/2026-04-06T03-14-19-794702+00-00/ee-tarek-exam-hints-2019-page-067/point-09.png', 'Ex. Doctor prescribed 20 mEq K, how many mg of K should be taken (M.W of K = 39) Ans. Mg = mEq * mw /valence = 20 * 39 /1= 780', 8, 'complete', 'published', '2026-04-06T03:21:28.734210+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'treatment ladder', null, '2026-04-06T03:21:28.734210+00:00'),
  ('690d2505-a8c2-5fe6-8a74-ffcdeecab317', 'd2c0db43-e1db-5eda-8c71-804073a30d42', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '/seed/2026-04-06/2026-04-06T03-14-19-794702+00-00/ee-tarek-exam-hints-2019-page-067/point-10.png', 'Mmol = mEq/Valence = weight /MW', 9, 'complete', 'published', '2026-04-06T03:21:28.734210+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:28.734210+00:00')
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
  ('d4edb73f-3d6d-5763-88b9-2e36a68621a6', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '3e4d2bda-ddff-50b6-81a0-bc48bff28d03', 'f3d93e39-513a-5da3-b967-3f3cf2b5ee1b', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 067.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:67", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 67, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:28.734210+00:00'),
  ('d0a10c51-c80d-5d8e-82cb-28d6bbf78f6d', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', 'be6dce8c-9a8a-57d0-9c25-0d79bd1f1f27', '0f78dc49-c154-5c4b-9fd6-872fc8e9890b', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 067.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:67", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 67, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:28.734210+00:00'),
  ('5935147d-ea94-506f-81e6-f073023b3cd5', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '20c17d57-e2ce-5d97-a2b4-62e61791ba3a', 'dedb83e5-6984-515f-b6ed-319cc3e5865b', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 067.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:67", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 67, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:28.734210+00:00'),
  ('585c081e-f29e-5f22-bf58-8702fc196965', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', 'e9174e9b-eb5b-50b3-9231-ab388d994fb7', 'c408a2aa-97b3-53f8-b648-77e002b989b9', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 067.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:67", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 67, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:28.734210+00:00'),
  ('c51995f2-8e32-5566-af34-24ccde02a5b2', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', 'c18d450a-61d3-5fc9-8c80-2b728e7010bd', 'da17e65d-e9d0-5020-bcca-0b3272acca44', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 067.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:67", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 67, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:28.734210+00:00'),
  ('db612d0b-7b1c-5df7-8265-e8b6425e7ee1', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '567fdc84-5909-5ffa-9980-193dedfda264', 'fe1a8f96-2335-5c47-a306-7e810d169e80', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 067.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:67", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 67, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:28.734210+00:00'),
  ('69464448-ceae-51c9-ba67-57e8405ee85a', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '7f6265c6-e94c-54d5-b77e-ea0f217f5927', '71dece17-5ff6-5b74-9c29-a56073812294', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 067.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:67", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 67, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:28.734210+00:00'),
  ('a5f844c1-ba2e-5798-b2c4-273fb4b4cd5b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', 'a465eafd-044e-5444-8688-e74159b22016', '488d4fad-86c0-5f38-82a6-4da53760e87f', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 067.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:67", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 67, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:28.734210+00:00'),
  ('be1f5c8f-935c-5595-a30c-1dbcf1e62536', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '28beeac6-7e1d-5bcd-94e7-da02d01106f6', '02686fcb-ecda-59c4-91de-fe344e23b832', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'treatment ladder', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 067.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:67", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 67, "point_category": "Management", "point_concept": "Management", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:28.734210+00:00'),
  ('417e004c-b0cc-59fa-a079-2c57157c1223', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'cc0830a4-9c6b-5b28-8888-a6f5da32db2e', '690d2505-a8c2-5fe6-8a74-ffcdeecab317', 'd2c0db43-e1db-5eda-8c71-804073a30d42', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 067.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:67", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 67, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:28.734210+00:00')
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

select public.refresh_public_card_relationships('cc0830a4-9c6b-5b28-8888-a6f5da32db2e'::uuid);
