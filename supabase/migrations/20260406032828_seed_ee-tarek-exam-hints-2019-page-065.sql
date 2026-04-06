-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('d710aab3-af62-512b-855c-f6b9106d9780', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-06/2026-04-06T03-05-48-745823+00-00/ee-tarek-exam-hints-2019-page-065/source.png', 'complete', 'Gross Profit = Sales - Cost', 10, 10, '2026-04-06T03:21:23.645896+00:00', '2026-04-06T03:21:23.645896+00:00', 'published')
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
  ('a16832a7-d920-518a-b963-455796644366', 'd710aab3-af62-512b-855c-f6b9106d9780', 'Gross margin = (Sales – Cost / Sales) * 100', 'General', 'Other', 0, 1, '2026-04-06T03:21:23.645896+00:00'),
  ('b62256a5-0590-525c-82d4-5260c898f2a5', 'd710aab3-af62-512b-855c-f6b9106d9780', 'Markup = (Sales – Cost / Cost) * 100', 'General', 'Other', 1, 1, '2026-04-06T03:21:23.645896+00:00'),
  ('70491e86-bd70-54ed-b722-49af2d0ed92b', 'd710aab3-af62-512b-855c-f6b9106d9780', 'Sales price = Cost + (Cost * markup %)', 'General', 'Other', 2, 1, '2026-04-06T03:21:23.645896+00:00'),
  ('90fe374c-a619-591c-ac7c-9c8e069d9c7a', 'd710aab3-af62-512b-855c-f6b9106d9780', 'Cost price = Sales price/ (1+markup%)', 'General', 'Other', 3, 1, '2026-04-06T03:21:23.645896+00:00'),
  ('1d87888a-41c1-5003-a159-fb6f427d14cf', 'd710aab3-af62-512b-855c-f6b9106d9780', 'Vd= 𝐷𝑟𝑢𝑔 𝑎𝑚𝑜𝑢𝑛𝑡 𝐷𝑟𝑢𝑔 𝑐𝑜𝑛𝑐.𝑎𝑡 𝑡𝑖𝑚𝑒 0 = 𝑇𝑜𝑡𝑎𝑙 𝐶𝑙 𝐾𝑒𝑙', 'General', 'Other', 4, 1, '2026-04-06T03:21:23.645896+00:00'),
  ('82d2db1d-6dbd-56dc-892e-b31162656c53', 'd710aab3-af62-512b-855c-f6b9106d9780', 'Rate of infusion = Css * CL = Css * Vd * Kel = Css * Vd *', 'General', 'Other', 5, 1, '2026-04-06T03:21:23.645896+00:00'),
  ('7c2c90f1-9359-5a72-b4c8-a4f0b093ed4b', 'd710aab3-af62-512b-855c-f6b9106d9780', 'Loading dose = Css * Vd', 'General', 'Other', 6, 1, '2026-04-06T03:21:23.645896+00:00'),
  ('c316dc44-d9c6-5b89-8d3a-33a020b1aebf', 'd710aab3-af62-512b-855c-f6b9106d9780', 'AUC: concentration of drug over time interval ( mass*time/volume)', 'General', 'Drug', 7, 1, '2026-04-06T03:21:23.645896+00:00'),
  ('f3df9338-3ebd-51d5-977e-e38ea792f302', 'd710aab3-af62-512b-855c-f6b9106d9780', 'Css= AUC/T(dosing interval)', 'General', 'Other', 8, 1, '2026-04-06T03:21:23.645896+00:00'),
  ('ae978181-732e-5de8-84ec-52e5fd811cb9', 'd710aab3-af62-512b-855c-f6b9106d9780', 'Amount available for absorption = F * D', 'General', 'Other', 9, 1, '2026-04-06T03:21:23.645896+00:00')
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
  ('825a2991-e070-5398-9e61-eb464c5b65a6', 'a16832a7-d920-518a-b963-455796644366', 'd710aab3-af62-512b-855c-f6b9106d9780', '/seed/2026-04-06/2026-04-06T03-05-48-745823+00-00/ee-tarek-exam-hints-2019-page-065/point-01.png', 'Gross margin = (Sales – Cost / Sales) * 100', 0, 'complete', 'published', '2026-04-06T03:21:23.645896+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:23.645896+00:00'),
  ('d38ddffa-63ef-5586-a79b-27abb09a7ce5', 'b62256a5-0590-525c-82d4-5260c898f2a5', 'd710aab3-af62-512b-855c-f6b9106d9780', '/seed/2026-04-06/2026-04-06T03-05-48-745823+00-00/ee-tarek-exam-hints-2019-page-065/point-02.png', 'Markup = (Sales – Cost / Cost) * 100', 1, 'complete', 'published', '2026-04-06T03:21:23.645896+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:23.645896+00:00'),
  ('b0538c96-46e5-5634-b4b9-21e262de3b39', '70491e86-bd70-54ed-b722-49af2d0ed92b', 'd710aab3-af62-512b-855c-f6b9106d9780', '/seed/2026-04-06/2026-04-06T03-05-48-745823+00-00/ee-tarek-exam-hints-2019-page-065/point-03.png', 'Sales price = Cost + (Cost * markup %)', 2, 'complete', 'published', '2026-04-06T03:21:23.645896+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:23.645896+00:00'),
  ('7823af90-687e-554b-bd4a-20a1e81de8e9', '90fe374c-a619-591c-ac7c-9c8e069d9c7a', 'd710aab3-af62-512b-855c-f6b9106d9780', '/seed/2026-04-06/2026-04-06T03-05-48-745823+00-00/ee-tarek-exam-hints-2019-page-065/point-04.png', 'Cost price = Sales price/ (1+markup%)', 3, 'complete', 'published', '2026-04-06T03:21:23.645896+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:23.645896+00:00'),
  ('1bdf455c-73f1-53e4-9e58-159f56fc9bff', '1d87888a-41c1-5003-a159-fb6f427d14cf', 'd710aab3-af62-512b-855c-f6b9106d9780', '/seed/2026-04-06/2026-04-06T03-05-48-745823+00-00/ee-tarek-exam-hints-2019-page-065/point-05.png', 'Vd= 𝐷𝑟𝑢𝑔 𝑎𝑚𝑜𝑢𝑛𝑡 𝐷𝑟𝑢𝑔 𝑐𝑜𝑛𝑐.𝑎𝑡 𝑡𝑖𝑚𝑒 0 = 𝑇𝑜𝑡𝑎𝑙 𝐶𝑙 𝐾𝑒𝑙', 4, 'complete', 'published', '2026-04-06T03:21:23.645896+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:23.645896+00:00'),
  ('2eb2e94b-6908-59db-8f6c-93e1dd160185', '82d2db1d-6dbd-56dc-892e-b31162656c53', 'd710aab3-af62-512b-855c-f6b9106d9780', '/seed/2026-04-06/2026-04-06T03-05-48-745823+00-00/ee-tarek-exam-hints-2019-page-065/point-06.png', 'Rate of infusion = Css * CL = Css * Vd * Kel = Css * Vd *', 5, 'complete', 'published', '2026-04-06T03:21:23.645896+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:23.645896+00:00'),
  ('dbfa45eb-7d51-59b6-ab0f-e7a45c8516e2', '7c2c90f1-9359-5a72-b4c8-a4f0b093ed4b', 'd710aab3-af62-512b-855c-f6b9106d9780', '/seed/2026-04-06/2026-04-06T03-05-48-745823+00-00/ee-tarek-exam-hints-2019-page-065/point-07.png', 'Loading dose = Css * Vd', 6, 'complete', 'published', '2026-04-06T03:21:23.645896+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:23.645896+00:00'),
  ('69f18cd1-4a19-5e31-934f-9cbfb05954d0', 'c316dc44-d9c6-5b89-8d3a-33a020b1aebf', 'd710aab3-af62-512b-855c-f6b9106d9780', '/seed/2026-04-06/2026-04-06T03-05-48-745823+00-00/ee-tarek-exam-hints-2019-page-065/point-08.png', 'AUC', 7, 'complete', 'published', '2026-04-06T03:21:23.645896+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:23.645896+00:00'),
  ('499f7c48-6800-527e-8c98-80c88b0c9b79', 'f3df9338-3ebd-51d5-977e-e38ea792f302', 'd710aab3-af62-512b-855c-f6b9106d9780', '/seed/2026-04-06/2026-04-06T03-05-48-745823+00-00/ee-tarek-exam-hints-2019-page-065/point-09.png', 'Css= AUC/T(dosing interval)', 8, 'complete', 'published', '2026-04-06T03:21:23.645896+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:23.645896+00:00'),
  ('a9c97fd4-1733-5160-8ee3-6ad7d02ad32b', 'ae978181-732e-5de8-84ec-52e5fd811cb9', 'd710aab3-af62-512b-855c-f6b9106d9780', '/seed/2026-04-06/2026-04-06T03-05-48-745823+00-00/ee-tarek-exam-hints-2019-page-065/point-10.png', 'Amount available for absorption = F * D', 9, 'complete', 'published', '2026-04-06T03:21:23.645896+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:23.645896+00:00')
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
  ('bdee3964-e95a-584a-a246-f88a691fbf53', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd710aab3-af62-512b-855c-f6b9106d9780', '825a2991-e070-5398-9e61-eb464c5b65a6', 'a16832a7-d920-518a-b963-455796644366', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 065.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:65", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 65, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:23.645896+00:00'),
  ('2754524b-b08b-5099-b63b-f677ebd9773b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd710aab3-af62-512b-855c-f6b9106d9780', 'd38ddffa-63ef-5586-a79b-27abb09a7ce5', 'b62256a5-0590-525c-82d4-5260c898f2a5', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 065.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:65", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 65, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:23.645896+00:00'),
  ('70fe2b91-fcfb-5522-9e44-06cd6ee2edff', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd710aab3-af62-512b-855c-f6b9106d9780', 'b0538c96-46e5-5634-b4b9-21e262de3b39', '70491e86-bd70-54ed-b722-49af2d0ed92b', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 065.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:65", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 65, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:23.645896+00:00'),
  ('a3296688-4f32-5a1f-bc6c-61107a751e3a', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd710aab3-af62-512b-855c-f6b9106d9780', '7823af90-687e-554b-bd4a-20a1e81de8e9', '90fe374c-a619-591c-ac7c-9c8e069d9c7a', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 065.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:65", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 65, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:23.645896+00:00'),
  ('52172735-ddba-5f46-9e8a-0bbbd84cd64a', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd710aab3-af62-512b-855c-f6b9106d9780', '1bdf455c-73f1-53e4-9e58-159f56fc9bff', '1d87888a-41c1-5003-a159-fb6f427d14cf', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 065.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:65", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 65, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:23.645896+00:00'),
  ('699aa0f8-13ad-59fd-8b8c-157bed9cc5ed', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd710aab3-af62-512b-855c-f6b9106d9780', '2eb2e94b-6908-59db-8f6c-93e1dd160185', '82d2db1d-6dbd-56dc-892e-b31162656c53', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 065.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:65", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 65, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:23.645896+00:00'),
  ('384d6f1a-741d-5560-9642-90c9b049f80a', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd710aab3-af62-512b-855c-f6b9106d9780', 'dbfa45eb-7d51-59b6-ab0f-e7a45c8516e2', '7c2c90f1-9359-5a72-b4c8-a4f0b093ed4b', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 065.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:65", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 65, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:23.645896+00:00'),
  ('e23d0cc8-e0b3-5ff7-8b75-518e4000a825', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd710aab3-af62-512b-855c-f6b9106d9780', '69f18cd1-4a19-5e31-934f-9cbfb05954d0', 'c316dc44-d9c6-5b89-8d3a-33a020b1aebf', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 065.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:65", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 65, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:23.645896+00:00'),
  ('bde56f3c-0288-5783-af96-40d55b74137e', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd710aab3-af62-512b-855c-f6b9106d9780', '499f7c48-6800-527e-8c98-80c88b0c9b79', 'f3df9338-3ebd-51d5-977e-e38ea792f302', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 065.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:65", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 65, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:23.645896+00:00'),
  ('70ea6eb1-064f-541a-b483-deaf08fcab08', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd710aab3-af62-512b-855c-f6b9106d9780', 'a9c97fd4-1733-5160-8ee3-6ad7d02ad32b', 'ae978181-732e-5de8-84ec-52e5fd811cb9', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 065.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:65", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 65, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:23.645896+00:00')
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

select public.refresh_public_card_relationships('d710aab3-af62-512b-855c-f6b9106d9780'::uuid);
