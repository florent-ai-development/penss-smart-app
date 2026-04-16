# Build Prompt — PENSS App

You are an expert React Native / Expo developer. Your task is to implement the **PENSS** app from scratch, following the detailed specifications in the `docs/` folder of this repository. Read every spec file before writing any code.

---

## Step 0 — Read the specs first

Read these files in order before touching any code:

1. `docs/overview.md` — purpose, screen list, tech stack
2. `docs/design-system.md` — colors, typography, spacing, every reusable component
3. `docs/data-model.md` — TypeScript types, static data, repository interfaces
4. `docs/navigation.md` — file structure, navigation map, NewEventContext
5. `docs/screens.md` — pixel-level spec for every screen and every edge case

Do not start implementing until you have read all five files.

---

## Step 1 — Understand the existing project state

The project already exists. Key facts:

- **Expo SDK**: 55 (not 52 — use SDK 55 compatible package versions)
- **React Native**: 0.83.4
- **React Native Reanimated**: 4.2.1 (this is Reanimated **4**, not 3 — the API differs)
- **App root**: `src/app/` — Expo Router is configured with `"main": "expo-router/entry"` and all routes live under `src/app/`
- **TypeScript**: `~5.9.2`
- The `src/app/` directory currently contains boilerplate files (`index.tsx`, `explore.tsx`, `_layout.tsx`)
- The `src/components/` directory contains boilerplate components that are not needed

Already installed (do NOT reinstall):
- `expo-router ~55.0.12`
- `react-native-reanimated 4.2.1`
- `react-native-safe-area-context ~5.6.2`
- `react-native-screens ~4.23.0`
- `react-native-gesture-handler ~2.30.0`
- `@react-navigation/native`, `@react-navigation/bottom-tabs`

---

## Step 2 — Install missing dependencies

Run these installs before writing any code:

```bash
npx expo install @react-native-async-storage/async-storage
npx expo install expo-linear-gradient
npx expo install expo-crypto
npx expo install @expo/vector-icons
npx expo install date-fns
npx expo install react-native-gifted-charts
```

> `@expo/vector-icons` ships with Expo but must be explicitly listed for TypeScript types.
> `react-native-gifted-charts` requires `react-native-svg` — install it too:

```bash
npx expo install react-native-svg
```

---

## Step 3 — Clean the boilerplate

Delete all existing boilerplate before starting:

- Delete everything inside `src/app/` except `_layout.tsx` (you will rewrite it)
- Delete everything inside `src/components/` (you will create your own)
- Keep `src/constants/theme.ts` if present (you will replace its content)

---

## Step 4 — Build in this exact order

Work through each phase completely before moving to the next. Do not skip phases.

### Phase 1 — Types and constants

Create these files:

**`src/types/index.ts`**
Define all TypeScript types from `docs/data-model.md`:
- `EmotionPolarity`, `Emotion`, `CognitiveBias`
- `AutomaticThought`, `RationalThought`, `EventEmotion`
- `AppEvent`, `EventStatus` — use `AppEvent`, NOT `Event` (reserved DOM type)
- `StressEntry`

**`src/constants/colors.ts`**
Export the full `Colors` object from `docs/design-system.md`. Copy it exactly.

**`src/constants/typography.ts`**
Export the `Typography` object from `docs/design-system.md`. Import `Colors` from `./colors`.

**`src/constants/spacing.ts`**
Export the `Spacing` object from `docs/design-system.md`.

**`src/data/emotions.ts`**
Export `DEFAULT_EMOTIONS: Emotion[]` from `docs/data-model.md`. Copy the full array exactly.

**`src/data/biases.ts`**
Export `DEFAULT_COGNITIVE_BIASES: CognitiveBias[]` from `docs/data-model.md`. Copy the full array exactly.

### Phase 2 — Storage layer

**`src/storage/keys.ts`**
```ts
export const STORAGE_KEYS = {
  EVENTS: '@penss/events',
  STRESS_ENTRIES: '@penss/stress',
};
```

