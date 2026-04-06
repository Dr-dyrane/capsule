-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('daad8e00-77cd-5945-b2ba-017dab26f679', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-06/2026-04-06T02-40-45-003303+00-00/ee-tarek-exam-hints-2019-page-059/source.png', 'complete', 'Economic decisions: product without demand and lack financial return. Manufacturers consolidating,', 10, 10, '2026-04-06T03:21:05.554516+00:00', '2026-04-06T03:21:05.554516+00:00', 'published')
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
  ('04370abe-7cec-50cf-98d3-3588c8fa93d6', 'daad8e00-77cd-5945-b2ba-017dab26f679', '• Business Ownership: 1- Sole: sole owner, low startup cost, with unlimited liabilities. Creditors can take your personal assets. 2- Partnership: skills and knowledge could be shared, but with rate of conflicts. 3- Corporation and limited liability companies: limited liability, several directors, legal entity but high government involvement. Here, creditors will not affect your personal assets.', 'Rules', 'Other', 0, 1, '2026-04-06T03:21:05.554516+00:00'),
  ('9938b350-225a-5c3b-ac14-f05933cb0eda', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'Simplest = Sole Easiest = Franchise.', 'General', 'Other', 1, 1, '2026-04-06T03:21:05.554516+00:00'),
  ('3043d997-3100-5dbd-8632-dadfd5d6ebcc', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'When putting pharmacy schedule, it should consider: Fair for all employees, predictable so the employees would be committed, not template every month.', 'Regimen', 'Regimen', 2, 1, '2026-04-06T03:21:05.554516+00:00'),
  ('2ddef9bd-5a72-521c-9770-b74e8c3331a0', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'Pharmacist can initiate, adapt and renew prescriptions', 'Rules', 'Other', 3, 1, '2026-04-06T03:21:05.554516+00:00'),
  ('d11cd4a9-015b-5aa7-888f-5582c46666b3', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'Initiating: pharmacist can initiate smoking cessation prescription such as Varenicline and Bupropion.', 'Rules', 'Other', 4, 1, '2026-04-06T03:21:05.554516+00:00'),
  ('746dc23d-a5b1-5176-b76b-574454e4e684', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'Adaptation: change the dose, dosage form, route of administration.', 'General', 'Other', 5, 1, '2026-04-06T03:21:05.554516+00:00'),
  ('a3e86155-f933-5e73-85d3-a99f8a490c95', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'Renewing: for continuity, but not more than 6 months or more than quantity prescribed.', 'General', 'Other', 6, 1, '2026-04-06T03:21:05.554516+00:00'),
  ('def86d8a-e370-51ba-974e-90e90c3657cd', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'No adaptation or renewing in narcotics and controlled drugs.', 'Rules', 'Drug', 7, 1, '2026-04-06T03:21:05.554516+00:00'),
  ('83d75476-7f53-51eb-af11-f6b301533741', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'refill use the original prescription number, unused refills should be cancelled', 'Rules', 'Other', 8, 1, '2026-04-06T03:21:05.554516+00:00'),
  ('52b91531-313a-5887-ba87-cc4d02c3b112', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'renewing: use a new prescription number, + reference to the original prescription.', 'Rules', 'Other', 9, 1, '2026-04-06T03:21:05.554516+00:00')
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
  ('bd7870c0-fc8f-5263-8f72-5b5206ec61b1', '04370abe-7cec-50cf-98d3-3588c8fa93d6', 'daad8e00-77cd-5945-b2ba-017dab26f679', '/seed/2026-04-06/2026-04-06T02-40-45-003303+00-00/ee-tarek-exam-hints-2019-page-059/point-01.png', '• Business Ownership', 0, 'complete', 'published', '2026-04-06T03:21:05.554516+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'rules board', null, '2026-04-06T03:21:05.554516+00:00'),
  ('ed2dbec7-f3c6-5131-b507-dd28a4da3bb4', '9938b350-225a-5c3b-ac14-f05933cb0eda', 'daad8e00-77cd-5945-b2ba-017dab26f679', '/seed/2026-04-06/2026-04-06T02-40-45-003303+00-00/ee-tarek-exam-hints-2019-page-059/point-02.png', 'Simplest = Sole Easiest = Franchise.', 1, 'complete', 'published', '2026-04-06T03:21:05.554516+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:05.554516+00:00'),
  ('bdf4df9a-c57b-53fb-be34-2e1fd8f473f7', '3043d997-3100-5dbd-8632-dadfd5d6ebcc', 'daad8e00-77cd-5945-b2ba-017dab26f679', '/seed/2026-04-06/2026-04-06T02-40-45-003303+00-00/ee-tarek-exam-hints-2019-page-059/point-03.png', 'When putting pharmacy schedule, it should consider', 2, 'complete', 'published', '2026-04-06T03:21:05.554516+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'treatment ladder', null, '2026-04-06T03:21:05.554516+00:00'),
  ('368af076-9ba3-5111-9695-6fe5b00f6086', '2ddef9bd-5a72-521c-9770-b74e8c3331a0', 'daad8e00-77cd-5945-b2ba-017dab26f679', '/seed/2026-04-06/2026-04-06T02-40-45-003303+00-00/ee-tarek-exam-hints-2019-page-059/point-04.png', 'Pharmacist can initiate, adapt and renew prescriptions', 3, 'complete', 'published', '2026-04-06T03:21:05.554516+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'rules board', null, '2026-04-06T03:21:05.554516+00:00'),
  ('0cead980-31ab-5c58-84be-99864be9d96d', 'd11cd4a9-015b-5aa7-888f-5582c46666b3', 'daad8e00-77cd-5945-b2ba-017dab26f679', '/seed/2026-04-06/2026-04-06T02-40-45-003303+00-00/ee-tarek-exam-hints-2019-page-059/point-05.png', 'Initiating', 4, 'complete', 'published', '2026-04-06T03:21:05.554516+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'rules board', null, '2026-04-06T03:21:05.554516+00:00'),
  ('8b4eb33e-10a4-518e-95c2-34fd9ccd36e5', '746dc23d-a5b1-5176-b76b-574454e4e684', 'daad8e00-77cd-5945-b2ba-017dab26f679', '/seed/2026-04-06/2026-04-06T02-40-45-003303+00-00/ee-tarek-exam-hints-2019-page-059/point-06.png', 'Adaptation', 5, 'complete', 'published', '2026-04-06T03:21:05.554516+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:05.554516+00:00'),
  ('29c6ce7b-719c-5132-9e06-3aba8779fe74', 'a3e86155-f933-5e73-85d3-a99f8a490c95', 'daad8e00-77cd-5945-b2ba-017dab26f679', '/seed/2026-04-06/2026-04-06T02-40-45-003303+00-00/ee-tarek-exam-hints-2019-page-059/point-07.png', 'Renewing', 6, 'complete', 'published', '2026-04-06T03:21:05.554516+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:05.554516+00:00'),
  ('a9e9aa9d-825d-5c01-8540-9b9c6cdd73b2', 'def86d8a-e370-51ba-974e-90e90c3657cd', 'daad8e00-77cd-5945-b2ba-017dab26f679', '/seed/2026-04-06/2026-04-06T02-40-45-003303+00-00/ee-tarek-exam-hints-2019-page-059/point-08.png', 'No adaptation or renewing in narcotics and controlled drugs.', 7, 'complete', 'published', '2026-04-06T03:21:05.554516+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'rules board', null, '2026-04-06T03:21:05.554516+00:00'),
  ('a8063b8f-9b79-56b9-850a-7109b75c872c', '83d75476-7f53-51eb-af11-f6b301533741', 'daad8e00-77cd-5945-b2ba-017dab26f679', '/seed/2026-04-06/2026-04-06T02-40-45-003303+00-00/ee-tarek-exam-hints-2019-page-059/point-09.png', 'refill use the original prescription number, unused refills should be cancelled', 8, 'complete', 'published', '2026-04-06T03:21:05.554516+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'rules board', null, '2026-04-06T03:21:05.554516+00:00'),
  ('b1318f07-73fd-5408-9cd8-2e41ae66b323', '52b91531-313a-5887-ba87-cc4d02c3b112', 'daad8e00-77cd-5945-b2ba-017dab26f679', '/seed/2026-04-06/2026-04-06T02-40-45-003303+00-00/ee-tarek-exam-hints-2019-page-059/point-10.png', 'renewing', 9, 'complete', 'published', '2026-04-06T03:21:05.554516+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'rules board', null, '2026-04-06T03:21:05.554516+00:00')
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
  ('07e170f1-f0c2-585f-be53-46b7ed1ca96c', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'bd7870c0-fc8f-5263-8f72-5b5206ec61b1', '04370abe-7cec-50cf-98d3-3588c8fa93d6', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'rules board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 059.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:59", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 59, "point_category": "Rules", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:05.554516+00:00'),
  ('23f6b4c0-20e6-5c8f-9267-513853f28c4a', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'ed2dbec7-f3c6-5131-b507-dd28a4da3bb4', '9938b350-225a-5c3b-ac14-f05933cb0eda', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 059.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:59", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 59, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:05.554516+00:00'),
  ('14a3341c-6105-53f9-b5aa-58626e58a580', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'bdf4df9a-c57b-53fb-be34-2e1fd8f473f7', '3043d997-3100-5dbd-8632-dadfd5d6ebcc', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'treatment ladder', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 059.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:59", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 59, "point_category": "Regimen", "point_concept": "Regimen", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:05.554516+00:00'),
  ('778ed20f-58b5-5319-b6ff-4c8f0c081e3f', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'daad8e00-77cd-5945-b2ba-017dab26f679', '368af076-9ba3-5111-9695-6fe5b00f6086', '2ddef9bd-5a72-521c-9770-b74e8c3331a0', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'rules board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 059.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:59", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 59, "point_category": "Rules", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:05.554516+00:00'),
  ('7fc9d3e4-e40a-5467-8237-ec9e6ab8be2b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'daad8e00-77cd-5945-b2ba-017dab26f679', '0cead980-31ab-5c58-84be-99864be9d96d', 'd11cd4a9-015b-5aa7-888f-5582c46666b3', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'rules board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 059.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:59", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 59, "point_category": "Rules", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:05.554516+00:00'),
  ('7d809985-3529-5afa-955d-871fa9c91948', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'daad8e00-77cd-5945-b2ba-017dab26f679', '8b4eb33e-10a4-518e-95c2-34fd9ccd36e5', '746dc23d-a5b1-5176-b76b-574454e4e684', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 059.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:59", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 59, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:05.554516+00:00'),
  ('5c8f8ed6-8cf4-560d-b454-7e76f099c8c4', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'daad8e00-77cd-5945-b2ba-017dab26f679', '29c6ce7b-719c-5132-9e06-3aba8779fe74', 'a3e86155-f933-5e73-85d3-a99f8a490c95', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 059.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:59", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 59, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:05.554516+00:00'),
  ('706f433e-d033-5101-a7be-2c6a5dacb17b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'a9e9aa9d-825d-5c01-8540-9b9c6cdd73b2', 'def86d8a-e370-51ba-974e-90e90c3657cd', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'rules board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 059.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:59", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 59, "point_category": "Rules", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:05.554516+00:00'),
  ('7f2439b7-c029-5d02-9d24-6aadd7bb9867', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'a8063b8f-9b79-56b9-850a-7109b75c872c', '83d75476-7f53-51eb-af11-f6b301533741', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'rules board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 059.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:59", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 59, "point_category": "Rules", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:05.554516+00:00'),
  ('9256748a-14f2-58a7-a6f7-7526377271ca', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'daad8e00-77cd-5945-b2ba-017dab26f679', 'b1318f07-73fd-5408-9cd8-2e41ae66b323', '52b91531-313a-5887-ba87-cc4d02c3b112', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'rules board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 059.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:59", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 59, "point_category": "Rules", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:05.554516+00:00')
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

select public.refresh_public_card_relationships('daad8e00-77cd-5945-b2ba-017dab26f679'::uuid);
