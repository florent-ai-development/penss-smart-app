# Screen Specifications

---

## 1. Home Screen (`app/index.tsx`)

### Background
Full-screen linear gradient: `#4DD9F0` (top) → `#2979FF` (bottom).

### Layout (top to bottom)

#### Top Bar (no header component — custom)
- **Top-left**: Settings icon button (`Ionicons: settings`, 28px, white). Tappable → future settings screen (no-op for now, show toast "Bientôt disponible").
- **Top-right**: Notification icon container: lightning bolt icon on a `#2979FF` rounded-square (44×44, borderRadius 12), with a yellow badge (`#FFD600`) showing count "20" in the top-right corner of the icon.

#### Central Logo Area
- Centered horizontally, positioned in the upper 40% of the screen.
- Large rounded-square container (120×120, borderRadius 28, background: `rgba(255,255,255,0.25)`).
- Inside: white lightning bolt icon (60px).
- Tappable area (the whole container) → navigates to `new-event/step-1`.
- Below container, centered text: `"Taper pour saisir un nouvel événement."` — white, 15px, regular weight.

#### Menu List
- Vertical stack of `HomeMenuItem` cards.
- Container: `marginTop: 24`, `paddingHorizontal: 16`, gap between items: `12`.
- 4 items in order:

| # | Icon | Icon bg | Label |
|---|---|---|---|
| 1 | `Ionicons: flash` | `#2979FF` | Mes événements |
| 2 | `Ionicons: archive` | `#9E9E9E` | Mes événements archivés |
| 3 | `MaterialCommunityIcons: pulse` | `#2979FF` | Évaluation du stress |
| 4 | `Ionicons: bar-chart` | `#2979FF` | Mes statistiques |

Each item navigates to its respective screen on press.

---

## 2. New Event – Step 1: Situation (`app/new-event/step-1.tsx`)

### Background
Gradient (`#4DD9F0` → `#2979FF`).

### Layout
```
[StepProgress: 1/5]  "Détail de la situation"    [✕]
─────────────────────────────────────────────────────
📅 Date   14 mars 2026 - 10:30

┌───────────────────────────────────────────────────┐
│ Décrivez ici l'événement ou la situation qui a    │
│ déclenché la contrariété...                       │
│                                                   │
│  (multiline TextInput, ~6 lines visible)          │
└───────────────────────────────────────────────────┘

                ● ─ ─ ─ ─   (StepDots, step 1)

        [ Suite → ]  (disabled until text entered)
```

### Details
- **StepProgress** (top-left): circular arc, `current=1`, `total=5`.
- **Title** (top-center): "Détail de la situation", white, 20px bold.
- **Close button** (top-right): `Ionicons: close-circle`, white, 28px. Dismisses entire modal.
- **Date row**: calendar icon (`Ionicons: calendar-outline`, 16px, white) + date text (white, 13px). Date is `draft.createdAt` — set once when `_layout.tsx` mounts. Format: `dd MMMM yyyy - HH:mm` using `date-fns/fr`. The same date is shown on **all 5 steps** without change.
- **TextInput**:
  - `backgroundColor: rgba(255,255,255,0.25)`
  - `borderRadius: 16`
  - `padding: 14`
  - `color: white`
  - Placeholder: `"Décrivez ici l'événement ou la situation qui a déclenché la contrariété..."` in `rgba(255,255,255,0.6)`
  - `multiline: true`, `textAlignVertical: top`
  - Height: use `minHeight: 140` (roughly 6 lines) — do NOT rely on `numberOfLines` for height as it is unreliable on iOS. Use `minHeight` + let the input grow with content (`scrollEnabled: false`).
- **StepDots**: `current=1`, `total=5`.
- **Suite button**: `PillButton` variant `primary`, disabled when `situation.trim() === ''`. Label: `"Suite →"`.

---

## 3. New Event – Step 2: Emotion (`app/new-event/step-2.tsx`)

### Background
Gradient (`#4DD9F0` → `#2979FF`).

