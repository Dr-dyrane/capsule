-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('7556dcce-3fe6-5b74-b698-da015d8d1ec3', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T05-09-42-152341+00-00/source.png', 'complete', 'Page 70', 10, 10, '2026-04-11T07:19:14.520928+00:00', '2026-04-11T07:19:14.520928+00:00', 'published')
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
  ('faf02e74-4c73-55f8-830e-bccbec0ac283', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', 'Sympathetic originate from Thoracic and Lumbar.', 'General', 'Other', 0, 1, '2026-04-11T07:19:14.520928+00:00'),
  ('aad615b3-83bb-5c9f-bfd5-aaf9ca2e44e4', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', 'Vagal nerve is a parasympathetic nerve control pulmonary, digestive and urinary system and heart beats.', 'General', 'Other', 1, 1, '2026-04-11T07:19:14.520928+00:00'),
  ('468c63b3-9362-5d8f-9459-0a3b120058f3', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', 'Cranial nerves: Olfactory (smell), Trigeminal (chewing, face and mouth touch, pain), oculomotor (eyelid and eyeball movement), trochlear and abducens (eye movement), facial (face expression, secretion of tears, saliva, taste), hypoglossal (tongue movement), Glossopharyngeal (sense carotid BP, taste), Vagal (aortic BP, heart rate, digestive organs, taste), vestibulocochlear (hearing and equilibrium)', 'General', 'Other', 2, 1, '2026-04-11T07:19:14.520928+00:00'),
  ('cbfec06c-81ac-5c6c-a252-58c733ce4bf5', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', 'Parasympathetic cranial nerves: oculomotor, Glossopharyngeal, Facial, Vagus nerve.', 'General', 'Other', 3, 1, '2026-04-11T07:19:14.520928+00:00'),
  ('b848a347-2be3-5d4a-8045-2a557928c6a1', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', 'Sciatic nerve: run through buttock, thighs till foot. It innervates whole foot. Divided into tibia and common fibular nerve which supply muscle of posterior thighs, all legs and foot. Injury lead: difficulty flexion of the knee, bending the foot inward.', 'General', 'Other', 4, 1, '2026-04-11T07:19:14.520928+00:00'),
  ('f620c8d5-ec31-50f2-a5d6-ed011346bd9a', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', 'All organs are innervated with both Sympathetic and Parasympathetic system, except exocrine gland only innervated with Parasympathetic (except only salivary gland which is innervated by the two). In Salivary gland, parasympathetic produce thick saliva while sympathetic produce light saliva.', 'General', 'Other', 5, 1, '2026-04-11T07:19:14.520928+00:00'),
  ('d816b115-7257-5eea-9b1e-3af9a5433b28', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', 'Mucus is produced by Goblet cells', 'General', 'Other', 6, 1, '2026-04-11T07:19:14.520928+00:00'),
  ('1ce99291-f2bc-5b27-8283-40480a185853', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', 'Posterior pituitary gland: Vasopressin (ADH) and Oxytocin.', 'General', 'Other', 7, 1, '2026-04-11T07:19:14.520928+00:00'),
  ('b452f6d1-105e-5a43-ae46-195427953280', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', 'Anterior pituitary: FSH, LH, TSH, ACTH, GH, prolactin.', 'General', 'Other', 8, 1, '2026-04-11T07:19:14.520928+00:00'),
  ('c42082b1-ff10-59a0-a60f-5852a643420d', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', 'Pineal: melatonin.', 'General', 'Other', 9, 1, '2026-04-11T07:19:14.520928+00:00')
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
  ('133cb706-f62b-564b-be5e-ec159503ac4f', 'faf02e74-4c73-55f8-830e-bccbec0ac283', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T05-09-42-152341+00-00/ee-tarek-exam-hints-2019-page-070/point-01.png', 'Sympathetic originate from Thoracic and Lumbar.', 0, 'complete', 'published', '2026-04-11T07:19:14.520928+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-11T07:19:14.520928+00:00'),
  ('4eed3876-476b-5c72-be71-ab38793825f1', 'aad615b3-83bb-5c9f-bfd5-aaf9ca2e44e4', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T05-09-42-152341+00-00/ee-tarek-exam-hints-2019-page-070/point-02.png', 'Vagal nerve is a parasympathetic nerve control pulmonary, digestive and urinary system and heart beats.', 1, 'complete', 'published', '2026-04-11T07:19:14.520928+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-11T07:19:14.520928+00:00'),
  ('04c07b31-8bc9-5359-bb8a-43b2b4350f6a', '468c63b3-9362-5d8f-9459-0a3b120058f3', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T05-09-42-152341+00-00/ee-tarek-exam-hints-2019-page-070/point-03.png', 'Cranial nerves', 2, 'complete', 'published', '2026-04-11T07:19:14.520928+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-11T07:19:14.520928+00:00'),
  ('d66c85c6-7a99-5470-b662-f51b3d0dd352', 'cbfec06c-81ac-5c6c-a252-58c733ce4bf5', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T05-09-42-152341+00-00/ee-tarek-exam-hints-2019-page-070/point-04.png', 'Parasympathetic cranial nerves', 3, 'complete', 'published', '2026-04-11T07:19:14.520928+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-11T07:19:14.520928+00:00'),
  ('ec20348e-3e7c-5f75-863e-70cfd0467d74', 'b848a347-2be3-5d4a-8045-2a557928c6a1', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T05-09-42-152341+00-00/ee-tarek-exam-hints-2019-page-070/point-05.png', 'Sciatic nerve', 4, 'complete', 'published', '2026-04-11T07:19:14.520928+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-11T07:19:14.520928+00:00'),
  ('d8f7fbcc-b259-5566-8709-3baa9a33fd6e', 'f620c8d5-ec31-50f2-a5d6-ed011346bd9a', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T05-09-42-152341+00-00/ee-tarek-exam-hints-2019-page-070/point-06.png', 'All organs are innervated with both Sympathetic and Parasympathetic system, except exocrine gland only innervated with Parasympathetic (except only salivary gland which is innervated by the two). In Salivary gland, parasympathetic produce thick saliva while sympathetic produce light saliva.', 5, 'complete', 'published', '2026-04-11T07:19:14.520928+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-11T07:19:14.520928+00:00'),
  ('2f858f21-0dec-5f2b-9f7f-c05d691850dd', 'd816b115-7257-5eea-9b1e-3af9a5433b28', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T05-09-42-152341+00-00/ee-tarek-exam-hints-2019-page-070/point-07.png', 'Mucus is produced by Goblet cells', 6, 'complete', 'published', '2026-04-11T07:19:14.520928+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-11T07:19:14.520928+00:00'),
  ('38e7088f-eb7b-5a09-9c20-89c153055216', '1ce99291-f2bc-5b27-8283-40480a185853', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T05-09-42-152341+00-00/ee-tarek-exam-hints-2019-page-070/point-08.png', 'Posterior pituitary gland', 7, 'complete', 'published', '2026-04-11T07:19:14.520928+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-11T07:19:14.520928+00:00'),
  ('fc5f323a-7399-5b03-869d-cc55cc699e67', 'b452f6d1-105e-5a43-ae46-195427953280', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T05-09-42-152341+00-00/ee-tarek-exam-hints-2019-page-070/point-09.png', 'Anterior pituitary', 8, 'complete', 'published', '2026-04-11T07:19:14.520928+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-11T07:19:14.520928+00:00'),
  ('453532ee-d411-55d9-9fda-67a9f8905aff', 'c42082b1-ff10-59a0-a60f-5852a643420d', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T05-09-42-152341+00-00/ee-tarek-exam-hints-2019-page-070/point-10.png', 'Pineal', 9, 'complete', 'published', '2026-04-11T07:19:14.520928+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-11T07:19:14.520928+00:00')
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
  ('f9986f30-86cb-5d23-b96d-cdb4f1b61c89', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '133cb706-f62b-564b-be5e-ec159503ac4f', 'faf02e74-4c73-55f8-830e-bccbec0ac283', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 070.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:70", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 70, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-11T07:19:14.520928+00:00'),
  ('70bbfa4e-d52b-525e-8568-9e42d0a2f49b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '4eed3876-476b-5c72-be71-ab38793825f1', 'aad615b3-83bb-5c9f-bfd5-aaf9ca2e44e4', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 070.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:70", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 70, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-11T07:19:14.520928+00:00'),
  ('5ebbfe07-ef8d-5550-a66e-140a67df8a21', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '04c07b31-8bc9-5359-bb8a-43b2b4350f6a', '468c63b3-9362-5d8f-9459-0a3b120058f3', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 070.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:70", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 70, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-11T07:19:14.520928+00:00'),
  ('9c6aa557-6ce5-5d1e-b4a9-8fe0ffff218b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', 'd66c85c6-7a99-5470-b662-f51b3d0dd352', 'cbfec06c-81ac-5c6c-a252-58c733ce4bf5', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 070.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:70", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 70, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-11T07:19:14.520928+00:00'),
  ('fb1f82d4-1864-532e-85bc-b6ac2abd6703', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', 'ec20348e-3e7c-5f75-863e-70cfd0467d74', 'b848a347-2be3-5d4a-8045-2a557928c6a1', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 070.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:70", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 70, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-11T07:19:14.520928+00:00'),
  ('f44d2fc5-bb97-5686-ad93-60a8580a8921', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', 'd8f7fbcc-b259-5566-8709-3baa9a33fd6e', 'f620c8d5-ec31-50f2-a5d6-ed011346bd9a', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 070.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:70", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 70, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-11T07:19:14.520928+00:00'),
  ('fd6e7ab3-c04a-5eb1-90ab-34a8f1ad3e33', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '2f858f21-0dec-5f2b-9f7f-c05d691850dd', 'd816b115-7257-5eea-9b1e-3af9a5433b28', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 070.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:70", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 70, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-11T07:19:14.520928+00:00'),
  ('d62cb53f-2754-59b9-8825-d6d10e4fbaf8', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '38e7088f-eb7b-5a09-9c20-89c153055216', '1ce99291-f2bc-5b27-8283-40480a185853', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 070.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:70", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 70, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-11T07:19:14.520928+00:00'),
  ('2a5efd3a-617d-5ceb-94c1-2d917bb17e18', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', 'fc5f323a-7399-5b03-869d-cc55cc699e67', 'b452f6d1-105e-5a43-ae46-195427953280', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 070.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:70", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 70, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-11T07:19:14.520928+00:00'),
  ('3ec764bc-2f49-5a0c-a5b2-a52cc73e05d2', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '7556dcce-3fe6-5b74-b698-da015d8d1ec3', '453532ee-d411-55d9-9fda-67a9f8905aff', 'c42082b1-ff10-59a0-a60f-5852a643420d', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 070.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:70", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 70, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-11T07:19:14.520928+00:00')
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

select public.refresh_public_card_relationships('7556dcce-3fe6-5b74-b698-da015d8d1ec3'::uuid);
