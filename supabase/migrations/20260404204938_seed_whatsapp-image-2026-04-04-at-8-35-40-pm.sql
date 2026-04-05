-- Seed WhatsApp Image 2026-04-04 at 8.35.40 PM.jpeg for Dr Dyrane from pharmacy/notes after local QA completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('38c34d78-fea7-5da8-97c5-05e02a0e273d', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-04/2026-04-04T20-49-38-909857/whatsapp-image-2026-04-04-at-8-35-40-pm/source/WhatsApp Image 2026-04-04 at 8.35.40 PM.jpeg', 'complete', 'The page discusses regulatory bodies for drug pricing and safety, pharmacy formats, confidentiality of patient information, and types of medical studies. It also covers the hierarchy of study designs and methods to avoid bias.', 10, 10, '2026-04-04T20:49:38.909857', '2026-04-04T20:49:38.909857', 'published')
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
  ('e4b90e5d-1b61-542a-8f34-ee63cea9cc1e', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'Therapeutic Products Directorate reviews safety and efficacy of drugs before marketing.', 'Regulation', 'Other', 0, 1, '2026-04-04T20:49:38.909857'),
  ('4e0a752b-6115-5059-bf3d-c7bc434f8025', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'Patented Medicine Prices Review Board (PMPRB) sets prices for prescription drugs, excluding generics.', 'Regulation', 'Other', 1, 1, '2026-04-04T20:49:38.909857'),
  ('a6eea3fd-a472-5378-accb-1808b505ef3d', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'Health Canada determines manufacturing conditions of drugs (GMP).', 'Regulation', 'Other', 2, 1, '2026-04-04T20:49:38.909857'),
  ('d217f278-f3fe-5772-9732-0272846a5fa0', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'Franchise pharmacies are owned by pharmacists but not the physical assets.', 'Pharmacy', 'Other', 3, 1, '2026-04-04T20:49:38.909857'),
  ('7a49282f-849b-535c-a4f0-5b824a077d23', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'Patient''s medical information is confidential unless consent is given, court ordered, or patient is incapacitated.', 'Confidentiality', 'Other', 4, 1, '2026-04-04T20:49:38.909857'),
  ('e2a538b1-578b-59da-8288-a48bf7eb39c1', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'Case control studies compare exposure to risk factors between diseased and non-diseased cases, using Odds Ratio.', 'Study Design', 'Other', 5, 1, '2026-04-04T20:49:38.909857'),
  ('ef70dfdd-5e48-5b60-8efb-5e97c02e2750', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'Cohort studies follow exposure towards disease incidence, using Risk Ratio.', 'Study Design', 'Other', 6, 1, '2026-04-04T20:49:38.909857'),
  ('587101ea-6a3d-5ee6-80c0-bbc037c133ec', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'Cross-sectional studies determine prevalence by tracking changes at a single time point.', 'Study Design', 'Other', 7, 1, '2026-04-04T20:49:38.909857'),
  ('7b5e4e30-8be8-5c47-9095-15a99dccd38b', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'The hierarchy of study designs: Systematic Review > Meta-analysis > RCT > Cohort > Case control > Cross-sectional > Case studies > Case report.', 'Study Design', 'Other', 8, 1, '2026-04-04T20:49:38.909857'),
  ('f98e4b3f-571e-53cf-a5cc-e18d5993413c', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'Short Form 36 (SF 36) is a survey measuring quality of life.', 'Survey', 'Other', 9, 1, '2026-04-04T20:49:38.909857')
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
  ('cc7845c7-c169-5bc2-8af3-6d201ff4ba48', 'e4b90e5d-1b61-542a-8f34-ee63cea9cc1e', '38c34d78-fea7-5da8-97c5-05e02a0e273d', '/seed/2026-04-04/2026-04-04T20-49-38-909857/whatsapp-image-2026-04-04-at-8-35-40-pm/cards/point-01.png', 'Therapeutic Products Directorate reviews safety and efficacy of drugs before marketing.', 0, 'complete', 'published', '2026-04-04T20:49:38.909857', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'Process Flow / Gatekeeper', null, '2026-04-04T20:49:38.909857'),
  ('b6578c4b-2c32-5cec-84c8-41c5f9efb4ed', '4e0a752b-6115-5059-bf3d-c7bc434f8025', '38c34d78-fea7-5da8-97c5-05e02a0e273d', '/seed/2026-04-04/2026-04-04T20-49-38-909857/whatsapp-image-2026-04-04-at-8-35-40-pm/cards/point-02.png', 'Patented Medicine Prices Review Board (PMPRB) sets prices for prescription drugs, excluding generics.', 1, 'complete', 'published', '2026-04-04T20:49:38.909857', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'process flow with exclusion cue', null, '2026-04-04T20:49:38.909857'),
  ('c4b8ac15-11cb-5479-9c84-f170a10b57d6', 'a6eea3fd-a472-5378-accb-1808b505ef3d', '38c34d78-fea7-5da8-97c5-05e02a0e273d', '/seed/2026-04-04/2026-04-04T20-49-38-909857/whatsapp-image-2026-04-04-at-8-35-40-pm/cards/point-03.png', 'Health Canada determines manufacturing conditions of drugs (GMP).', 2, 'complete', 'published', '2026-04-04T20:49:38.909857', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'process flow with anatomy + regulatory icon', null, '2026-04-04T20:49:38.909857'),
  ('bc0a98cc-7d48-5032-9d34-99a9d8b25aa5', 'd217f278-f3fe-5772-9732-0272846a5fa0', '38c34d78-fea7-5da8-97c5-05e02a0e273d', '/seed/2026-04-04/2026-04-04T20-49-38-909857/whatsapp-image-2026-04-04-at-8-35-40-pm/cards/point-04.png', 'Franchise pharmacies are owned by pharmacists but not the physical assets.', 3, 'complete', 'published', '2026-04-04T20:49:38.909857', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'comparison diagram', null, '2026-04-04T20:49:38.909857'),
  ('b99d3a9d-c0db-5793-993d-745e02b568c3', '7a49282f-849b-535c-a4f0-5b824a077d23', '38c34d78-fea7-5da8-97c5-05e02a0e273d', '/seed/2026-04-04/2026-04-04T20-49-38-909857/whatsapp-image-2026-04-04-at-8-35-40-pm/cards/point-05.png', 'Patient''s medical information is confidential unless consent is given, court ordered, or patient is incapacitated.', 4, 'complete', 'published', '2026-04-04T20:49:38.909857', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'decision flow diagram', null, '2026-04-04T20:49:38.909857'),
  ('6bf1d040-0d0c-5c1b-9fb4-4739279e8032', 'e2a538b1-578b-59da-8288-a48bf7eb39c1', '38c34d78-fea7-5da8-97c5-05e02a0e273d', '/seed/2026-04-04/2026-04-04T20-49-38-909857/whatsapp-image-2026-04-04-at-8-35-40-pm/cards/point-06.png', 'Case control studies compare exposure to risk factors between diseased and non-diseased cases, using Odds Ratio.', 5, 'complete', 'published', '2026-04-04T20:49:38.909857', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'Process flow with split groups and minimal labels', null, '2026-04-04T20:49:38.909857'),
  ('a07f3552-f0e3-53d6-992b-a88b48c7d75d', 'ef70dfdd-5e48-5b60-8efb-5e97c02e2750', '38c34d78-fea7-5da8-97c5-05e02a0e273d', '/seed/2026-04-04/2026-04-04T20-49-38-909857/whatsapp-image-2026-04-04-at-8-35-40-pm/cards/point-07.png', 'Cohort studies follow exposure towards disease incidence, using Risk Ratio.', 6, 'complete', 'published', '2026-04-04T20:49:38.909857', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'timeline/process flow', null, '2026-04-04T20:49:38.909857'),
  ('d2f41000-2c2e-52cf-bc67-07d423c24655', '587101ea-6a3d-5ee6-80c0-bbc037c133ec', '38c34d78-fea7-5da8-97c5-05e02a0e273d', '/seed/2026-04-04/2026-04-04T20-49-38-909857/whatsapp-image-2026-04-04-at-8-35-40-pm/cards/point-08.png', 'Cross-sectional studies determine prevalence by tracking changes at a single time point.', 7, 'complete', 'published', '2026-04-04T20:49:38.909857', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'Anatomy/Process Flow', null, '2026-04-04T20:49:38.909857'),
  ('14d75a3b-76bd-5d66-8bea-defcba4cf166', '7b5e4e30-8be8-5c47-9095-15a99dccd38b', '38c34d78-fea7-5da8-97c5-05e02a0e273d', '/seed/2026-04-04/2026-04-04T20-49-38-909857/whatsapp-image-2026-04-04-at-8-35-40-pm/cards/point-09.png', 'The hierarchy of study designs', 8, 'complete', 'published', '2026-04-04T20:49:38.909857', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'Evidence Pyramid', null, '2026-04-04T20:49:38.909857'),
  ('dd906c8d-073f-58b1-a624-44975fbc93fb', 'f98e4b3f-571e-53cf-a5cc-e18d5993413c', '38c34d78-fea7-5da8-97c5-05e02a0e273d', '/seed/2026-04-04/2026-04-04T20-49-38-909857/whatsapp-image-2026-04-04-at-8-35-40-pm/cards/point-10.png', 'Short Form 36 (SF 36) is a survey measuring quality of life.', 9, 'complete', 'published', '2026-04-04T20:49:38.909857', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'modular overview (icon grid)', null, '2026-04-04T20:49:38.909857')
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
  ('73440f8e-57f9-5637-a547-7b2e39816675', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'cc7845c7-c169-5bc2-8af3-6d201ff4ba48', 'e4b90e5d-1b61-542a-8f34-ee63cea9cc1e', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'Process Flow / Gatekeeper', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 137, 1979, 2116, 137, 0, 411, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.35.40 PM.jpeg", "point_category": "Regulation", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:49:38.909857'),
  ('f4dc856d-d625-5a24-b438-d800917d8497', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'b6578c4b-2c32-5cec-84c8-41c5f9efb4ed', '4e0a752b-6115-5059-bf3d-c7bc434f8025', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'process flow with exclusion cue', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 172, 1909, 2081, 172, 0, 341, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.35.40 PM.jpeg", "point_category": "Regulation", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:49:38.909857'),
  ('4b46008d-7fcf-57d4-82f3-0354b08a900e', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'c4b8ac15-11cb-5479-9c84-f170a10b57d6', 'a6eea3fd-a472-5378-accb-1808b505ef3d', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'process flow with anatomy + regulatory icon', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 122, 1953, 2075, 122, 0, 385, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.35.40 PM.jpeg", "point_category": "Regulation", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:49:38.909857'),
  ('aba99dba-e832-5b43-81d1-f1baec5a4c0c', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'bc0a98cc-7d48-5032-9d34-99a9d8b25aa5', 'd217f278-f3fe-5772-9732-0272846a5fa0', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'comparison diagram', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 120, 1975, 2095, 120, 0, 407, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.35.40 PM.jpeg", "point_category": "Pharmacy", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:49:38.909857'),
  ('2408e94b-11d3-5170-b417-ff724e2a63f0', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'b99d3a9d-c0db-5793-993d-745e02b568c3', '7a49282f-849b-535c-a4f0-5b824a077d23', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'decision flow diagram', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 177, 1956, 2133, 177, 0, 388, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.35.40 PM.jpeg", "point_category": "Confidentiality", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:49:38.909857'),
  ('147da221-9bfa-5925-98e9-4d00f88e905a', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '38c34d78-fea7-5da8-97c5-05e02a0e273d', '6bf1d040-0d0c-5c1b-9fb4-4739279e8032', 'e2a538b1-578b-59da-8288-a48bf7eb39c1', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'Process flow with split groups and minimal labels', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 173, 1949, 2122, 173, 0, 381, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.35.40 PM.jpeg", "point_category": "Study Design", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:49:38.909857'),
  ('75e52a65-8786-5402-ba19-0ea5463a186f', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'a07f3552-f0e3-53d6-992b-a88b48c7d75d', 'ef70dfdd-5e48-5b60-8efb-5e97c02e2750', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'timeline/process flow', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 119, 1931, 2050, 119, 0, 363, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.35.40 PM.jpeg", "point_category": "Study Design", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:49:38.909857'),
  ('e6fadf47-a8ca-5756-afb7-a3002d31ecf7', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'd2f41000-2c2e-52cf-bc67-07d423c24655', '587101ea-6a3d-5ee6-80c0-bbc037c133ec', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'Anatomy/Process Flow', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 125, 1940, 2065, 125, 0, 372, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.35.40 PM.jpeg", "point_category": "Study Design", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:49:38.909857'),
  ('2901a309-5529-59b6-a69a-df8ab72c6ddf', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '38c34d78-fea7-5da8-97c5-05e02a0e273d', '14d75a3b-76bd-5d66-8bea-defcba4cf166', '7b5e4e30-8be8-5c47-9095-15a99dccd38b', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'Evidence Pyramid', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 109, 1967, 2076, 109, 0, 399, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.35.40 PM.jpeg", "point_category": "Study Design", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:49:38.909857'),
  ('807c45ce-642f-5763-b448-a86f1906f767', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '38c34d78-fea7-5da8-97c5-05e02a0e273d', 'dd906c8d-073f-58b1-a624-44975fbc93fb', 'f98e4b3f-571e-53cf-a5cc-e18d5993413c', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'modular overview (icon grid)', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 153, 1968, 2121, 153, 0, 400, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.35.40 PM.jpeg", "point_category": "Survey", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:49:38.909857')
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
