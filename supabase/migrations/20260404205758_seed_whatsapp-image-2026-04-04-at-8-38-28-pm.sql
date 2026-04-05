-- Seed WhatsApp Image 2026-04-04 at 8.38.28 PM.jpeg for Dr Dyrane from pharmacy/notes after local QA completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('f4da856e-333a-5a66-a137-3b1e85b3bb13', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-04/2026-04-04T20-57-58-549844/whatsapp-image-2026-04-04-at-8-38-28-pm/source/WhatsApp Image 2026-04-04 at 8.38.28 PM.jpeg', 'complete', 'The page outlines regulations and guidelines for prescribing and handling narcotics and controlled substances, including the roles of pharmacists and legal requirements for documentation and reporting.', 12, 12, '2026-04-04T20:57:58.549844', '2026-04-04T20:57:58.549844', 'published')
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
  ('669315ce-43a8-5f80-b74d-9b1b78473bda', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'Doctors can prescribe to themselves or relatives only in emergencies; otherwise, it''s unethical.', 'Ethics', 'Other', 0, 1, '2026-04-04T20:57:58.549844'),
  ('f2158306-e99f-58c8-ad39-6f300bb0f7f0', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'Pharmaceutical gifts over $100 are not accepted; patient information is not shared with companies.', 'Regulation', 'Other', 1, 1, '2026-04-04T20:57:58.549844'),
  ('24a8d0de-a611-5102-8d80-ee343e407bcb', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'Controlled Drug and Substance Act (CDSA) controls narcotics, controlled drugs, and BDZ.', 'Regulation', 'Other', 2, 1, '2026-04-04T20:57:58.549844'),
  ('81ad1e36-3291-586f-bcb1-a04c4d52371b', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'Straight Narcotics require written prescriptions only, no refills or transfers allowed.', 'Prescription', 'Drug', 3, 1, '2026-04-04T20:57:58.549844'),
  ('1e4841df-4915-5269-83b3-0eb731e998eb', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'Controlled Part 1 drugs require written and verbal prescriptions, only written with specified intervals.', 'Prescription', 'Drug', 4, 1, '2026-04-04T20:57:58.549844'),
  ('7f975257-3d2e-5e53-8796-14b6d4b4abf6', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'Controlled Part 2 and 3 drugs require written and verbal prescriptions, no transfers allowed.', 'Prescription', 'Drug', 5, 1, '2026-04-04T20:57:58.549844'),
  ('711d39ef-625a-5938-8222-eb42de49a70d', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'BDZ requires written and verbal prescriptions, one transfer allowed, expires in a year.', 'Prescription', 'Drug', 6, 1, '2026-04-04T20:57:58.549844'),
  ('abee2333-5fe4-5bf9-adf9-b05565d9b9a7', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'Exempted narcotics can be dispensed by pharmacists without a prescription under supervision.', 'Dispensing', 'Drug', 7, 1, '2026-04-04T20:57:58.549844'),
  ('e86c7322-a477-55c4-b13c-f8412ad3cc8c', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'All narcotics and BDZ must be dispensed under direct pharmacist supervision, not by technicians.', 'Dispensing', 'Drug', 8, 1, '2026-04-04T20:57:58.549844'),
  ('7eb954df-525f-55a8-8a99-f824814b0919', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'Controlled drugs cannot be refilled earlier than the specified interval.', 'Regulation', 'Drug', 9, 1, '2026-04-04T20:57:58.549844'),
  ('7c1815db-ce48-5d66-b99a-593d627cfdbc', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'Contact the Office of Controlled Substance for theft, missing, or damage of narcotics within 10 days.', 'Reporting', 'Other', 10, 1, '2026-04-04T20:57:58.549844'),
  ('db264f90-ee54-5ec2-ad91-21b8e61c35a1', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'Unscheduled drugs (Schedule U) are available in corner stores, e.g., Ibuprofen 400mg, Acetaminophen 650mg.', 'Availability', 'Drug', 11, 1, '2026-04-04T20:57:58.549844')
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
  ('d6593070-aa18-5bf6-a9bc-b928d94891d4', '669315ce-43a8-5f80-b74d-9b1b78473bda', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '/seed/2026-04-04/2026-04-04T20-57-58-549844/whatsapp-image-2026-04-04-at-8-38-28-pm/cards/point-01.png', 'Doctors can prescribe to themselves or relatives only in emergencies; otherwise, it''s unethical.', 0, 'complete', 'published', '2026-04-04T20:57:58.549844', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'comparison / decision tree', null, '2026-04-04T20:57:58.549844'),
  ('2dea2fe2-5f6a-585a-8b55-45abba28e8cf', 'f2158306-e99f-58c8-ad39-6f300bb0f7f0', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '/seed/2026-04-04/2026-04-04T20-57-58-549844/whatsapp-image-2026-04-04-at-8-38-28-pm/cards/point-02.png', 'Pharmaceutical gifts over $100 are not accepted; patient information is not shared with companies.', 1, 'complete', 'published', '2026-04-04T20:57:58.549844', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'comparison/ban', null, '2026-04-04T20:57:58.549844'),
  ('089cc541-4ca8-5eaf-b088-f2aefd866e5a', '24a8d0de-a611-5102-8d80-ee343e407bcb', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '/seed/2026-04-04/2026-04-04T20-57-58-549844/whatsapp-image-2026-04-04-at-8-38-28-pm/cards/point-03.png', 'Controlled Drug and Substance Act (CDSA) controls narcotics, controlled drugs, and BDZ.', 2, 'complete', 'published', '2026-04-04T20:57:58.549844', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'modular board with icons', null, '2026-04-04T20:57:58.549844'),
  ('fca6129c-7223-5509-87f7-fb7bb6b7c85a', '81ad1e36-3291-586f-bcb1-a04c4d52371b', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '/seed/2026-04-04/2026-04-04T20-57-58-549844/whatsapp-image-2026-04-04-at-8-38-28-pm/cards/point-04.png', 'Straight Narcotics require written prescriptions only, no refills or transfers allowed.', 3, 'complete', 'published', '2026-04-04T20:57:58.549844', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'process restriction infographic', null, '2026-04-04T20:57:58.549844'),
  ('00b82b97-e28d-5696-9d57-ea82b8ab0b8f', '1e4841df-4915-5269-83b3-0eb731e998eb', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '/seed/2026-04-04/2026-04-04T20-57-58-549844/whatsapp-image-2026-04-04-at-8-38-28-pm/cards/point-05.png', 'Controlled Part 1 drugs require written and verbal prescriptions, only written with specified intervals.', 4, 'complete', 'published', '2026-04-04T20:57:58.549844', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'comparison panel', null, '2026-04-04T20:57:58.549844'),
  ('6d9e8011-902b-5bcd-b2db-ac57051ae5c3', '7f975257-3d2e-5e53-8796-14b6d4b4abf6', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '/seed/2026-04-04/2026-04-04T20-57-58-549844/whatsapp-image-2026-04-04-at-8-38-28-pm/cards/point-06.png', 'Controlled Part 2 and 3 drugs require written and verbal prescriptions, no transfers allowed.', 5, 'complete', 'published', '2026-04-04T20:57:58.549844', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'comparison board', null, '2026-04-04T20:57:58.549844'),
  ('a9edc8c9-1eee-582a-b4f4-b7c37b150523', '711d39ef-625a-5938-8222-eb42de49a70d', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '/seed/2026-04-04/2026-04-04T20-57-58-549844/whatsapp-image-2026-04-04-at-8-38-28-pm/cards/point-07.png', 'BDZ requires written and verbal prescriptions, one transfer allowed, expires in a year.', 6, 'complete', 'published', '2026-04-04T20:57:58.549844', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'Infographic process flow', null, '2026-04-04T20:57:58.549844'),
  ('64dfe446-6dae-5bb1-bb70-52246d88d995', 'abee2333-5fe4-5bf9-adf9-b05565d9b9a7', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '/seed/2026-04-04/2026-04-04T20-57-58-549844/whatsapp-image-2026-04-04-at-8-38-28-pm/cards/point-08.png', 'Exempted narcotics can be dispensed by pharmacists without a prescription under supervision.', 7, 'complete', 'published', '2026-04-04T20:57:58.549844', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'process flow (pharmacy counter)', null, '2026-04-04T20:57:58.549844'),
  ('babbece5-de29-5f72-ba84-dd4e6d12a83a', 'e86c7322-a477-55c4-b13c-f8412ad3cc8c', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '/seed/2026-04-04/2026-04-04T20-57-58-549844/whatsapp-image-2026-04-04-at-8-38-28-pm/cards/point-09.png', 'All narcotics and BDZ must be dispensed under direct pharmacist supervision, not by technicians.', 8, 'complete', 'published', '2026-04-04T20:57:58.549844', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'comparison/role-based scene', null, '2026-04-04T20:57:58.549844'),
  ('de7f488b-80b7-5ef1-8088-a9ab105fd7f2', '7eb954df-525f-55a8-8a99-f824814b0919', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '/seed/2026-04-04/2026-04-04T20-57-58-549844/whatsapp-image-2026-04-04-at-8-38-28-pm/cards/point-10.png', 'Controlled drugs cannot be refilled earlier than the specified interval.', 9, 'complete', 'published', '2026-04-04T20:57:58.549844', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'timeline restriction', null, '2026-04-04T20:57:58.549844'),
  ('c8fe4a6f-9efd-5175-b337-594dc428ab4b', '7c1815db-ce48-5d66-b99a-593d627cfdbc', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '/seed/2026-04-04/2026-04-04T20-57-58-549844/whatsapp-image-2026-04-04-at-8-38-28-pm/cards/point-11.png', 'Contact the Office of Controlled Substance for theft, missing, or damage of narcotics within 10 days.', 10, 'complete', 'published', '2026-04-04T20:57:58.549844', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'process flow', null, '2026-04-04T20:57:58.549844'),
  ('a7bfa30d-f923-5eaa-80ee-256333970124', 'db264f90-ee54-5ec2-ad91-21b8e61c35a1', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '/seed/2026-04-04/2026-04-04T20-57-58-549844/whatsapp-image-2026-04-04-at-8-38-28-pm/cards/point-12.png', 'Unscheduled drugs (Schedule U) are available in corner stores, e.g., Ibuprofen 400mg, Acetaminophen 650mg.', 11, 'complete', 'published', '2026-04-04T20:57:58.549844', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'comparison scene', null, '2026-04-04T20:57:58.549844')
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
  ('ed0896ce-53b4-5989-8b40-d51efa24f7e2', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'd6593070-aa18-5bf6-a9bc-b928d94891d4', '669315ce-43a8-5f80-b74d-9b1b78473bda', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'comparison / decision tree', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 144, 1914, 2058, 144, 0, 346, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.38.28 PM.jpeg", "point_category": "Ethics", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:57:58.549844'),
  ('c779a809-9249-52c8-8c15-55a835b69b58', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '2dea2fe2-5f6a-585a-8b55-45abba28e8cf', 'f2158306-e99f-58c8-ad39-6f300bb0f7f0', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'comparison/ban', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 105, 1905, 2010, 105, 0, 337, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.38.28 PM.jpeg", "point_category": "Regulation", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:57:58.549844'),
  ('c75e7303-e335-5a4a-9d0a-92174d1c81f3', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '089cc541-4ca8-5eaf-b088-f2aefd866e5a', '24a8d0de-a611-5102-8d80-ee343e407bcb', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'modular board with icons', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 128, 1983, 2111, 128, 0, 415, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.38.28 PM.jpeg", "point_category": "Regulation", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:57:58.549844'),
  ('86775613-fbe8-5df2-aaa7-3f23963fc607', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'fca6129c-7223-5509-87f7-fb7bb6b7c85a', '81ad1e36-3291-586f-bcb1-a04c4d52371b', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'process restriction infographic', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 141, 1946, 2087, 141, 0, 378, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.38.28 PM.jpeg", "point_category": "Prescription", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:57:58.549844'),
  ('85ca426e-c2bc-55f5-94f7-41369489a212', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '00b82b97-e28d-5696-9d57-ea82b8ab0b8f', '1e4841df-4915-5269-83b3-0eb731e998eb', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'comparison panel', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 99, 1983, 2082, 99, 0, 415, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.38.28 PM.jpeg", "point_category": "Prescription", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:57:58.549844'),
  ('136bb554-4b94-5dd1-a033-15b40617104e', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '6d9e8011-902b-5bcd-b2db-ac57051ae5c3', '7f975257-3d2e-5e53-8796-14b6d4b4abf6', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'comparison board', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 132, 1985, 2117, 132, 0, 417, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.38.28 PM.jpeg", "point_category": "Prescription", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:57:58.549844'),
  ('0cbee88c-d077-531e-b183-a37c9c74ddbc', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'a9edc8c9-1eee-582a-b4f4-b7c37b150523', '711d39ef-625a-5938-8222-eb42de49a70d', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'Infographic process flow', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 169, 1968, 2137, 169, 0, 400, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.38.28 PM.jpeg", "point_category": "Prescription", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:57:58.549844'),
  ('4c9b60f4-cf75-5e88-9ade-d02f5fa1ab77', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', '64dfe446-6dae-5bb1-bb70-52246d88d995', 'abee2333-5fe4-5bf9-adf9-b05565d9b9a7', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'process flow (pharmacy counter)', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 138, 1890, 2028, 138, 0, 322, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.38.28 PM.jpeg", "point_category": "Dispensing", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:57:58.549844'),
  ('27e37828-4280-5f1a-9bc6-36dd03fdebc3', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'babbece5-de29-5f72-ba84-dd4e6d12a83a', 'e86c7322-a477-55c4-b13c-f8412ad3cc8c', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'comparison/role-based scene', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 136, 1975, 2111, 136, 0, 407, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.38.28 PM.jpeg", "point_category": "Dispensing", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:57:58.549844'),
  ('84c02823-18a7-50d0-b8c0-f88e82ec4ed3', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'de7f488b-80b7-5ef1-8088-a9ab105fd7f2', '7eb954df-525f-55a8-8a99-f824814b0919', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'timeline restriction', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 103, 1953, 2056, 103, 0, 385, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.38.28 PM.jpeg", "point_category": "Regulation", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:57:58.549844'),
  ('4abda760-5167-5ac4-acdb-de5ac633b52d', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'c8fe4a6f-9efd-5175-b337-594dc428ab4b', '7c1815db-ce48-5d66-b99a-593d627cfdbc', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'process flow', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 125, 1898, 2023, 125, 0, 330, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.38.28 PM.jpeg", "point_category": "Reporting", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:57:58.549844'),
  ('6dfc922b-1a1d-5fdd-a04b-ebe93feba6cc', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'f4da856e-333a-5a66-a137-3b1e85b3bb13', 'a7bfa30d-f923-5eaa-80ee-256333970124', 'db264f90-ee54-5ec2-ad91-21b8e61c35a1', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'comparison scene', null, 'precapsule-v1', 'openai-2026-04-03', 0.050000, 137, 1966, 2103, 137, 0, 398, 1568, '{"imported": true, "source": "notes-folder", "note": "WhatsApp Image 2026-04-04 at 8.38.28 PM.jpeg", "point_category": "Availability", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-04T20:57:58.549844')
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
