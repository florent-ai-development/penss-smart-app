# Navigation Architecture

## Stack

Expo Router (file-based routing). All routes are **stack-based** — no bottom tab bar.

---

## File Structure

```
app/
├── index.tsx                        # Home screen
├── events/
│   ├── index.tsx                    # My Events list (active)
│   ├── archived.tsx                 # Archived Events list
│   └── [id].tsx                     # Event Detail (dynamic route)
├── new-event/
│   ├── _layout.tsx                  # Modal layout + NewEventContext provider
│   ├── step-1.tsx                   # Situation
│   ├── step-2.tsx                   # Emotion selection
│   ├── step-3.tsx                   # Automatic thoughts
│   ├── step-4.tsx                   # Rational thoughts
│   └── step-5.tsx                   # Re-evaluation
├── stress/
│   ├── index.tsx                    # Stress evaluation
│   └── history.tsx                  # Stress history
└── statistics/
    └── index.tsx                    # Statistics (Semaine/Mois/Année tabs)
```

> **Direct URL access guard**: Steps 2–5 must redirect to `step-1` if `draft.createdAt` is empty (i.e., the flow was not started from Home). In `_layout.tsx`, initialise `draft.createdAt` with `new Date().toISOString()` only when the layout first mounts — not on re-renders. This prevents stale drafts if the user navigates directly to `/new-event/step-3` via deep link.

---

## Navigation Map

```
Home (index)
  │
  ├── Tap central lightning bolt ──────────→ new-event/step-1
  │
  ├── "Mes événements" ─────────────────→ events/index
  │       └── Tap event card ──────────→ events/[id]
  │
  ├── "Mes événements archivés" ────────→ events/archived
  │       └── Tap event card ──────────→ events/[id]
  │
  ├── "Évaluation du stress" ──────────→ stress/index
  │       └── "Voir l'historique" ─────→ stress/history
  │
  └── "Mes statistiques" ────────────→ statistics/index


new-event/ flow (forward-only — no back navigation between steps):
  step-1 ──Suite──→ step-2 ──Suite──→ step-3 ──Suite──→ step-4 ──Suite──→ step-5
  step-5 ──Enregistrer──→ events/index (replace entire modal stack)
  Any step ──✕──→ Home (dismiss entire flow, discard draft, no confirmation needed)
```

---

## Navigation Behavior Details

### New Event Flow
- Presented as a **modal stack** (slides up from bottom on iOS, fills screen).
- The `new-event/_layout.tsx` wraps all 5 steps. It holds the **draft state** (a partial `Event` object) in a React Context (`NewEventContext`). Each step reads/writes to this context.
- Closing (✕) discards the draft and navigates back to Home (`router.dismissAll()`).
- "Suite →" is **disabled** (opacity 0.4, non-pressable) until the current step has the minimum required input:
  - Step 1: `situation.trim().length > 0`
  - Step 2: at least one emotion selected
  - Step 3: can proceed with empty thoughts (button says "Suite" even if no thought added)
  - Step 4: can proceed with empty rational thoughts
  - Step 5: always enabled (slider has a default value)
- On final step, "Enregistrer →" saves the complete event and navigates to `events/index`.

### Event Detail
- Received via route param: `router.push({ pathname: '/events/[id]', params: { id } })`
- Archive action: sets `status = 'archived'`, `archivedAt = new Date().toISOString()`, then navigates back.
- Delete action: shows a **confirmation alert** (`Alert.alert`) before deleting, then navigates back.

### Statistics Tabs
- Period selector (Semaine / Mois / Année) is **local state** inside `statistics/index.tsx` — not a separate route.

---

## NewEventContext

```ts
// app/new-event/_layout.tsx

interface NewEventDraft {
  createdAt: string;             // ISO string — set once when layout mounts
  situation: string;
  selectedEmotionIds: string[];  // step 2 — emotion ids only; initialIntensity always = 50
  automaticThoughts: AutomaticThought[];
  rationalThoughts: RationalThought[];
  // step 5 — keyed by emotionId; populated on "Enregistrer"
  finalEmotionIntensities: Record<string, number>;
}

interface NewEventContextValue {
  draft: NewEventDraft;
  setSituation: (text: string) => void;
  toggleEmotion: (emotionId: string) => void;  // add if absent, remove if present
  addAutomaticThought: (thought: AutomaticThought) => void;
  removeAutomaticThought: (index: number) => void;
  addRationalThought: (thought: RationalThought) => void;
  removeRationalThought: (index: number) => void;
  setFinalIntensity: (emotionId: string, value: number) => void;
  // Assembles AppEvent and calls EventRepository.save():
  //   emotions = selectedEmotionIds.map(id => ({
  //     emotionId: id,
  //     initialIntensity: 50,
  //     finalIntensity: finalEmotionIntensities[id] ?? 50
  //   }))
  saveDraft: () => Promise<void>;
}
```