**`src/storage/eventRepository.ts`**
Implement `EventRepository` with these methods, all using AsyncStorage:
- `getAll(): Promise<AppEvent[]>` — read and JSON.parse the EVENTS key; return `[]` if null
- `getById(id: string): Promise<AppEvent | null>`
- `getActive(): Promise<AppEvent[]>` — filter by `status === 'active'`
- `getArchived(): Promise<AppEvent[]>` — filter by `status === 'archived'`
- `save(event: AppEvent): Promise<void>` — upsert by id (read all, replace if exists, push if new, write back)
- `archive(id: string): Promise<void>` — set `status = 'archived'`, `archivedAt = new Date().toISOString()`
- `delete(id: string): Promise<void>` — filter out by id and write back

**`src/storage/stressRepository.ts`**
Implement `StressRepository`:
- `getAll(): Promise<StressEntry[]>` — read STRESS_ENTRIES key; return `[]` if null
- `getByDate(date: string): Promise<StressEntry | null>` — find entry where `entry.date === date`
- `save(entry: StressEntry): Promise<void>` — UPSERT by `date` field (not by `id`): if an entry for the same date exists, replace it entirely; otherwise push

### Phase 3 — Reusable components

Create one file per component in `src/components/`. Implement each component exactly as specified in `docs/design-system.md`. Do NOT add props or features not listed in the spec.

Build them in dependency order:

1. **`src/components/GradientScreen.tsx`**
   - Uses `expo-linear-gradient` `LinearGradient`
   - Full screen, colors `['#4DD9F0', '#2979FF']`, `start={{ x: 0, y: 0 }}`, `end={{ x: 0, y: 1 }}`
   - Props: `children: ReactNode`, `style?: ViewStyle`

2. **`src/components/ScreenHeader.tsx`**
   - Solid blue (`#29A9F5`) bar, safe-area aware (`useSafeAreaInsets` for top padding)
   - Back arrow left, centered title, optional right slot
   - Props: `title: string`, `onBack: () => void`, `rightSlot?: ReactNode`

3. **`src/components/Card.tsx`**
   - White rounded card with shadow (spec values from design-system.md)
   - Props: `children: ReactNode`, `style?: ViewStyle`

4. **`src/components/PillButton.tsx`**
   - Four variants: `primary`, `destructive`, `outline`, `ghost`
   - Disabled state: `opacity: 0.4`, native `disabled` prop on Pressable
   - Props: `label: string`, `onPress: () => void`, `variant`, `disabled?: boolean`, `icon?: ReactNode`

5. **`src/components/EmotionChip.tsx`**
   - Small blue pill tag
   - Props: `label: string`

6. **`src/components/StepProgress.tsx`**
   - Circular arc using `react-native-svg` `Circle` elements
   - Background arc stroke `rgba(255,255,255,0.3)`, fill arc white, animated with Reanimated
   - Center text `"X sur Y"`
   - Props: `current: number`, `total: number`

7. **`src/components/StepDots.tsx`**
   - `total` dots, active = elongated white pill (width 20), inactive = small faded circle
   - Props: `current: number` (1-indexed), `total: number`

8. **`src/components/PolarityToggle.tsx`**
   - Dark-themed two-segment pill (NOT white background — both segments are dark)
   - Props: `value: 'negative' | 'positive'`, `onChange: (v: 'negative' | 'positive') => void`

9. **`src/components/EmotionButton.tsx`**
   - Dark square card, 3-column grid item
   - Width: `(Dimensions.get('window').width - 2 * 16 - 2 * 8) / 3`
   - Selected: `borderWidth: 2`, `borderColor: '#00C8E0'`
   - Props: `emoji: string`, `label: string`, `selected: boolean`, `onPress: () => void`

10. **`src/components/CognitiveBiasButton.tsx`**
    - Full-width dark card, optional emoji, title + subtitle
    - Selected: teal border
    - Props: `title: string`, `subtitle: string`, `emoji?: string`, `selected: boolean`, `onPress: () => void`

