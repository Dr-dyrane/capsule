# Capsule — UI Component Checklist

Per-component audit. Every component must pass all checks before it ships.

---

## Global Checks (apply to ALL components)

| # | Check | Pass? |
|---|---|---|
| 1 | Zero `border` properties (except `border-radius`) | ☐ |
| 2 | Zero `ring` or `outline` on interactive surfaces | ☐ |
| 3 | Zero `box-shadow: inset` | ☐ |
| 4 | Uses only tokenized colors (`--surface-*`, `--text-*`, `--accent`) | ☐ |
| 5 | Uses only tokenized spacing (`--space-*`) | ☐ |
| 6 | Uses only tokenized radii | ☐ |
| 7 | Uses only tokenized shadows (`--shadow-*`) | ☐ |
| 8 | Uses only tokenized font sizes | ☐ |
| 9 | Has hover state (desktop) | ☐ |
| 10 | Has press state (scale + darken) | ☐ |
| 11 | Touch target ≥ 44×44px | ☐ |
| 12 | Works without motion (`prefers-reduced-motion`) | ☐ |
| 13 | Accessible name (screen reader) | ☐ |
| 14 | Keyboard navigable | ☐ |

---

## Component Matrix

### Primitives

| Component | Border-free | Token-only | States | A11y |
|---|---|---|---|---|
| `Button` | ☐ | ☐ | ☐ | ☐ |
| `Input` | ☐ | ☐ | ☐ | ☐ |
| `Skeleton` | ☐ | ☐ | — | ☐ |
| `Toast` | ☐ | ☐ | ☐ | ☐ |
| `ProgressBar` | ☐ | ☐ | — | ☐ |
| `ProgressRing` | ☐ | ☐ | — | ☐ |
| `Icon` | — | ☐ | — | ☐ |

### Navigation

| Component | Border-free | Token-only | States | A11y |
|---|---|---|---|---|
| `TabBar` | ☐ | ☐ | ☐ | ☐ |
| `Sidebar` | ☐ | ☐ | ☐ | ☐ |
| `NavLink` | ☐ | ☐ | ☐ | ☐ |

### Cards

| Component | Border-free | Token-only | States | A11y |
|---|---|---|---|---|
| `CardThumbnail` | ☐ | ☐ | ☐ | ☐ |
| `CardGrid` | ☐ | ☐ | — | ☐ |
| `CardDetail` | ☐ | ☐ | ☐ | ☐ |
| `CardSkeleton` | ☐ | ☐ | — | ☐ |

### Scan

| Component | Border-free | Token-only | States | A11y |
|---|---|---|---|---|
| `UploadZone` | ☐ | ☐ | ☐ | ☐ |
| `ProcessingView` | ☐ | ☐ | ☐ | ☐ |

### Marketing

| Component | Border-free | Token-only | States | A11y |
|---|---|---|---|---|
| `Hero` | ☐ | ☐ | — | ☐ |
| `FeatureBlocks` | ☐ | ☐ | — | ☐ |

---

## Surface Audit

Run after all components are built:

```bash
# Must return 0 results (excluding border-radius)
grep -rn "border:" styles/ --include="*.css" | grep -v "border-radius"
grep -rn "outline:" styles/ --include="*.css"
grep -rn "ring" styles/ --include="*.css"
```