### Layout
```
[StepProgress: 2/5]  "L'émotion ressentie"    [✕]
─────────────────────────────────────────────────────
📅 Date   16 mars 2026 - 11:49

Quelles émotions ressentez-vous ?

[ Négatives  |  Positives ]   (toggle pill)

┌──────┐  ┌──────┐  ┌──────┐
│  😰  │  │  😤  │  │  😡  │
│Déb.  │  │Frus. │  │En c. │
└──────┘  └──────┘  └──────┘
┌──────┐  ┌──────┐  ┌──────┐
│  😨  │  │  😓  │  │  😬  │
│Anx.  │  │Stre. │  │Nerv. │
└──────┘  └──────┘  └──────┘
┌──────┐  ┌──────┐  ┌──────┐
│  😟  │  │  😔  │  │  😞  │
│Inq.  │  │Coup. │  │Déçu  │
└──────┘  └──────┘  └──────┘

        [ 🔒 Personnaliser ]

                ─ ● ─ ─ ─   (StepDots, step 2)

        [ Suite → ]  (disabled until ≥1 emotion selected)
```

### Details
- **Polarity toggle**: `PolarityToggle` component. Full width, height 40. Dark theme throughout — active segment has slightly lighter dark bg + white bold text; inactive has semi-transparent white text. Tap switches displayed emotions grid.
- **Emotion grid**: `FlatList` with `numColumns={3}`, `columnWrapperStyle={{ gap: 8 }}`, row gap 8. Each `EmotionButton` shows emoji + label.
- **Selected state**: tapping an emotion selects it (toggle). Multiple selections allowed. Selected buttons have `border: 2px solid #00C8E0`.
- **Personnaliser button**: full-width, dark bg, locked icon (`🔒`). Non-functional for now (show "Fonctionnalité à venir" toast).
- **Suite**: disabled until at least 1 emotion selected.

> **Note**: The initial intensity slider for each selected emotion is NOT shown in step 2 in the screenshots. The initial intensity defaults to 50. It is only recalled (as read-only reference) in step 5.

---

## 4. New Event – Step 3: Automatic Thoughts (`app/new-event/step-3.tsx`)

### Background
Gradient (`#4DD9F0` → `#2979FF`).

### Layout
```
[StepProgress: 3/5]  "Détail des pensées automatiques"    [✕]
─────────────────────────────────────────────────────────────
📅 Date   16 mars 2026 - 11:50

┌───────────────────────────────────────────────────┐
│ Décrivez ici les pensées automatiques qui vous    │
│ viennent en tête...                               │
└───────────────────────────────────────────────────┘

Quel est le niveau de croyance de vos pensées
automatiques ?

  [──────────────●──────────────]
  0                            100
               50

[ Ajouter cette pensée ]

                ─ ─ ● ─ ─   (StepDots, step 3)

        [ Suite → ]
```

### Details
- **Previously added thoughts list**: shown above the TextInput. Renders `draft.automaticThoughts` as a stacked list of semi-transparent white rows (`backgroundColor: rgba(255,255,255,0.18)`, `borderRadius: 10`, `padding: 10`). Each row: thought text (white, 13px) on the left + `"Croyance: X%"` (white 60% opacity, 12px) on the right + red `×` icon to remove. Hidden when list is empty.
- **TextInput**: same style as step 1. Placeholder: `"Décrivez ici les pensées automatiques qui vous viennent en tête..."`
- **Belief slider**: `StressSlider`, min=0, max=100, default=50. No left/right labels. Value shown below center.
- **"Ajouter cette pensée" button**: `PillButton` variant `outline`. On press:
  - If `text.trim() === ''`, do nothing.
  - Otherwise call `addAutomaticThought({ text, beliefLevel })`, clear the TextInput, reset slider to 50.
  - The user can add multiple thoughts by repeating this.
- **Suite**: always enabled (user may proceed without adding any thought).

---

## 5. New Event – Step 4: Rational Thoughts (`app/new-event/step-4.tsx`)