11. **`src/components/StressSlider.tsx`**
    - Custom slider using Reanimated + PanGestureHandler (from `react-native-gesture-handler`)
    - Track, fill, thumb
    - Below track: `flexDirection: 'row'` with leftLabel and rightLabel
    - Below labels: centered current value (large bold)
    - `readonly` mode: reduced thumb opacity, no gesture
    - Props: `value: number`, `min: number`, `max: number`, `onChange: (v: number) => void`, `leftLabel?: string`, `rightLabel?: string`, `readonly?: boolean`

    > **Reanimated 4 note**: Use `useSharedValue`, `useAnimatedStyle`, `useDerivedValue` from `react-native-reanimated`. The gesture system uses `Gesture.Pan()` from `react-native-gesture-handler` with `GestureDetector`. Do NOT use the old `PanGestureHandler` component API.

12. **`src/components/StressEmoji.tsx`**
    - Circle container, diameter 120, background color from stress level
    - Emoji inside, fontSize 64
    - Color mapping (implement as a function `getStressColor(level: number): string`):
      - 0–2 → `#66BB6A` (green), emoji `😌`
      - 3–4 → `#9CCC65` (light green), emoji `🙂`
      - 5   → `#FFA726` (orange), emoji `😐`
      - 6–7 → `#EF5350` (red-orange), emoji `😟`
      - 8–9 → `#E53935` (red), emoji `😰`
      - 10  → `#B71C1C` (dark red), emoji `😱`
    - Props: `level: number`

13. **`src/components/EventCard.tsx`**
    - White card, left icon, date, situation text, emotion chips row
    - Active events: blue icon bg; archived events: gray icon bg with archive icon
    - Props: `event: AppEvent`, `onPress: () => void`, `archived?: boolean`

14. **`src/components/HomeMenuItem.tsx`**
    - Full-width white card row: icon container + label + chevron
    - Props: `icon: ReactNode`, `label: string`, `onPress: () => void`

### Phase 4 — Navigation layout

**`src/app/_layout.tsx`**
Root layout for Expo Router. Configure a `Stack` navigator. Hide the default header on all screens (each screen manages its own header). Enable gesture navigation. Set the `backgroundColor` of the stack to `#F2F6FF` to avoid flashes.

```tsx
<Stack screenOptions={{ headerShown: false }} />
```

### Phase 5 — New Event flow context and layout

**`src/context/NewEventContext.tsx`**
Implement the `NewEventDraft` interface and `NewEventContextValue` exactly as defined in `docs/navigation.md`. Key points:
- `createdAt` is set to `new Date().toISOString()` when the context Provider first mounts (use `useRef` to set it once, not on every render)
- `toggleEmotion` adds the id if absent, removes it if present
- `saveDraft` assembles an `AppEvent` with `id = randomUUID()` from `expo-crypto`, maps `selectedEmotionIds` to `EventEmotion[]` with `initialIntensity: 50` and `finalIntensity` from `finalEmotionIntensities` (defaulting to 50 if not set), then calls `EventRepository.save()`

**`src/app/new-event/_layout.tsx`**
- Wraps all 5 steps in `NewEventContext.Provider`
- Presented as a modal: configure `presentation: 'modal'` on the parent `Stack.Screen`
- Steps 2–5: on mount, if `draft.createdAt` is an empty string, redirect to `step-1` using `router.replace('/new-event/step-1')`

### Phase 6 — Screens

Implement each screen in the order below. For each screen, read the corresponding section in `docs/screens.md` before writing a single line.

#### 6.1 Home Screen — `src/app/index.tsx`
- `GradientScreen` background
- Custom top bar (settings icon left, notification badge right) — NO `ScreenHeader` component here
- Central tappable logo → `router.push('/new-event/step-1')`
- 4 `HomeMenuItem` cards
- The notification badge count is hardcoded to `20` for now

#### 6.2 New Event Step 1 — `src/app/new-event/step-1.tsx`
- `GradientScreen`, no `ScreenHeader`
- Custom header row: `StepProgress` (1/5) + title + close button
- Date row (displays `draft.createdAt`, formatted with `date-fns/fr` as `"dd MMMM yyyy - HH:mm"`)
- Multiline `TextInput` — use `minHeight: 140`, NOT `numberOfLines`
- `StepDots` (current=1)
- `PillButton` primary, disabled when `draft.situation.trim() === ''`

