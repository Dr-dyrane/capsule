-- Seed workshop note session for Dr Dyrane after full local completion.

insert into public.sessions
  (id, user_id, source_url, status, session_context, point_count, card_count, created_at, updated_at, visibility)
values
  ('047307d8-2d13-5f91-a148-05bf803715d7', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-10-06-926607+00-00/source.png', 'complete', 'Peginterferon: Contraindicated with Acute Hepatitis B Virus.', 10, 10, '2026-04-10T07:12:17.157751+00:00', '2026-04-10T07:12:17.157751+00:00', 'published')
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
  ('6efea5ef-f224-5489-839d-f6ad8be8ca17', '047307d8-2d13-5f91-a148-05bf803715d7', 'Avoid antacids with tetracycline, quinolone (ciprofloxacin, levofloxacin, moxifloxacin), Digoxin. Separate with 2 hours.', 'General', 'Other', 0, 1, '2026-04-10T07:12:17.157751+00:00'),
  ('f1d23e8a-5dc8-5767-a459-bf486caa3d83', '047307d8-2d13-5f91-a148-05bf803715d7', 'B2 agonist (Salbutamol, Salmeterol) could lead to hyperglycemia, so contraindicated with Diabetic pts.', 'Management', 'Management', 1, 1, '2026-04-10T07:12:17.157751+00:00'),
  ('5f646cf7-ef92-5689-b8fd-27d529817eab', '047307d8-2d13-5f91-a148-05bf803715d7', 'Contraindicated in Pregnancy: ASA', 'Management', 'Management', 2, 1, '2026-04-10T07:12:17.157751+00:00'),
  ('52728ccb-77f7-5800-8775-3c99f3003644', '047307d8-2d13-5f91-a148-05bf803715d7', 'Bismuth (anti diarrheal) decrease the anti-HTN effect of ACEI, ARBs and B-blocker.', 'General', 'Other', 3, 1, '2026-04-10T07:12:17.157751+00:00'),
  ('7dc15b51-9c06-5f69-aa16-f89b9fb6e580', '047307d8-2d13-5f91-a148-05bf803715d7', 'Breastfeeding contraindicated with: Codeine: serous side effects and lead to death of children.', 'Management', 'Management', 4, 1, '2026-04-10T07:12:17.157751+00:00'),
  ('ded5cd33-b4f9-5e93-aacd-f04160eb7ae3', '047307d8-2d13-5f91-a148-05bf803715d7', 'Meperidine: has neurotoxic metabolites.', 'General', 'Other', 5, 1, '2026-04-10T07:12:17.157751+00:00'),
  ('c6f21493-83ab-5744-a61e-5ecdd4f44fa4', '047307d8-2d13-5f91-a148-05bf803715d7', 'Codeine is converted by CYP2D6 to morphine; thus, its effect and toxicity affected by poor metabolizers and ultra-metabolizer. Therefore, its better to use morphine instead.', 'General', 'Other', 6, 1, '2026-04-10T07:12:17.157751+00:00'),
  ('727633a4-5224-52ce-893b-f4bee195acaf', '047307d8-2d13-5f91-a148-05bf803715d7', 'Corticosteroids injection contraindicated in Achilles tendonitis where risk rupture is highest.', 'Management', 'Management', 7, 1, '2026-04-10T07:12:17.157751+00:00'),
  ('172d2b3b-d943-592a-a46b-5ba5c1e7e38d', '047307d8-2d13-5f91-a148-05bf803715d7', 'Gabapentin and Pregabalin contraindicated with opioids due to risk of respiratory depression.', 'Management', 'Management', 8, 1, '2026-04-10T07:12:17.157751+00:00'),
  ('69120d01-6d6c-5c74-8731-b00a308d8b0e', '047307d8-2d13-5f91-a148-05bf803715d7', 'Renal patients: With Thrombus: avoid Heparin and OAC (Dabigataran, Apixaban, Rivaraxaban), but can use Warfarin.', 'General', 'Drug', 9, 1, '2026-04-10T07:12:17.157751+00:00')
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
  ('ffad8f9f-6a4c-58c6-9476-460d9ae069c0', '6efea5ef-f224-5489-839d-f6ad8be8ca17', '047307d8-2d13-5f91-a148-05bf803715d7', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-10-06-926607+00-00/ee-tarek-exam-hints-2019-page-078/point-01.png', 'Avoid antacids with tetracycline, quinolone (ciprofloxacin, levofloxacin, moxifloxacin), Digoxin. Separate with 2 hours.', 0, 'complete', 'published', '2026-04-10T07:12:17.157751+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:12:17.157751+00:00'),
  ('2b868979-7a24-5375-843c-ad965430d0a0', 'f1d23e8a-5dc8-5767-a459-bf486caa3d83', '047307d8-2d13-5f91-a148-05bf803715d7', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-10-06-926607+00-00/ee-tarek-exam-hints-2019-page-078/point-02.png', 'B2 agonist (Salbutamol, Salmeterol) could lead to hyperglycemia, so contraindicated with Diabetic pts.', 1, 'complete', 'published', '2026-04-10T07:12:17.157751+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'treatment ladder', null, '2026-04-10T07:12:17.157751+00:00'),
  ('0afb153f-38fb-519a-af7b-b15a2b62bbf8', '5f646cf7-ef92-5689-b8fd-27d529817eab', '047307d8-2d13-5f91-a148-05bf803715d7', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-10-06-926607+00-00/ee-tarek-exam-hints-2019-page-078/point-03.png', 'Contraindicated in Pregnancy', 2, 'complete', 'published', '2026-04-10T07:12:17.157751+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'treatment ladder', null, '2026-04-10T07:12:17.157751+00:00'),
  ('ff58c137-7a80-5542-abb3-19c6bf763a7b', '52728ccb-77f7-5800-8775-3c99f3003644', '047307d8-2d13-5f91-a148-05bf803715d7', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-10-06-926607+00-00/ee-tarek-exam-hints-2019-page-078/point-04.png', 'Bismuth (anti diarrheal) decrease the anti-HTN effect of ACEI, ARBs and B-blocker.', 3, 'complete', 'published', '2026-04-10T07:12:17.157751+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:12:17.157751+00:00'),
  ('b7e923ab-c6bc-567d-8037-19260b3bb1b1', '7dc15b51-9c06-5f69-aa16-f89b9fb6e580', '047307d8-2d13-5f91-a148-05bf803715d7', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-10-06-926607+00-00/ee-tarek-exam-hints-2019-page-078/point-05.png', 'Breastfeeding contraindicated with', 4, 'complete', 'published', '2026-04-10T07:12:17.157751+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'treatment ladder', null, '2026-04-10T07:12:17.157751+00:00'),
  ('66405a64-9dd4-5a56-85a3-1b69b85320e7', 'ded5cd33-b4f9-5e93-aacd-f04160eb7ae3', '047307d8-2d13-5f91-a148-05bf803715d7', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-10-06-926607+00-00/ee-tarek-exam-hints-2019-page-078/point-06.png', 'Meperidine', 5, 'complete', 'published', '2026-04-10T07:12:17.157751+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:12:17.157751+00:00'),
  ('1ce5823b-164f-5920-ae39-aa2b560c1218', 'c6f21493-83ab-5744-a61e-5ecdd4f44fa4', '047307d8-2d13-5f91-a148-05bf803715d7', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-10-06-926607+00-00/ee-tarek-exam-hints-2019-page-078/point-07.png', 'Codeine is converted by CYP2D6 to morphine; thus, its effect and toxicity affected by poor metabolizers and ultra-metabolizer. Therefore, its better to use morphine instead.', 6, 'complete', 'published', '2026-04-10T07:12:17.157751+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:12:17.157751+00:00'),
  ('21156341-b73f-54bc-8d28-851af0674bdc', '727633a4-5224-52ce-893b-f4bee195acaf', '047307d8-2d13-5f91-a148-05bf803715d7', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-10-06-926607+00-00/ee-tarek-exam-hints-2019-page-078/point-08.png', 'Corticosteroids injection contraindicated in Achilles tendonitis where risk rupture is highest.', 7, 'complete', 'published', '2026-04-10T07:12:17.157751+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'treatment ladder', null, '2026-04-10T07:12:17.157751+00:00'),
  ('22294b40-e84e-58fd-bf82-3fa0869625b3', '172d2b3b-d943-592a-a46b-5ba5c1e7e38d', '047307d8-2d13-5f91-a148-05bf803715d7', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-10-06-926607+00-00/ee-tarek-exam-hints-2019-page-078/point-09.png', 'Gabapentin and Pregabalin contraindicated with opioids due to risk of respiratory depression.', 8, 'complete', 'published', '2026-04-10T07:12:17.157751+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'treatment ladder', null, '2026-04-10T07:12:17.157751+00:00'),
  ('4e875cde-0223-5ba2-946e-1baca2f33c4f', '69120d01-6d6c-5c74-8731-b00a308d8b0e', '047307d8-2d13-5f91-a148-05bf803715d7', '4dee6c5d-7949-4133-880b-18ccf0f05df6/2026-04-10T07-10-06-926607+00-00/ee-tarek-exam-hints-2019-page-078/point-10.png', 'Renal patients', 9, 'complete', 'published', '2026-04-10T07:12:17.157751+00:00', '4dee6c5d-7949-4133-880b-18ccf0f05df6', 'high-yield summary board', null, '2026-04-10T07:12:17.157751+00:00')
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
  ('b51dcca4-9680-52b9-9117-55cdd395e336', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '047307d8-2d13-5f91-a148-05bf803715d7', 'ffad8f9f-6a4c-58c6-9476-460d9ae069c0', '6efea5ef-f224-5489-839d-f6ad8be8ca17', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 078.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:78", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 78, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.157751+00:00'),
  ('95bc2fe3-c3dc-5597-8358-666d3891424f', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '047307d8-2d13-5f91-a148-05bf803715d7', '2b868979-7a24-5375-843c-ad965430d0a0', 'f1d23e8a-5dc8-5767-a459-bf486caa3d83', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'treatment ladder', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 078.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:78", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 78, "point_category": "Management", "point_concept": "Management", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.157751+00:00'),
  ('b6807263-9bb4-51a1-a764-b2f87b3ec932', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '047307d8-2d13-5f91-a148-05bf803715d7', '0afb153f-38fb-519a-af7b-b15a2b62bbf8', '5f646cf7-ef92-5689-b8fd-27d529817eab', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'treatment ladder', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 078.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:78", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 78, "point_category": "Management", "point_concept": "Management", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.157751+00:00'),
  ('fa4d31da-8352-5199-81ae-a9ee48bd8330', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '047307d8-2d13-5f91-a148-05bf803715d7', 'ff58c137-7a80-5542-abb3-19c6bf763a7b', '52728ccb-77f7-5800-8775-3c99f3003644', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 078.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:78", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 78, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.157751+00:00'),
  ('59cde4bb-4d3f-5c19-90da-e213336ace62', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '047307d8-2d13-5f91-a148-05bf803715d7', 'b7e923ab-c6bc-567d-8037-19260b3bb1b1', '7dc15b51-9c06-5f69-aa16-f89b9fb6e580', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'treatment ladder', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 078.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:78", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 78, "point_category": "Management", "point_concept": "Management", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.157751+00:00'),
  ('3348c4af-ec33-53b8-a30c-4b9dc967a43b', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '047307d8-2d13-5f91-a148-05bf803715d7', '66405a64-9dd4-5a56-85a3-1b69b85320e7', 'ded5cd33-b4f9-5e93-aacd-f04160eb7ae3', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 078.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:78", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 78, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.157751+00:00'),
  ('597d53b9-bbb2-5f2a-acf4-84472a1cbda4', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '047307d8-2d13-5f91-a148-05bf803715d7', '1ce5823b-164f-5920-ae39-aa2b560c1218', 'c6f21493-83ab-5744-a61e-5ecdd4f44fa4', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 078.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:78", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 78, "point_category": "General", "point_concept": "Other", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.157751+00:00'),
  ('3794c41a-7918-5c4c-abd8-186284e93a03', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '047307d8-2d13-5f91-a148-05bf803715d7', '21156341-b73f-54bc-8d28-851af0674bdc', '727633a4-5224-52ce-893b-f4bee195acaf', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'treatment ladder', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 078.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:78", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 78, "point_category": "Management", "point_concept": "Management", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.157751+00:00'),
  ('e33f0e9b-c4a5-5d00-a871-bc2a59dad8c8', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '047307d8-2d13-5f91-a148-05bf803715d7', '22294b40-e84e-58fd-bf82-3fa0869625b3', '172d2b3b-d943-592a-a46b-5ba5c1e7e38d', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'treatment ladder', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 078.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:78", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 78, "point_category": "Management", "point_concept": "Management", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.157751+00:00'),
  ('1b09d48e-af54-57f4-b811-bb81a50ffeb4', '4dee6c5d-7949-4133-880b-18ccf0f05df6', '047307d8-2d13-5f91-a148-05bf803715d7', '4e875cde-0223-5ba2-946e-1baca2f33c4f', '69120d01-6d6c-5c74-8731-b00a308d8b0e', 'seed', 'gpt-image-1.5', 'medium', '1536x1024', null, 'high-yield summary board', null, 'workshop-imagegen-v1', 'openai-2026-04-05', 0.050000, null, null, null, null, null, null, null, '{"imported": true, "source": "notes-folder", "note": "EE Tarek Exam Hints 2019 - page 078.png", "source_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7:page:78", "source_origin_name": "EE Tarek Exam Hints 2019.pdf", "source_origin_sha256": "48d291516d0704ea59775eaba692b67daecde43e0fabe74a6fcddd2ec2e752b7", "source_page_number": 78, "point_category": "General", "point_concept": "Drug", "variant_index": 0, "variant_count": 1}'::jsonb, '2026-04-10T07:12:17.157751+00:00')
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

select public.refresh_public_card_relationships('047307d8-2d13-5f91-a148-05bf803715d7'::uuid);
