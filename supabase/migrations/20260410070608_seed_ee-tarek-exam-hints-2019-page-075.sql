-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('e3a85a74-ddb2-5016-bddf-cc70e985869b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-49-12-076204+00-00/source.png', 'complete', 'Histone: alkaline (positive charged) proteins', 10, 10, '2026-04-10T06:53:43.321373+00:00', '2026-04-10T06:53:43.321373+00:00', 'published')
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
  ('4fbdb0a2-429e-5925-8b91-dd4b1b90dd5d', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', 'Chromatin: repeating units of nucleosome.', 'General', 'Other', 0, 1, '2026-04-10T06:53:43.321373+00:00'),
  ('7d0cee21-0bac-524d-80da-8b24efc70187', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', 'DNA transcribed to mRNA which is translated to Protein.', 'General', 'Other', 1, 1, '2026-04-10T06:53:43.321373+00:00'),
  ('60ad8cdb-2608-54df-94a2-237814c5839e', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', 'Anti sense DNA strand: is strand that transcribed to mRNA. Therefore, mRNA will be similar to sense strand, except uracil (U) instead of thymine (T) base.', 'General', 'Other', 2, 1, '2026-04-10T06:53:43.321373+00:00'),
  ('984dc4b3-591d-537e-9ce2-cabf3e9b3b01', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '• SDS-Gel electrophoresis: used to separate proteins. Sodium Dodecyl Sulfate (SDS): denature protein (lose its configuration)', 'General', 'Other', 3, 1, '2026-04-10T06:53:43.321373+00:00'),
  ('d89bad89-1555-5af7-98de-33c94b88909d', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', 'Gel Electrophoresis: method of separation of proteins, DNA, RNA and protein according to charge/molecular size.', 'General', 'Other', 4, 1, '2026-04-10T06:53:43.321373+00:00'),
  ('0a6e7681-c0e6-5b0d-9128-3fe435ea4514', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', 'Polyacrylamide Gel Electrophoresis (PAGE): small pores. Separate proteins and DNA', 'General', 'Other', 5, 1, '2026-04-10T06:53:43.321373+00:00'),
  ('90b9de9c-3566-5a7c-a6da-c93fadddb835', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', 'Agarose Gel Electrophoresis (AGE): large pores. Separate DNA.', 'General', 'Other', 6, 1, '2026-04-10T06:53:43.321373+00:00'),
  ('addd6a46-1648-5703-ac99-bba3e7339dcd', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', 'Centrifugation: separation of organelles/macromolecules based on size affected by gravity.', 'General', 'Other', 7, 1, '2026-04-10T06:53:43.321373+00:00'),
  ('56f95ab6-ecd9-565b-aa1a-07741ebcca68', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', 'Mass spectrometer: measure mass of charged particles. Use Mass/ion charge ratio.', 'Diagnostic', 'Diagnostic', 8, 1, '2026-04-10T06:53:43.321373+00:00'),
  ('302ce90b-12e9-59ee-b95c-edb46dded171', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', 'Electron ionization: result well established fragmentation pattern that is useful in identification of unknown.', 'General', 'Other', 9, 1, '2026-04-10T06:53:43.321373+00:00')
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
  ('7ded99c8-ab43-5429-8342-8fdaf1c49c2e', '4fbdb0a2-429e-5925-8b91-dd4b1b90dd5d', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-49-12-076204+00-00/ee-tarek-exam-hints-2019-page-075/point-01.png', 'Chromatin', 0, 'complete', 'published', '2026-04-10T06:53:43.321373+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:53:43.321373+00:00'),
  ('d52cfac1-1473-5a19-838f-b9d34c91b844', '7d0cee21-0bac-524d-80da-8b24efc70187', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-49-12-076204+00-00/ee-tarek-exam-hints-2019-page-075/point-02.png', 'DNA transcribed to mRNA which is translated to Protein.', 1, 'complete', 'published', '2026-04-10T06:53:43.321373+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:53:43.321373+00:00'),
  ('88b4a3fb-9adc-5f65-baf1-ac70594f898f', '60ad8cdb-2608-54df-94a2-237814c5839e', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-49-12-076204+00-00/ee-tarek-exam-hints-2019-page-075/point-03.png', 'Anti sense DNA strand', 2, 'complete', 'published', '2026-04-10T06:53:43.321373+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:53:43.321373+00:00'),
  ('913a4c9f-1b55-522f-9a60-861383a05442', '984dc4b3-591d-537e-9ce2-cabf3e9b3b01', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-49-12-076204+00-00/ee-tarek-exam-hints-2019-page-075/point-04.png', '• SDS-Gel electrophoresis', 3, 'complete', 'published', '2026-04-10T06:53:43.321373+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:53:43.321373+00:00'),
  ('b9b53861-018d-5d6d-ad78-81859137b95c', 'd89bad89-1555-5af7-98de-33c94b88909d', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-49-12-076204+00-00/ee-tarek-exam-hints-2019-page-075/point-05.png', 'Gel Electrophoresis', 4, 'complete', 'published', '2026-04-10T06:53:43.321373+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:53:43.321373+00:00'),
  ('49c66c4d-29d5-5254-99aa-5df0859f7e0c', '0a6e7681-c0e6-5b0d-9128-3fe435ea4514', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-49-12-076204+00-00/ee-tarek-exam-hints-2019-page-075/point-06.png', 'Polyacrylamide Gel Electrophoresis (PAGE)', 5, 'complete', 'published', '2026-04-10T06:53:43.321373+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:53:43.321373+00:00'),
  ('d15a4657-8043-5f14-8327-a5568912bd18', '90b9de9c-3566-5a7c-a6da-c93fadddb835', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-49-12-076204+00-00/ee-tarek-exam-hints-2019-page-075/point-07.png', 'Agarose Gel Electrophoresis (AGE)', 6, 'complete', 'published', '2026-04-10T06:53:43.321373+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:53:43.321373+00:00'),
  ('f4a6f843-1df5-53d1-990d-a0158b2a461f', 'addd6a46-1648-5703-ac99-bba3e7339dcd', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-49-12-076204+00-00/ee-tarek-exam-hints-2019-page-075/point-08.png', 'Centrifugation', 7, 'complete', 'published', '2026-04-10T06:53:43.321373+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:53:43.321373+00:00'),
  ('91dcb3b7-d8ba-5c71-8774-899ff0924481', '56f95ab6-ecd9-565b-aa1a-07741ebcca68', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-49-12-076204+00-00/ee-tarek-exam-hints-2019-page-075/point-09.png', 'Mass spectrometer', 8, 'complete', 'published', '2026-04-10T06:53:43.321373+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'diagnostic flow', null, '2026-04-10T06:53:43.321373+00:00'),
  ('7f61fad8-de86-5788-a1c9-6d4f2c74ab36', '302ce90b-12e9-59ee-b95c-edb46dded171', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-49-12-076204+00-00/ee-tarek-exam-hints-2019-page-075/point-10.png', 'Electron ionization', 9, 'complete', 'published', '2026-04-10T06:53:43.321373+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T06:53:43.321373+00:00')
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
  ('7daf3c51-2da8-5ee5-a651-1cdacf5c6e11', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '7ded99c8-ab43-5429-8342-8fdaf1c49c2e', '4fbdb0a2-429e-5925-8b91-dd4b1b90dd5d', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 075.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:75", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 75, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:53:43.321373+00:00'),
  ('79a2f0d5-edd6-573a-8be2-eb71dd06be15', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', 'd52cfac1-1473-5a19-838f-b9d34c91b844', '7d0cee21-0bac-524d-80da-8b24efc70187', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 075.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:75", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 75, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:53:43.321373+00:00'),
  ('4e548ce3-ca89-5c2f-b612-93251601bbad', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '88b4a3fb-9adc-5f65-baf1-ac70594f898f', '60ad8cdb-2608-54df-94a2-237814c5839e', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 075.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:75", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 75, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:53:43.321373+00:00'),
  ('7b338fc5-d976-5e39-97f7-d57713ba82cf', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '913a4c9f-1b55-522f-9a60-861383a05442', '984dc4b3-591d-537e-9ce2-cabf3e9b3b01', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 075.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:75", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 75, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:53:43.321373+00:00'),
  ('a5af214b-81b1-5648-a87e-9559def4d70e', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', 'b9b53861-018d-5d6d-ad78-81859137b95c', 'd89bad89-1555-5af7-98de-33c94b88909d', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 075.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:75", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 75, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:53:43.321373+00:00'),
  ('41ec4673-ddab-5b3f-8173-da6c4c5bf569', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '49c66c4d-29d5-5254-99aa-5df0859f7e0c', '0a6e7681-c0e6-5b0d-9128-3fe435ea4514', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 075.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:75", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 75, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:53:43.321373+00:00'),
  ('d203f555-8e86-5829-a7b9-609c8684201a', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', 'd15a4657-8043-5f14-8327-a5568912bd18', '90b9de9c-3566-5a7c-a6da-c93fadddb835', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 075.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:75", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 75, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:53:43.321373+00:00'),
  ('1adb5055-e1af-53f1-9996-226c95ceb22b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', 'f4a6f843-1df5-53d1-990d-a0158b2a461f', 'addd6a46-1648-5703-ac99-bba3e7339dcd', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 075.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:75", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 75, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:53:43.321373+00:00'),
  ('9159bc3d-bc0c-58df-8173-944b7a86f000', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '91dcb3b7-d8ba-5c71-8774-899ff0924481', '56f95ab6-ecd9-565b-aa1a-07741ebcca68', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'diagnostic flow', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 075.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:75", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 75, "point_category": "Diagnostic", "point_concept": "Diagnostic", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:53:43.321373+00:00'),
  ('4d97d19f-2b19-5587-a22b-b32c4acf62bc', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'e3a85a74-ddb2-5016-bddf-cc70e985869b', '7f61fad8-de86-5788-a1c9-6d4f2c74ab36', '302ce90b-12e9-59ee-b95c-edb46dded171', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 075.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:75", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 75, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T06:53:43.321373+00:00')
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

select public.refresh_public_card_relationships('e3a85a74-ddb2-5016-bddf-cc70e985869b'::uuid);