#### 6.3 New Event Step 2 — `src/app/new-event/step-2.tsx`
- `GradientScreen`, custom header (StepProgress 2/5, title, close)
- `PolarityToggle` to switch between negative/positive emotions from `DEFAULT_EMOTIONS`
- 3-column grid of `EmotionButton` — use `FlatList` with `numColumns={3}`
- "Personnaliser" button: show `Alert.alert('Fonctionnalité à venir', 'Cette option sera disponible prochainement.')` on press
- `StepDots` (current=2)
- `PillButton` primary, disabled when `draft.selectedEmotionIds.length === 0`

#### 6.4 New Event Step 3 — `src/app/new-event/step-3.tsx`
- `GradientScreen`, custom header (StepProgress 3/5, title, close)
- Previously added thoughts list (above the TextInput): renders `draft.automaticThoughts`; each row has a `×` button calling `removeAutomaticThought(index)`
- Multiline `TextInput` (same style as step 1), local state for current text
- `StressSlider` (min=0, max=100, default=50), local state for current belief level
- "Ajouter cette pensée" button: `PillButton` variant `outline`; on press if text non-empty → `addAutomaticThought({ text, beliefLevel })` + reset local state
- `StepDots` (current=3)
- `PillButton` primary "Suite →", always enabled

#### 6.5 New Event Step 4 — `src/app/new-event/step-4.tsx`
- `GradientScreen`, custom header (StepProgress 4/5, title, close)
- **Wrap entire content in a `ScrollView`** — this step exceeds screen height
- Previously added rational thoughts list: renders `draft.rationalThoughts`; each row shows text + belief + bias labels + `×` remove button
- List of all `DEFAULT_COGNITIVE_BIASES` as `CognitiveBiasButton`; selection is **local state**, reset to `[]` after each "Ajouter"
- Multiline `TextInput` for rational thought text (local state)
- `StressSlider` for rational belief level (local state, default 50)
- "Ajouter cette pensée": `PillButton` outline; on press if text non-empty → `addRationalThought({ text, beliefLevel, selectedBiasIds })` + reset local state
- `StepDots` (current=4)
- `PillButton` primary "Suite →", always enabled

#### 6.6 New Event Step 5 — `src/app/new-event/step-5.tsx`
- `GradientScreen`, custom header (StepProgress 5/5, title, close)
- Wrap in `ScrollView` if more than one emotion
- For **each** emotion in `draft.selectedEmotionIds`, render a block:
  1. `EmotionButton` (non-interactive display — use `pointerEvents: 'none'`)
  2. Label "Rappel de l'intensité de l'émotion initiale"
  3. `StressSlider` with `readonly: true`, `value: 50`
  4. Label "Maintenant, quel est le niveau d'intensité de l'émotion initialement ressentie ?"
  5. `StressSlider` (interactive), default value 50, `onChange` → `setFinalIntensity(emotionId, value)`
- `StepDots` (current=5)
- `PillButton` primary "Enregistrer →": calls `await saveDraft()` then `router.replace('/events')`

#### 6.7 My Events — `src/app/events/index.tsx`
- `ScreenHeader` title "Mes événements"
- Load `EventRepository.getActive()` on mount (use `useFocusEffect` from `@react-navigation/native` to reload when screen comes back into focus)
- **Empty state**: centered faded lightning bolt icon + "Aucun événement enregistré" + `PillButton` primary "Créer un événement" → `router.push('/new-event/step-1')`
- **List state**: `FlatList` of `EventCard`; tap → `router.push({ pathname: '/events/[id]', params: { id: event.id } })`
- FAB: absolute position, bottom-center, blue circle 56×56, white flash icon, → `router.push('/new-event/step-1')`
- Background: `#F2F6FF`

#### 6.8 Archived Events — `src/app/events/archived.tsx`
- `ScreenHeader` title "Événements archivés"
- Same pattern as My Events but loads `EventRepository.getArchived()`
- `EventCard` uses `archived={true}` prop (gray icon bg, archive icon)
- No FAB
- Empty state: archive icon + "Aucun événement archivé"

