-- Seed WhatsApp Image 2026-04-04 at 8.37.24 PM.jpeg for Dr Dyrane from pharmacy/notes after local QA completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('ea7c929e-e99a-5de2-8313-74d34d83cfe6', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-04/2026-04-04T20-54-23-029765/whatsapp-image-2026-04-04-at-8-37-24-pm/source/WhatsApp Image 2026-04-04 at 8.37.24 PM.jpeg', 'complete', 'The page covers calculations of relative risk and relative risk reduction, prohibited abbreviations, ethics principles, and guidelines for pharmacists. It also discusses the role of pharmacy colleges and associations, and the responsibilities of pharmacists in various situations.', 8, 8, '2026-04-04T20:54:23.029765', '2026-04-04T20:54:23.029765', 'published')
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
  ('610f76b3-2ff2-55ed-bac8-fb4a9db55c86', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', 'Calculating Relative Risk (RR) and Relative Risk Reduction (RRR) involves using formulas: RR = ART / ARC and RRR = (ARC - ART) / ARC.', 'Calculation', 'Other', 0, 1, '2026-04-04T20:54:23.029765'),
  ('faaee3f1-f68e-53d2-a021-0b1a7810e9e2', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', 'Number Needed to Treat (NNT) is calculated as 1 / ARR.', 'Calculation', 'Other', 1, 1, '2026-04-04T20:54:23.029765'),
  ('047c575f-228b-583c-8120-445ee5c9f645', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', 'ISMP prohibits certain abbreviations like q.d., ug, hs, and others to prevent medication errors.', 'Safety', 'Other', 2, 1, '2026-04-04T20:54:23.029765'),
  ('cce2ab7d-f664-5517-a748-ab4aa2bfa04a', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', 'Ethics principles include beneficence, nonmaleficence, autonomy, veracity, justice, and fidelity.', 'Ethics', 'Other', 3, 1, '2026-04-04T20:54:23.029765'),
  ('9f8a9499-afc6-53d6-bb77-e941a376da79', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', 'Pharmacists should report or provide support for sexually abused adults and contact Child Associate Society for abused children.', 'Responsibility', 'Other', 4, 1, '2026-04-04T20:54:23.029765'),
  ('737dc07f-7204-5dbd-aea1-7905464ce405', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', 'Pharmacy Colleges regulate the pharmacy profession and provide guidelines for practice.', 'Regulation', 'Other', 5, 1, '2026-04-04T20:54:23.029765'),
  ('8cc01865-f0ac-55d7-a74c-de0364bc629f', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', 'Pharmacist Associations advocate for pharmacists and provide continuous education.', 'Advocacy', 'Other', 6, 1, '2026-04-04T20:54:23.029765'),
  ('3943c40d-2769-5023-bcc0-dfea4d306bca', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', 'Pharmacists can refuse to prescribe a drug against their ethics but must provide a second choice unless no alternative exists.', 'Ethics', 'Other', 7, 1, '2026-04-04T20:54:23.029765')
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
  ('92b8472f-ec5b-546c-bdc7-b4abc86f0f12', '610f76b3-2ff2-55ed-bac8-fb4a9db55c86', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '/seed/2026-04-04/2026-04-04T20-54-23-029765/whatsapp-image-2026-04-04-at-8-37-24-pm/cards/point-01.png', 'Calculating Relative Risk (RR) and Relative Risk Reduction (RRR) involves using formulas', 0, 'complete', 'published', '2026-04-04T20:54:23.029765', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'side-by-side comparison with formula overlay', null, '2026-04-04T20:54:23.029765'),
  ('772781be-bcca-58a0-8de6-75c7e732e8da', 'faaee3f1-f68e-53d2-a021-0b1a7810e9e2', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '/seed/2026-04-04/2026-04-04T20-54-23-029765/whatsapp-image-2026-04-04-at-8-37-24-pm/cards/point-02.png', 'Number Needed to Treat (NNT) is calculated as 1 / ARR.', 1, 'complete', 'published', '2026-04-04T20:54:23.029765', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'Process flow with clinical context', null, '2026-04-04T20:54:23.029765'),
  ('0db90653-51f9-5c02-8d7a-651b233f5451', '047c575f-228b-583c-8120-445ee5c9f645', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '/seed/2026-04-04/2026-04-04T20-54-23-029765/whatsapp-image-2026-04-04-at-8-37-24-pm/cards/point-03.png', 'ISMP prohibits certain abbreviations like q.d., ug, hs, and others to prevent medication errors.', 2, 'complete', 'published', '2026-04-04T20:54:23.029765', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'before-and-after / cause-and-effect', null, '2026-04-04T20:54:23.029765'),
  ('06089422-d131-56ca-9a0d-ef22acffabfb', 'cce2ab7d-f664-5517-a748-ab4aa2bfa04a', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '/seed/2026-04-04/2026-04-04T20-54-23-029765/whatsapp-image-2026-04-04-at-8-37-24-pm/cards/point-04.png', 'Ethics principles include beneficence, nonmaleficence, autonomy, veracity, justice, and fidelity.', 3, 'complete', 'published', '2026-04-04T20:54:23.029765', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'modular icons grid', null, '2026-04-04T20:54:23.029765'),
  ('6cd1bf00-cecb-5ab6-8c78-34f17bf5b9b9', '9f8a9499-afc6-53d6-bb77-e941a376da79', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '/seed/2026-04-04/2026-04-04T20-54-23-029765/whatsapp-image-2026-04-04-at-8-37-24-pm/cards/point-05.png', 'Pharmacists should report or provide support for sexually abused adults and contact Child Associate Society for abused children.', 4, 'complete', 'published', '2026-04-04T20:54:23.029765', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'split-flow infographic', null, '2026-04-04T20:54:23.029765'),
  ('562fba67-5577-5ada-a0cb-5db9d686d128', '737dc07f-7204-5dbd-aea1-7905464ce405', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '/seed/2026-04-04/2026-04-04T20-54-23-029765/whatsapp-image-2026-04-04-at-8-37-24-pm/cards/point-06.png', 'Pharmacy Colleges regulate the pharmacy profession and provide guidelines for practice.', 5, 'complete', 'published', '2026-04-04T20:54:23.029765', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'modular board (organization and flow)', null, '2026-04-04T20:54:23.029765'),
  ('fa798f7c-6554-58f2-a42d-8b6caa8f72aa', '8cc01865-f0ac-55d7-a74c-de0364bc629f', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '/seed/2026-04-04/2026-04-04T20-54-23-029765/whatsapp-image-2026-04-04-at-8-37-24-pm/cards/point-07.png', 'Pharmacist Associations advocate for pharmacists and provide continuous education.', 6, 'complete', 'published', '2026-04-04T20:54:23.029765', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'Process flow / Modular board', null, '2026-04-04T20:54:23.029765'),
  ('2bf462e4-ba1c-54cf-94f3-59fe33964573', '3943c40d-2769-5023-bcc0-dfea4d306bca', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '/seed/2026-04-04/2026-04-04T20-54-23-029765/whatsapp-image-2026-04-04-at-8-37-24-pm/cards/point-08.png', 'Pharmacists can refuse to prescribe a drug against their ethics but must provide a second choice unless no alternative exists.', 7, 'complete', 'published', '2026-04-04T20:54:23.029765', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'decision flow (ethics)', null, '2026-04-04T20:54:23.029765')
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
  ('187f97ea-e4f1-534e-855b-5a767232a4d1', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '92b8472f-ec5b-546c-bdc7-b4abc86f0f12', '610f76b3-2ff2-55ed-bac8-fb4a9db55c86', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'side-by-side comparison with formula overlay', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 210, 2021, 2231, 210, 0, 453, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.37.24 PM.jpeg", "point_category": "Calculation", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:54:23.029765'),
  ('f2f2a18d-3a83-58ef-9728-4139f447bbc4', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '772781be-bcca-58a0-8de6-75c7e732e8da', 'faaee3f1-f68e-53d2-a021-0b1a7810e9e2', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'Process flow with clinical context', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 147, 1904, 2051, 147, 0, 336, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.37.24 PM.jpeg", "point_category": "Calculation", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:54:23.029765'),
  ('d4d16273-0f3e-546a-a423-072665754b5e', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '0db90653-51f9-5c02-8d7a-651b233f5451', '047c575f-228b-583c-8120-445ee5c9f645', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'before-and-after / cause-and-effect', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 154, 2014, 2168, 154, 0, 446, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.37.24 PM.jpeg", "point_category": "Safety", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:54:23.029765'),
  ('4eea8a83-2cc4-58e7-8c2b-7741653d0383', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '06089422-d131-56ca-9a0d-ef22acffabfb', 'cce2ab7d-f664-5517-a748-ab4aa2bfa04a', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'modular icons grid', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 160, 2070, 2230, 160, 0, 502, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.37.24 PM.jpeg", "point_category": "Ethics", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:54:23.029765'),
  ('6cea677f-d5ec-54b0-9886-b4ec9b4f48e6', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '6cd1bf00-cecb-5ab6-8c78-34f17bf5b9b9', '9f8a9499-afc6-53d6-bb77-e941a376da79', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'split-flow infographic', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 125, 1949, 2074, 125, 0, 381, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.37.24 PM.jpeg", "point_category": "Responsibility", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:54:23.029765'),
  ('82cc7086-257a-5d9c-830b-e816aec4a987', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '562fba67-5577-5ada-a0cb-5db9d686d128', '737dc07f-7204-5dbd-aea1-7905464ce405', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'modular board (organization and flow)', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 116, 1971, 2087, 116, 0, 403, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.37.24 PM.jpeg", "point_category": "Regulation", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:54:23.029765'),
  ('370252cc-4801-55c3-95d4-65084f46f17e', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', 'fa798f7c-6554-58f2-a42d-8b6caa8f72aa', '8cc01865-f0ac-55d7-a74c-de0364bc629f', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'Process flow / Modular board', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 124, 2018, 2142, 124, 0, 450, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.37.24 PM.jpeg", "point_category": "Advocacy", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:54:23.029765'),
  ('a1f52893-37f4-5e62-b0dd-9f5b466403be', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ea7c929e-e99a-5de2-8313-74d34d83cfe6', '2bf462e4-ba1c-54cf-94f3-59fe33964573', '3943c40d-2769-5023-bcc0-dfea4d306bca', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'decision flow (ethics)', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 141, 1910, 2051, 141, 0, 342, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.37.24 PM.jpeg", "point_category": "Ethics", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:54:23.029765')
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
