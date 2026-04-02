# Capsule — Tech Stack & Architecture

## Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Server components, server actions, streaming |
| **Auth** | Supabase Auth (`@supabase/ssr`) | Cookie-based SSR auth, magic link |
| **Database** | Supabase PostgreSQL | RLS, real-time subscriptions |
| **Storage** | Supabase Storage | Private buckets for images |
| **OCR** | GPT-4o Vision API | Multi-modal, handles handwriting |
| **Card Gen** | AI image generation | Illustrative medical cards |
| **CSS** | Vanilla CSS custom properties | No framework, full control |
| **Animation** | View Transitions API + CSS | Native, no library |
| **Deploy** | Vercel | Edge functions, Next.js native |

---

## Data Model

```sql
-- Auth handled by Supabase (auth.users)

CREATE TABLE sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source_url  TEXT NOT NULL,           -- Supabase Storage path
  status      TEXT DEFAULT 'uploading', -- uploading | processing | generating | complete | error
  point_count INT DEFAULT 0,
  card_count  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE points (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  text        TEXT NOT NULL,
  category    TEXT,                     -- Dermatology, Oncology, etc.
  concept     TEXT,                     -- Drug, Disease, Regimen, etc.
  sort_order  INT NOT NULL,
  card_count  INT DEFAULT 0,           -- How many cards this point needs
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE cards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  point_id    UUID REFERENCES points(id) ON DELETE CASCADE NOT NULL,
  session_id  UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  image_url   TEXT NOT NULL,            -- Supabase Storage path
  title       TEXT,
  card_order  INT DEFAULT 1,            -- 1st, 2nd card for same point
  status      TEXT DEFAULT 'generating', -- generating | complete | error
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_points_session ON points(session_id);
CREATE INDEX idx_cards_session ON cards(session_id);
CREATE INDEX idx_cards_point ON cards(point_id);
```

### RLS Policies

```sql
-- Sessions: user owns their sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY sessions_user ON sessions
  FOR ALL USING (user_id = auth.uid());

-- Points: user owns via session
ALTER TABLE points ENABLE ROW LEVEL SECURITY;
CREATE POLICY points_user ON points
  FOR ALL USING (
    session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid())
  );

-- Cards: same pattern
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY cards_user ON cards
  FOR ALL USING (
    session_id IN (SELECT id FROM sessions WHERE user_id = auth.uid())
  );
```

### Storage Buckets

| Bucket | Access | Path Pattern |
|---|---|---|
| `notes` | Private | `{user_id}/{session_id}/source.{ext}` |
| `cards` | Private | `{user_id}/{session_id}/{card_id}.png` |

---

## API Design (Server Actions)

| Action | Input | Output |
|---|---|---|
| `uploadNote` | File | Session ID + signed URL |
| `processNote` | Session ID | Points array (streamed) |
| `generateCard` | Point ID | Card record + image URL |
| `getSession` | Session ID | Session + points + cards |
| `getSessions` | — | User's sessions |
| `deleteSession` | Session ID | — |

### Background Generation Flow

```
1. Upload completes → session created
2. Server action calls GPT-4o Vision → extracts points
3. Points inserted into DB
4. For each point (sequentially):
   a. Card generation starts → card record created with status 'generating'
   b. Image generated → uploaded to storage
   c. Card record updated → status 'complete', image_url set
   d. Client receives real-time update via Supabase subscription
5. User can browse completed cards while remaining cards generate
```

---

## File Structure

```
capsule/
├── app/
│   ├── layout.tsx                  Root layout (fonts, metadata, providers)
│   ├── page.tsx                    Marketing hero
│   ├── (auth)/
│   │   ├── login/page.tsx          Email login
│   │   └── callback/route.ts      Supabase auth callback
│   ├── (app)/
│   │   ├── layout.tsx              App shell (TabBar / Sidebar)
│   │   ├── scan/page.tsx           Upload / camera
│   │   ├── scan/[id]/page.tsx      Processing + generation view
│   │   ├── cards/page.tsx          Recent cards gallery
│   │   ├── cards/[id]/page.tsx     Card detail (full-screen)
│   │   ├── library/page.tsx        All sessions
│   │   └── profile/page.tsx        User profile
│   └── actions/
│       ├── upload.ts               Upload server action
│       ├── process.ts              OCR + point extraction
│       └── generate.ts             Card generation
├── components/
│   ├── ui/                         Button, Input, Card, Skeleton, etc.
│   ├── navigation/                 TabBar, Sidebar, NavLink
│   ├── scan/                       UploadZone, ProcessingView
│   ├── cards/                      CardGrid, CardThumbnail, CardDetail
│   ├── feedback/                   Toast, ProgressRing, HapticButton
│   └── marketing/                  Hero, FeatureBlocks
├── lib/
│   ├── supabase/
│   │   ├── client.ts               Browser Supabase client
│   │   ├── server.ts               Server Supabase client
│   │   └── middleware.ts           Session refresh helper
│   ├── ai/
│   │   ├── ocr.ts                  GPT-4o Vision extraction
│   │   └── generate.ts             Card image generation
│   └── utils.ts                    Helpers
├── styles/
│   ├── tokens.css                  Design tokens
│   ├── reset.css                   CSS reset
│   ├── globals.css                 Global styles
│   └── components/                 Per-component CSS modules
├── middleware.ts                    Next.js route protection
├── docs/                           Design & planning docs
├── .env.local                      Secrets
├── .env.example                    Template
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
