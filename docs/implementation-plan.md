# Capsule — Implementation Plan

## Build Order

Phases are sequential. Within each phase, files are listed in dependency order.

---

## Phase 1: Scaffold (CURRENT)

| # | File | What |
|---|---|---|
| 1 | `package.json` | Next.js 15, `@supabase/ssr`, `@supabase/supabase-js`, `lucide-react`, `framer-motion` |
| 2 | `next.config.ts` | Image domains, experimental features |
| 3 | `tsconfig.json` | Path aliases (`@/`) |
| 4 | `.env.local` | Supabase + OpenAI keys |
| 5 | `styles/tokens.css` | [DONE] All design tokens |
| 6 | `styles/reset.css` | [DONE] CSS reset |
| 7 | `styles/globals.css` | [DONE] Body, font loading, global surface rules |
| 8 | `app/layout.tsx` | [DONE] Root layout, fonts, metadata |

**Exit criteria:** `npm run dev` renders a black page with correct fonts loaded.

---

## Phase 2: Supabase & Auth

| # | File | What |
|---|---|---|
| 1 | `lib/supabase/client.ts` | Browser client factory |
| 2 | `lib/supabase/server.ts` | Server client factory |
| 3 | `lib/supabase/middleware.ts` | Cookie refresh helper |
| 4 | `middleware.ts` | Protect `/(app)/*` routes |
| 5 | `app/(auth)/login/page.tsx` | Email input + continue |
| 6 | `app/(auth)/callback/route.ts` | Exchange code for session |

**Exit criteria:** User can login via magic link and reach protected routes.

---

## Phase 3: App Shell & UI Primitives

| # | File | What |
|---|---|---|
| 1 | `components/ui/Button.tsx` | Apple HIG-style button (no borders) |
| 2 | `components/ui/Input.tsx` | Apple HIG-style input (no borders) |
| 3 | `components/navigation/TabBar.tsx` | Mobile bottom tab bar |
| 4 | `components/navigation/Sidebar.tsx` | Desktop sidebar |
| 5 | `app/(app)/layout.tsx` | App shell composition |

**Exit criteria:** Navigation works on mobile and desktop. Correct active states.

---

## Phase 4: Core Flow (Scan & Background Gen)

| # | File | What |
|---|---|---|
| 1 | `lib/ai/ocr.ts` | GPT-4o Vision extraction logic |
| 2 | `lib/ai/generate.ts` | Card image generation logic |
| 3 | `app/actions/process.ts` | Server action: note → points |
| 4 | `app/actions/generate.ts` | Server action: point → card |
| 5 | `app/(app)/scan/page.tsx` | Upload zone → Processing view |

**Exit criteria:** Image upload triggers point extraction and sequential card generation.

---

## Phase 5: Card Gallery & Detail

| # | File | What |
|---|---|---|
| 1 | `components/cards/CardGrid.tsx` | Responsive grid |
| 2 | `components/cards/CardDetail.tsx` | Full-screen detail view |
| 3 | `app/(app)/cards/page.tsx` | Gallery view |

**Exit criteria:** Cards are browsable, morphing to full-screen on tap.

---

## Phase 6: Library & Polish

| # | File | What |
|---|---|---|
| 1 | `app/(app)/library/page.tsx` | Sessions list |
| 2 | `app/(app)/profile/page.tsx` | User profile |
| 3 | `Phase 9: Polish` | Zero-border audit, responsive testing |

**Exit criteria:** Complete feature parity with design spec.
