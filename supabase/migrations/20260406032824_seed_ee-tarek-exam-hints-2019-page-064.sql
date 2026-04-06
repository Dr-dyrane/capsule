-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('d18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-06/2026-04-06T03-01-10-159156+00-00/ee-tarek-exam-hints-2019-page-064/source.png', 'complete', 'T1/2 depend on drug conc. T1/2 is constant', 10, 12, '2026-04-06T03:21:20.431782+00:00', '2026-04-06T03:21:20.431782+00:00', 'published')
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
  ('5df0695c-433a-5e55-ad49-99dc0985798c', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', 'Linear plot: Conc vs Time graph = linear graph * Linear Plot: Conc. Vs time = Curve (Exponential)', 'Compare', 'Comparison', 0, 2, '2026-04-06T03:21:20.431782+00:00'),
  ('8f123eb3-cbf7-5d6c-a7b7-6b68a8ec3eec', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', 'Semi-log plot: logarithmic conc Vs time = linear graph After saturation. Some drugs: aspirin, phenytoin, ethanol, Cisplatin, fluoxetine, Omeprazole Most drugs at most doses', 'Compare', 'Comparison', 1, 2, '2026-04-06T03:21:20.431782+00:00'),
  ('7389ec48-6927-5a98-b9df-d9461dcb65e6', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '• Half-life (T1/2)', 'General', 'Other', 2, 1, '2026-04-06T03:21:20.431782+00:00'),
  ('72ac46bd-8cf2-5263-b0b7-ff67ae5d12e8', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '1st order: T1/2= 0.693/K', 'General', 'Other', 3, 1, '2026-04-06T03:21:20.431782+00:00'),
  ('799835b9-df9f-5cab-9832-7f81f0555677', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', 'zero order: T1/2= 0.5* A/K', 'General', 'Other', 4, 1, '2026-04-06T03:21:20.431782+00:00'),
  ('26084326-0fac-5959-80bb-861fb24763ba', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', 'Shelf life (T90) = measure at room temp (250 C) when 90% of drug is still stable', 'Diagnostic', 'Diagnostic', 5, 1, '2026-04-06T03:21:20.431782+00:00'),
  ('91617270-c4ad-5575-836a-5e6a25b3e1d4', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '1st order: T90= 0.105/K', 'General', 'Other', 6, 1, '2026-04-06T03:21:20.431782+00:00'),
  ('7ff343b9-7bed-58d2-bb68-a87c87126b4b', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', 'zero order: T90= 0.1* A/K', 'General', 'Other', 7, 1, '2026-04-06T03:21:20.431782+00:00'),
  ('7fc2ad78-9a7a-5d50-bcbc-6e6a4acb90b5', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', 'Log C = log C0 – kt/2.303', 'General', 'Other', 8, 1, '2026-04-06T03:21:20.431782+00:00'),
  ('92918b84-2512-5b3c-92c0-23fdabf6fb4a', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', 'Trough level: Ctrough is the lowest concentration reached by a drug before the next dose is administered.', 'General', 'Drug', 9, 1, '2026-04-06T03:21:20.431782+00:00')
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
  ('6d1994f8-2761-5cec-a600-94096b0a2e8a', '5df0695c-433a-5e55-ad49-99dc0985798c', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '/seed/2026-04-06/2026-04-06T03-01-10-159156+00-00/ee-tarek-exam-hints-2019-page-064/point-01-variant-01.png', 'Linear plot (1)', 0, 'complete', 'published', '2026-04-06T03:21:20.431782+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'comparison board', null, '2026-04-06T03:21:20.431782+00:00'),
  ('4b81e303-a3ee-56f2-bc3b-62c7d50f26f7', '5df0695c-433a-5e55-ad49-99dc0985798c', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '/seed/2026-04-06/2026-04-06T03-01-10-159156+00-00/ee-tarek-exam-hints-2019-page-064/point-01-variant-02.png', 'Linear plot (2)', 1, 'complete', 'published', '2026-04-06T03:21:20.431782+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'comparison board', null, '2026-04-06T03:21:20.431782+00:00'),
  ('4f80da69-6ac4-5d37-9548-8cdac1054fb6', '8f123eb3-cbf7-5d6c-a7b7-6b68a8ec3eec', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '/seed/2026-04-06/2026-04-06T03-01-10-159156+00-00/ee-tarek-exam-hints-2019-page-064/point-02-variant-01.png', 'Semi-log plot (1)', 2, 'complete', 'published', '2026-04-06T03:21:20.431782+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'comparison board', null, '2026-04-06T03:21:20.431782+00:00'),
  ('e416b507-c795-55c2-aff9-080ee6c69ded', '8f123eb3-cbf7-5d6c-a7b7-6b68a8ec3eec', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '/seed/2026-04-06/2026-04-06T03-01-10-159156+00-00/ee-tarek-exam-hints-2019-page-064/point-02-variant-02.png', 'Semi-log plot (2)', 3, 'complete', 'published', '2026-04-06T03:21:20.431782+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'comparison board', null, '2026-04-06T03:21:20.431782+00:00'),
  ('ef1eee16-de90-5cc0-ae6c-a809ae7f1ba9', '7389ec48-6927-5a98-b9df-d9461dcb65e6', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '/seed/2026-04-06/2026-04-06T03-01-10-159156+00-00/ee-tarek-exam-hints-2019-page-064/point-03.png', '• Half-life (T1/2)', 4, 'complete', 'published', '2026-04-06T03:21:20.431782+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:20.431782+00:00'),
  ('f0b5d748-9848-503b-a041-2eb734e41d33', '72ac46bd-8cf2-5263-b0b7-ff67ae5d12e8', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '/seed/2026-04-06/2026-04-06T03-01-10-159156+00-00/ee-tarek-exam-hints-2019-page-064/point-04.png', '1st order', 5, 'complete', 'published', '2026-04-06T03:21:20.431782+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:20.431782+00:00'),
  ('56df078d-726d-52d1-92c2-50f7c380178f', '799835b9-df9f-5cab-9832-7f81f0555677', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '/seed/2026-04-06/2026-04-06T03-01-10-159156+00-00/ee-tarek-exam-hints-2019-page-064/point-05.png', 'zero order', 6, 'complete', 'published', '2026-04-06T03:21:20.431782+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:20.431782+00:00'),
  ('9ea95ff2-79e1-5198-8b2f-d711b7d6a633', '26084326-0fac-5959-80bb-861fb24763ba', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '/seed/2026-04-06/2026-04-06T03-01-10-159156+00-00/ee-tarek-exam-hints-2019-page-064/point-06.png', 'Shelf life (T90) = measure at room temp (250 C) when 90% of drug is still stable', 7, 'complete', 'published', '2026-04-06T03:21:20.431782+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'diagnostic flow', null, '2026-04-06T03:21:20.431782+00:00'),
  ('371f82f4-e42e-58e3-9da6-00f2e66e4284', '91617270-c4ad-5575-836a-5e6a25b3e1d4', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '/seed/2026-04-06/2026-04-06T03-01-10-159156+00-00/ee-tarek-exam-hints-2019-page-064/point-07.png', '1st order', 8, 'complete', 'published', '2026-04-06T03:21:20.431782+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:20.431782+00:00'),
  ('2155611c-46ea-5a9a-a55b-d653ac8c9d1e', '7ff343b9-7bed-58d2-bb68-a87c87126b4b', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '/seed/2026-04-06/2026-04-06T03-01-10-159156+00-00/ee-tarek-exam-hints-2019-page-064/point-08.png', 'zero order', 9, 'complete', 'published', '2026-04-06T03:21:20.431782+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:20.431782+00:00'),
  ('04c0b517-1989-5f6f-8763-afc9b9dfd66f', '7fc2ad78-9a7a-5d50-bcbc-6e6a4acb90b5', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '/seed/2026-04-06/2026-04-06T03-01-10-159156+00-00/ee-tarek-exam-hints-2019-page-064/point-09.png', 'Log C = log C0 – kt/2.303', 10, 'complete', 'published', '2026-04-06T03:21:20.431782+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:20.431782+00:00'),
  ('2e4cadd3-3f04-5c1f-a4f0-9301c05dca22', '92918b84-2512-5b3c-92c0-23fdabf6fb4a', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '/seed/2026-04-06/2026-04-06T03-01-10-159156+00-00/ee-tarek-exam-hints-2019-page-064/point-10.png', 'Trough level', 11, 'complete', 'published', '2026-04-06T03:21:20.431782+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-06T03:21:20.431782+00:00')
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
  ('20a42203-1976-5abb-92b1-27804bfdc377', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '6d1994f8-2761-5cec-a600-94096b0a2e8a', '5df0695c-433a-5e55-ad49-99dc0985798c', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'comparison board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 064.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:64", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 64, "point_category": "Compare", "point_concept": "Comparison", "variant_index": 0, "variant_count": 2}'::jsonb, '2026-04-06T03:21:20.431782+00:00'),
  ('b85299c9-f3b6-5af5-93f2-5df9f2e91ef6', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '4b81e303-a3ee-56f2-bc3b-62c7d50f26f7', '5df0695c-433a-5e55-ad49-99dc0985798c', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'comparison board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 064.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:64", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 64, "point_category": "Compare", "point_concept": "Comparison", "variant_index": 1, "variant_count": 2}'::jsonb, '2026-04-06T03:21:20.431782+00:00'),
  ('8fcb0547-91f5-53c7-9265-e409f54a88bb', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '4f80da69-6ac4-5d37-9548-8cdac1054fb6', '8f123eb3-cbf7-5d6c-a7b7-6b68a8ec3eec', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'comparison board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 064.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:64", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 64, "point_category": "Compare", "point_concept": "Comparison", "variant_index": 0, "variant_count": 2}'::jsonb, '2026-04-06T03:21:20.431782+00:00'),
  ('0a0722a3-31f7-5bca-b3f4-ae1318b54f7d', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', 'e416b507-c795-55c2-aff9-080ee6c69ded', '8f123eb3-cbf7-5d6c-a7b7-6b68a8ec3eec', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'comparison board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 064.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:64", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 64, "point_category": "Compare", "point_concept": "Comparison", "variant_index": 1, "variant_count": 2}'::jsonb, '2026-04-06T03:21:20.431782+00:00'),
  ('41d20318-4687-559a-8e04-cfa328850407', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', 'ef1eee16-de90-5cc0-ae6c-a809ae7f1ba9', '7389ec48-6927-5a98-b9df-d9461dcb65e6', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 064.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:64", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 64, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:20.431782+00:00'),
  ('af719575-ac20-5f5c-bc8d-544b570873cc', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', 'f0b5d748-9848-503b-a041-2eb734e41d33', '72ac46bd-8cf2-5263-b0b7-ff67ae5d12e8', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 064.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:64", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 64, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:20.431782+00:00'),
  ('85be5ff1-c77f-5eb1-a12a-2a43fdcd7e71', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '56df078d-726d-52d1-92c2-50f7c380178f', '799835b9-df9f-5cab-9832-7f81f0555677', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 064.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:64", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 64, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:20.431782+00:00'),
  ('f9954aa7-f704-56a8-ad2f-0e61430f202e', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '9ea95ff2-79e1-5198-8b2f-d711b7d6a633', '26084326-0fac-5959-80bb-861fb24763ba', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'diagnostic flow', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 064.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:64", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 64, "point_category": "Diagnostic", "point_concept": "Diagnostic", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:20.431782+00:00'),
  ('35626068-e5d2-57e9-ba71-05605c81a586', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '371f82f4-e42e-58e3-9da6-00f2e66e4284', '91617270-c4ad-5575-836a-5e6a25b3e1d4', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 064.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:64", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 64, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:20.431782+00:00'),
  ('59c292d6-6fa6-5f93-a3cb-624a9274e604', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '2155611c-46ea-5a9a-a55b-d653ac8c9d1e', '7ff343b9-7bed-58d2-bb68-a87c87126b4b', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 064.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:64", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 64, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:20.431782+00:00'),
  ('2f99c93e-4359-5566-9d38-78b15cf5e944', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '04c0b517-1989-5f6f-8763-afc9b9dfd66f', '7fc2ad78-9a7a-5d50-bcbc-6e6a4acb90b5', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 064.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:64", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 64, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:20.431782+00:00'),
  ('6d24e0e4-0e70-5090-8680-730d2298e238', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'd18956ba-eacc-5a8f-9fac-42b8f1ca0de3', '2e4cadd3-3f04-5c1f-a4f0-9301c05dca22', '92918b84-2512-5b3c-92c0-23fdabf6fb4a', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 064.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:64", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 64, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-06T03:21:20.431782+00:00')
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

select public.refresh_public_card_relationships('d18956ba-eacc-5a8f-9fac-42b8f1ca0de3'::uuid);
