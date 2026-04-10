-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('ebb905be-499b-5dc2-9581-5b1c227830ee', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '/seed/2026-04-10/2026-04-10T05-33-38-096627+00-00/ee-tarek-exam-hints-2019-page-074/source.png', 'complete', 'Propylene glycol used as solvent in Diazepam injection.', 10, 10, '2026-04-10T05:33:38.096627+00:00', '2026-04-10T05:33:38.096627+00:00', 'published')
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
  ('42378b76-3050-5fc2-b719-05724eacef5e', 'ebb905be-499b-5dc2-9581-5b1c227830ee', 'Light and temperature affect drug stability = Physical incompatibility Drug components interact and precipitate = Chemical incompatibility', 'General', 'Drug', 0, 1, '2026-04-10T05:33:38.096627+00:00'),
  ('8a4cd391-6613-5669-8f9a-fc355a8efcde', 'ebb905be-499b-5dc2-9581-5b1c227830ee', 'Spray is the fastest dosage form.', 'Diagnostic', 'Diagnostic', 1, 1, '2026-04-10T05:33:38.096627+00:00'),
  ('e0bdba2b-989f-5bad-a96c-45a3180a7eed', 'ebb905be-499b-5dc2-9581-5b1c227830ee', 'Metabisulfite: used as preservative, disinfectant and antioxidant. In parenteral formulation used as antioxidant', 'General', 'Other', 2, 1, '2026-04-10T05:33:38.096627+00:00'),
  ('4fbcb891-240d-5a05-b322-ea56fd0222a9', 'ebb905be-499b-5dc2-9581-5b1c227830ee', 'Particle size of internal phase affect the physical stability of oil-in-water emulsion.', 'General', 'Other', 3, 1, '2026-04-10T05:33:38.096627+00:00'),
  ('32b1706b-e10f-5925-b743-e7dd45f84cfb', 'ebb905be-499b-5dc2-9581-5b1c227830ee', 'Eutectic temperature: lowest melting temperature.', 'General', 'Other', 4, 1, '2026-04-10T05:33:38.096627+00:00'),
  ('f8a27399-7e7c-588d-bde7-6bcbc8a5bcea', 'ebb905be-499b-5dc2-9581-5b1c227830ee', 'Benzyl alcohol: used as preservative.', 'General', 'Other', 5, 1, '2026-04-10T05:33:38.096627+00:00'),
  ('92053cea-d12a-5fc7-9d53-ac053401c031', 'ebb905be-499b-5dc2-9581-5b1c227830ee', 'Surfactant: added to formulation to solubilize lipophilic active ingredients and also they could solubilized lipids in stratum corneum.', 'General', 'Other', 6, 1, '2026-04-10T05:33:38.096627+00:00'),
  ('185bbf84-7b4b-5fae-bf89-4381624e9960', 'ebb905be-499b-5dc2-9581-5b1c227830ee', 'Any suspension: shake well before use.', 'General', 'Other', 7, 1, '2026-04-10T05:33:38.096627+00:00'),
  ('964ca5bd-7ed8-5a0e-8de9-0cb14f4165b5', 'ebb905be-499b-5dc2-9581-5b1c227830ee', 'Isotonicicty is measured by depression in freezing point. Biotechnology/ Recombinant Colony Stimulating factors', 'Diagnostic', 'Diagnostic', 8, 1, '2026-04-10T05:33:38.096627+00:00'),
  ('18d15c9f-8430-53b1-a65b-8d24f36c48ea', 'ebb905be-499b-5dc2-9581-5b1c227830ee', 'Pegfilgrastim/Filgrastim: Recombinant Granulocyte colony stimulating factor, stimulate production of white blood cells. Used to treat neutropenia, chemotherapy induced neutropenia.', 'General', 'Mechanism', 9, 1, '2026-04-10T05:33:38.096627+00:00')
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
  ('0efb9b94-8f9c-52f3-bf32-d56e6f3219e1', '42378b76-3050-5fc2-b719-05724eacef5e', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '/seed/2026-04-10/2026-04-10T05-33-38-096627+00-00/ee-tarek-exam-hints-2019-page-074/point-01.png', 'Light and temperature affect drug stability = Physical incompatibility Drug components interact and precipitate = Chemical incompatibility', 0, 'complete', 'published', '2026-04-10T05:33:38.096627+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:33:38.096627+00:00'),
  ('64898018-1ea1-5635-8d99-5092b6f9355e', '8a4cd391-6613-5669-8f9a-fc355a8efcde', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '/seed/2026-04-10/2026-04-10T05-33-38-096627+00-00/ee-tarek-exam-hints-2019-page-074/point-02.png', 'Spray is the fastest dosage form.', 1, 'complete', 'published', '2026-04-10T05:33:38.096627+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'diagnostic flow', null, '2026-04-10T05:33:38.096627+00:00'),
  ('face438d-a6e5-52bf-b715-10d1baa09b7a', 'e0bdba2b-989f-5bad-a96c-45a3180a7eed', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '/seed/2026-04-10/2026-04-10T05-33-38-096627+00-00/ee-tarek-exam-hints-2019-page-074/point-03.png', 'Metabisulfite', 2, 'complete', 'published', '2026-04-10T05:33:38.096627+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:33:38.096627+00:00'),
  ('ea47e504-6f28-5eb2-818d-47e72b2fdefa', '4fbcb891-240d-5a05-b322-ea56fd0222a9', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '/seed/2026-04-10/2026-04-10T05-33-38-096627+00-00/ee-tarek-exam-hints-2019-page-074/point-04.png', 'Particle size of internal phase affect the physical stability of oil-in-water emulsion.', 3, 'complete', 'published', '2026-04-10T05:33:38.096627+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:33:38.096627+00:00'),
  ('21129390-32de-5e8a-bca8-5a34c6521dcb', '32b1706b-e10f-5925-b743-e7dd45f84cfb', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '/seed/2026-04-10/2026-04-10T05-33-38-096627+00-00/ee-tarek-exam-hints-2019-page-074/point-05.png', 'Eutectic temperature', 4, 'complete', 'published', '2026-04-10T05:33:38.096627+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:33:38.096627+00:00'),
  ('36bfee75-2d94-593d-ac67-bf1455059afa', 'f8a27399-7e7c-588d-bde7-6bcbc8a5bcea', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '/seed/2026-04-10/2026-04-10T05-33-38-096627+00-00/ee-tarek-exam-hints-2019-page-074/point-06.png', 'Benzyl alcohol', 5, 'complete', 'published', '2026-04-10T05:33:38.096627+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:33:38.096627+00:00'),
  ('e47f55a1-787a-5090-a8b6-b89248dbf5cc', '92053cea-d12a-5fc7-9d53-ac053401c031', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '/seed/2026-04-10/2026-04-10T05-33-38-096627+00-00/ee-tarek-exam-hints-2019-page-074/point-07.png', 'Surfactant', 6, 'complete', 'published', '2026-04-10T05:33:38.096627+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:33:38.096627+00:00'),
  ('244211af-5b91-52b3-a4b7-c2dad85ab725', '185bbf84-7b4b-5fae-bf89-4381624e9960', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '/seed/2026-04-10/2026-04-10T05-33-38-096627+00-00/ee-tarek-exam-hints-2019-page-074/point-08.png', 'Any suspension', 7, 'complete', 'published', '2026-04-10T05:33:38.096627+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T05:33:38.096627+00:00'),
  ('ddb541e1-076f-537b-b3e3-7f3877368ad0', '964ca5bd-7ed8-5a0e-8de9-0cb14f4165b5', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '/seed/2026-04-10/2026-04-10T05-33-38-096627+00-00/ee-tarek-exam-hints-2019-page-074/point-09.png', 'Isotonicicty is measured by depression in freezing point. Biotechnology/ Recombinant Colony Stimulating factors', 8, 'complete', 'published', '2026-04-10T05:33:38.096627+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'diagnostic flow', null, '2026-04-10T05:33:38.096627+00:00'),
  ('3e6c9a8e-9528-577c-bbb1-a4def64ffe3a', '18d15c9f-8430-53b1-a65b-8d24f36c48ea', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '/seed/2026-04-10/2026-04-10T05-33-38-096627+00-00/ee-tarek-exam-hints-2019-page-074/point-10.png', 'Pegfilgrastim/Filgrastim', 9, 'complete', 'published', '2026-04-10T05:33:38.096627+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'mechanism board', null, '2026-04-10T05:33:38.096627+00:00')
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
  ('4939f121-a266-5850-87cf-4998451499eb', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '0efb9b94-8f9c-52f3-bf32-d56e6f3219e1', '42378b76-3050-5fc2-b719-05724eacef5e', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 074.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:74", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 74, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:33:38.096627+00:00'),
  ('8f9b1bde-19af-5368-af18-4ca059cd1760', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '64898018-1ea1-5635-8d99-5092b6f9355e', '8a4cd391-6613-5669-8f9a-fc355a8efcde', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'diagnostic flow', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 074.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:74", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 74, "point_category": "Diagnostic", "point_concept": "Diagnostic", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:33:38.096627+00:00'),
  ('0800706b-d0a1-5c0c-ba6a-e7826e94a65c', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ebb905be-499b-5dc2-9581-5b1c227830ee', 'face438d-a6e5-52bf-b715-10d1baa09b7a', 'e0bdba2b-989f-5bad-a96c-45a3180a7eed', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 074.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:74", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 74, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:33:38.096627+00:00'),
  ('311821ad-ccbf-5044-9529-903dc8333a33', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ebb905be-499b-5dc2-9581-5b1c227830ee', 'ea47e504-6f28-5eb2-818d-47e72b2fdefa', '4fbcb891-240d-5a05-b322-ea56fd0222a9', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 074.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:74", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 74, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:33:38.096627+00:00'),
  ('d1e18f68-3cd9-5f08-87b6-7f48bee627c2', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '21129390-32de-5e8a-bca8-5a34c6521dcb', '32b1706b-e10f-5925-b743-e7dd45f84cfb', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 074.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:74", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 74, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:33:38.096627+00:00'),
  ('b4cfb9ee-fdb8-588a-844e-15294a83fee7', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '36bfee75-2d94-593d-ac67-bf1455059afa', 'f8a27399-7e7c-588d-bde7-6bcbc8a5bcea', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 074.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:74", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 74, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:33:38.096627+00:00'),
  ('fcb29a53-8cdd-5506-bc5b-a4410b9aa5c8', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ebb905be-499b-5dc2-9581-5b1c227830ee', 'e47f55a1-787a-5090-a8b6-b89248dbf5cc', '92053cea-d12a-5fc7-9d53-ac053401c031', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 074.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:74", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 74, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:33:38.096627+00:00'),
  ('ad833930-f8e8-58d5-9daa-a6a716dc920d', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '244211af-5b91-52b3-a4b7-c2dad85ab725', '185bbf84-7b4b-5fae-bf89-4381624e9960', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 074.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:74", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 74, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:33:38.096627+00:00'),
  ('c14f9af3-5852-5435-8fa6-0a6dd7088a6c', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ebb905be-499b-5dc2-9581-5b1c227830ee', 'ddb541e1-076f-537b-b3e3-7f3877368ad0', '964ca5bd-7ed8-5a0e-8de9-0cb14f4165b5', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'diagnostic flow', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 074.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:74", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 74, "point_category": "Diagnostic", "point_concept": "Diagnostic", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:33:38.096627+00:00'),
  ('9a81420b-a057-58ff-8925-4cb13d7b2502', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'ebb905be-499b-5dc2-9581-5b1c227830ee', '3e6c9a8e-9528-577c-bbb1-a4def64ffe3a', '18d15c9f-8430-53b1-a65b-8d24f36c48ea', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'mechanism board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 074.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:74", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 74, "point_category": "General", "point_concept": "Mechanism", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T05:33:38.096627+00:00')
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

select public.refresh_public_card_relationships('ebb905be-499b-5dc2-9581-5b1c227830ee'::uuid);