### Background
Gradient (`#4DD9F0` → `#2979FF`).

### Layout
```
[StepProgress: 4/5]  "Pensées rationnelles"    [✕]
─────────────────────────────────────────────────────
📅 Date   16 mars 2026 - 11:52

Votre pensée contient-elle des biais ?

┌──────────────────────────────────────────────────┐
│ 💣  Catastrophisation                            │
│      "Et si le pire arrivait ?"                  │
└──────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────┐
│ 😤  Tout ou rien                                 │
│      "Je suis nul."                              │
└──────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────┐
│ 🌀  Raisonnement émotionnel                      │
│      "Je ressens ça, donc ça doit être vrai."    │
└──────────────────────────────────────────────────┘
  ... (scrollable list of all biases)

┌───────────────────────────────────────────────────┐
│ Prenez du recul par rapport aux pensées           │
│ automatiques en listant ici des réponses          │
│ rationnelles face à l'événement ou la situation.. │
└───────────────────────────────────────────────────┘

Quel est le niveau de croyance dans les pensées
rationnelles ?

  [──────────────●──────────────]
  0                            100
               50

[ Ajouter cette pensée ]

                ─ ─ ─ ● ─   (StepDots, step 4)

                  [ Suite → ]
```

### Details
> **Important**: The full step 4 content (bias list + text area + slider + add button + added thoughts) exceeds one screen. Wrap the entire step content in a `ScrollView`.

- **Bias list**: vertical list of `CognitiveBiasButton` (not a FlatList — render statically inside ScrollView). Multiple can be selected (toggle). Selected → teal border. Selection state is local (per thought composition), reset to empty after "Ajouter cette pensée".
- **Previously added rational thoughts**: shown above the bias list, same visual style as step 3's thought list. Each row: rational thought text + `"Croyance: X%"` + `×` remove icon. Hidden when list is empty.
- **TextInput**: placeholder as shown. User writes their rational reframe.
- **Belief slider**: same as step 3, for rational thought belief level.
- **"Ajouter cette pensée"**: call `addRationalThought({ text, beliefLevel, selectedBiasIds })`, clear text + reset slider to 50 + deselect all biases.
- **Suite**: always enabled.

---

## 6. New Event – Step 5: Re-evaluation (`app/new-event/step-5.tsx`)

### Background
Gradient (`#4DD9F0` → `#2979FF`).

### Layout
```
[StepProgress: 5/5]  "Nouvelle évaluation de l'émotion ressentie"    [✕]
─────────────────────────────────────────────────────────────────────
📅 Date   16 mars 2026 - 11:52

Rappel de l'émotion ressentie

  ┌──────┐
  │  😤  │    (EmotionButton selected, non-interactive)
  │Frust.│
  └──────┘

Rappel de l'intensité de l'émotion initiale

  [─────────────●───────────────]   (read-only, red thumb, shows initial value)
  0                             100

Maintenant, quel est le niveau d'intensité de
l'émotion initialement ressentie ?

  [──────────────●──────────────]   (editable, default = initialIntensity)
  0                             100

                ─ ─ ─ ─ ●   (StepDots, step 5)

              [ Enregistrer → ]
```

### Details
- **Multiple emotions**: if the user selected more than one emotion in step 2, render each emotion as its own block, stacked vertically (wrapped in a `ScrollView`). Each block contains:
  - Emotion chip (non-interactive display)
  - Read-only reference slider (initial intensity = 50)
  - Editable slider (default = 50, updates `finalEmotionIntensities[emotionId]`)
- **Reference slider** (read-only): `StressSlider` with `readonly: true`. Thumb reduced opacity. Shows `initialIntensity = 50`.
- **Editable slider**: interactive, initial value = 50. On change: call `setFinalIntensity(emotionId, value)`.
- **"Enregistrer →"**: `PillButton` variant `primary`. On press:
  1. For any emotion not yet adjusted, `finalIntensity` defaults to 50.
  2. Calls `saveDraft()` — assembles `AppEvent` and persists it.
  3. Navigates to `events/index` replacing the modal stack (`router.replace('/events')`).

