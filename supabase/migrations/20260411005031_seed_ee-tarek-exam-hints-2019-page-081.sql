-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('040b4223-492c-5a9f-83b8-963acab24126', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-55-32-686658+00-00/source.png', 'complete', 'Page 81', 10, 10, '2026-04-10T21:03:05.236444+00:00', '2026-04-10T21:03:05.236444+00:00', 'published')
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
  ('ab9edb77-5b19-5765-be64-3f03b99a02de', '040b4223-492c-5a9f-83b8-963acab24126', 'Isomers: have same molecular formula', 'General', 'Other', 0, 1, '2026-04-10T21:03:05.236444+00:00'),
  ('a0239fc7-82ab-543e-86f4-418499045252', '040b4223-492c-5a9f-83b8-963acab24126', 'Constitutional isomers (structure isomers): same molecular formula + different connectivity', 'General', 'Other', 1, 1, '2026-04-10T21:03:05.236444+00:00'),
  ('fc84c4ed-d22c-5054-aeba-f3471edecc86', '040b4223-492c-5a9f-83b8-963acab24126', 'Conformational Isomers: isomers are identical by rotation around single bond', 'General', 'Other', 2, 1, '2026-04-10T21:03:05.236444+00:00'),
  ('b2c96448-7db2-5e5b-a00e-bbac24bf5689', '040b4223-492c-5a9f-83b8-963acab24126', 'Stereoisomers: same molecular formula + same connectivity + mirror image', 'General', 'Other', 3, 1, '2026-04-10T21:03:05.236444+00:00'),
  ('7dfdbea6-e913-57cb-93c3-33021d9ecebb', '040b4223-492c-5a9f-83b8-963acab24126', 'Diastereomers: Same molecular formula + same connectivity + not mirror image (more than 1 chiral center) subtype is Epimer: only one chiral center is different.', 'General', 'Other', 4, 1, '2026-04-10T21:03:05.236444+00:00'),
  ('9bbf51d2-cac1-52a5-83d3-cba6a1052f38', '040b4223-492c-5a9f-83b8-963acab24126', 'Geometric isomers: in one isomer two atoms or groups are on the same side of the plane of a double bond or ring (Cis), whereas in the other isomer they are on opposite sides (Trans). Herbal: • Foxgloves planet is the source of Digoxin. SE: blurred vision, small eye pupils, excessive urination, tremors, convulsions.', 'General', 'Other', 5, 1, '2026-04-10T21:03:05.236444+00:00'),
  ('d9c87339-71e5-5fb9-a588-a1f6a2416d18', '040b4223-492c-5a9f-83b8-963acab24126', 'Belladonna used for nausea, vomiting, motion sickness, nocturia, tremors and rigidity caused by Parkinson disease. SE: blurred vision, dry mouth, enlarged pupils, inability to urinate or sweat.', 'General', 'Disease', 6, 1, '2026-04-10T21:03:05.236444+00:00'),
  ('4257ef86-2fe4-53d0-bedf-f58395a2e12b', '040b4223-492c-5a9f-83b8-963acab24126', 'FeverFew used for migraine Prime rose: premenstrual cycle St. John Wort: antidepressant Saw palmetto: BPH Echniacea: common cold Garlic: Lipid levels. Ginkgo: increase memory Vincristine, Vinblastin: anticancer.', 'General', 'Other', 7, 1, '2026-04-10T21:03:05.236444+00:00'),
  ('9a16a3b5-3b98-5d96-a965-e23e4df179a5', '040b4223-492c-5a9f-83b8-963acab24126', 'Creatine Kinase: increase after heater attack, muscle injury (myopathy), drinking too much alcohol.', 'General', 'Other', 8, 1, '2026-04-10T21:03:05.236444+00:00'),
  ('db6a5655-9b46-5680-bbb6-d0d2a3682393', '040b4223-492c-5a9f-83b8-963acab24126', 'Creatinine level (blood): increase with impaired kidney function.', 'General', 'Other', 9, 1, '2026-04-10T21:03:05.236444+00:00')
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
  ('08fdfa9b-ad53-51b3-847b-30ce1a41aad3', 'ab9edb77-5b19-5765-be64-3f03b99a02de', '040b4223-492c-5a9f-83b8-963acab24126', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-55-32-686658+00-00/ee-tarek-exam-hints-2019-page-081/point-01.png', 'Isomers', 0, 'complete', 'published', '2026-04-10T21:03:05.236444+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:05.236444+00:00'),
  ('83708fcf-a243-5837-86c2-dd0384dba3fb', 'a0239fc7-82ab-543e-86f4-418499045252', '040b4223-492c-5a9f-83b8-963acab24126', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-55-32-686658+00-00/ee-tarek-exam-hints-2019-page-081/point-02.png', 'Constitutional isomers (structure isomers)', 1, 'complete', 'published', '2026-04-10T21:03:05.236444+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:05.236444+00:00'),
  ('b4083dbd-5e0d-5d8a-9f6d-a976462bc0b6', 'fc84c4ed-d22c-5054-aeba-f3471edecc86', '040b4223-492c-5a9f-83b8-963acab24126', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-55-32-686658+00-00/ee-tarek-exam-hints-2019-page-081/point-03.png', 'Conformational Isomers', 2, 'complete', 'published', '2026-04-10T21:03:05.236444+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:05.236444+00:00'),
  ('e994dbc4-43df-52ba-9418-cd95bbec8e6f', 'b2c96448-7db2-5e5b-a00e-bbac24bf5689', '040b4223-492c-5a9f-83b8-963acab24126', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-55-32-686658+00-00/ee-tarek-exam-hints-2019-page-081/point-04.png', 'Stereoisomers', 3, 'complete', 'published', '2026-04-10T21:03:05.236444+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:05.236444+00:00'),
  ('9ad25494-d1bd-5657-bd31-5c5f09e700d7', '7dfdbea6-e913-57cb-93c3-33021d9ecebb', '040b4223-492c-5a9f-83b8-963acab24126', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-55-32-686658+00-00/ee-tarek-exam-hints-2019-page-081/point-05.png', 'Diastereomers', 4, 'complete', 'published', '2026-04-10T21:03:05.236444+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:05.236444+00:00'),
  ('bd85c108-aa80-585e-a330-314be2a43311', '9bbf51d2-cac1-52a5-83d3-cba6a1052f38', '040b4223-492c-5a9f-83b8-963acab24126', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-55-32-686658+00-00/ee-tarek-exam-hints-2019-page-081/point-06.png', 'Geometric isomers', 5, 'complete', 'published', '2026-04-10T21:03:05.236444+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:05.236444+00:00'),
  ('b4a9c913-2ba9-57ff-a7d3-999b36a1d28d', 'd9c87339-71e5-5fb9-a588-a1f6a2416d18', '040b4223-492c-5a9f-83b8-963acab24126', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-55-32-686658+00-00/ee-tarek-exam-hints-2019-page-081/point-07.png', 'Belladonna used for nausea, vomiting, motion sickness, nocturia, tremors and rigidity caused by Parkinson disease. SE', 6, 'complete', 'published', '2026-04-10T21:03:05.236444+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:05.236444+00:00'),
  ('cffc0db4-56f7-5347-8ba3-17e20413cb72', '4257ef86-2fe4-53d0-bedf-f58395a2e12b', '040b4223-492c-5a9f-83b8-963acab24126', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-55-32-686658+00-00/ee-tarek-exam-hints-2019-page-081/point-08.png', 'FeverFew used for migraine Prime rose', 7, 'complete', 'published', '2026-04-10T21:03:05.236444+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:05.236444+00:00'),
  ('0a6ae170-6184-5064-9ffa-648f0eb9ac80', '9a16a3b5-3b98-5d96-a965-e23e4df179a5', '040b4223-492c-5a9f-83b8-963acab24126', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-55-32-686658+00-00/ee-tarek-exam-hints-2019-page-081/point-09.png', 'Creatine Kinase', 8, 'complete', 'published', '2026-04-10T21:03:05.236444+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:05.236444+00:00'),
  ('f8506f5d-a141-597f-a840-f9e0f613e7f3', 'db6a5655-9b46-5680-bbb6-d0d2a3682393', '040b4223-492c-5a9f-83b8-963acab24126', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T20-55-32-686658+00-00/ee-tarek-exam-hints-2019-page-081/point-10.png', 'Creatinine level (blood)', 9, 'complete', 'published', '2026-04-10T21:03:05.236444+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T21:03:05.236444+00:00')
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
  ('26c78f03-5aaa-53b4-832a-1ca6e924d045', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '040b4223-492c-5a9f-83b8-963acab24126', '08fdfa9b-ad53-51b3-847b-30ce1a41aad3', 'ab9edb77-5b19-5765-be64-3f03b99a02de', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 081.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:81", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 81, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:05.236444+00:00'),
  ('dcfb4131-2019-5d72-bcd9-37eaa5b4507e', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '040b4223-492c-5a9f-83b8-963acab24126', '83708fcf-a243-5837-86c2-dd0384dba3fb', 'a0239fc7-82ab-543e-86f4-418499045252', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 081.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:81", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 81, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:05.236444+00:00'),
  ('b9e23e90-0717-5d9d-9c1b-39049b436015', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '040b4223-492c-5a9f-83b8-963acab24126', 'b4083dbd-5e0d-5d8a-9f6d-a976462bc0b6', 'fc84c4ed-d22c-5054-aeba-f3471edecc86', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 081.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:81", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 81, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:05.236444+00:00'),
  ('e8d923e5-c58c-5e30-9d89-e7045cd594c2', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '040b4223-492c-5a9f-83b8-963acab24126', 'e994dbc4-43df-52ba-9418-cd95bbec8e6f', 'b2c96448-7db2-5e5b-a00e-bbac24bf5689', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 081.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:81", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 81, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:05.236444+00:00'),
  ('e26315c3-f231-5193-8fee-f6bba38bbcf9', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '040b4223-492c-5a9f-83b8-963acab24126', '9ad25494-d1bd-5657-bd31-5c5f09e700d7', '7dfdbea6-e913-57cb-93c3-33021d9ecebb', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 081.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:81", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 81, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:05.236444+00:00'),
  ('932a3727-d8e7-5c0a-ae68-c69eef80659d', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '040b4223-492c-5a9f-83b8-963acab24126', 'bd85c108-aa80-585e-a330-314be2a43311', '9bbf51d2-cac1-52a5-83d3-cba6a1052f38', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 081.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:81", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 81, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:05.236444+00:00'),
  ('4f10bf6a-c386-5fd9-bee8-2a68452bdee2', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '040b4223-492c-5a9f-83b8-963acab24126', 'b4a9c913-2ba9-57ff-a7d3-999b36a1d28d', 'd9c87339-71e5-5fb9-a588-a1f6a2416d18', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 081.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:81", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 81, "point_category": "General", "point_concept": "Disease", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:05.236444+00:00'),
  ('645a4d72-8ee1-539e-8282-846f5701870c', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '040b4223-492c-5a9f-83b8-963acab24126', 'cffc0db4-56f7-5347-8ba3-17e20413cb72', '4257ef86-2fe4-53d0-bedf-f58395a2e12b', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 081.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:81", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 81, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:05.236444+00:00'),
  ('9dc94ca4-202f-5762-84dc-936bd3747b6d', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '040b4223-492c-5a9f-83b8-963acab24126', '0a6ae170-6184-5064-9ffa-648f0eb9ac80', '9a16a3b5-3b98-5d96-a965-e23e4df179a5', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 081.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:81", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 81, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:05.236444+00:00'),
  ('13741881-b4f9-5e08-980b-841ac8f8ef7b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '040b4223-492c-5a9f-83b8-963acab24126', 'f8506f5d-a141-597f-a840-f9e0f613e7f3', 'db6a5655-9b46-5680-bbb6-d0d2a3682393', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 081.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:81", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 81, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T21:03:05.236444+00:00')
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

select public.refresh_public_card_relationships('040b4223-492c-5a9f-83b8-963acab24126'::uuid);
