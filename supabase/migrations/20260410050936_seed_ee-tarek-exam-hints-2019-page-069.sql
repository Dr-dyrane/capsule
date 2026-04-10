-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-10/2026-04-10T05-04-25-219734+00-00/ee-tarek-exam-hints-2019-page-069/source.png', 'complete', 'Financial statements', 10, 10, '2026-04-10T05:04:25.219734+00:00', '2026-04-10T05:04:25.219734+00:00', 'published')
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
  ('243ac79e-c3a5-5674-a71f-f6f74c946dda', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', 'Income Statement (Profit & Loss Statement): indicator of sales, cost of goods sold, gross profit, net profit.', 'General', 'Other', 0, 1, '2026-04-10T05:04:25.219734+00:00'),
  ('3c095e2e-2717-5fc9-9e6a-de9eef94ab7c', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', 'Sales = units * unit price Cost of goods sold = units * unit cost Gross margin/profit = Sales – cost of goods sold Gross margin % = (sales – cost of goods sold)/sales *100 Net profit = Gross margin – expenses.', 'General', 'Other', 1, 1, '2026-04-10T05:04:25.219734+00:00'),
  ('3421281e-3a3a-5830-87db-1e9430e27355', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', 'Balance sheet: indicator for assets and liabilities. Assets = cash + current inventory + prepaid expenses + furniture. Liability = account payable (debts)+ long-term liabilities', 'General', 'Other', 2, 1, '2026-04-10T05:04:25.219734+00:00'),
  ('b6fc9390-50d5-5bd4-ba81-9d7eb7dca6b5', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', 'Net worth (owner equity) = assets – liabilities Total current assets = cash + inventory + prepaid expenses Total assets = current assets + fixed assets Liability = account payable (supplier money) + note payable (bank loans)', 'General', 'Other', 3, 1, '2026-04-10T05:04:25.219734+00:00'),
  ('9aef54cb-a7c3-5d25-a8b4-dc66a2eb0faa', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', 'Retained Earning Statement: represent net income after paying off dividend to shareholders.', 'General', 'Other', 4, 1, '2026-04-10T05:04:25.219734+00:00'),
  ('702dd48b-7aad-50fb-b391-f700dafc0d02', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', 'Patient give 1gm Vancomycin IV, after 3 days T1/2 the blood conc. 15 mmol/L, he received 1 gm vancomycin. What peak and trough conc. of vancomycin Ans. After 3 days (T1/2) the conc. was 15. So at time of administration was 30; thus, each 1 gm vancomycin give 30 mmol/L. We calculate the concentration after 5 T1/2 Steady state conc. reach after 3-5 T1/2. So the steady state trough conc. = 29', 'General', 'Other', 5, 1, '2026-04-10T05:04:25.219734+00:00'),
  ('0b9f8b34-e989-5e80-87ce-061c16d982be', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', 'Closing Inventory equal to Opening Inventory for the next year.', 'General', 'Other', 6, 1, '2026-04-10T05:04:25.219734+00:00'),
  ('75fdc76a-2e9e-5b92-9d69-9827b8958048', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', 'Zwitter ion formation = (pka+pkb)/2', 'General', 'Other', 7, 1, '2026-04-10T05:04:25.219734+00:00'),
  ('50c5d242-e994-5b14-b26a-13861974c9be', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', 'Radial nerve in upper arm, supply triceps; responsible for extending the elbow, wrist and fingers and its injury result in Wrist drop.', 'General', 'Other', 8, 1, '2026-04-10T05:04:25.219734+00:00'),
  ('7e7eb8d6-5f17-5726-9a72-4e78b76a4fbd', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', 'Radial nerve: pass through forearm, write and fingertips. It supply muscles in forearm.', 'General', 'Other', 9, 1, '2026-04-10T05:04:25.219734+00:00')
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
  ('fa8cadde-c8b3-521f-b689-a69a3362b894', '243ac79e-c3a5-5674-a71f-f6f74c946dda', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '/seed/2026-04-10/2026-04-10T05-04-25-219734+00-00/ee-tarek-exam-hints-2019-page-069/point-01.png', 'Income Statement (Profit & Loss Statement)', 0, 'complete', 'published', '2026-04-10T05:04:25.219734+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:04:25.219734+00:00'),
  ('36d1a351-00a4-588e-95ed-c436052b4f79', '3c095e2e-2717-5fc9-9e6a-de9eef94ab7c', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '/seed/2026-04-10/2026-04-10T05-04-25-219734+00-00/ee-tarek-exam-hints-2019-page-069/point-02.png', 'Sales = units * unit price Cost of goods sold = units * unit cost Gross margin/profit = Sales – cost of goods sold Gross margin % = (sales – cost of goods sold)/sales *100 Net profit = Gross margin – expenses.', 1, 'complete', 'published', '2026-04-10T05:04:25.219734+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:04:25.219734+00:00'),
  ('dd87b261-026a-5b7a-94e1-8c9c28ef776f', '3421281e-3a3a-5830-87db-1e9430e27355', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '/seed/2026-04-10/2026-04-10T05-04-25-219734+00-00/ee-tarek-exam-hints-2019-page-069/point-03.png', 'Balance sheet', 2, 'complete', 'published', '2026-04-10T05:04:25.219734+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:04:25.219734+00:00'),
  ('125a8ef6-488e-5f8c-beb3-1f9ab27dbdb4', 'b6fc9390-50d5-5bd4-ba81-9d7eb7dca6b5', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '/seed/2026-04-10/2026-04-10T05-04-25-219734+00-00/ee-tarek-exam-hints-2019-page-069/point-04.png', 'Net worth (owner equity) = assets – liabilities Total current assets = cash + inventory + prepaid expenses Total assets = current assets + fixed assets Liability = account payable (supplier money) + note payable (bank loans)', 3, 'complete', 'published', '2026-04-10T05:04:25.219734+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:04:25.219734+00:00'),
  ('68b67c13-1990-5129-9ad3-927a9d82ef77', '9aef54cb-a7c3-5d25-a8b4-dc66a2eb0faa', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '/seed/2026-04-10/2026-04-10T05-04-25-219734+00-00/ee-tarek-exam-hints-2019-page-069/point-05.png', 'Retained Earning Statement', 4, 'complete', 'published', '2026-04-10T05:04:25.219734+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:04:25.219734+00:00'),
  ('85fe5dad-ff54-586a-b076-4e1808a85ccd', '702dd48b-7aad-50fb-b391-f700dafc0d02', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '/seed/2026-04-10/2026-04-10T05-04-25-219734+00-00/ee-tarek-exam-hints-2019-page-069/point-06.png', 'Patient give 1gm Vancomycin IV, after 3 days T1/2 the blood conc. 15 mmol/L, he received 1 gm vancomycin. What peak and trough conc. of vancomycin Ans. After 3 days (T1/2) the conc. was 15. So at time of administration was 30; thus, each 1 gm vancomycin give 30 mmol/L. We calculate the concentration after 5 T1/2 Steady state conc. reach after 3-5 T1/2. So the steady state trough conc. = 29', 5, 'complete', 'published', '2026-04-10T05:04:25.219734+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:04:25.219734+00:00'),
  ('f9ec41a4-e435-5a6a-bcad-01226c627b9c', '0b9f8b34-e989-5e80-87ce-061c16d982be', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '/seed/2026-04-10/2026-04-10T05-04-25-219734+00-00/ee-tarek-exam-hints-2019-page-069/point-07.png', 'Closing Inventory equal to Opening Inventory for the next year.', 6, 'complete', 'published', '2026-04-10T05:04:25.219734+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:04:25.219734+00:00'),
  ('53d3a235-fc00-5513-8013-c10d51cee844', '75fdc76a-2e9e-5b92-9d69-9827b8958048', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '/seed/2026-04-10/2026-04-10T05-04-25-219734+00-00/ee-tarek-exam-hints-2019-page-069/point-08.png', 'Zwitter ion formation = (pka+pkb)/2', 7, 'complete', 'published', '2026-04-10T05:04:25.219734+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:04:25.219734+00:00'),
  ('120d8a7d-009d-53a7-9763-418ebe3e1e93', '50c5d242-e994-5b14-b26a-13861974c9be', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '/seed/2026-04-10/2026-04-10T05-04-25-219734+00-00/ee-tarek-exam-hints-2019-page-069/point-09.png', 'Radial nerve in upper arm, supply triceps; responsible for extending the elbow, wrist and fingers and its injury result in Wrist drop.', 8, 'complete', 'published', '2026-04-10T05:04:25.219734+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:04:25.219734+00:00'),
  ('8ac0483d-f715-5cfc-ae9f-a70b74bd2b8d', '7e7eb8d6-5f17-5726-9a72-4e78b76a4fbd', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '/seed/2026-04-10/2026-04-10T05-04-25-219734+00-00/ee-tarek-exam-hints-2019-page-069/point-10.png', 'Radial nerve', 9, 'complete', 'published', '2026-04-10T05:04:25.219734+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:04:25.219734+00:00')
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
  ('b57bf5a5-4ccc-5889-a09f-85769e5ab596', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', 'fa8cadde-c8b3-521f-b689-a69a3362b894', '243ac79e-c3a5-5674-a71f-f6f74c946dda', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 069.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:69", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 69, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:04:25.219734+00:00'),
  ('0df69ff7-0bb1-5e45-8fc6-d27dd54e7112', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '36d1a351-00a4-588e-95ed-c436052b4f79', '3c095e2e-2717-5fc9-9e6a-de9eef94ab7c', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 069.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:69", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 69, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:04:25.219734+00:00'),
  ('139ae77b-ef70-5c45-bc5c-cb363963046f', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', 'dd87b261-026a-5b7a-94e1-8c9c28ef776f', '3421281e-3a3a-5830-87db-1e9430e27355', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 069.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:69", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 69, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:04:25.219734+00:00'),
  ('1919c058-817d-5ceb-b8b4-800427b0d378', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '125a8ef6-488e-5f8c-beb3-1f9ab27dbdb4', 'b6fc9390-50d5-5bd4-ba81-9d7eb7dca6b5', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 069.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:69", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 69, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:04:25.219734+00:00'),
  ('7ac16794-2f25-51ad-91a5-7d30f74cf724', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '68b67c13-1990-5129-9ad3-927a9d82ef77', '9aef54cb-a7c3-5d25-a8b4-dc66a2eb0faa', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 069.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:69", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 69, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:04:25.219734+00:00'),
  ('d9cbfdff-b63c-5820-8dcd-621d1b36b1c6', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '85fe5dad-ff54-586a-b076-4e1808a85ccd', '702dd48b-7aad-50fb-b391-f700dafc0d02', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 069.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:69", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 69, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:04:25.219734+00:00'),
  ('4d29a569-526a-50ce-a426-cd6b87b89186', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', 'f9ec41a4-e435-5a6a-bcad-01226c627b9c', '0b9f8b34-e989-5e80-87ce-061c16d982be', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 069.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:69", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 69, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:04:25.219734+00:00'),
  ('54bcbcb7-bcdf-5a2e-8fc0-5bffc3e576dd', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '53d3a235-fc00-5513-8013-c10d51cee844', '75fdc76a-2e9e-5b92-9d69-9827b8958048', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 069.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:69", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 69, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:04:25.219734+00:00'),
  ('b5a66924-537f-5153-8a7e-b8ab16b18cde', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '120d8a7d-009d-53a7-9763-418ebe3e1e93', '50c5d242-e994-5b14-b26a-13861974c9be', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 069.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:69", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 69, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:04:25.219734+00:00'),
  ('5a81b339-9981-5484-8c97-b28721da2d26', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa', '8ac0483d-f715-5cfc-ae9f-a70b74bd2b8d', '7e7eb8d6-5f17-5726-9a72-4e78b76a4fbd', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 069.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:69", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 69, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:04:25.219734+00:00')
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

select public.refresh_public_card_relationships('5ee4ca24-af0b-5ac5-bd6d-287fa480c8aa'::uuid);
