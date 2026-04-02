# Capsule — UI/UX Specification

## Design Language: Liquid Glass Dark

### Absolute Rules

| # | Rule | Enforcement |
|---|---|---|
| 1 | **No borders** | Zero `border` properties. Zero `outline` on surfaces. |
| 2 | **No rings** | Zero `ring`, `box-shadow: inset`, or ring-like treatments. |
| 3 | **No explanatory copy** | UI labels only. No sentences in the interface. |
| 4 | **No decoration** | Color = state. Shape = function. Nothing ornamental. |
| 5 | **Content leads** | Cards, images, data are the interface. Chrome yields. |

### Marketing Interpretation

- The marketing page should behave like a product demonstration, not a copy-heavy SaaS landing page.
- One headline and one short support line are usually enough.
- Generated cards should appear high on the page and dominate the visual hierarchy.
- Avoid long badge rows, explanatory feature copy, and generic centered marketing layouts.
- Wide content should not be trapped inside an unnecessarily narrow max-width shell.
- If the experience claims Apple-level polish, include small but meaningful controls such as a theme toggle in the footer or lower chrome.

---

## Surface System

```
Layer 0  ──  #000000                          Canvas
Layer 1  ──  rgba(255,255,255, 0.04)          Primary surface (cards, containers)
Layer 2  ──  rgba(255,255,255, 0.08)          Elevated surface (modals, popovers)
Layer 3  ──  rgba(255,255,255, 0.12)          Active / pressed states
```

All elevated surfaces: `backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); saturate(180%);`

---

## Color Tokens

| Token | Value | When |
|---|---|---|
| `--canvas` | `#000000` | Page background |
| `--surface-1` | `rgba(255,255,255,0.04)` | Cards, sections |
| `--surface-2` | `rgba(255,255,255,0.08)` | Elevated panels |
| `--surface-3` | `rgba(255,255,255,0.12)` | Pressed / active |
| `--text-primary` | `rgba(255,255,255,0.92)` | Headings |
| `--text-secondary` | `rgba(255,255,255,0.56)` | Labels, metadata |
| `--text-tertiary` | `rgba(255,255,255,0.32)` | Placeholder, hints |
| `--accent` | `#0A84FF` | Interactive (iOS system blue) |
| `--accent-hover` | `#409CFF` | Hover / focus |
| `--destructive` | `#FF453A` | Error, delete |
| `--success` | `#30D158` | Completion |
| `--warning` | `#FFD60A` | Caution |

---

## Typography

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;
```

| Scale | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| Large Title | 34px | 700 | 1.1 | Page headers |
| Title 1 | 28px | 700 | 1.2 | Section heads |
| Title 2 | 22px | 600 | 1.25 | Card titles |
| Title 3 | 20px | 600 | 1.3 | Subsection |
| Body | 17px | 400 | 1.5 | Default |
| Callout | 16px | 400 | 1.4 | Secondary |
| Subhead | 15px | 400 | 1.4 | Meta |
| Footnote | 13px | 400 | 1.35 | Timestamps |
| Caption | 12px | 500 | 1.3 | Badges |

---

## Spacing

```
4  8  12  16  20  24  32  40  48  64  80  96
```

All spacing tokenized as `--space-{n}`.

---

## Radius

| Element | Radius |
|---|---|
| Cards / containers | 16px continuous |
| Buttons | 12px |
| Chips / pills | 9999px |
| Inputs | 12px |
| Modals / sheets | 20px |
| App icon | 22.37% (Apple superellipse) |

---

## Elevation (shadows only, no rings)

```css
--shadow-sm:  0 1px  2px  rgba(0,0,0, 0.4);
--shadow-md:  0 4px  12px rgba(0,0,0, 0.5);
--shadow-lg:  0 8px  32px rgba(0,0,0, 0.6);
--shadow-xl:  0 16px 64px rgba(0,0,0, 0.7);
```

---

## Motion

| Type | Duration | Easing | Use |
|---|---|---|---|
| Micro | 150ms | `ease-out` | Hover, press |
| Standard | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Expand, slide |
| Dramatic | 500ms | `cubic-bezier(0.32, 0.72, 0, 1)` | Page, modal morph |
| Exit | 200ms | `cubic-bezier(0.4, 0, 1, 1)` | Dismiss |

`prefers-reduced-motion: reduce` → all transitions become instant.

---

## Navigation

### Mobile (< 768px) — Tab Bar

Bottom tab bar. Frosted glass surface. 4 items, icon-only, label on active.

```
[ Scan ]  [ Cards ]  [ Library ]  [ Profile ]
```

### Desktop (≥ 1024px) — Sidebar

Left sidebar, collapsible. Same 4 destinations.

### Tablet (768–1024px)

Compact sidebar (icons only), expands on hover.

---

## Screen Inventory

| Screen | Primary Action | Content |
|---|---|---|
| Marketing | Get Started | Hero + card showcase |
| Login | Continue | Email input |
| Scan | Upload | Camera / file zone |
| Processing | — (passive) | Points stream + card generation |
| Cards | Browse | Card grid |
| Card Detail | Read | Full-screen card image |
| Library | Search | Sessions grouped by date |
| Profile | Sign Out | Stats + settings |
