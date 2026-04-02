# Capsule — Agent (AI Card Generation Rules)

This document defines how Capsule's AI pipeline transforms medical notes into illustrative learning cards.

---

## Pipeline

```
Image → OCR (GPT-4o Vision) → Points → Card Generation → Storage
```

### Step 1: OCR Extraction

**Input:** Photograph or scan of handwritten/printed medical notes.

**Model:** GPT-4o Vision

**Prompt strategy:**
- System prompt instructs extraction of atomic teaching points
- Each point should be a single concept: one drug, one disease, one mechanism
- Points are classified by concept type and category
- Output is structured JSON

**Output format:**
```json
{
  "points": [
    {
      "text": "Methotrexate inhibits dihydrofolate reductase, blocking folate metabolism required for DNA synthesis",
      "category": "Oncology",
      "concept": "Drug",
      "card_count": 1
    },
    {
      "text": "Acne pathophysiology: hormonal stimulation → sebum overproduction → follicular hyperkeratinization → C. acnes proliferation → inflammation",
      "category": "Dermatology",
      "concept": "Disease",
      "card_count": 2
    }
  ]
}
```

`card_count` > 1 when a concept has distinct layers (e.g., pathophysiology + management).

### Step 2: Card Generation

For each point, generate an illustrative learning card.

---

## Core Philosophy

- Every card is illustrative, not text-heavy.
- Every card teaches a causal story, not a restatement.
- The agent chooses the best visual logic for each concept.
- Visual clutter is reduced aggressively.
- Comprehension and retention over completeness.

---

## What Is Locked

- Output: polished illustrative medical learning card
- Format: quick scanning, low cognitive load
- Text: minimal
- Card: makes sense within seconds
- Image: clean, intentional, educational
- Visual language: consistent across collection

## What Is Not Locked

- Number of zones or panels
- Scan direction
- Composition type
- Whether the card uses anatomy, timeline, cross-section, pathway, comparison, or process flow

---

## Density Modes

### Quick-scan card
One dominant teaching story. Very low text. One main visual sentence.

### Summary board
Several linked subtopics within one concept. Multiple modules, timeline or progression arrows.

### Progressive disclosure sequence
Two or more coordinated images. Each teaches one layer. Sequence moves simple → deep.

---

## Visual Story Types

- Natural history story
- Site-of-action story
- Mechanism strip
- Interruption story
- Dual-action convergence
- Before-and-after
- Decision pathway
- Comparison
- Toxicity map

---

## Image Style

- Illustrative, not text-dense
- Clean, premium, editorial educational tone
- Minimal clutter
- Strong visual hierarchy
- Scanable in seconds
- Friendly, clear, not childish
- Consistent dimensions across collection
- Use anatomy and icons to reduce text burden
- The product shell should showcase real generated cards, not placeholder gradients or fake demo tiles
- Default presentation ratio is 16:9 unless the concept clearly benefits from another format

---

## Text Rules

- Micro-labels over sentences
- No paragraphs
- No repeated terms
- No decorative text
- Card works if viewer reads only title + 2-3 labels
- On product surfaces, explanatory copy should be aggressively minimized
- If the generated cards are present, let them carry the proof instead of adding extra descriptive text around them

---

## Accuracy

- Preserve study intent
- Correct inaccurate mechanisms
- Distinguish classic regimen vs. current framing when relevant

---

## Generation Checklist

Before generating each card:

1. What is the single main teaching point?
2. What visual story teaches it best?
3. Is the mechanism accurate?
4. Is text minimal enough?
5. Will the learner understand it in one scan?

## Product Shell Rules

- The marketing page should demonstrate Capsule immediately, not explain it at length.
- Avoid generic three-column SaaS feature blocks unless they directly extend the card experience.
- Do not hide the cards below excessive hero copy or badge rows.
- Wide 16:9 cards should not be forced into an overly narrow centered layout.
- Include obvious polish controls such as theme toggles when the interface aspires to premium product quality.