---

## 7. My Events (`app/events/index.tsx`)

### Background
Light: `#F2F6FF`.

### Header
`ScreenHeader`, title: `"Mes événements"`.

### Empty State
When `events.length === 0`:
```
        (centered vertically)
        [lightning bolt icon, large, ghost/faded]
        "Aucun événement enregistré"
        [ Créer un événement ]   (white pill button → new-event/step-1)
```

### List State
`FlatList` of `EventCard`.
- `contentContainerStyle: { padding: 16, gap: 12 }`

**EventCard contents**:
- Left: 40×40 blue rounded square with white lightning bolt.
- Top line: calendar icon + `"dd/M/yyyy - HH:mm"` (blue, 13px).
- Second line: `situation` text (dark, 14px, bold, `numberOfLines: 1`).
- Third line: row of `EmotionChip` for each `EventEmotion` (showing emotion label).
- Tap → navigate to `events/[id]`.

### FAB (Floating Action Button)
- Absolute positioned, bottom-right (or bottom-center based on screenshot): 24px from bottom, centered.
- Blue rounded circle (56×56), white lightning bolt icon (28px).
- Tap → `new-event/step-1`.

> In the screenshot the FAB appears centered at the bottom. Position it at bottom-center, `bottom: 24`.

---

## 8. My Events – Archived (`app/events/archived.tsx`)

### Background
Light: `#F2F6FF`.

### Header
`ScreenHeader`, title: `"Événements archivés"`.

### List
Same as My Events list, but:
- Loads `EventRepository.getArchived()`.
- EventCard icon: gray rounded square (not blue) with archive icon.
- No FAB.

### Empty State
Centered: ghost archive icon + `"Aucun événement archivé"`.

---

## 9. Event Detail (`app/events/[id].tsx`)

### Background
Light: `#F2F6FF`.

### Header
`ScreenHeader`, title: `"Détail de l'événement"`.

### Layout
```
📅 16/4/2026 - 11:53

┌──────────────────────────────────┐
│ Situation                        │
│                                  │
│  ddd                             │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Émotions                         │
│                                  │
│  Frustré          Intensité: 50/100 │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Pensées automatiques             │
│                                  │
│ ▎ Je me sens triste              │
│   Croyance: 91%                  │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Pensées rationnelles             │
│                                  │
│ ▎ Je peux gérer cette situation  │
│   Croyance: 70%                  │
│   Biais : Catastrophisation      │
└──────────────────────────────────┘

  [ 🗃 Archiver ]    [ 🗑 Supprimer ]
```

### Details
- **Date**: `Ionicons: calendar-outline` + formatted date (blue, 14px). Full width, `marginBottom: 16`.
- **Situation card**: `Card` component. Title "Situation" in blue bold. Body: `event.situation` text.
- **Emotions card**: `Card`. Title "Émotions". One row per `EventEmotion`:
  - Left: emotion label (dark, 14px).
  - Right: `"Intensité: X/100"` where X = `finalIntensity` (blue, 13px).
  - If there are multiple emotions, stack them vertically with a divider.
- **Automatic Thoughts card**: `Card`. Title "Pensées automatiques". Hidden if `event.automaticThoughts.length === 0`. One block per thought:
  - Left border: 3px solid `#2979FF` (vertical blue bar), `paddingLeft: 10`.
  - Text: thought text (dark, 14px).
  - Below text: `"Croyance: X%"` (gray, 12px) where X = `beliefLevel`.
  - Padding between thought blocks: 8px.
- **Rational Thoughts card**: `Card`. Title "Pensées rationnelles". Hidden if `event.rationalThoughts.length === 0`. One block per thought:
  - Left border: 3px solid `#00C8E0` (teal — visually distinct from automatic thoughts).
  - Text: rational thought text (dark, 14px).
  - Below text: `"Croyance: X%"` (gray, 12px).
  - If `selectedBiasIds.length > 0`: row of small bias labels (`"Biais : Catastrophisation, Tout ou rien"`) in gray, 11px, below the croyance line.
  - Padding between thought blocks: 8px.
