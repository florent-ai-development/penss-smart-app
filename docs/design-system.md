# Design System

## Color Palette

```ts
export const Colors = {
  // Primary gradient — used on Home screen background and header bars
  gradientStart: '#4DD9F0',   // cyan top
  gradientEnd:   '#2979FF',   // blue bottom

  // Header / navigation bar solid color (matches gradient end)
  headerBg: '#29A9F5',        // mid-blue — used as solid bg for screen headers

  // Accent — active tab, active buttons, links
  accent: '#00C8E0',          // teal/cyan

  // Card backgrounds
  cardWhite: '#FFFFFF',
  cardDark: '#1A1F2E',        // near-black — used for emotion selection buttons

  // Summary card (statistics)
  summaryCardStart: '#29A9F5',
  summaryCardEnd:   '#2979FF',

  // Action buttons
  btnPrimary: '#FFFFFF',           // white pill button (main CTA)
  btnPrimaryText: '#2979FF',
  btnDestructive: '#F44336',       // red — "Supprimer"
  btnDestructiveText: '#FFFFFF',
  btnOutline: '#FFFFFF',           // white border — "Archiver"
  btnOutlineText: '#333333',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#555A6A',
  textOnGradient: '#FFFFFF',
  textOnDark: '#FFFFFF',
  textAccent: '#2979FF',           // blue labels on white cards (e.g., section titles)
  textDate: '#2979FF',             // date links/labels on white cards

  // Slider track
  sliderTrack: 'rgba(255,255,255,0.4)',
  sliderThumb: '#FFFFFF',
  sliderFillLow: '#4DD9F0',        // teal for low stress
  sliderFillHigh: '#F44336',       // red for high stress (stress history bar)

  // Emotion chip (tag pill on event cards)
  chipBg: '#E8F4FF',
  chipText: '#2979FF',

  // Progress arc (circular step indicator)
  progressArcBg: 'rgba(255,255,255,0.3)',
  progressArcFill: '#FFFFFF',

  // Step dots (bottom of new-event flow)
  dotActive: '#FFFFFF',
  dotInactive: 'rgba(255,255,255,0.35)',

  // Stress emoji background colors — see StressEmoji component for full 6-level mapping
  stressColor0to2: '#66BB6A',     // green       0–2
  stressColor3to4: '#9CCC65',     // light green 3–4
  stressColor5:    '#FFA726',     // orange      5
  stressColor6to7: '#EF5350',     // red-orange  6–7
  stressColor8to9: '#E53935',     // red         8–9
  stressColor10:   '#B71C1C',     // dark red    10

  // Icon backgrounds on home menu items
  iconBgBlue: '#2979FF',
  iconBgGray: '#9E9E9E',          // archived icon bg

  white: '#FFFFFF',
  black: '#000000',
};
```

---

## Typography

All fonts use the **system default** (SF Pro on iOS, Roboto on Android).

```ts
export const Typography = {
  // Screen titles in header bars
  headerTitle: { fontSize: 18, fontWeight: '600', color: Colors.white },

  // Section titles inside cards (e.g., "Situation", "Émotions")
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textAccent },

  // Body text inside cards
  body: { fontSize: 14, fontWeight: '400', color: Colors.textPrimary },

  // Step header title ("Détail de la situation")
  stepTitle: { fontSize: 20, fontWeight: '700', color: Colors.white },

  // Step counter label ("1 sur 5")
  stepCounter: { fontSize: 13, fontWeight: '600', color: Colors.white },

  // Question text inside a step
  question: { fontSize: 16, fontWeight: '600', color: Colors.white },

  // Placeholder text inside text areas
  placeholder: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },

  // Emotion button label
  emotionLabel: { fontSize: 12, fontWeight: '500', color: Colors.white },

  // Date label
  date: { fontSize: 13, fontWeight: '500', color: Colors.textDate },

  // Slider scale labels ("0 – Calme", "10 – Extrême")
  sliderLabel: { fontSize: 11, color: Colors.white },

  // Slider current value
  sliderValue: { fontSize: 22, fontWeight: '700', color: Colors.white },

  // Home menu item label
  menuItem: { fontSize: 16, fontWeight: '500', color: Colors.textPrimary },

  // Stat summary large number
  statNumber: { fontSize: 36, fontWeight: '800', color: Colors.white },

  // Stat summary sub-label
  statLabel: { fontSize: 14, color: Colors.white },

  // Chart axis labels
  chartAxis: { fontSize: 10, color: Colors.textSecondary },
};
```

