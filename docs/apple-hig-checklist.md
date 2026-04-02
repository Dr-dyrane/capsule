# Capsule — Apple HIG Compliance Checklist

Element-for-element adherence to Apple Human Interface Guidelines.

---

## Navigation

| HIG Element | Capsule Implementation | Status |
|---|---|---|
| Tab bar (iOS) | Bottom bar, 4 tabs, frosted glass, icons-only | ☐ |
| Sidebar (iPadOS/macOS) | Left sidebar, collapsible, same 4 destinations | ☐ |
| Sidebar-adaptable | Tab bar < 768px, sidebar ≥ 1024px, compact 768–1024 | ☐ |
| Active tab: filled icon | SF Symbol filled variant on active | ☐ |
| Inactive tab: outlined icon | SF Symbol outlined variant on inactive | ☐ |
| State preservation | Each tab preserves scroll position and sub-state | ☐ |
| No actions in tab bar | Tab bar = navigation only. Actions in toolbar. | ☐ |

---

## Typography

| HIG Element | Implementation | Status |
|---|---|---|
| Large Title | 34px/700 on page entry | ☐ |
| Large → Inline transition | Title shrinks on scroll | ☐ |
| Title hierarchy | Large Title > Title 1 > Title 2 > Title 3 | ☐ |
| Body text 17px | Default readable text at 17px | ☐ |
| Dynamic Type support | rem-based sizes scale with user preference | ☐ |

---

## Surfaces & Materials

| HIG Element | Implementation | Status |
|---|---|---|
| No decorative borders | Zero `border` in all components | ☐ |
| Layered glass surfaces | `backdrop-filter: blur(20px)` on elevated elements | ☐ |
| Dark mode base | `#000000` canvas | ☐ |
| Elevated = lighter | Higher surfaces have higher white opacity | ☐ |
| Content extends under chrome | Cards scroll behind tab bar / nav bar | ☐ |

---

## Touch & Interaction

| HIG Element | Implementation | Status |
|---|---|---|
| Minimum 44×44px touch targets | All buttons, links, interactive areas | ☐ |
| Press states | Scale 0.97 + surface darken on press | ☐ |
| Hover states (desktop) | Surface brighten + subtle lift shadow | ☐ |
| Swipe gestures | Swipe between cards in detail view | ☐ |
| Pull to refresh | Content stretches with rubber-band | ☐ |
| Scroll elasticity | Overscroll bounce at top/bottom | ☐ |

---

## Progressive Disclosure

| HIG Element | Implementation | Status |
|---|---|---|
| Show only what's needed now | Cards grid > detail on tap | ☐ |
| Drill-down hierarchy | Library > Session > Card | ☐ |
| Contextual actions | Long-press / right-click for secondary actions | ☐ |
| Modal for focused tasks | Upload as modal or dedicated page | ☐ |

---

## View Transitions

| HIG Element | Implementation | Status |
|---|---|---|
| Spatial continuity | Card morphs from grid to detail, preserving position | ☐ |
| No teleporting | Every transition animates origin → destination | ☐ |
| Spring easing | `cubic-bezier(0.32, 0.72, 0, 1)` for major transitions | ☐ |
| Reduced motion | `prefers-reduced-motion` → instant transitions | ☐ |

---

## Content & Layout

| HIG Element | Implementation | Status |
|---|---|---|
| Content-first | Card images are the primary surface, UI chrome minimal | ☐ |
| Grouped content | Cards grouped by session/category with section headers | ☐ |
| Consistent spacing | All spacing from token scale | ☐ |
| Safe areas | Content respects device safe areas (notch, home indicator) | ☐ |
| Responsive grid | 1 col mobile, 2 col tablet, 3 col desktop | ☐ |

---

## Feedback & State

| HIG Element | Implementation | Status |
|---|---|---|
| Every action has feedback | See user-feedback.md | ☐ |
| Loading skeleton | Shimmer skeletons match content shape | ☐ |
| Empty state | Icon + label + action for every empty screen | ☐ |
| Error recovery | Every error shows clear retry/recovery action | ☐ |
| Progress indication | Determinate progress for uploads and generation | ☐ |

---

## Accessibility

| HIG Element | Implementation | Status |
|---|---|---|
| Color contrast AA | All text meets WCAG AA on dark surfaces | ☐ |
| Focus indicators | Visible focus ring (non-border, shadow-based) | ☐ |
| Screen reader labels | All interactive elements have accessible names | ☐ |
| Keyboard navigation | Full tab navigation on desktop | ☐ |
| Semantic HTML | Correct heading hierarchy, landmarks, roles | ☐ |
| `aria-live` regions | Toast and progress announcements | ☐ |

---

## Icons

| HIG Element | Implementation | Status |
|---|---|---|
| SF Symbol-style | Lucide icons (closest web equivalent to SF Symbols) | ☐ |
| Filled = active | Filled variant for active tab | ☐ |
| Outlined = inactive | Outlined variant for inactive | ☐ |
| Consistent weight | All icons same stroke weight | ☐ |