#### 6.9 Event Detail — `src/app/events/[id].tsx`
- `ScreenHeader` title "Détail de l'événement"
- Load `EventRepository.getById(id)` where `id = useLocalSearchParams().id`
- Background: `#F2F6FF`, content in a `ScrollView`
- Date row (calendar icon + formatted date)
- **Situation** `Card`
- **Émotions** `Card` — one row per `EventEmotion`: emotion label left, "Intensité: X/100" right (X = `finalIntensity`)
- **Pensées automatiques** `Card` — only if `event.automaticThoughts.length > 0`; each thought has a left blue border + text + "Croyance: X%"
- **Pensées rationnelles** `Card` — only if `event.rationalThoughts.length > 0`; each thought has a left **teal** border (`#00C8E0`) + text + "Croyance: X%" + bias labels
- **Action buttons** row:
  - "Archiver" (`PillButton` outline, archive icon): only shown if `event.status === 'active'`; on press → `EventRepository.archive(id)` → navigate back
  - "Supprimer" (`PillButton` destructive, trash icon): always shown; on press → `Alert.alert` confirmation → `EventRepository.delete(id)` → navigate back

#### 6.10 Stress Evaluation — `src/app/stress/index.tsx`
- `GradientScreen` + `ScreenHeader` title "Évaluation du stress"
- `StepProgress` (current=1, total=1)
- Title + current date (formatted `"dd MMMM yyyy"` in French)
- `StressEmoji` — updates live as slider value changes (local state)
- `StressSlider` (min=0, max=10, default=5, leftLabel="0 – Calme", rightLabel="10 – Extrême")
- "Voir l'historique" (`PillButton` ghost, time icon) → `router.push('/stress/history')`
- "Enregistrer cette mesure" (`PillButton` primary):
  1. Check `StressRepository.getByDate(todayString)` where `todayString = format(new Date(), 'yyyy-MM-dd')`
  2. If exists: `Alert.alert('Mesure déjà enregistrée', 'Une mesure existe déjà pour aujourd\'hui. Voulez-vous la remplacer ?', [{ text: 'Annuler' }, { text: 'Remplacer', onPress: doSave }])`
  3. Otherwise: call `doSave()` directly
  4. `doSave`: `StressRepository.save({ id: randomUUID(), date: todayString, level, createdAt: new Date().toISOString() })` → navigate back

#### 6.11 Stress History — `src/app/stress/history.tsx`
- White background (`#FFFFFF`), `ScreenHeader` title "Historique du stress"
- Load `StressRepository.getAll()` on mount, sorted by `date` descending
- **Empty state**: centered `😌` emoji (large, gray) + "Aucune mesure enregistrée" + smaller hint text
- **List**: `FlatList` of stress history cards (`Card`):
  - Top row: date (calendar icon + `"dd/M/yyyy"`) left, stress emoji square (44×44, colored bg) right
  - Middle row: "Niveau de stress" label left, "X/10" bold right
  - Bottom: progress bar (height 8, colored fill = `(level/10)*100%`)
  - Colors from `getStressColor(level)`

#### 6.12 Statistics — `src/app/statistics/index.tsx`
- `ScreenHeader` title "Mes statistiques", background `#F2F6FF`
- Load both `EventRepository.getActive()` and `EventRepository.getArchived()` on mount with `useFocusEffect`
- **Summary card** (gradient `#29A9F5` → `#2979FF`): active count (large) + archived count (sub-label)
- **Period tabs**: local state `period: 'week' | 'month' | 'year'`, default `'week'`; three pill buttons in a dark pill container
- **Events Over Time chart** (`Card`):
  - Use `react-native-gifted-charts` `BarChart`
  - Data from `groupEventsByPeriod([...active, ...archived], period)` (both active and archived)
  - Bar color `#00C8E0`, bar width proportional to available space
  - If all counts are 0: show dashed border container with "Aucune donnée" centered
