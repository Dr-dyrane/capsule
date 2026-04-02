# Capsule — Implementation Plan

## Build Order

Phases are sequential. Within each phase, files are listed in dependency order.

---

## Phase 1: Scaffold

| # | File | What |
|---|---|---|
| 1 | `package.json` | Next.js 15, `@supabase/ssr`, `@supabase/supabase-js` |
| 2 | `next.config.js` | Image domains, experimental features |
| 3 | `tsconfig.json` | Path aliases (`@/`) |
| 4 | `.env.example` | Template for required env vars |
| 5 | `styles/tokens.css` | All design tokens |
| 6 | `styles/reset.css` | CSS reset |
| 7 | `styles/globals.css` | Body, font loading, global surface rules |
| 8 | `app/layout.tsx` | Root layout, fonts, metadata |

**Exit criteria:** `npm run dev` renders a black page with correct fonts loaded.

---

## Phase 2: Auth

| # | File | What |
|---|---|---|
| 1 | `lib/supabase/client.ts` | Browser client factory |
| 2 | `lib/supabase/server.ts` | Server client factory |
| 3 | `lib/supabase/middleware.ts` | Cookie refresh helper |
| 4 | `middleware.ts` | Protect `/(app)/*` routes |
| 5 | `app/(auth)/login/page.tsx` | Email input + continue |
| 6 | `styles/components/auth.css` | Login page styles |
| 7 | `app/(auth)/callback/route.ts` | Exchange code for session |

**Exit criteria:** User can enter email, receive magic link, click it, land on dashboard.

---

## Phase 3: App Shell

| # | File | What |
|---|---|---|
| 1 | `components/ui/Button.tsx` | Primary button component |
| 2 | `components/ui/Input.tsx` | Text input component |
| 3 | `components/navigation/TabBar.tsx` | Mobile bottom tab bar |
| 4 | `components/navigation/Sidebar.tsx` | Desktop sidebar |
| 5 | `components/navigation/NavLink.tsx` | Active-state nav item |
| 6 | `app/(app)/layout.tsx` | App shell (TabBar + Sidebar) |
| 7 | `styles/components/navigation.css` | Nav styles |

**Exit criteria:** Tab bar on mobile, sidebar on desktop. Correct icons. Active state works.

---

## Phase 4: Marketing

| # | File | What |
|---|---|---|
| 1 | `components/marketing/Hero.tsx` | Hero section |
| 2 | `components/marketing/Features.tsx` | 3 feature blocks |
| 3 | `app/page.tsx` | Marketing page composition |
| 4 | `styles/components/marketing.css` | Marketing styles |

**Exit criteria:** Dark hero page with card showcase, CTA, feature blocks.

---

## Phase 5: Scan & Upload

| # | File | What |
|---|---|---|
| 1 | `components/scan/UploadZone.tsx` | Drop zone + file/camera picker |
| 2 | `app/actions/upload.ts` | Server action: upload to Supabase Storage |
| 3 | `app/(app)/scan/page.tsx` | Scan page |
| 4 | `styles/components/scan.css` | Upload zone styles |

**Exit criteria:** User can upload an image. It appears in Supabase Storage. Session record created.

---

## Phase 6: Processing & Card Generation

| # | File | What |
|---|---|---|
| 1 | `lib/ai/ocr.ts` | GPT-4o Vision → structured points |
| 2 | `lib/ai/generate.ts` | Point → illustrative card image |
| 3 | `app/actions/process.ts` | OCR extraction server action |
| 4 | `app/actions/generate.ts` | Card generation server action |
| 5 | `components/scan/ProcessingView.tsx` | Points streaming + card generation |
| 6 | `components/cards/CardSkeleton.tsx` | Skeleton shimmer component |
| 7 | `app/(app)/scan/[id]/page.tsx` | Processing page |
| 8 | `styles/components/processing.css` | Processing + skeleton styles |

**Exit criteria:** Upload triggers OCR. Points appear. Cards generate sequentially. User can see cards arriving. Can tap completed cards.

---

## Phase 7: Card Gallery & Detail

| # | File | What |
|---|---|---|
| 1 | `components/cards/CardThumbnail.tsx` | Card in grid |
| 2 | `components/cards/CardGrid.tsx` | Responsive grid |
| 3 | `components/cards/CardDetail.tsx` | Full-screen detail |
| 4 | `app/(app)/cards/page.tsx` | Gallery page |
| 5 | `app/(app)/cards/[id]/page.tsx` | Detail page |
| 6 | `styles/components/cards.css` | Card styles + view transitions |

**Exit criteria:** Card grid displays all cards. Tap morphs to full-screen. Swipe/arrow navigation between cards. Back returns to grid.

---

## Phase 8: Library & Profile

| # | File | What |
|---|---|---|
| 1 | `app/(app)/library/page.tsx` | Sessions list |
| 2 | `app/(app)/profile/page.tsx` | User profile |
| 3 | `styles/components/library.css` | Library styles |
| 4 | `styles/components/profile.css` | Profile styles |

**Exit criteria:** Library shows all sessions grouped by date. Profile shows stats + sign out.

---

## Phase 9: Polish

| Task | Criteria |
|---|---|
| Zero-border audit | `grep -r "border" styles/` returns 0 hits (except `border-radius`) |
| Motion review | All transitions use defined easing curves |
| Responsive test | 375px, 768px, 1024px, 1440px all correct |
| `prefers-reduced-motion` | All motion disabled |
| Empty states | Every screen has empty state |
| Error states | Every async action has error recovery |
| Lighthouse | Performance > 90, Accessibility > 95 |
