-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('4f797c1e-b352-5519-8632-5b2041f2ca38', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-51-29-780716+00-00/source.png', 'complete', 'Page 80', 10, 10, '2026-04-10T21:03:01.158361+00:00', '2026-04-10T21:03:01.158361+00:00', 'published')
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
  ('420be0e3-da62-5f70-bcd2-2bcaa8002ab1', '4f797c1e-b352-5519-8632-5b2041f2ca38', 'Warfarin has a coumarin ring.', 'General', 'Drug', 0, 1, '2026-04-10T21:03:01.158361+00:00'),
  ('941cdeb6-e41d-5fdb-ab8d-81415215ae0c', '4f797c1e-b352-5519-8632-5b2041f2ca38', 'Omega 3: double bond located 3 carbons away from the molecule end', 'General', 'Other', 1, 1, '2026-04-10T21:03:01.158361+00:00'),
  ('f137d2f0-cbc1-5e48-85e5-cc498ed24654', '4f797c1e-b352-5519-8632-5b2041f2ca38', 'Omega 6: double bond located 6 carbons away from the molecule end', 'General', 'Other', 2, 1, '2026-04-10T21:03:01.158361+00:00'),
  ('1043d668-c8e9-5a2f-b8da-6c37793d851c', '4f797c1e-b352-5519-8632-5b2041f2ca38', 'Omega 9: double bond located 9 carbons away from the molecule end', 'General', 'Other', 3, 1, '2026-04-10T21:03:01.158361+00:00'),
  ('1393491d-8b5d-5b01-9047-925017048806', '4f797c1e-b352-5519-8632-5b2041f2ca38', 'Heme is composed of tetra pyrrole.', 'General', 'Other', 4, 1, '2026-04-10T21:03:01.158361+00:00'),
  ('dcdc39fd-8da8-5226-be61-68bf5775bae4', '4f797c1e-b352-5519-8632-5b2041f2ca38', 'Vitamin B12: tetra pyrrole with cobalt in center', 'General', 'Other', 5, 1, '2026-04-10T21:03:01.158361+00:00'),
  ('78608551-0700-5d79-9d2c-067c13c9dda7', '4f797c1e-b352-5519-8632-5b2041f2ca38', 'Purine bases: Adenine and Guanine', 'General', 'Other', 6, 1, '2026-04-10T21:03:01.158361+00:00'),
  ('821b0ec5-86b3-5dc9-b9f3-7aab5bc14f4a', '4f797c1e-b352-5519-8632-5b2041f2ca38', 'Pyrimidine base: Thymine, Cytosine and Uracil.', 'General', 'Other', 7, 1, '2026-04-10T21:03:01.158361+00:00'),
  ('6504e909-36e3-5e38-8595-c02cd9aba6ce', '4f797c1e-b352-5519-8632-5b2041f2ca38', 'Folic acid: has Pteridine nucleus.', 'General', 'Other', 8, 1, '2026-04-10T21:03:01.158361+00:00'),
  ('27f5ddf2-13e5-5aa5-be6b-42c7eb1071b8', '4f797c1e-b352-5519-8632-5b2041f2ca38', '• Carbonic anhydrase inhibitors (ex. Acetazolamide, Dorzolamide) has sulfonamide group.', 'Pathophysiology', 'Mechanism', 9, 1, '2026-04-10T21:03:01.158361+00:00')
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
  ('82ca40b4-2502-51a4-8fb7-35a31323a4a5', '420be0e3-da62-5f70-bcd2-2bcaa8002ab1', '4f797c1e-b352-5519-8632-5b2041f2ca38', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-51-29-780716+00-00/ee-tarek-exam-hints-2019-page-080/point-01.png', 'Warfarin has a coumarin ring.', 0, 'complete', 'published', '2026-04-10T21:03:01.158361+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:01.158361+00:00'),
  ('6869c4c4-73ab-5623-ba1e-5bab9e2d9cea', '941cdeb6-e41d-5fdb-ab8d-81415215ae0c', '4f797c1e-b352-5519-8632-5b2041f2ca38', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-51-29-780716+00-00/ee-tarek-exam-hints-2019-page-080/point-02.png', 'Omega 3', 1, 'complete', 'published', '2026-04-10T21:03:01.158361+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:01.158361+00:00'),
  ('83676872-964c-5e7b-951b-b7ddc35fc4e5', 'f137d2f0-cbc1-5e48-85e5-cc498ed24654', '4f797c1e-b352-5519-8632-5b2041f2ca38', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-51-29-780716+00-00/ee-tarek-exam-hints-2019-page-080/point-03.png', 'Omega 6', 2, 'complete', 'published', '2026-04-10T21:03:01.158361+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:01.158361+00:00'),
  ('406cd190-b324-5baf-a30e-188e724f4235', '1043d668-c8e9-5a2f-b8da-6c37793d851c', '4f797c1e-b352-5519-8632-5b2041f2ca38', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-51-29-780716+00-00/ee-tarek-exam-hints-2019-page-080/point-04.png', 'Omega 9', 3, 'complete', 'published', '2026-04-10T21:03:01.158361+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:01.158361+00:00'),
  ('a00ce09e-2ae5-51c3-8d50-870bcebdac65', '1393491d-8b5d-5b01-9047-925017048806', '4f797c1e-b352-5519-8632-5b2041f2ca38', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-51-29-780716+00-00/ee-tarek-exam-hints-2019-page-080/point-05.png', 'Heme is composed of tetra pyrrole.', 4, 'complete', 'published', '2026-04-10T21:03:01.158361+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:01.158361+00:00'),
  ('64a699f0-317d-5f74-8a7a-96fc4f5bc055', 'dcdc39fd-8da8-5226-be61-68bf5775bae4', '4f797c1e-b352-5519-8632-5b2041f2ca38', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-51-29-780716+00-00/ee-tarek-exam-hints-2019-page-080/point-06.png', 'Vitamin B12', 5, 'complete', 'published', '2026-04-10T21:03:01.158361+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:01.158361+00:00'),
  ('56a7185c-cad6-50ad-b2e4-e37d88b7b7d6', '78608551-0700-5d79-9d2c-067c13c9dda7', '4f797c1e-b352-5519-8632-5b2041f2ca38', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-51-29-780716+00-00/ee-tarek-exam-hints-2019-page-080/point-07.png', 'Purine bases', 6, 'complete', 'published', '2026-04-10T21:03:01.158361+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:01.158361+00:00'),
  ('35db6078-692e-5c42-a0f2-ef06b92e00f8', '821b0ec5-86b3-5dc9-b9f3-7aab5bc14f4a', '4f797c1e-b352-5519-8632-5b2041f2ca38', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-51-29-780716+00-00/ee-tarek-exam-hints-2019-page-080/point-08.png', 'Pyrimidine base', 7, 'complete', 'published', '2026-04-10T21:03:01.158361+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:01.158361+00:00'),
  ('04e04614-a78d-54e8-ba3f-5b39cbe11ec1', '6504e909-36e3-5e38-8595-c02cd9aba6ce', '4f797c1e-b352-5519-8632-5b2041f2ca38', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-51-29-780716+00-00/ee-tarek-exam-hints-2019-page-080/point-09.png', 'Folic acid', 8, 'complete', 'published', '2026-04-10T21:03:01.158361+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:01.158361+00:00'),
  ('7087605d-06ac-53e5-9c57-137966d0ed80', '27f5ddf2-13e5-5aa5-be6b-42c7eb1071b8', '4f797c1e-b352-5519-8632-5b2041f2ca38', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-51-29-780716+00-00/ee-tarek-exam-hints-2019-page-080/point-10.png', '• Carbonic anhydrase inhibitors (ex. Acetazolamide, Dorzolamide) has sulfonamide group.', 9, 'complete', 'published', '2026-04-10T21:03:01.158361+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism board', null, '2026-04-10T21:03:01.158361+00:00')
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
  ('4f48c6bf-787a-5c24-a708-17b4c26ea334', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4f797c1e-b352-5519-8632-5b2041f2ca38', '82ca40b4-2502-51a4-8fb7-35a31323a4a5', '420be0e3-da62-5f70-bcd2-2bcaa8002ab1', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 080.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:80", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 80, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:01.158361+00:00'),
  ('9b72b6b0-150b-5477-95cc-87a8a4801852', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4f797c1e-b352-5519-8632-5b2041f2ca38', '6869c4c4-73ab-5623-ba1e-5bab9e2d9cea', '941cdeb6-e41d-5fdb-ab8d-81415215ae0c', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 080.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:80", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 80, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:01.158361+00:00'),
  ('6de6530a-3c2c-5bc0-847c-22f4d713af93', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4f797c1e-b352-5519-8632-5b2041f2ca38', '83676872-964c-5e7b-951b-b7ddc35fc4e5', 'f137d2f0-cbc1-5e48-85e5-cc498ed24654', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 080.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:80", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 80, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:01.158361+00:00'),
  ('3df6b3da-7572-5a24-8624-45a64dd99b77', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4f797c1e-b352-5519-8632-5b2041f2ca38', '406cd190-b324-5baf-a30e-188e724f4235', '1043d668-c8e9-5a2f-b8da-6c37793d851c', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 080.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:80", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 80, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:01.158361+00:00'),
  ('bd46956d-8f02-56b5-8918-735049594512', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4f797c1e-b352-5519-8632-5b2041f2ca38', 'a00ce09e-2ae5-51c3-8d50-870bcebdac65', '1393491d-8b5d-5b01-9047-925017048806', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 080.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:80", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 80, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:01.158361+00:00'),
  ('66e2290e-bfab-5303-ab4f-6570be93512d', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4f797c1e-b352-5519-8632-5b2041f2ca38', '64a699f0-317d-5f74-8a7a-96fc4f5bc055', 'dcdc39fd-8da8-5226-be61-68bf5775bae4', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 080.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:80", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 80, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:01.158361+00:00'),
  ('bd0ca23e-01e9-5777-bc69-44e98a48497a', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4f797c1e-b352-5519-8632-5b2041f2ca38', '56a7185c-cad6-50ad-b2e4-e37d88b7b7d6', '78608551-0700-5d79-9d2c-067c13c9dda7', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 080.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:80", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 80, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:01.158361+00:00'),
  ('17e87746-4b30-5825-90a2-1aa1fd201a65', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4f797c1e-b352-5519-8632-5b2041f2ca38', '35db6078-692e-5c42-a0f2-ef06b92e00f8', '821b0ec5-86b3-5dc9-b9f3-7aab5bc14f4a', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 080.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:80", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 80, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:01.158361+00:00'),
  ('3c5d57c0-1348-5955-b7b2-0352f1eaaefc', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4f797c1e-b352-5519-8632-5b2041f2ca38', '04e04614-a78d-54e8-ba3f-5b39cbe11ec1', '6504e909-36e3-5e38-8595-c02cd9aba6ce', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 080.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:80", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 80, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:01.158361+00:00'),
  ('2fd79c05-ce86-5e48-b47b-151b6edfdaee', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4f797c1e-b352-5519-8632-5b2041f2ca38', '7087605d-06ac-53e5-9c57-137966d0ed80', '27f5ddf2-13e5-5aa5-be6b-42c7eb1071b8', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'mechanism board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 080.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:80", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 80, "point_category": "Pathophysiology", "point_concept": "Mechanism", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:01.158361+00:00')
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

select public.refresh_public_card_relationships('4f797c1e-b352-5519-8632-5b2041f2ca38'::uuid);
