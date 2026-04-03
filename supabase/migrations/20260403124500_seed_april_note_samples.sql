-- Seed tested April 3 note samples for Dr Dyrane without storing image blobs in Postgres.
-- Assets are repo-backed under public/seed/2026-04-03 and treated as direct URLs by the app.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('0c96002c-48e3-5e0b-961a-a6274a1abd5a', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-03/notes/note-1-source.jpeg', 'complete', 'The notes cover key aspects of celiac disease, immune system components, and vaccination guidelines, including specific details about flu vaccines and their administration.', 9, 9, '2026-04-03T09:35:40.109Z', '2026-04-03T09:40:40.109Z', 'published'),
  ('0cebd413-85c7-5fe7-a8a9-47d0c913c660', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-03/notes/note-2-source.jpeg', 'complete', 'The document covers autoimmune diseases and their treatments, focusing on rheumatoid arthritis, psoriasis, multiple sclerosis, and systemic lupus erythematosus (SLE). It highlights drug regimens, side effects, and management strategies.', 8, 8, '2026-04-03T09:45:40.109Z', '2026-04-03T09:50:40.109Z', 'published')
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
  ('56f0cc51-a77c-5ac1-bdd1-f63100fa96e5', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', 'Celiac disease is an immune disease where gluten damages the small intestine.', 'Pathophysiology', 'Disease', 0, 1, '2026-04-03T09:35:40.109Z'),
  ('97b5b8e3-f9d3-5114-ad5f-828ce4583819', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', 'MHC I is expressed on all nucleated cells and presents antigens to CD8 T cells.', 'Immunology', 'Mechanism', 1, 1, '2026-04-03T09:35:40.109Z'),
  ('c51708e1-cc57-5ffe-89f6-ed6c9a1bfdcb', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', 'MHC II is expressed on APCs and presents antigens to CD4 T cells.', 'Immunology', 'Mechanism', 2, 1, '2026-04-03T09:35:40.109Z'),
  ('cb4c916c-4a16-51da-8340-f9e787227e0e', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', 'Passive immunity involves the transfer of antibodies from one person to another.', 'Immunology', 'Mechanism', 3, 1, '2026-04-03T09:35:40.109Z'),
  ('4f090f60-b7e3-5b0e-bc63-1b9b43d44b0e', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', 'Natural Killer cells destroy infected cells and tumor cells.', 'Immunology', 'Mechanism', 4, 1, '2026-04-03T09:35:40.109Z'),
  ('ffda9ca6-11cf-5d37-bbd2-571953984e05', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', 'Live attenuated vaccines are more effective than inactivated vaccines but should be avoided in specific groups.', 'Vaccination', 'Regimen', 5, 1, '2026-04-03T09:35:40.109Z'),
  ('b6837720-5ef9-5277-8e43-da194de43a7f', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', 'MMR vaccine is given at age 1 year with a booster at age 5-6 years.', 'Vaccination', 'Regimen', 6, 1, '2026-04-03T09:35:40.109Z'),
  ('12cca37d-f450-5ed5-a134-3bb236e503b9', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', 'Flu immunization season is October to mid-November.', 'Vaccination', 'Regimen', 7, 1, '2026-04-03T09:35:40.109Z'),
  ('2da1c837-8f94-59e0-8df2-764871098b26', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', 'Flu vaccines are killed vaccines except for the flu intranasal mist.', 'Vaccination', 'Regimen', 8, 1, '2026-04-03T09:35:40.109Z'),
  ('a774cef6-eb8e-5e7b-ae16-5827026ba4dc', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', 'Methotrexate (MTX) is used for rheumatoid arthritis at 7.5 to 25 mg per week for at least 3 months, with folic acid 5 mg/week to counteract side effects.', 'Rheumatoid arthritis', 'Drug', 0, 1, '2026-04-03T09:45:40.109Z'),
  ('6fd465b2-541c-5afd-8e03-a3b7123bb1f1', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', 'Biologics like Infliximab and Adalimumab are used for rheumatoid arthritis but not routinely due to cost and side effects.', 'Rheumatoid arthritis', 'Drug', 1, 1, '2026-04-03T09:45:40.109Z'),
  ('972d2993-0fab-54d9-a6a0-04b41b438ef1', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', 'Topical corticosteroids and calcineurin inhibitors like tacrolimus are used for psoriasis treatment.', 'Psoriasis treatment', 'Drug', 2, 1, '2026-04-03T09:45:40.109Z'),
  ('fffff0e7-25e0-58c8-afd1-cff2e6e7aa02', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', 'Systemic therapy for psoriasis includes methotrexate, cyclosporine, and biologics like adalimumab and secukinumab.', 'Psoriasis treatment', 'Regimen', 3, 1, '2026-04-03T09:45:40.109Z'),
  ('78f81b22-5dc2-55a4-b49f-fb775671d22f', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', 'Multiple sclerosis involves immune system attacks on CNS myelin, leading to neural damage.', 'Multiple Sclerosis', 'Disease', 4, 1, '2026-04-03T09:45:40.109Z'),
  ('6ede6561-2c0e-5c47-9eda-b4ae02273024', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', 'Hydroxychloroquine is a first-line antimalarial for SLE, with eye toxicity as a side effect.', 'SLE', 'Drug', 5, 1, '2026-04-03T09:45:40.109Z'),
  ('d8310eb7-645f-5f89-87e9-7230507daace', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', 'Immunosuppressants like Mycophenolate, MTX, and Azathioprine are used in SLE treatment.', 'SLE', 'Drug', 6, 1, '2026-04-03T09:45:40.109Z'),
  ('ff650dd0-af0c-556f-b04a-781b022241ee', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', 'B cell inhibitors such as Rituximab and Belimumab are used in SLE management.', 'SLE', 'Drug', 7, 1, '2026-04-03T09:45:40.109Z')
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
  ('66848edb-c26f-5fb8-802d-d9a03125dad8', '56f0cc51-a77c-5ac1-bdd1-f63100fa96e5', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '/seed/2026-04-03/cards/note-1/card-01.png', 'Celiac disease is an immune disease where gluten damages the small intestine.', 0, 'complete', 'published', '2026-04-03T09:40:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'cascade', null, '2026-04-03T09:40:40.109Z'),
  ('8992a69c-48f6-5fe7-9a94-be1a8fe79196', '97b5b8e3-f9d3-5114-ad5f-828ce4583819', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '/seed/2026-04-03/cards/note-1/card-02.png', 'MHC I is expressed on all nucleated cells and presents antigens to CD8 T cells.', 1, 'complete', 'published', '2026-04-03T09:40:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism-board', null, '2026-04-03T09:40:40.109Z'),
  ('ebe8e780-e604-5c47-af8c-0008210a6c3f', 'c51708e1-cc57-5ffe-89f6-ed6c9a1bfdcb', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '/seed/2026-04-03/cards/note-1/card-03.png', 'MHC II is expressed on APCs and presents antigens to CD4 T cells.', 2, 'complete', 'published', '2026-04-03T09:40:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism-board', null, '2026-04-03T09:40:40.109Z'),
  ('b30ad615-bea6-5c6c-95b7-57a0d1663fdd', 'cb4c916c-4a16-51da-8340-f9e787227e0e', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '/seed/2026-04-03/cards/note-1/card-04.png', 'Passive immunity involves the transfer of antibodies from one person to another.', 3, 'complete', 'published', '2026-04-03T09:40:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism-board', null, '2026-04-03T09:40:40.109Z'),
  ('79c4d7c8-8785-55e2-88ab-421c125c9965', '4f090f60-b7e3-5b0e-bc63-1b9b43d44b0e', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '/seed/2026-04-03/cards/note-1/card-05.png', 'Natural Killer cells destroy infected cells and tumor cells.', 4, 'complete', 'published', '2026-04-03T09:40:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism-board', null, '2026-04-03T09:40:40.109Z'),
  ('88fe2f07-0184-5d7b-89fe-1ca9404cb812', 'ffda9ca6-11cf-5d37-bbd2-571953984e05', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '/seed/2026-04-03/cards/note-1/card-06.png', 'Live attenuated vaccines are more effective than inactivated vaccines but should be avoided in specific groups.', 5, 'complete', 'published', '2026-04-03T09:40:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'comparison-board', null, '2026-04-03T09:40:40.109Z'),
  ('bc67ae53-61df-5615-bad7-345584e9578e', 'b6837720-5ef9-5277-8e43-da194de43a7f', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '/seed/2026-04-03/cards/note-1/card-07.png', 'MMR vaccine is given at age 1 year with a booster at age 5-6 years.', 6, 'complete', 'published', '2026-04-03T09:40:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism-board', null, '2026-04-03T09:40:40.109Z'),
  ('84441740-d9b0-5428-883c-3fd588d6541b', '12cca37d-f450-5ed5-a134-3bb236e503b9', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '/seed/2026-04-03/cards/note-1/card-08.png', 'Flu immunization season is October to mid-November.', 7, 'complete', 'published', '2026-04-03T09:40:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism-board', null, '2026-04-03T09:40:40.109Z'),
  ('0ddcb71a-d53e-59fc-a55b-9c916a06c235', '2da1c837-8f94-59e0-8df2-764871098b26', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '/seed/2026-04-03/cards/note-1/card-09.png', 'Flu vaccines are killed vaccines except for the flu intranasal mist.', 8, 'complete', 'published', '2026-04-03T09:40:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism-board', null, '2026-04-03T09:40:40.109Z'),
  ('5ff1e0ac-dd5b-596e-a6c3-bfb6091da9e5', 'a774cef6-eb8e-5e7b-ae16-5827026ba4dc', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '/seed/2026-04-03/cards/note-2/card-01.png', 'Methotrexate (MTX) is used for rheumatoid arthritis at 7.5 to 25 mg per week for at least 3 months, with folic acid 5 mg/week to counteract side effects.', 0, 'complete', 'published', '2026-04-03T09:50:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'timeline', null, '2026-04-03T09:50:40.109Z'),
  ('0589f919-d2e9-5dfb-a9f4-167f7b1ab1e0', '6fd465b2-541c-5afd-8e03-a3b7123bb1f1', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '/seed/2026-04-03/cards/note-2/card-02.png', 'Biologics like Infliximab and Adalimumab are used for rheumatoid arthritis but not routinely due to cost and side effects.', 1, 'complete', 'published', '2026-04-03T09:50:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism-board', null, '2026-04-03T09:50:40.109Z'),
  ('b2fdc828-4590-5e63-aa84-c0e50bf2dd50', '972d2993-0fab-54d9-a6a0-04b41b438ef1', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '/seed/2026-04-03/cards/note-2/card-03.png', 'Topical corticosteroids and calcineurin inhibitors like tacrolimus are used for psoriasis treatment.', 2, 'complete', 'published', '2026-04-03T09:50:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism-board', null, '2026-04-03T09:50:40.109Z'),
  ('2756aa2b-e0f8-5e0c-ae74-a0dc75e49fbc', 'fffff0e7-25e0-58c8-afd1-cff2e6e7aa02', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '/seed/2026-04-03/cards/note-2/card-04.png', 'Systemic therapy for psoriasis includes methotrexate, cyclosporine, and biologics like adalimumab and secukinumab.', 3, 'complete', 'published', '2026-04-03T09:50:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism-board', null, '2026-04-03T09:50:40.109Z'),
  ('9752ee9d-f650-5dcd-b0ca-2ba0f16d257b', '78f81b22-5dc2-55a4-b49f-fb775671d22f', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '/seed/2026-04-03/cards/note-2/card-05.png', 'Multiple sclerosis involves immune system attacks on CNS myelin, leading to neural damage.', 4, 'complete', 'published', '2026-04-03T09:50:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism-board', null, '2026-04-03T09:50:40.109Z'),
  ('7f88965c-c65e-5d00-80b9-4589b088f029', '6ede6561-2c0e-5c47-9eda-b4ae02273024', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '/seed/2026-04-03/cards/note-2/card-06.png', 'Hydroxychloroquine is a first-line antimalarial for SLE, with eye toxicity as a side effect.', 5, 'complete', 'published', '2026-04-03T09:50:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism-board', null, '2026-04-03T09:50:40.109Z'),
  ('857550ce-e908-5453-9f43-bde2dfb6c76a', 'd8310eb7-645f-5f89-87e9-7230507daace', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '/seed/2026-04-03/cards/note-2/card-07.png', 'Immunosuppressants like Mycophenolate, MTX, and Azathioprine are used in SLE treatment.', 6, 'complete', 'published', '2026-04-03T09:50:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism-board', null, '2026-04-03T09:50:40.109Z'),
  ('956b9355-5619-5760-a838-6e5942e69209', 'ff650dd0-af0c-556f-b04a-781b022241ee', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '/seed/2026-04-03/cards/note-2/card-08.png', 'B cell inhibitors such as Rituximab and Belimumab are used in SLE management.', 7, 'complete', 'published', '2026-04-03T09:50:40.109Z', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism-board', null, '2026-04-03T09:50:40.109Z')
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
  ('3093b633-28ba-5e36-94f6-6979f00fabef', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '66848edb-c26f-5fb8-802d-d9a03125dad8', '56f0cc51-a77c-5ac1-bdd1-f63100fa96e5', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'cascade', 'cascade', 'level-2', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-1","point_category":"Pathophysiology","point_concept":"Disease","image_only_seed":true}'::jsonb, '2026-04-03T09:40:40.109Z'),
  ('2042055d-502d-595c-955b-91c56e8841d7', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '8992a69c-48f6-5fe7-9a94-be1a8fe79196', '97b5b8e3-f9d3-5114-ad5f-828ce4583819', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'planner-default', 'mechanism-board', 'level-3', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-1","point_category":"Immunology","point_concept":"Mechanism","image_only_seed":true}'::jsonb, '2026-04-03T09:40:40.109Z'),
  ('a0d066be-7499-5536-bf6c-ca85c07ea61a', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', 'ebe8e780-e604-5c47-af8c-0008210a6c3f', 'c51708e1-cc57-5ffe-89f6-ed6c9a1bfdcb', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'planner-default', 'mechanism-board', 'level-3', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-1","point_category":"Immunology","point_concept":"Mechanism","image_only_seed":true}'::jsonb, '2026-04-03T09:40:40.109Z'),
  ('14608c7f-8b6d-566b-b1d5-8c5374167720', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', 'b30ad615-bea6-5c6c-95b7-57a0d1663fdd', 'cb4c916c-4a16-51da-8340-f9e787227e0e', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'planner-default', 'mechanism-board', 'level-3', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-1","point_category":"Immunology","point_concept":"Mechanism","image_only_seed":true}'::jsonb, '2026-04-03T09:40:40.109Z'),
  ('734f4ad5-2402-59e2-9d10-8ba5e5c7b8e1', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '79c4d7c8-8785-55e2-88ab-421c125c9965', '4f090f60-b7e3-5b0e-bc63-1b9b43d44b0e', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'planner-default', 'mechanism-board', 'level-3', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-1","point_category":"Immunology","point_concept":"Mechanism","image_only_seed":true}'::jsonb, '2026-04-03T09:40:40.109Z'),
  ('1f374f8c-e653-56fb-bdc8-ceb347eacb63', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '88fe2f07-0184-5d7b-89fe-1ca9404cb812', 'ffda9ca6-11cf-5d37-bbd2-571953984e05', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'comparison', 'comparison-board', 'level-1', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-1","point_category":"Vaccination","point_concept":"Regimen","image_only_seed":true}'::jsonb, '2026-04-03T09:40:40.109Z'),
  ('4ca1504c-ba79-58e3-a1a6-88ca18e32295', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', 'bc67ae53-61df-5615-bad7-345584e9578e', 'b6837720-5ef9-5277-8e43-da194de43a7f', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'planner-default', 'mechanism-board', 'level-3', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-1","point_category":"Vaccination","point_concept":"Regimen","image_only_seed":true}'::jsonb, '2026-04-03T09:40:40.109Z'),
  ('6848024c-59a8-55ae-b3e7-60793f516a61', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '84441740-d9b0-5428-883c-3fd588d6541b', '12cca37d-f450-5ed5-a134-3bb236e503b9', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'planner-default', 'mechanism-board', 'level-3', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-1","point_category":"Vaccination","point_concept":"Regimen","image_only_seed":true}'::jsonb, '2026-04-03T09:40:40.109Z'),
  ('860d075e-8515-5c16-8859-1e9a972f3518', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0c96002c-48e3-5e0b-961a-a6274a1abd5a', '0ddcb71a-d53e-59fc-a55b-9c916a06c235', '2da1c837-8f94-59e0-8df2-764871098b26', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'planner-default', 'mechanism-board', 'level-3', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-1","point_category":"Vaccination","point_concept":"Regimen","image_only_seed":true}'::jsonb, '2026-04-03T09:40:40.109Z'),
  ('6700eb40-cb14-5da6-8985-7853af471c0a', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '5ff1e0ac-dd5b-596e-a6c3-bfb6091da9e5', 'a774cef6-eb8e-5e7b-ae16-5827026ba4dc', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'timeline', 'timeline', 'level-1', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-2","point_category":"Rheumatoid arthritis","point_concept":"Drug","image_only_seed":true}'::jsonb, '2026-04-03T09:50:40.109Z'),
  ('b523c064-6b6a-51cd-b174-1b79f98239a6', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '0589f919-d2e9-5dfb-a9f4-167f7b1ab1e0', '6fd465b2-541c-5afd-8e03-a3b7123bb1f1', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'planner-default', 'mechanism-board', 'level-3', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-2","point_category":"Rheumatoid arthritis","point_concept":"Drug","image_only_seed":true}'::jsonb, '2026-04-03T09:50:40.109Z'),
  ('5b9f740f-b2f7-54b0-ae97-822fe402dff5', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', 'b2fdc828-4590-5e63-aa84-c0e50bf2dd50', '972d2993-0fab-54d9-a6a0-04b41b438ef1', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'planner-default', 'mechanism-board', 'level-3', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-2","point_category":"Psoriasis treatment","point_concept":"Drug","image_only_seed":true}'::jsonb, '2026-04-03T09:50:40.109Z'),
  ('be7c4d2b-8e72-5fde-8932-9043781c5e61', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '2756aa2b-e0f8-5e0c-ae74-a0dc75e49fbc', 'fffff0e7-25e0-58c8-afd1-cff2e6e7aa02', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'planner-default', 'mechanism-board', 'level-3', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-2","point_category":"Psoriasis treatment","point_concept":"Regimen","image_only_seed":true}'::jsonb, '2026-04-03T09:50:40.109Z'),
  ('6cfdc3ff-262b-5bcd-baed-0f7ee900a6fa', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '9752ee9d-f650-5dcd-b0ca-2ba0f16d257b', '78f81b22-5dc2-55a4-b49f-fb775671d22f', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'planner-default', 'mechanism-board', 'level-3', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-2","point_category":"Multiple Sclerosis","point_concept":"Disease","image_only_seed":true}'::jsonb, '2026-04-03T09:50:40.109Z'),
  ('a8ac90fe-39c4-558d-87b4-693608e83ca8', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '7f88965c-c65e-5d00-80b9-4589b088f029', '6ede6561-2c0e-5c47-9eda-b4ae02273024', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'planner-default', 'mechanism-board', 'level-3', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-2","point_category":"SLE","point_concept":"Drug","image_only_seed":true}'::jsonb, '2026-04-03T09:50:40.109Z'),
  ('561cc7f7-7184-53aa-b608-4536096f33b6', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '857550ce-e908-5453-9f43-bde2dfb6c76a', 'd8310eb7-645f-5f89-87e9-7230507daace', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'planner-default', 'mechanism-board', 'level-3', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-2","point_category":"SLE","point_concept":"Drug","image_only_seed":true}'::jsonb, '2026-04-03T09:50:40.109Z'),
  ('b916194f-87d1-5bfd-9d53-3f30eb0622d6', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '0cebd413-85c7-5fe7-a8a9-47d0c913c660', '956b9355-5619-5760-a838-6e5942e69209', 'ff650dd0-af0c-556f-b04a-781b022241ee', 'seed', 'gpt-image-1.5', 'high', '1536x1024', 'planner-default', 'mechanism-board', 'level-3', 'capsule-2026-04-02-v2', 'openai-2026-04-03', 0.200000, null, null, null, null, null, null, null, '{"imported":true,"note":"note-2","point_category":"SLE","point_concept":"Drug","image_only_seed":true}'::jsonb, '2026-04-03T09:50:40.109Z')
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
  metadata = excluded.metadata,
  created_at = excluded.created_at;
