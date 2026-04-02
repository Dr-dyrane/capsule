# Capsule — Loading & State Design

Every screen has 4 designed states. Nothing is blank. Nothing fails silently.

---

## State Matrix

| Screen | Loading | Empty | Error | Partial |
|---|---|---|---|---|
| **Scan** | — | Upload zone (primary) | Upload failed toast | — |
| **Processing** | Points streaming in | — | OCR failed → retry | Points visible, generating |
| **Cards** | Skeleton grid (3 cards) | "No cards yet" + scan CTA | — | Mix of skeletons + real cards |
| **Card Detail** | Blurred placeholder | — | Image load failed → retry | — |
| **Library** | Skeleton list (4 rows) | "Your library is empty" + scan CTA | — | — |
| **Profile** | — | — | — | — |

---

## Loading State Designs

### The Core Principle: Involve the User

Loading is not a wall. It's a preview of what's coming.

### Card Generation (most important loading state)

This is where the user spends the most time. It must be engaging.

```
┌─────────────────────────────────────────────────┐
│  ┌────── Progress Bar (thin, accent color) ──┐  │
│  │████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  3 of 8 cards                                    │  ← counter
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ ▓▓▓▓▓▓▓▓ │  │ ▓▓▓▓▓▓▓▓ │  │ ▓▓▓▓▓▓▓▓ │      │  ← completed (tappable)
│  │ ▓▓▓▓▓▓▓▓ │  │ ▓▓▓▓▓▓▓▓ │  │ ▓▓▓▓▓▓▓▓ │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │      │  ← generating (skeleton)
│  │ ░░ shim ░│  │ ░░░░░░░░ │  │ ░░░░░░░░ │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│                                                  │
│  ┌──────────┐  ┌──────────┐                      │
│  │          │  │          │                      │  ← pending (dim outline)
│  │          │  │          │                      │
│  └──────────┘  └──────────┘                      │
└─────────────────────────────────────────────────┘
```

**Three visual states for cards in the grid:**

| State | Visual | Interaction |
|---|---|---|
| **Complete** | Full image, shadow elevation | Tappable → detail view |
| **Generating** | Skeleton shimmer (left-to-right gradient) | Not tappable, subtle pulse |
| **Pending** | Faint `--surface-1` rectangle | Not tappable, nearly invisible |

**Transitions between states:**
1. Pending → Generating: surface brightens, shimmer starts (300ms fade)
2. Generating → Complete: shimmer stops, image fades in + scales 0.95→1.0 (400ms spring)

---

### Upload Processing

```
┌──────────────────────────────────┐
│                                  │
│   ┌────────────────────────┐    │
│   │                        │    │
│   │   [Note thumbnail]     │    │
│   │                        │    │
│   │   ═══════════ 67%      │    │  ← radial progress on image
│   │                        │    │
│   └────────────────────────┘    │
│                                  │
│   Reading your notes...          │  ← single status label
│                                  │
│   ● ● ○ ○ ○ ○ ○                 │  ← points appearing as found
│                                  │
└──────────────────────────────────┘
```

Points appear one by one as OCR extracts them. Each point slides in from below (200ms).

---

### Gallery Skeleton

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │
│ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │
│ ░░░░░░░░ │  │ ░░░░░░░░ │  │ ░░░░░░░░ │
│ ░░░▓▓▓░░ │  │ ░░░▓▓▓░░ │  │ ░░░▓▓▓░░ │  ← title bar skeleton
└──────────┘  └──────────┘  └──────────┘
```

Skeleton uses `--surface-1` base with a sweeping highlight at `--surface-2`. Animation: 1.5s ease-in-out infinite.

---

### Library Skeleton

```
┌─────────────────────────────────────┐
│  ░░░░░░░░░░░░░  Today              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │░░░░│ │░░░░│ │░░░░│ │░░░░│      │
│  └────┘ └────┘ └────┘ └────┘      │
│                                     │
│  ░░░░░░░░░░░░░  Yesterday          │
│  ┌────┐ ┌────┐ ┌────┐              │
│  │░░░░│ │░░░░│ │░░░░│              │
│  └────┘ └────┘ └────┘              │
└─────────────────────────────────────┘
```

---

## Empty States

Each empty state has:
1. A relevant SF Symbol-style icon (large, `--text-tertiary`)
2. A 2-word label
3. An action button leading to the resolution

| Screen | Icon | Label | Action |
|---|---|---|---|
| Cards | grid icon | No cards | Scan notes |
| Library | book icon | Empty library | Scan notes |

No paragraphs. No explanations. The icon and label are self-evident.

---

## Error States

| Error | Surface | Recovery |
|---|---|---|
| Upload failed | Toast (red accent) | Retry button |
| OCR failed | Inline in processing view | Retry button |
| Card generation failed | Card shows error icon in grid | Tap to retry |
| Network offline | Top banner (subtle, persistent) | Auto-dismisses on reconnect |
| Auth expired | Redirect to login | — |
