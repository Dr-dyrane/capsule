-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('dcb039e3-d279-5314-a4c5-a5708531cdca', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-58-21-799281+00-00/source.png', 'complete', 'Phenytoin side effect (PHENYTOIN): P- p450 inducer, H- hirsutism, E- enlargement of gums, N', 10, 10, '2026-04-10T07:02:44.148508+00:00', '2026-04-10T07:02:44.148508+00:00', 'published')
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
  ('9e25567e-530c-50fd-817a-f5e7a783f423', 'dcb039e3-d279-5314-a4c5-a5708531cdca', 'nystagmus, Y- yellow skin (sjs), T- teratogenic, O- osteomalesia, I- interferes folic absorption, N', 'General', 'Other', 0, 1, '2026-04-10T07:02:44.148508+00:00'),
  ('435bb9b5-7d12-550d-bb4c-9e0f73913298', 'dcb039e3-d279-5314-a4c5-a5708531cdca', 'PPI side effects: diarrhea, hypomagnesemia, decrease vitamin B12, bone fractures.', 'General', 'Other', 1, 1, '2026-04-10T07:02:44.148508+00:00'),
  ('bd38a129-374b-5c21-a11c-55ce5a7962b5', 'dcb039e3-d279-5314-a4c5-a5708531cdca', 'NSAIDs increase water and Na retention; thus, increase BP. Aspirin doesn’t increase risk of HTN. Ibuprofen increase risk of HTN and stroke. Diclofenac increase risk of stroke. Naproxen and Celecoxib doesn’t increase the risk of HTN or stroke.', 'General', 'Other', 2, 1, '2026-04-10T07:02:44.148508+00:00'),
  ('5f1e26d1-5fc7-5415-bcf9-2a3c9fc7311e', 'dcb039e3-d279-5314-a4c5-a5708531cdca', 'Vancomycin: SE: Red man syndrome (red rash on neck and face) Chloramphenicol SE: Grey baby syndrome (grey skin, vomiting) Amiodarone SE: Grey man syndrome (blue-grey pigmentation) Warfarin SE: purple toe syndrome (purple lesion in toe)', 'General', 'Disease', 3, 1, '2026-04-10T07:02:44.148508+00:00'),
  ('443858e6-acee-5b6a-9b6b-4341eaec4ab8', 'dcb039e3-d279-5314-a4c5-a5708531cdca', 'Acetaminophen can cause acute hepatic failure.', 'General', 'Timeline', 4, 1, '2026-04-10T07:02:44.148508+00:00'),
  ('43675b30-2030-5227-9ed0-6c36f323f73f', 'dcb039e3-d279-5314-a4c5-a5708531cdca', 'Toxic nephropathy drugs: penicillin, cephalosporins, Thiazides, furosemide, NSAIDs, Rifampicin, cisplatin, cyclosporine, penicillamine.', 'General', 'Drug', 5, 1, '2026-04-10T07:02:44.148508+00:00'),
  ('42f83371-69f3-5161-81c8-53e5ab529501', 'dcb039e3-d279-5314-a4c5-a5708531cdca', 'Macrolides (erythromycin, clarithromycin): SE: hepatitis, QT prolongation, potent CYP inhibitor except Azithromycin. (not related to nephrotoxicity) Teratogenic drugs:', 'Pathophysiology', 'Mechanism', 6, 1, '2026-04-10T07:02:44.148508+00:00'),
  ('eff73964-505e-596a-a5d3-952ed4ec5831', 'dcb039e3-d279-5314-a4c5-a5708531cdca', 'Rubella could cause fetal defect and deafness. CMV could cause deafness.', 'General', 'Other', 7, 1, '2026-04-10T07:02:44.148508+00:00'),
  ('898387fc-9d5a-5691-910b-7634fff3bbcb', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '• Drug interactions/ Contraindication: Enzyme inducers/inhibitors', 'Pathophysiology', 'Mechanism', 8, 1, '2026-04-10T07:02:44.148508+00:00'),
  ('0c8d167e-56af-5f50-a4e3-bef2f641f358', 'dcb039e3-d279-5314-a4c5-a5708531cdca', 'CYP 3A4 inducers AED (Carbamazepine, Phenobarbital, St. John’s Wort, Phenytoin) decrease serum conc. of Oral contraceptives. A solution could be using progestin depot injection or use intrauterine device.', 'General', 'Other', 9, 1, '2026-04-10T07:02:44.148508+00:00')
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
  ('5785a6be-b70a-592e-9f6b-eef7e8ca3ddf', '9e25567e-530c-50fd-817a-f5e7a783f423', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-58-21-799281+00-00/ee-tarek-exam-hints-2019-page-077/point-01.png', 'nystagmus, Y- yellow skin (sjs), T- teratogenic, O- osteomalesia, I- interferes folic absorption, N', 0, 'complete', 'published', '2026-04-10T07:02:44.148508+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:02:44.148508+00:00'),
  ('4b6c7f1c-9951-595f-8a45-f1d2d099cf5a', '435bb9b5-7d12-550d-bb4c-9e0f73913298', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-58-21-799281+00-00/ee-tarek-exam-hints-2019-page-077/point-02.png', 'PPI side effects', 1, 'complete', 'published', '2026-04-10T07:02:44.148508+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:02:44.148508+00:00'),
  ('90ef5f0a-6dfd-57f6-9d98-448412861d5c', 'bd38a129-374b-5c21-a11c-55ce5a7962b5', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-58-21-799281+00-00/ee-tarek-exam-hints-2019-page-077/point-03.png', 'NSAIDs increase water and Na retention; thus, increase BP. Aspirin doesn’t increase risk of HTN. Ibuprofen increase risk of HTN and stroke. Diclofenac increase risk of stroke. Naproxen and Celecoxib doesn’t increase the risk of HTN or stroke.', 2, 'complete', 'published', '2026-04-10T07:02:44.148508+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:02:44.148508+00:00'),
  ('9da75989-d3b2-51c5-85b0-ed58f7273197', '5f1e26d1-5fc7-5415-bcf9-2a3c9fc7311e', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-58-21-799281+00-00/ee-tarek-exam-hints-2019-page-077/point-04.png', 'Vancomycin', 3, 'complete', 'published', '2026-04-10T07:02:44.148508+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:02:44.148508+00:00'),
  ('2ae37d23-11b6-5be5-9c5d-b2b2e0d79234', '443858e6-acee-5b6a-9b6b-4341eaec4ab8', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-58-21-799281+00-00/ee-tarek-exam-hints-2019-page-077/point-05.png', 'Acetaminophen can cause acute hepatic failure.', 4, 'complete', 'published', '2026-04-10T07:02:44.148508+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'timeline strip', null, '2026-04-10T07:02:44.148508+00:00'),
  ('45af03c1-8d4a-5e41-bebc-3b64a180e6e8', '43675b30-2030-5227-9ed0-6c36f323f73f', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-58-21-799281+00-00/ee-tarek-exam-hints-2019-page-077/point-06.png', 'Toxic nephropathy drugs', 5, 'complete', 'published', '2026-04-10T07:02:44.148508+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:02:44.148508+00:00'),
  ('7a4e31c7-42eb-53f6-8b68-cb0cf78f50c4', '42f83371-69f3-5161-81c8-53e5ab529501', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-58-21-799281+00-00/ee-tarek-exam-hints-2019-page-077/point-07.png', 'Macrolides (erythromycin, clarithromycin)', 6, 'complete', 'published', '2026-04-10T07:02:44.148508+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism board', null, '2026-04-10T07:02:44.148508+00:00'),
  ('a57b29c6-0747-5559-9722-43eadfa894d5', 'eff73964-505e-596a-a5d3-952ed4ec5831', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-58-21-799281+00-00/ee-tarek-exam-hints-2019-page-077/point-08.png', 'Rubella could cause fetal defect and deafness. CMV could cause deafness.', 7, 'complete', 'published', '2026-04-10T07:02:44.148508+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:02:44.148508+00:00'),
  ('b6d9dbd0-cebe-52f3-ad29-d6c58d972eea', '898387fc-9d5a-5691-910b-7634fff3bbcb', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-58-21-799281+00-00/ee-tarek-exam-hints-2019-page-077/point-09.png', '• Drug interactions/ Contraindication', 8, 'complete', 'published', '2026-04-10T07:02:44.148508+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism board', null, '2026-04-10T07:02:44.148508+00:00'),
  ('80ba1e4b-3d55-5ec4-a9b7-d77271ff349f', '0c8d167e-56af-5f50-a4e3-bef2f641f358', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T06-58-21-799281+00-00/ee-tarek-exam-hints-2019-page-077/point-10.png', 'CYP 3A4 inducers AED (Carbamazepine, Phenobarbital, St. John’s Wort, Phenytoin) decrease serum conc. of Oral contraceptives. A solution could be using progestin depot injection or use intrauterine device.', 9, 'complete', 'published', '2026-04-10T07:02:44.148508+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:02:44.148508+00:00')
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
  ('cf30a335-cf3f-50b7-9ffd-0a8fc682597b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '5785a6be-b70a-592e-9f6b-eef7e8ca3ddf', '9e25567e-530c-50fd-817a-f5e7a783f423', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 077.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:77", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 77, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:02:44.148508+00:00'),
  ('4fa25a87-b204-5034-b196-f447d793b8f1', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '4b6c7f1c-9951-595f-8a45-f1d2d099cf5a', '435bb9b5-7d12-550d-bb4c-9e0f73913298', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 077.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:77", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 77, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:02:44.148508+00:00'),
  ('e0772a37-22d9-5522-b691-dc4dab9c4dd3', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '90ef5f0a-6dfd-57f6-9d98-448412861d5c', 'bd38a129-374b-5c21-a11c-55ce5a7962b5', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 077.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:77", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 77, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:02:44.148508+00:00'),
  ('dd8d5505-7316-56a8-a19b-0f760501f516', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '9da75989-d3b2-51c5-85b0-ed58f7273197', '5f1e26d1-5fc7-5415-bcf9-2a3c9fc7311e', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 077.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:77", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 77, "point_category": "General", "point_concept": "Disease", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:02:44.148508+00:00'),
  ('f7f41baa-e462-5a0c-a8fe-46c99688716d', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '2ae37d23-11b6-5be5-9c5d-b2b2e0d79234', '443858e6-acee-5b6a-9b6b-4341eaec4ab8', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'timeline strip', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 077.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:77", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 77, "point_category": "General", "point_concept": "Timeline", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:02:44.148508+00:00'),
  ('b2c3a46e-beab-59bd-ae42-7ceac9d2120e', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '45af03c1-8d4a-5e41-bebc-3b64a180e6e8', '43675b30-2030-5227-9ed0-6c36f323f73f', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 077.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:77", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 77, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:02:44.148508+00:00'),
  ('846ccad3-0b8e-5b7e-bf49-db62ce6a7eda', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '7a4e31c7-42eb-53f6-8b68-cb0cf78f50c4', '42f83371-69f3-5161-81c8-53e5ab529501', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'mechanism board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 077.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:77", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 77, "point_category": "Pathophysiology", "point_concept": "Mechanism", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:02:44.148508+00:00'),
  ('511a2a50-412a-5694-bbde-176de7e5f020', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'dcb039e3-d279-5314-a4c5-a5708531cdca', 'a57b29c6-0747-5559-9722-43eadfa894d5', 'eff73964-505e-596a-a5d3-952ed4ec5831', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 077.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:77", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 77, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:02:44.148508+00:00'),
  ('3bd8a1fb-8e20-5c08-a67e-9b4658b265fb', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'dcb039e3-d279-5314-a4c5-a5708531cdca', 'b6d9dbd0-cebe-52f3-ad29-d6c58d972eea', '898387fc-9d5a-5691-910b-7634fff3bbcb', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'mechanism board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 077.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:77", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 77, "point_category": "Pathophysiology", "point_concept": "Mechanism", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:02:44.148508+00:00'),
  ('3c068915-7caf-5e90-8a26-1a7998a73949', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'dcb039e3-d279-5314-a4c5-a5708531cdca', '80ba1e4b-3d55-5ec4-a9b7-d77271ff349f', '0c8d167e-56af-5f50-a4e3-bef2f641f358', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 077.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:77", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 77, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:02:44.148508+00:00')
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

select public.refresh_public_card_relationships('dcb039e3-d279-5314-a4c5-a5708531cdca'::uuid);
