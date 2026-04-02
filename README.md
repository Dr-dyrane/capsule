# Capsule

**Distill notes into visual knowledge.**

Capsule transforms handwritten and printed medical notes into illustrative learning cards. Scan a page, and Capsule extracts each teaching point, then generates a beautiful, scannable card for each concept — in the background, ready to read as they arrive.

---

## How It Works

```
Scan  →  Extract  →  Generate  →  Read
```

1. **Scan** — Upload or photograph a page of notes
2. **Extract** — AI reads the page and identifies atomic teaching points
3. **Generate** — Each point becomes an illustrative learning card (generated in background)
4. **Read** — Browse your cards immediately as they appear. Swipe. Study. Retain.

---

## Design Philosophy

Capsule is built on three principles:

| Principle | Meaning |
|---|---|
| **Content is the interface** | Cards are the product. UI gets out of the way. |
| **No waiting** | Cards stream in as they generate. Start reading immediately. |
| **No friction** | No manual point curation. No configuration. Scan → cards. |

### Visual Language

- **Dark canvas** — `#000000` base, depth through translucent surfaces
- **No borders** — Ever. Separation through layers, blur, and shadow only.
- **No rings** — No outlines, no insets. Surfaces float.
- **Apple HIG** — Element-for-element adherence. Tab bar, large titles, progressive disclosure, spatial transitions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Auth | Supabase Auth (email, `@supabase/ssr`) |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |
| OCR | GPT-4o Vision |
| Card Generation | AI image generation pipeline |
| Styling | Vanilla CSS (custom properties) |
| Animation | View Transitions API |
| Deployment | Vercel |

---

## Project Structure

```
capsule/
├── README.md                   ← You are here
├── docs/                       ← All design & planning docs
│   ├── ui-ux.md                   Design language & surfaces
│   ├── tech-stack.md              Architecture & data model
│   ├── implementation-plan.md     Build order & phases
│   ├── ui-checklist.md            Component audit checklist
│   ├── apple-hig-checklist.md     HIG compliance matrix
│   ├── user-feedback.md           Feedback & loading system
│   ├── loading-states.md          State design for every screen
│   └── agent.md                   AI card generation rules
├── app/                        ← Next.js App Router
├── components/                 ← React components
├── lib/                        ← Utilities, Supabase, AI
├── styles/                     ← CSS tokens & globals
└── public/                     ← Static assets
```

---

## Documentation

| Document | Purpose |
|---|---|
| [UI/UX Spec](docs/ui-ux.md) | Surfaces, typography, color, spacing, motion |
| [Tech Stack](docs/tech-stack.md) | Architecture, data model, API design |
| [Implementation Plan](docs/implementation-plan.md) | Build phases, file creation order |
| [UI Checklist](docs/ui-checklist.md) | Per-component zero-border audit |
| [Apple HIG Checklist](docs/apple-hig-checklist.md) | Element-by-element HIG compliance |
| [User Feedback](docs/user-feedback.md) | Feedback system & micro-interactions |
| [Loading States](docs/loading-states.md) | Every screen's loading/empty/error states |
| [Agent](docs/agent.md) | AI card generation rules & heuristics |

---

## Quick Start

```bash
cd capsule
npm install
cp .env.example .env.local   # Add Supabase + OpenAI keys
npm run dev
```

---

## License

Private — not for redistribution.
