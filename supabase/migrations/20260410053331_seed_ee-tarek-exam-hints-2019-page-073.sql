-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-10/2026-04-10T05-24-49-785254+00-00/ee-tarek-exam-hints-2019-page-073/source.png', 'complete', 'Special powders', 10, 10, '2026-04-10T05:24:49.785254+00:00', '2026-04-10T05:24:49.785254+00:00', 'published')
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
  ('22bbf87e-2ca5-57c7-8527-fa39271621df', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', 'Hygroscopic: substance absorb moisture from the air.', 'General', 'Other', 0, 1, '2026-04-10T05:24:49.785254+00:00'),
  ('937773ef-2c8a-5ee9-96b5-4df26cc5277d', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', 'Deliquescence: when hygroscopic material absorb moist form atmosphere till it dissolved in absorbed water and form solution.', 'General', 'Other', 1, 1, '2026-04-10T05:24:49.785254+00:00'),
  ('5f2293df-a970-5459-91bd-3c3a7f5462e2', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', 'Efflorescence: crystalline form liberate water and become powder.', 'General', 'Other', 2, 1, '2026-04-10T05:24:49.785254+00:00'),
  ('427137f0-104b-5f6d-bfbf-d66c8b1e5674', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', 'Effervescent: liberate Co2 with water Others', 'General', 'Other', 3, 1, '2026-04-10T05:24:49.785254+00:00'),
  ('7fab82d4-bcf2-52f9-9b93-f4be7a8ab8eb', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', 'PEGylation: attachment of PEG to protein, peptide or antibody, to reduce its immunogenicity and decrease its renal clearance; thus, prolong its circulation time.', 'General', 'Other', 4, 1, '2026-04-10T05:24:49.785254+00:00'),
  ('313df348-79a6-583e-acb8-b3d09b8d549a', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', 'Blister pack improve adherence for old patients.', 'General', 'Other', 5, 1, '2026-04-10T05:24:49.785254+00:00'),
  ('9b0695e2-c2ee-5f2d-b9b9-a87883fb47af', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', 'Preservatives should be in multi-dose injection but should NOT be included in Large Volume Parenteral', 'General', 'Other', 6, 1, '2026-04-10T05:24:49.785254+00:00'),
  ('ed6594bc-cf34-5d10-ba26-59cee0a8e235', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', 'Single dose vial: lack antimicrobial preservative.', 'General', 'Other', 7, 1, '2026-04-10T05:24:49.785254+00:00'),
  ('ce18f08e-56d3-57f6-a8c6-349d9ccda062', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', 'Multi dose vial: contain antimicrobial preservative.', 'General', 'Other', 8, 1, '2026-04-10T05:24:49.785254+00:00'),
  ('b710602a-8ec3-5f68-8ae7-eef871e46536', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', 'Micronization: a process of decreasing particles size. It increase its dissolution rate and efficacy.', 'General', 'Other', 9, 1, '2026-04-10T05:24:49.785254+00:00')
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
  ('c0e78b78-0155-5817-92c6-73678a28b608', '22bbf87e-2ca5-57c7-8527-fa39271621df', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '/seed/2026-04-10/2026-04-10T05-24-49-785254+00-00/ee-tarek-exam-hints-2019-page-073/point-01.png', 'Hygroscopic', 0, 'complete', 'published', '2026-04-10T05:24:49.785254+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:24:49.785254+00:00'),
  ('0c3ae047-4159-5de7-9876-0ceb8726ba16', '937773ef-2c8a-5ee9-96b5-4df26cc5277d', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '/seed/2026-04-10/2026-04-10T05-24-49-785254+00-00/ee-tarek-exam-hints-2019-page-073/point-02.png', 'Deliquescence', 1, 'complete', 'published', '2026-04-10T05:24:49.785254+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:24:49.785254+00:00'),
  ('06d0eaec-0060-59ac-96cb-324491573164', '5f2293df-a970-5459-91bd-3c3a7f5462e2', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '/seed/2026-04-10/2026-04-10T05-24-49-785254+00-00/ee-tarek-exam-hints-2019-page-073/point-03.png', 'Efflorescence', 2, 'complete', 'published', '2026-04-10T05:24:49.785254+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:24:49.785254+00:00'),
  ('2b86987c-06f6-5448-a01c-c08592cd250b', '427137f0-104b-5f6d-bfbf-d66c8b1e5674', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '/seed/2026-04-10/2026-04-10T05-24-49-785254+00-00/ee-tarek-exam-hints-2019-page-073/point-04.png', 'Effervescent', 3, 'complete', 'published', '2026-04-10T05:24:49.785254+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:24:49.785254+00:00'),
  ('a3d30a58-f8e9-5599-bf33-301aa7e8b365', '7fab82d4-bcf2-52f9-9b93-f4be7a8ab8eb', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '/seed/2026-04-10/2026-04-10T05-24-49-785254+00-00/ee-tarek-exam-hints-2019-page-073/point-05.png', 'PEGylation', 4, 'complete', 'published', '2026-04-10T05:24:49.785254+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:24:49.785254+00:00'),
  ('6adeebcb-2085-544b-9f4b-c800f81d2460', '313df348-79a6-583e-acb8-b3d09b8d549a', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '/seed/2026-04-10/2026-04-10T05-24-49-785254+00-00/ee-tarek-exam-hints-2019-page-073/point-06.png', 'Blister pack improve adherence for old patients.', 5, 'complete', 'published', '2026-04-10T05:24:49.785254+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:24:49.785254+00:00'),
  ('3ab5a1e6-375a-5b19-9aab-67ed59bd991b', '9b0695e2-c2ee-5f2d-b9b9-a87883fb47af', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '/seed/2026-04-10/2026-04-10T05-24-49-785254+00-00/ee-tarek-exam-hints-2019-page-073/point-07.png', 'Preservatives should be in multi-dose injection but should NOT be included in Large Volume Parenteral', 6, 'complete', 'published', '2026-04-10T05:24:49.785254+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:24:49.785254+00:00'),
  ('250a4966-569d-59c9-ad7c-83883801b1d2', 'ed6594bc-cf34-5d10-ba26-59cee0a8e235', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '/seed/2026-04-10/2026-04-10T05-24-49-785254+00-00/ee-tarek-exam-hints-2019-page-073/point-08.png', 'Single dose vial', 7, 'complete', 'published', '2026-04-10T05:24:49.785254+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:24:49.785254+00:00'),
  ('d60849a0-4a15-520c-acbe-fdfcb99f4f1e', 'ce18f08e-56d3-57f6-a8c6-349d9ccda062', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '/seed/2026-04-10/2026-04-10T05-24-49-785254+00-00/ee-tarek-exam-hints-2019-page-073/point-09.png', 'Multi dose vial', 8, 'complete', 'published', '2026-04-10T05:24:49.785254+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:24:49.785254+00:00'),
  ('bf037570-5579-5a9d-ac1d-7a0b9f7d77ed', 'b710602a-8ec3-5f68-8ae7-eef871e46536', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '/seed/2026-04-10/2026-04-10T05-24-49-785254+00-00/ee-tarek-exam-hints-2019-page-073/point-10.png', 'Micronization', 9, 'complete', 'published', '2026-04-10T05:24:49.785254+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:24:49.785254+00:00')
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
  ('be5eb521-ac01-5bb7-8aa4-ab0d93c33a56', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', 'c0e78b78-0155-5817-92c6-73678a28b608', '22bbf87e-2ca5-57c7-8527-fa39271621df', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 073.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:73", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 73, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:24:49.785254+00:00'),
  ('67cc6d0f-b878-5d0d-9595-b3788135325f', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '0c3ae047-4159-5de7-9876-0ceb8726ba16', '937773ef-2c8a-5ee9-96b5-4df26cc5277d', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 073.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:73", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 73, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:24:49.785254+00:00'),
  ('1871c308-af8a-5bc5-b000-b832b51bee75', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '06d0eaec-0060-59ac-96cb-324491573164', '5f2293df-a970-5459-91bd-3c3a7f5462e2', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 073.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:73", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 73, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:24:49.785254+00:00'),
  ('77322ac4-798c-5781-ab64-7823c1955aeb', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '2b86987c-06f6-5448-a01c-c08592cd250b', '427137f0-104b-5f6d-bfbf-d66c8b1e5674', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 073.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:73", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 73, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:24:49.785254+00:00'),
  ('79bcdf7c-5b72-57d8-bb2b-20c5fa55d760', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', 'a3d30a58-f8e9-5599-bf33-301aa7e8b365', '7fab82d4-bcf2-52f9-9b93-f4be7a8ab8eb', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 073.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:73", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 73, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:24:49.785254+00:00'),
  ('72eaf6b0-3916-5100-a4f2-5a5ed671dec5', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '6adeebcb-2085-544b-9f4b-c800f81d2460', '313df348-79a6-583e-acb8-b3d09b8d549a', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 073.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:73", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 73, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:24:49.785254+00:00'),
  ('3d4b6983-5f41-56d5-b261-ed07498ec7f3', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '3ab5a1e6-375a-5b19-9aab-67ed59bd991b', '9b0695e2-c2ee-5f2d-b9b9-a87883fb47af', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 073.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:73", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 73, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:24:49.785254+00:00'),
  ('1deab2c3-e7de-52f9-bd49-4309b3950a76', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', '250a4966-569d-59c9-ad7c-83883801b1d2', 'ed6594bc-cf34-5d10-ba26-59cee0a8e235', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 073.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:73", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 73, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:24:49.785254+00:00'),
  ('0f11800a-3e52-5abf-ad29-9d6c13ab906b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', 'd60849a0-4a15-520c-acbe-fdfcb99f4f1e', 'ce18f08e-56d3-57f6-a8c6-349d9ccda062', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 073.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:73", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 73, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:24:49.785254+00:00'),
  ('a4c1a054-286b-5308-9a47-5b71914123e4', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3ee4da6-1225-5040-a7db-dbb0a51cc25c', 'bf037570-5579-5a9d-ac1d-7a0b9f7d77ed', 'b710602a-8ec3-5f68-8ae7-eef871e46536', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 073.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:73", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 73, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:24:49.785254+00:00')
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

select public.refresh_public_card_relationships('e3ee4da6-1225-5040-a7db-dbb0a51cc25c'::uuid);