- **Action buttons**: horizontal row, equal width, `gap: 12`.
  - "Archiver": `PillButton` variant `outline`, icon `Ionicons: archive`.
    - Only shown if `event.status === 'active'`.
    - On press: `EventRepository.archive(id)`, navigate back.
  - "Supprimer": `PillButton` variant `destructive`, icon `Ionicons: trash`.
    - On press: show `Alert.alert("Supprimer l'événement", "Cette action est irréversible.", [{text: "Annuler"}, {text: "Supprimer", style: "destructive", onPress: ...}])`.
    - On confirm: `EventRepository.delete(id)`, navigate back.

---

## 10. Stress Evaluation (`app/stress/index.tsx`)

### Background
Gradient (`#4DD9F0` → `#2979FF`).

### Header
`ScreenHeader` (blue), title: `"Évaluation du stress"`.

### Layout
```
         1 sur 1    (StepProgress, current=1, total=1)

   Votre niveau de stress global de la journée
              16 avril 2026

         ┌──────────────────┐
         │       😐          │
         └──────────────────┘

       Évaluez votre niveau de stress

   [───────────────●─────────────────]
   0 – Calme                10 – Extrême
                  5

        [ ⏱ Voir l'historique ]

        [ Enregistrer cette mesure ]
```

### Details
- **StepProgress**: `current=1`, `total=1`. Shows that this is a single-question form.
- **Title**: "Votre niveau de stress global de la journée" — white, 20px bold, centered.
- **Date**: formatted as `"dd MMMM yyyy"` in French (e.g., "16 avril 2026"). White, 14px, centered.
- **StressEmoji**: `diameter: 120`. Emoji and background color update live as slider moves.
- **Slider label**: "Évaluez votre niveau de stress" — white, 15px.
- **StressSlider**: min=0, max=10, default=5. Left label: `"0 – Calme"`, right label: `"10 – Extrême"`. Current value shown below center (large, white, bold).
- **"Voir l'historique"** button: `PillButton` variant `ghost` with `Ionicons: time` icon. Navigates to `stress/history`.
- **"Enregistrer cette mesure"** button: `PillButton` variant `primary`.
  - On press:
    1. Check if a stress entry already exists for today (`StressRepository.getByDate(today)`).
    2. If yes: `Alert.alert` asking to replace ("Une mesure existe déjà pour aujourd'hui. Voulez-vous la remplacer ?").
    3. Create/update `StressEntry { id, date: today, level, createdAt }` and save.
    4. Show brief success feedback (toast or brief animation), then navigate back.

---

## 11. Stress History (`app/stress/history.tsx`)

### Background
White: `#FFFFFF`.

### Header
`ScreenHeader` (blue), title: `"Historique du stress"`.

### Layout
`FlatList` of stress history cards. `contentContainerStyle: { padding: 16, gap: 12 }`.

**Stress History Card** (`Card`):
```
┌─────────────────────────────────────────────────────┐
│  📅 16/4/2026              [ 😱 ]  (emoji in colored square) │
│                                                     │
│  Niveau de stress                         7/10      │
│  [█████████░░░░░░░]   (progress bar, colored)        │
└─────────────────────────────────────────────────────┘
```
- **Date**: `Ionicons: calendar-outline` + `"dd/M/yyyy"` in blue.
- **Emoji square**: 44×44 rounded (borderRadius 10), background color = `stressEmojiColor(level)`, emoji inside.
- **"Niveau de stress" label**: dark, 14px.
- **Value**: `"X/10"` right-aligned, bold, dark.
- **Progress bar**: height 8, borderRadius 4, `width = (level/10)*100%`, color = `stressEmojiColor(level)`.

Sorted by `date` descending (most recent first).