---

## Spacing & Layout

```ts
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  screenHorizontalPadding: 16,
  cardPadding: 16,
  cardBorderRadius: 16,
  buttonBorderRadius: 30,       // fully-rounded pill buttons
  iconBorderRadius: 12,         // rounded-square icons on home
  emotionButtonBorderRadius: 12,
};
```

---

## Background

All screens that are part of the main gradient (Home, all new-event steps, stress evaluation) use a **linear gradient**:

```ts
// Top → Bottom
['#4DD9F0', '#2979FF']
```

Screens with a **white/light** background (lists, details, statistics, stress history):

```ts
backgroundColor: '#F2F6FF'  // very light blue-white
```

Header bars on list/detail screens:
```ts
backgroundColor: '#29A9F5'  // solid mid-blue
```

---

## Reusable Components

### `GradientScreen`
Full-screen linear gradient background (`#4DD9F0` → `#2979FF`). Used for: Home, all new-event steps, stress evaluation.

### `ScreenHeader`
Solid blue (`#29A9F5`) top bar with:
- Left: back arrow `←` (white, 24px)
- Center: title text (white, bold, 18px)
- No right action (unless specified per screen)

Props: `title: string`, `onBack: () => void`

### `Card`
White rounded card.
- `borderRadius: 16`
- `backgroundColor: #FFFFFF`
- `padding: 16`
- `shadowColor: #000`, `shadowOpacity: 0.08`, `shadowRadius: 8`, `elevation: 2`

### `PillButton`
Fully rounded button (borderRadius 30).

Variants:
- **primary** — white bg, blue text: main CTA on gradient screens
- **destructive** — red bg, white text: delete action
- **outline** — white border, dark text: secondary action (archive)
- **ghost** — transparent bg, white text/border: "Voir l'historique"

Props: `label: string`, `onPress: () => void`, `variant: 'primary' | 'destructive' | 'outline' | 'ghost'`, `disabled?: boolean`, `icon?: ReactNode`

Disabled state: `opacity: 0.4`, `pointerEvents: 'none'`. Applied via `style={[styles.btn, disabled && { opacity: 0.4 }]}` + `disabled={disabled}` on `Pressable`.

### `EmotionChip`
Small pill tag shown on event cards and event detail.
- `backgroundColor: #E8F4FF`
- `color: #2979FF`
- `borderRadius: 20`
- `paddingHorizontal: 10`, `paddingVertical: 4`
- `fontSize: 12`

Props: `label: string`

### `PolarityToggle`
Two-segment toggle for "Négatives" / "Positives" polarity selection in step 2.
- Outer container: `backgroundColor: #1A1F2E` (same dark as emotion buttons), `borderRadius: 30`, `padding: 4`, full width
- Active segment: `backgroundColor: #2A2F3E` (slightly lighter dark), white text, `fontWeight: '600'`
- Inactive segment: transparent bg, `rgba(255,255,255,0.5)` text
- Segment `borderRadius: 26`, height 36, `flex: 1`

Props: `value: 'negative' | 'positive'`, `onChange: (v: 'negative' | 'positive') => void`

### `EmotionButton`
Dark rounded square button used in the emotion selection grid.
- `backgroundColor: #1A1F2E`
- `borderRadius: 12`
- Width: `(screenWidth - 2 * 16 - 2 * 8) / 3` — where 16 is horizontal screen padding (×2 sides) and 8 is the gap between columns (×2 gaps for 3 columns)
- Height: 80
- Content: emoji (24px) on top, label (12px) below, centered
- Default state: no border
- Selected state: `borderWidth: 2`, `borderColor: #00C8E0`

Props: `emoji: string`, `label: string`, `selected: boolean`, `onPress: () => void`

### `CognitiveBiasButton`
Dark rounded card (full width) for cognitive bias selection.
- `backgroundColor: #1A1F2E`
- `borderRadius: 12`
- `padding: 14`
- Title bold (white), subtitle smaller (rgba white 0.6)
- Optional emoji icon on left
- Selected state: border `2px solid #00C8E0`

