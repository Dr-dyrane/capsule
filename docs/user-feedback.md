# Capsule — User Feedback System

Every interaction produces visible, immediate feedback. The user never wonders "did it work?"

---

## Feedback Principles

| # | Principle | Rule |
|---|---|---|
| 1 | **Acknowledge instantly** | Every tap/click produces visual change within 100ms |
| 2 | **Show progress, not spinners** | Determinate progress over indeterminate |
| 3 | **Involve the user in waiting** | Loading states show real content arriving, not empty chrome |
| 4 | **Celebrate completion** | Subtle scale + fade confirms success |
| 5 | **Errors are calm** | Red tint on surface, clear recovery action |

---

## Feedback by Interaction Type

### Button Press
- **Immediate:** Surface darkens to `--surface-3` on press (150ms)
- **Processing:** Button text replaced by inline progress indicator
- **Complete:** Button returns to rest. Toast appears if outcome isn't visible inline.

### Upload
- **Drop/select:** File thumbnail appears instantly in upload zone
- **Uploading:** Radial progress ring around thumbnail (0% → 100%)
- **Complete:** Progress ring fills, brief scale pulse (1.0 → 1.02 → 1.0), then transitions to processing state

### Card Generation (the core feedback loop)
```
┌─────────────────────────────────────────────┐
│  Point 1: "Acne — Hormonal Sebum..."        │  ← text visible
│  ┌─────────────────┐                        │
│  │   ░░░░░░░░░░░░  │  ← skeleton shimmer   │
│  │   ░░░░░░░░░░░░  │     (card generating)  │
│  │   ░░░░░░░░░░░░  │                        │
│  └─────────────────┘                        │
│                                              │
│  Point 2: "Follicular..."                    │  ← next point
│  ┌─────────────────┐                        │
│  │   ▓▓▓▓▓▓▓▓▓▓▓▓  │  ← card image!       │
│  │   ▓▓▓▓▓▓▓▓▓▓▓▓  │     (complete, tappable) │
│  │   ▓▓▓▓▓▓▓▓▓▓▓▓  │                        │
│  └─────────────────┘                        │
└─────────────────────────────────────────────┘
```

- Cards generate sequentially, first card starts immediately
- Completed cards are tappable — user reads while others generate
- Skeleton shimmer on generating card uses a slow, left-to-right gradient sweep
- When a card completes: skeleton fades out, image scales in from 0.95 → 1.0 (300ms)
- Counter in header: `3 of 8` with a subtle progress bar below the header

### Navigation
- **Tab switch:** Active tab icon fills, content crossfades (200ms)
- **Card tap → detail:** View Transition morphs card from grid position to full-screen
- **Detail close:** Reverse morph back to grid position
- **Swipe in detail:** Card slides out, next card slides in with spring easing

### Delete / Destructive
- **Swipe to reveal:** Red surface slides in from right
- **Confirm:** Brief 200ms pause (intentional friction), then item collapses with height animation
- **Undo toast:** Appears for 5 seconds at bottom

---

## Toast System

| Type | Surface | Duration | Icon |
|---|---|---|---|
| Success | `--surface-2` + green left accent | 3s | ✓ checkmark |
| Error | `--surface-2` + red left accent | 5s + manual dismiss | ✕ |
| Info | `--surface-2` | 3s | none |
| Progress | `--surface-2` + progress bar | persistent until complete | — |

Toasts stack from bottom. Max 3 visible. Frosted glass surface. No borders.

---

## Haptic-Style Visual Feedback (touch devices)

Since web can't do true haptics, simulate the tactile feel:

| Gesture | Visual Response |
|---|---|
| Tap | Scale 1.0 → 0.97 → 1.0 (spring, 200ms) |
| Long press | Scale 1.0 → 0.95, surface brightens to `--surface-3` |
| Swipe | Rubber-band overshoot at edges |
| Pull to refresh | Content stretches slightly before releasing |
