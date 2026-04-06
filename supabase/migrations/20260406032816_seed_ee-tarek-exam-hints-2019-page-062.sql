-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('edb905b0-5f60-5f85-a5a5-f61242150b62', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-06/2026-04-06T02-53-01-179786+00-00/ee-tarek-exam-hints-2019-page-062/source.png', 'complete', 'Off label use /Extended use', 10, 10, '2026-04-06T03:21:13.142339+00:00', '2026-04-06T03:21:13.142339+00:00', 'published')
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
  ('91d9358e-2d2a-55d6-bd1f-7a5cb40cadfa', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'Manufacturers can’t promote any off-label uses of their products, if they did they will be fined heavily. They can only market their drugs for indications approved by Health Canada.', 'General', 'Drug', 0, 1, '2026-04-06T03:21:13.142339+00:00'),
  ('ef22f3ef-4eba-5448-8e33-034d2370ec83', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'Off-label use may or may not be supported by strong scientific evidence', 'General', 'Other', 1, 1, '2026-04-06T03:21:13.142339+00:00'),
  ('4d7b3c86-6f03-5b4a-9ab4-74127df199c7', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'Physicians can prescribe drugs for its off-label use. Drug recall', 'General', 'Drug', 2, 1, '2026-04-06T03:21:13.142339+00:00'),
  ('0ef97f6a-662a-51cd-aef9-c0e11bd9f594', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'Class 1: if drug has severe side effects or cause death', 'General', 'Drug', 3, 1, '2026-04-06T03:21:13.142339+00:00'),
  ('fcb719d3-6d55-5437-a155-f4d17dbaabb8', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'Class 2: if the drug cause temporary reversible side effect or little side effect', 'General', 'Drug', 4, 1, '2026-04-06T03:21:13.142339+00:00'),
  ('e4ed12b7-503b-5966-ae90-064765b939b6', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'Class 3: product not cause adverse effect. Recall is initiated by manufacturer. Compounded Sterile Preparations (CSPs) Immediate-use preparations', 'General', 'Other', 5, 1, '2026-04-06T03:21:13.142339+00:00'),
  ('b0016729-be45-5c5f-bc64-5c508e0374d0', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'The perpetrations shouldn’t exceed 3 sterile units. Beyond Use Date (PUD)', 'General', 'Other', 6, 1, '2026-04-06T03:21:13.142339+00:00'),
  ('a605f6a7-2a87-5e6e-a404-b29453098b93', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'It is similar concept of Expiration date but for non-sterile compounded products.', 'General', 'Other', 7, 1, '2026-04-06T03:21:13.142339+00:00'),
  ('e72d5e3c-d14e-51bf-bce8-885c06bd4be7', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'non-aqueous formulations (non-water contained - ointment, suppository, troches): no later than expiration date of any API or 6 months, whichever earlier.', 'General', 'Other', 8, 1, '2026-04-06T03:21:13.142339+00:00'),
  ('3334ff90-de88-5951-9505-27fc0a957e76', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'Water-containing oral formulation: 14 days in controlled cold temperature.', 'Rules', 'Other', 9, 1, '2026-04-06T03:21:13.142339+00:00')
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
  ('2cfd1530-d1a7-5e6c-aefb-97d10f137d6c', '91d9358e-2d2a-55d6-bd1f-7a5cb40cadfa', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '/seed/2026-04-06/2026-04-06T02-53-01-179786+00-00/ee-tarek-exam-hints-2019-page-062/point-01.png', 'Manufacturers can’t promote any off-label uses of their products, if they did they will be fined heavily. They can only market their drugs for indications approved by Health Canada.', 0, 'complete', 'published', '2026-04-06T03:21:13.142339+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:13.142339+00:00'),
  ('bf99627f-7ee7-5be4-ae20-b89e28262112', 'ef22f3ef-4eba-5448-8e33-034d2370ec83', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '/seed/2026-04-06/2026-04-06T02-53-01-179786+00-00/ee-tarek-exam-hints-2019-page-062/point-02.png', 'Off-label use may or may not be supported by strong scientific evidence', 1, 'complete', 'published', '2026-04-06T03:21:13.142339+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:13.142339+00:00'),
  ('d9dd6920-b5a1-52a7-b764-a1ba09f57035', '4d7b3c86-6f03-5b4a-9ab4-74127df199c7', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '/seed/2026-04-06/2026-04-06T02-53-01-179786+00-00/ee-tarek-exam-hints-2019-page-062/point-03.png', 'Physicians can prescribe drugs for its off-label use. Drug recall', 2, 'complete', 'published', '2026-04-06T03:21:13.142339+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:13.142339+00:00'),
  ('aea0cba5-5127-5cc8-b88c-58c841c8b408', '0ef97f6a-662a-51cd-aef9-c0e11bd9f594', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '/seed/2026-04-06/2026-04-06T02-53-01-179786+00-00/ee-tarek-exam-hints-2019-page-062/point-04.png', 'Class 1', 3, 'complete', 'published', '2026-04-06T03:21:13.142339+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:13.142339+00:00'),
  ('96174ccf-e5ff-58d9-a235-3cf76977f4f0', 'fcb719d3-6d55-5437-a155-f4d17dbaabb8', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '/seed/2026-04-06/2026-04-06T02-53-01-179786+00-00/ee-tarek-exam-hints-2019-page-062/point-05.png', 'Class 2', 4, 'complete', 'published', '2026-04-06T03:21:13.142339+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:13.142339+00:00'),
  ('9c8eb222-5a7a-5dc9-8f86-8e6c6f608ca3', 'e4ed12b7-503b-5966-ae90-064765b939b6', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '/seed/2026-04-06/2026-04-06T02-53-01-179786+00-00/ee-tarek-exam-hints-2019-page-062/point-06.png', 'Class 3', 5, 'complete', 'published', '2026-04-06T03:21:13.142339+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:13.142339+00:00'),
  ('ea26df79-9053-5847-bbb5-61df808fbb42', 'b0016729-be45-5c5f-bc64-5c508e0374d0', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '/seed/2026-04-06/2026-04-06T02-53-01-179786+00-00/ee-tarek-exam-hints-2019-page-062/point-07.png', 'The perpetrations shouldn’t exceed 3 sterile units. Beyond Use Date (PUD)', 6, 'complete', 'published', '2026-04-06T03:21:13.142339+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:13.142339+00:00'),
  ('abdcf7d3-35f7-5e25-9418-775886d7b3c9', 'a605f6a7-2a87-5e6e-a404-b29453098b93', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '/seed/2026-04-06/2026-04-06T02-53-01-179786+00-00/ee-tarek-exam-hints-2019-page-062/point-08.png', 'It is similar concept of Expiration date but for non-sterile compounded products.', 7, 'complete', 'published', '2026-04-06T03:21:13.142339+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:13.142339+00:00'),
  ('7c959124-e61d-5551-a6b2-ee9ddb865796', 'e72d5e3c-d14e-51bf-bce8-885c06bd4be7', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '/seed/2026-04-06/2026-04-06T02-53-01-179786+00-00/ee-tarek-exam-hints-2019-page-062/point-09.png', 'non-aqueous formulations (non-water contained - ointment, suppository, troches)', 8, 'complete', 'published', '2026-04-06T03:21:13.142339+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:13.142339+00:00'),
  ('925a5031-6fd0-53fa-a73d-b3c4a818f330', '3334ff90-de88-5951-9505-27fc0a957e76', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '/seed/2026-04-06/2026-04-06T02-53-01-179786+00-00/ee-tarek-exam-hints-2019-page-062/point-10.png', 'Water-containing oral formulation', 9, 'complete', 'published', '2026-04-06T03:21:13.142339+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'rules board', null, '2026-04-06T03:21:13.142339+00:00')
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
  ('fb256df0-0e56-5ba8-a326-ec2d8695742b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '2cfd1530-d1a7-5e6c-aefb-97d10f137d6c', '91d9358e-2d2a-55d6-bd1f-7a5cb40cadfa', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 062.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:62", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 62, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:13.142339+00:00'),
  ('9529e54c-d5bb-589b-afd9-d927d7973925', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'bf99627f-7ee7-5be4-ae20-b89e28262112', 'ef22f3ef-4eba-5448-8e33-034d2370ec83', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 062.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:62", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 62, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:13.142339+00:00'),
  ('36c6b3a2-b754-5f0a-aec8-ae3bd64a0dc4', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'd9dd6920-b5a1-52a7-b764-a1ba09f57035', '4d7b3c86-6f03-5b4a-9ab4-74127df199c7', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 062.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:62", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 62, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:13.142339+00:00'),
  ('f2293378-dd61-5c12-ac4a-dbb64b0fc658', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'aea0cba5-5127-5cc8-b88c-58c841c8b408', '0ef97f6a-662a-51cd-aef9-c0e11bd9f594', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 062.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:62", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 62, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:13.142339+00:00'),
  ('66aaaac5-9170-55f2-a935-a25e7a0969e3', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '96174ccf-e5ff-58d9-a235-3cf76977f4f0', 'fcb719d3-6d55-5437-a155-f4d17dbaabb8', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 062.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:62", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 62, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:13.142339+00:00'),
  ('1b7b8e0e-de32-5d85-a900-01593e9df586', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '9c8eb222-5a7a-5dc9-8f86-8e6c6f608ca3', 'e4ed12b7-503b-5966-ae90-064765b939b6', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 062.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:62", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 62, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:13.142339+00:00'),
  ('5d540c4e-7e02-5305-a240-13a41fbe0ecd', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'ea26df79-9053-5847-bbb5-61df808fbb42', 'b0016729-be45-5c5f-bc64-5c508e0374d0', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 062.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:62", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 62, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:13.142339+00:00'),
  ('55bbba8c-623c-592b-ae1b-345bc3dd1261', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'edb905b0-5f60-5f85-a5a5-f61242150b62', 'abdcf7d3-35f7-5e25-9418-775886d7b3c9', 'a605f6a7-2a87-5e6e-a404-b29453098b93', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 062.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:62", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 62, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:13.142339+00:00'),
  ('ba03146a-a2cd-587d-8d13-ba01c2379b42', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '7c959124-e61d-5551-a6b2-ee9ddb865796', 'e72d5e3c-d14e-51bf-bce8-885c06bd4be7', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 062.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:62", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 62, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:13.142339+00:00'),
  ('77f777c8-f0e7-5578-b187-2c71fad54c21', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'edb905b0-5f60-5f85-a5a5-f61242150b62', '925a5031-6fd0-53fa-a73d-b3c4a818f330', '3334ff90-de88-5951-9505-27fc0a957e76', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'rules board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 062.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:62", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 62, "point_category": "Rules", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:13.142339+00:00')
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

select public.refresh_public_card_relationships('edb905b0-5f60-5f85-a5a5-f61242150b62'::uuid);