### Empty State
When `stressEntries.length === 0`: centered ghost emoji (😌, large, low opacity) + `"Aucune mesure enregistrée"` (dark, 15px) + `"Utilisez l'évaluation du stress pour enregistrer votre premier niveau."` (gray, 13px, centered).

---

## 12. Statistics (`app/statistics/index.tsx`)

### Background
White: `#F2F6FF`.

### Header
`ScreenHeader` (blue), title: `"Mes statistiques"`.

### Layout (scrollable)
```
┌──────────────────────────────────────────┐  ← Summary card (gradient blue)
│  ⚡  1                                    │
│     Événements                           │
│  1 Événement archivé                     │
└──────────────────────────────────────────┘

[ Semaine ]  [ Mois ]  [ Année ]   ← Period tab selector

┌──────────────────────────────────────────┐
│  ↗ Les événements recensés dans le temps  │
│                                          │
│  [bar chart / line chart]                │
│                                          │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Les émotions recensées les plus         │
│  ressenties                              │
│                                          │
│         [donut chart]                    │
│                                          │
│  ● Frustré                           1   │
│  ● Anxieux                           2   │
└──────────────────────────────────────────┘
```

### Details

#### Summary Card
- Full-width, gradient `#29A9F5` → `#2979FF`, `borderRadius: 16`, `padding: 20`.
- Row 1: lightning bolt icon (white, 28px) + large number (**active** events count, white, 36px bold) + "Événements" label (white, 14px).
- Row 2: `"X Événement(s) archivé(s)"` — white, 13px. Uses `getArchived().length`.
- Data: `getActive()` for the main count, `getArchived()` for the sub-label. Do NOT use `getAll()` for the main number as it would double-count.

#### Period Tabs
- Three pill buttons in a row: "Semaine", "Mois", "Année".
- Container: `backgroundColor: #EEEEEE`, `borderRadius: 30`, `padding: 4`.
- Active tab: white bg, teal text (`#00C8E0`), shadow.
- Inactive: transparent bg, gray text.

#### Events Over Time Chart
`Card`. Header row: `Ionicons: trending-up` + title "Les événements recensés dans le temps".

Chart type by period:
- **Semaine** (week): bar chart. X-axis = 7 days (Mon–Sun), Y-axis = count. Bar color: `#00C8E0`.
- **Mois** (month): bar chart. X-axis = days 1–31 (or actual days in month), bar color: `#00C8E0`.
- **Année** (year): bar chart. X-axis = months abbreviated (jan., févr., mars, avr., mai, juin, juil., août, sept., oct., nov., déc.). Y-axis = count. Bar color: `#00C8E0`.

If no data in the selected period: show dashed border empty area with placeholder text "Aucune donnée".

#### Emotions Donut Chart
`Card`. Title: "Les émotions recensées les plus ressenties".

- Donut chart centered (outer radius ~80, inner radius ~55). Each slice = one emotion, color-coded.
- Legend below: one row per emotion. Left: colored dot (10px) + emotion label. Right: count.
- Colors: generate from a palette e.g., `['#00C8E0', '#2979FF', '#FF7043', '#66BB6A', '#AB47BC', ...]`.
- Sorted by count descending.
- If no data: show empty donut outline with "Aucune donnée".

#### Data Scope by Period
- **Semaine**: events created in the current calendar week (Mon 00:00 → Sun 23:59).
- **Mois**: events created in the current calendar month.
- **Année**: events created in the current calendar year.
- **Both active and archived events** are included in the charts — the charts show all journaling history regardless of archive status. Only the summary card distinguishes them.

---

## Error & Edge Cases

| Situation | Behavior |
|---|---|
| No events at all | My Events shows empty state |
| No archived events | Archived list shows empty state with archive icon |
| Stress entry already exists today | Alert before overwrite |
| No stress entries | Stress History shows empty state |
| No stats data for period | Chart areas show "Aucune donnée" placeholder |
| Step 1 textarea empty | "Suite" button disabled |
| Step 2 no emotion selected | "Suite" button disabled |
