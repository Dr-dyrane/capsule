-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('e585f891-e90d-5ca8-b54e-ac13fc20d724', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-10/2026-04-10T05-12-09-409075+00-00/ee-tarek-exam-hints-2019-page-071/source.png', 'complete', '1- Occipital lobe: vision', 10, 10, '2026-04-10T05:12:09.409075+00:00', '2026-04-10T05:12:09.409075+00:00', 'published')
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
  ('c60b37c8-9df2-57a0-80c3-0c56096de968', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '2- Parietal lobe: intelligence, reasoning, sensation, reading', 'General', 'Other', 0, 1, '2026-04-10T05:12:09.409075+00:00'),
  ('3f2eebcd-272e-52b8-8c4d-6447158b9a00', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '3- Temporal lobe: speech, behavior, memory', 'General', 'Other', 1, 1, '2026-04-10T05:12:09.409075+00:00'),
  ('9073554c-a15b-545a-98e2-87c52de20548', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '4- Frontal lobe: (has Motor cortex) movement, intelligence, personality', 'General', 'Other', 2, 1, '2026-04-10T05:12:09.409075+00:00'),
  ('8685c166-2407-5a45-b27f-c9722fb83b91', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', 'Gastrointestinal absorption could be affected by: PH alteration, flora alteration, motility alteration.', 'Diagnostic', 'Diagnostic', 3, 1, '2026-04-10T05:12:09.409075+00:00'),
  ('1657ab2f-b453-54d2-b0ae-6b1a38964d12', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', 'Blood consist of: 55% plasma, 44% RBCs, (1% WBC + Platelets.) Plasma: 91% water, Proteins 6-8%, vitamins +glucose +salt. Plasma protein: 60% albumin, 36% globulin, 4% Fibrinogen.', 'General', 'Other', 4, 1, '2026-04-10T05:12:09.409075+00:00'),
  ('ab3e85da-78a6-5bc6-b9c4-e23f52cae15e', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', 'Cruciate ligament present in Knee.', 'General', 'Other', 5, 1, '2026-04-10T05:12:09.409075+00:00'),
  ('0c481170-7e5f-5a2c-9aed-441ea4140786', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', 'Respiration rate: 12-20 breath/min', 'General', 'Other', 6, 1, '2026-04-10T05:12:09.409075+00:00'),
  ('75847390-7877-5451-ba1c-eeb69249b4e6', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', 'Centrosome organize microtubules, pull chromatids apart during cell division.', 'General', 'Other', 7, 1, '2026-04-10T05:12:09.409075+00:00'),
  ('d233e3d3-8cf1-5927-984a-1af791d2798c', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', 'Adrenal cortex secret: cortisol (increase glucose), aldosterone (Na retention), androgen (develop early male sex organs and female sex drive and puberty)', 'General', 'Other', 8, 1, '2026-04-10T05:12:09.409075+00:00'),
  ('589b6717-06f7-5be4-acc2-0587c4270de3', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', 'Adrenal medulla: secrete epinephrine (adrenaline).', 'General', 'Other', 9, 1, '2026-04-10T05:12:09.409075+00:00')
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
  ('608e46be-6dc4-530f-a248-5ec8e01eeb73', 'c60b37c8-9df2-57a0-80c3-0c56096de968', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '/seed/2026-04-10/2026-04-10T05-12-09-409075+00-00/ee-tarek-exam-hints-2019-page-071/point-01.png', '2- Parietal lobe', 0, 'complete', 'published', '2026-04-10T05:12:09.409075+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:12:09.409075+00:00'),
  ('ad636575-00a3-5d8f-8f71-99440482e8e6', '3f2eebcd-272e-52b8-8c4d-6447158b9a00', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '/seed/2026-04-10/2026-04-10T05-12-09-409075+00-00/ee-tarek-exam-hints-2019-page-071/point-02.png', '3- Temporal lobe', 1, 'complete', 'published', '2026-04-10T05:12:09.409075+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:12:09.409075+00:00'),
  ('3891fd80-30b4-5bf2-a362-ac9fd705a2ba', '9073554c-a15b-545a-98e2-87c52de20548', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '/seed/2026-04-10/2026-04-10T05-12-09-409075+00-00/ee-tarek-exam-hints-2019-page-071/point-03.png', '4- Frontal lobe', 2, 'complete', 'published', '2026-04-10T05:12:09.409075+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:12:09.409075+00:00'),
  ('8dba2054-6bc5-5627-ac78-90d6b7835c7e', '8685c166-2407-5a45-b27f-c9722fb83b91', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '/seed/2026-04-10/2026-04-10T05-12-09-409075+00-00/ee-tarek-exam-hints-2019-page-071/point-04.png', 'Gastrointestinal absorption could be affected by', 3, 'complete', 'published', '2026-04-10T05:12:09.409075+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'diagnostic flow', null, '2026-04-10T05:12:09.409075+00:00'),
  ('52ee4d1e-9dcb-5a26-b060-cab16d9c8dbc', '1657ab2f-b453-54d2-b0ae-6b1a38964d12', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '/seed/2026-04-10/2026-04-10T05-12-09-409075+00-00/ee-tarek-exam-hints-2019-page-071/point-05.png', 'Blood consist of', 4, 'complete', 'published', '2026-04-10T05:12:09.409075+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:12:09.409075+00:00'),
  ('c8eae306-0e68-5f82-b374-4a3ed336387b', 'ab3e85da-78a6-5bc6-b9c4-e23f52cae15e', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '/seed/2026-04-10/2026-04-10T05-12-09-409075+00-00/ee-tarek-exam-hints-2019-page-071/point-06.png', 'Cruciate ligament present in Knee.', 5, 'complete', 'published', '2026-04-10T05:12:09.409075+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:12:09.409075+00:00'),
  ('1d521098-789f-5ddd-8015-e21198fbe177', '0c481170-7e5f-5a2c-9aed-441ea4140786', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '/seed/2026-04-10/2026-04-10T05-12-09-409075+00-00/ee-tarek-exam-hints-2019-page-071/point-07.png', 'Respiration rate', 6, 'complete', 'published', '2026-04-10T05:12:09.409075+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:12:09.409075+00:00'),
  ('f3ab53ca-0e34-5ac8-95dc-4f095dd08c05', '75847390-7877-5451-ba1c-eeb69249b4e6', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '/seed/2026-04-10/2026-04-10T05-12-09-409075+00-00/ee-tarek-exam-hints-2019-page-071/point-08.png', 'Centrosome organize microtubules, pull chromatids apart during cell division.', 7, 'complete', 'published', '2026-04-10T05:12:09.409075+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:12:09.409075+00:00'),
  ('d14e7d71-0ab8-5bf4-b066-194754ae079f', 'd233e3d3-8cf1-5927-984a-1af791d2798c', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '/seed/2026-04-10/2026-04-10T05-12-09-409075+00-00/ee-tarek-exam-hints-2019-page-071/point-09.png', 'Adrenal cortex secret', 8, 'complete', 'published', '2026-04-10T05:12:09.409075+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:12:09.409075+00:00'),
  ('f11ac886-8dd9-58ac-b221-55ec2cc822d5', '589b6717-06f7-5be4-acc2-0587c4270de3', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '/seed/2026-04-10/2026-04-10T05-12-09-409075+00-00/ee-tarek-exam-hints-2019-page-071/point-10.png', 'Adrenal medulla', 9, 'complete', 'published', '2026-04-10T05:12:09.409075+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:12:09.409075+00:00')
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
  ('bda1c7e1-07ab-5cf4-ba7a-fd8231347003', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '608e46be-6dc4-530f-a248-5ec8e01eeb73', 'c60b37c8-9df2-57a0-80c3-0c56096de968', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 071.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:71", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 71, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:12:09.409075+00:00'),
  ('e574151f-cb44-5d05-969f-e882407d3df8', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', 'ad636575-00a3-5d8f-8f71-99440482e8e6', '3f2eebcd-272e-52b8-8c4d-6447158b9a00', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 071.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:71", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 71, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:12:09.409075+00:00'),
  ('c6e2a093-2641-5eaa-93dc-3daddbc188be', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '3891fd80-30b4-5bf2-a362-ac9fd705a2ba', '9073554c-a15b-545a-98e2-87c52de20548', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 071.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:71", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 71, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:12:09.409075+00:00'),
  ('fd427148-1974-54a9-ba9c-17ab4081ecd0', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '8dba2054-6bc5-5627-ac78-90d6b7835c7e', '8685c166-2407-5a45-b27f-c9722fb83b91', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'diagnostic flow', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 071.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:71", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 71, "point_category": "Diagnostic", "point_concept": "Diagnostic", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:12:09.409075+00:00'),
  ('94185511-f498-5ea5-8228-9087b47b60fb', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '52ee4d1e-9dcb-5a26-b060-cab16d9c8dbc', '1657ab2f-b453-54d2-b0ae-6b1a38964d12', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 071.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:71", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 71, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:12:09.409075+00:00'),
  ('61e1481a-db12-51ba-8779-853f2ca53bf2', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', 'c8eae306-0e68-5f82-b374-4a3ed336387b', 'ab3e85da-78a6-5bc6-b9c4-e23f52cae15e', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 071.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:71", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 71, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:12:09.409075+00:00'),
  ('48a48b34-f2dd-51f9-8d79-7369f718bfb2', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', '1d521098-789f-5ddd-8015-e21198fbe177', '0c481170-7e5f-5a2c-9aed-441ea4140786', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 071.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:71", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 71, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:12:09.409075+00:00'),
  ('155ee73b-ea64-5e2f-a4c8-40cd676200fa', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', 'f3ab53ca-0e34-5ac8-95dc-4f095dd08c05', '75847390-7877-5451-ba1c-eeb69249b4e6', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 071.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:71", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 71, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:12:09.409075+00:00'),
  ('8df9f84f-0b5e-5286-96e0-e99758837234', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', 'd14e7d71-0ab8-5bf4-b066-194754ae079f', 'd233e3d3-8cf1-5927-984a-1af791d2798c', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 071.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:71", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 71, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:12:09.409075+00:00'),
  ('a7ce88e3-e58b-550a-8b9f-a351b34b0bce', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e585f891-e90d-5ca8-b54e-ac13fc20d724', 'f11ac886-8dd9-58ac-b221-55ec2cc822d5', '589b6717-06f7-5be4-acc2-0587c4270de3', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 071.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:71", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 71, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:12:09.409075+00:00')
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

select public.refresh_public_card_relationships('e585f891-e90d-5ca8-b54e-ac13fc20d724'::uuid);