Props: `title: string`, `subtitle: string`, `emoji?: string`, `selected: boolean`, `onPress: () => void`

### `StepProgress` (circular arc)
Circular progress arc shown top-left of new-event steps.
- Size: 52×52
- Background arc: `rgba(255,255,255,0.3)`, stroke width 4
- Fill arc: white, animated to `(currentStep / totalSteps) * 360°`
- Center text: `${currentStep} sur ${totalSteps}` (11px, white, bold)

Props: `current: number`, `total: number`

### `StepDots`
Row of `total` dots at the bottom of new-event steps indicating current step.
- Active dot: white, width 20 (elongated pill), height 6, borderRadius 3
- Inactive dot: `rgba(255,255,255,0.35)`, width 6, height 6, borderRadius 3
- Horizontal gap: 6
- Centered horizontally

Props: `current: number` (1-indexed), `total: number`

### `StressSlider`
Horizontal slider for stress/belief levels.
- Track height: 4, borderRadius 2
- Track fill color: `#00C8E0` (or red for high stress in history)
- Thumb: white circle, 22px diameter, shadow
- Below the track: a `flexDirection: 'row'` row with `leftLabel` on the left and `rightLabel` on the right (not centered — one on each side)
- Current value displayed centered below the label row (large bold number, `fontSize: 22`)
- On gradient screens: track bg `rgba(255,255,255,0.4)`, fill white tint; labels and value in white
- `readonly` mode: thumb opacity reduced to 0.5, `pointerEvents: 'none'`

Props: `value: number`, `min: number`, `max: number`, `onChange: (v: number) => void`, `leftLabel?: string`, `rightLabel?: string`, `readonly?: boolean`

### `StressEmoji`
Large emoji in a colored circle, used on stress evaluation screen.
- Container: circle, diameter 120, background color varies by stress value
- Emoji font size: 64

Stress level → emoji + color:
| Range | Emoji | Color |
|---|---|---|
| 0–2 | 😌 | `#66BB6A` (green) |
| 3–4 | 🙂 | `#9CCC65` (light green) |
| 5 | 😐 | `#FFA726` (orange) |
| 6–7 | 😟 | `#EF5350` (red-orange) |
| 8–9 | 😰 | `#E53935` (red) |
| 10 | 😱 | `#B71C1C` (dark red) |

### `EventCard`
White card used in event lists.
- Left: blue rounded-square with lightning bolt icon (32×32, `#2979FF` bg for active; gray bg for archived)
- Top-right of content: date string (blue, 13px)
- Below date: situation text (dark, 14px, bold)
- Below text: row of `EmotionChip` components
- Tappable → navigates to Event Detail

Props: `event: Event`, `onPress: () => void`

### `HomeMenuItem`
Full-width white card row on home screen.
- Height: 60
- Left: rounded-square icon container (40×40) with icon
- Center: label text (16px, medium)
- Right: chevron `›` (gray, 18px)
- `borderRadius: 16`

Props: `icon: ReactNode`, `label: string`, `onPress: () => void`

---

## Icons

Use `@expo/vector-icons` with `Ionicons` and `MaterialCommunityIcons`:

| Usage | Icon |
|---|---|
| Home logo / event type | Custom lightning bolt SVG (or `Ionicons: flash`) |
| Archive | `Ionicons: archive` |
| Stress / pulse | `MaterialCommunityIcons: pulse` |
| Statistics | `Ionicons: bar-chart` |
| Settings | `Ionicons: settings` |
| Notifications | `Ionicons: flash` with badge |
| Back arrow | `Ionicons: arrow-back` |
| Close | `Ionicons: close-circle` |
| Calendar | `Ionicons: calendar-outline` |
| Trash | `Ionicons: trash` |
| History | `Ionicons: time` |
| Chevron right | `Ionicons: chevron-forward` |
| Trend line (chart card) | `Ionicons: trending-up` |

---

## Notification Badge

The lightning bolt icon in the top-right of the Home screen shows a yellow badge with a count (e.g., "20").
- Badge: `#FFD600` background, white text, 18px circle, positioned top-right of the icon container
- This count represents pending notifications (exact business logic TBD — could be number of days since last event entry)