- **Emotions Donut chart** (`Card`):
  - Use `react-native-gifted-charts` `PieChart` with `donut` prop
  - Data from `countEmotions([...active, ...archived])`
  - Map `emotionId` to label using `DEFAULT_EMOTIONS`
  - Color palette: `['#00C8E0', '#2979FF', '#FF7043', '#66BB6A', '#AB47BC', '#FF8A65', '#42A5F5']`
  - Legend below: colored dot + emotion label + count, sorted by count descending
  - If empty: empty circle outline + "Aucune donnée"

### Phase 7 — Statistics helper functions

Create **`src/utils/statsHelpers.ts`** and implement:

```ts
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear,
         isWithinInterval, parseISO, format, eachDayOfInterval, eachMonthOfInterval } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { AppEvent } from '../types'

export function groupEventsByPeriod(
  events: AppEvent[],
  period: 'week' | 'month' | 'year'
): { label: string; count: number }[]

export function countEmotions(
  events: AppEvent[]
): { emotionId: string; count: number }[]
```

Implementation notes:
- **week**: use `eachDayOfInterval({ start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) })`, label = `format(day, 'EEE', { locale: fr })` (gives "lun.", "mar.", etc.)
- **month**: use `eachDayOfInterval({ start: startOfMonth(now), end: endOfMonth(now) })`, label = day number as string
- **year**: use `eachMonthOfInterval({ start: startOfYear(now), end: endOfYear(now) })`, label = `format(month, 'MMM', { locale: fr })`
- For counting: check if `parseISO(event.createdAt)` falls within the interval

---

## Critical rules — do not violate these

1. **Never name a type `Event`** — use `AppEvent`. `Event` is a reserved DOM interface in TypeScript and will cause type errors.
2. **Never call AsyncStorage directly from a screen component** — always go through the repository layer.
3. **Reanimated 4 API**: use `Gesture.Pan()` + `GestureDetector` for gestures. The old `<PanGestureHandler>` component is deprecated and removed in Reanimated 4.
4. **`useFocusEffect`** not `useEffect` for data loading on list screens — screens need to reload when navigating back to them.
5. **`minHeight: 140`** for multiline TextInputs, NOT `numberOfLines: 6` — `numberOfLines` is unreliable on iOS.
6. **Gradient screens**: always use `GradientScreen` (wraps `LinearGradient`). Never use `backgroundColor` for gradient screens.
7. **The new-event flow is forward-only**: there is no back navigation between steps — only the close (✕) button which discards the entire draft.
8. **`StressRepository.save()` is an upsert by date**, not by id — if an entry for the same day already exists, replace it.
9. **`saveDraft()` uses `expo-crypto`'s `randomUUID()`** for the event id.
10. **All strings are in French** — do not translate or add an i18n layer.

---

## Checklist — verify before considering the task done

- [ ] All 5 spec files have been read
- [ ] Missing packages installed (`async-storage`, `expo-linear-gradient`, `expo-crypto`, `react-native-svg`, `react-native-gifted-charts`, `date-fns`)
- [ ] `src/types/index.ts` exports `AppEvent` (not `Event`)
- [ ] `src/data/emotions.ts` exports all 9 negative + 6 positive emotions with correct emojis
- [ ] `src/data/biases.ts` exports all 10 cognitive biases
- [ ] `src/storage/stressRepository.ts` `save()` upserts by `date` field
- [ ] `src/context/NewEventContext.tsx` has `toggleEmotion`, NOT `setEmotionInitialIntensity`
- [ ] Home screen has no `ScreenHeader` (custom top bar only)
- [ ] Step 4 is wrapped in `ScrollView`
- [ ] Step 5 stacks multiple emotions vertically (not horizontal scroll)
- [ ] Event Detail shows both automatic thoughts AND rational thoughts cards
- [ ] Rational thoughts card uses **teal** left border (`#00C8E0`), automatic thoughts use **blue** (`#2979FF`)
- [ ] Statistics summary card: main number = `getActive().length`, NOT `getAll().length`
- [ ] Statistics charts include both active AND archived events
- [ ] Stress History shows empty state when no entries
- [ ] `useFocusEffect` used on My Events, Archived Events, and Statistics screens
- [ ] The app runs without TypeScript errors (`npx tsc --noEmit`)
