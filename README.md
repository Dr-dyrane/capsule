# Capsule

Distill notes into visual knowledge.

Capsule turns handwritten or printed medical notes into visual learning cards. Upload a page, extract teaching points with AI, then generate cards that arrive while processing continues.

## Product Flow

```text
Scan -> Extract -> Generate -> Read
```

1. Scan a note from camera or file upload.
2. Extract atomic teaching points from the image.
3. Generate visual cards for each point.
4. Read completed cards while the rest continue in the background.

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19, Tailwind 4 utilities, CSS tokens |
| Auth | Supabase Auth with `@supabase/ssr` |
| Database | Supabase Postgres |
| Storage | Supabase Storage |
| AI extraction | OpenAI GPT-4o |
| Image generation | OpenAI image generation |

## Project Structure

```text
app/           Routes, layouts, server actions
components/    UI and feature components
docs/          Product, UI, and AI guidance
lib/           Supabase, AI, storage, shared helpers
public/        Static assets and demo imagery
supabase/      Config and SQL migrations
```

## Key Routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing landing page |
| `/login` | Magic link auth |
| `/scan` | Upload a note |
| `/scan/[id]` | Live extraction and generation state |
| `/cards` | Completed cards gallery |
| `/cards/[id]` | Card detail view |
| `/library` | Prior sessions |
| `/profile` | Account actions |

## Local Setup

1. Install dependencies.
2. Create `.env.local`.
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL`
   - `OPENAI_API_KEY`
4. Run the dev server.

```bash
npm install
npm run dev
```

## Notes

- The app uses `proxy.ts` for auth-aware request handling.
- Supabase SQL setup lives in [supabase/migrations/20260402093000_initial_capsule_schema.sql](supabase/migrations/20260402093000_initial_capsule_schema.sql).
- AI image guidance lives in [docs/agent.md](docs/agent.md).

## License

Private. Not for redistribution.
