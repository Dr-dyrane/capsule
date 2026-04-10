-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-53-43-683355+00-00/source.png', 'complete', 'Lupus (SLE) caused by “HIPPP MCQ”? (Hydralazine (vasodilator), INH (isoniazid), Phenytoin,', 10, 10, '2026-04-10T06:58:21.267740+00:00', '2026-04-10T06:58:21.267740+00:00', 'published')
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
  ('b85b4ffa-580f-5921-8418-52f1482ebe16', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', 'procainamide, penicillamine, methyldopa, chlorpromazine and quinidine.', 'General', 'Other', 0, 1, '2026-04-10T06:58:21.267740+00:00'),
  ('cdf29f3d-0cb2-51f8-ae1c-e19b8076b970', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', 'Hydralazine used to treat HTN, SE: fluid retention.', 'General', 'Other', 1, 1, '2026-04-10T06:58:21.267740+00:00'),
  ('861e57e4-e09f-5b0d-88a4-709f5fac3d90', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', 'Steven Johnson Syndrome and Toxic Epidermal Necrolysis caused by medications (SASPAN): Sulfonamides (sulfa drugs), Allopurinol, Penicillin, AED, NSAID.', 'General', 'Disease', 2, 1, '2026-04-10T06:58:21.267740+00:00'),
  ('909bde8a-d8c4-5bb4-837c-29452f5f160f', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '• Most Serious SE of Oral contraceptives: Thrombotic events.', 'General', 'Other', 3, 1, '2026-04-10T06:58:21.267740+00:00'),
  ('58a048b4-8604-5838-bd7c-fc4957013e7c', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', 'Isotretinoin SE: teratogenic, IBS, photosensitivity, depression, suicide thoughts, hypertriglyceridemia, pseudotumor cerebri.', 'General', 'Other', 4, 1, '2026-04-10T06:58:21.267740+00:00'),
  ('558e2bf6-380e-5f87-95db-c1dc9ea59407', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', 'Salicylate (ASA overdose) intoxication:', 'General', 'Other', 5, 1, '2026-04-10T06:58:21.267740+00:00'),
  ('d5c40acd-18ea-582b-a60f-ac93ff8a79e8', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', 'first 12 hours: respiratory alkalosis + alkaluria', 'General', 'Other', 6, 1, '2026-04-10T06:58:21.267740+00:00'),
  ('b201483b-9497-547e-af32-20dc2fcaf8c3', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '12-24 hours: Respiratory alkalosis + Aciduria.', 'General', 'Other', 7, 1, '2026-04-10T06:58:21.267740+00:00'),
  ('d647dca0-4ec7-5a05-b95c-670e468b9b06', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '24 hours or 4-6 hours in children: dehydration + hypokalemia + metabolic acidosis', 'General', 'Other', 8, 1, '2026-04-10T06:58:21.267740+00:00'),
  ('b8cd6bfc-1499-59c2-b7c8-9601ce7fd668', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', 'Prolonged use of topical decongestants (phenylephrine, xylometazoline) cause Rhinitis Medicamentosa (rebound congestion).', 'General', 'Other', 9, 1, '2026-04-10T06:58:21.267740+00:00')
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
  ('d0443fe0-41f2-57df-92eb-2dce3838ec05', 'b85b4ffa-580f-5921-8418-52f1482ebe16', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-53-43-683355+00-00/ee-tarek-exam-hints-2019-page-076/point-01.png', 'procainamide, penicillamine, methyldopa, chlorpromazine and quinidine.', 0, 'complete', 'published', '2026-04-10T06:58:21.267740+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:58:21.267740+00:00'),
  ('5cea2783-a181-51c5-b390-2b79ef342260', 'cdf29f3d-0cb2-51f8-ae1c-e19b8076b970', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-53-43-683355+00-00/ee-tarek-exam-hints-2019-page-076/point-02.png', 'Hydralazine used to treat HTN, SE', 1, 'complete', 'published', '2026-04-10T06:58:21.267740+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:58:21.267740+00:00'),
  ('eeab0ff9-f316-5808-87fc-dcb993c50728', '861e57e4-e09f-5b0d-88a4-709f5fac3d90', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-53-43-683355+00-00/ee-tarek-exam-hints-2019-page-076/point-03.png', 'Steven Johnson Syndrome and Toxic Epidermal Necrolysis caused by medications (SASPAN)', 2, 'complete', 'published', '2026-04-10T06:58:21.267740+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:58:21.267740+00:00'),
  ('4690e864-32cf-56ae-899e-28cbd7fc80df', '909bde8a-d8c4-5bb4-837c-29452f5f160f', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-53-43-683355+00-00/ee-tarek-exam-hints-2019-page-076/point-04.png', '• Most Serious SE of Oral contraceptives', 3, 'complete', 'published', '2026-04-10T06:58:21.267740+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:58:21.267740+00:00'),
  ('3c51e654-d8c7-5a52-8c8f-74bb7452d2ae', '58a048b4-8604-5838-bd7c-fc4957013e7c', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-53-43-683355+00-00/ee-tarek-exam-hints-2019-page-076/point-05.png', 'Isotretinoin SE', 4, 'complete', 'published', '2026-04-10T06:58:21.267740+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:58:21.267740+00:00'),
  ('deb26002-ac5d-571a-b862-3d7b6f7f6074', '558e2bf6-380e-5f87-95db-c1dc9ea59407', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-53-43-683355+00-00/ee-tarek-exam-hints-2019-page-076/point-06.png', 'Salicylate (ASA overdose) intoxication', 5, 'complete', 'published', '2026-04-10T06:58:21.267740+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:58:21.267740+00:00'),
  ('e052fe46-8cb1-567f-83bd-53b621cb35c4', 'd5c40acd-18ea-582b-a60f-ac93ff8a79e8', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-53-43-683355+00-00/ee-tarek-exam-hints-2019-page-076/point-07.png', 'first 12 hours', 6, 'complete', 'published', '2026-04-10T06:58:21.267740+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:58:21.267740+00:00'),
  ('72213b12-214d-5438-9fc8-313d4234e998', 'b201483b-9497-547e-af32-20dc2fcaf8c3', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-53-43-683355+00-00/ee-tarek-exam-hints-2019-page-076/point-08.png', '12-24 hours', 7, 'complete', 'published', '2026-04-10T06:58:21.267740+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:58:21.267740+00:00'),
  ('a7391c42-821f-5afd-8c60-481d385be1cd', 'd647dca0-4ec7-5a05-b95c-670e468b9b06', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-53-43-683355+00-00/ee-tarek-exam-hints-2019-page-076/point-09.png', '24 hours or 4-6 hours in children', 8, 'complete', 'published', '2026-04-10T06:58:21.267740+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:58:21.267740+00:00'),
  ('bb0840a7-f584-55c0-9ef5-877b08c721ce', 'b8cd6bfc-1499-59c2-b7c8-9601ce7fd668', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-53-43-683355+00-00/ee-tarek-exam-hints-2019-page-076/point-10.png', 'Prolonged use of topical decongestants (phenylephrine, xylometazoline) cause Rhinitis Medicamentosa (rebound congestion).', 9, 'complete', 'published', '2026-04-10T06:58:21.267740+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:58:21.267740+00:00')
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
  ('36dba5db-7eca-5eea-83f7-4fbb54f7165c', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', 'd0443fe0-41f2-57df-92eb-2dce3838ec05', 'b85b4ffa-580f-5921-8418-52f1482ebe16', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 076.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:76", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 76, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:58:21.267740+00:00'),
  ('65ce74eb-5403-5eea-8c6d-68074426e541', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '5cea2783-a181-51c5-b390-2b79ef342260', 'cdf29f3d-0cb2-51f8-ae1c-e19b8076b970', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 076.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:76", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 76, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:58:21.267740+00:00'),
  ('eede5d65-ea78-5a35-9ba9-ec222b9fc4f3', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', 'eeab0ff9-f316-5808-87fc-dcb993c50728', '861e57e4-e09f-5b0d-88a4-709f5fac3d90', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 076.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:76", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 76, "point_category": "General", "point_concept": "Disease", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:58:21.267740+00:00'),
  ('8c28ec90-395a-55e6-9e54-d86eb59bb124', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '4690e864-32cf-56ae-899e-28cbd7fc80df', '909bde8a-d8c4-5bb4-837c-29452f5f160f', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 076.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:76", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 76, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:58:21.267740+00:00'),
  ('e2b17f4c-9dd4-556e-a788-c85362d461d0', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '3c51e654-d8c7-5a52-8c8f-74bb7452d2ae', '58a048b4-8604-5838-bd7c-fc4957013e7c', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 076.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:76", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 76, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:58:21.267740+00:00'),
  ('5a762bc9-8a29-5b44-87ed-29ec8c3ea1bb', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', 'deb26002-ac5d-571a-b862-3d7b6f7f6074', '558e2bf6-380e-5f87-95db-c1dc9ea59407', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 076.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:76", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 76, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:58:21.267740+00:00'),
  ('11f81d62-3625-5741-9efe-6bda03bc9a58', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', 'e052fe46-8cb1-567f-83bd-53b621cb35c4', 'd5c40acd-18ea-582b-a60f-ac93ff8a79e8', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 076.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:76", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 76, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:58:21.267740+00:00'),
  ('508d8d58-eb5f-55f7-8abb-ad43e5df1e18', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', '72213b12-214d-5438-9fc8-313d4234e998', 'b201483b-9497-547e-af32-20dc2fcaf8c3', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 076.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:76", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 76, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:58:21.267740+00:00'),
  ('0fbe1eed-e8c3-51dc-b36f-b71b2db79b16', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', 'a7391c42-821f-5afd-8c60-481d385be1cd', 'd647dca0-4ec7-5a05-b95c-670e468b9b06', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 076.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:76", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 76, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:58:21.267740+00:00'),
  ('7ceea400-2d60-5778-adc6-0c804b7f1fbb', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60', 'bb0840a7-f584-55c0-9ef5-877b08c721ce', 'b8cd6bfc-1499-59c2-b7c8-9601ce7fd668', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 076.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:76", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 76, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:58:21.267740+00:00')
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

select public.refresh_public_card_relationships('ee8b12a9-b4ec-5d56-b8ff-b543d5b5dd60'::uuid);
