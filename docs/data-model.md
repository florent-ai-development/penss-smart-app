# Data Model

All data is persisted **locally on device** using AsyncStorage. No remote backend.

---

## TypeScript Types

```ts
// ─────────────────────────────────────────────
// EMOTION
// ─────────────────────────────────────────────

export type EmotionPolarity = 'negative' | 'positive';

export interface Emotion {
  id: string;           // e.g. 'frustre', 'anxieux'
  label: string;        // display name in French
  emoji: string;        // unicode emoji
  polarity: EmotionPolarity;
}

// ─────────────────────────────────────────────
// COGNITIVE BIAS
// ─────────────────────────────────────────────

export interface CognitiveBias {
  id: string;
  label: string;        // e.g. "Catastrophisation"
  example: string;      // e.g. "Et si le pire arrivait ?"
  emoji?: string;       // optional illustrative emoji
}

// ─────────────────────────────────────────────
// AUTOMATIC THOUGHT (step 3)
// ─────────────────────────────────────────────

export interface AutomaticThought {
  text: string;         // free text written by user
  beliefLevel: number;  // 0–100 — how much the user believes it
}

// ─────────────────────────────────────────────
// RATIONAL THOUGHT (step 4)
// ─────────────────────────────────────────────

export interface RationalThought {
  text: string;           // free text — rational reframe
  beliefLevel: number;    // 0–100
  selectedBiasIds: string[]; // IDs of CognitiveBias identified
}

// ─────────────────────────────────────────────
// EVENT EMOTION ENTRY (step 2 + step 5 re-eval)
// ─────────────────────────────────────────────

export interface EventEmotion {
  emotionId: string;          // references Emotion.id
  initialIntensity: number;   // 0–100 — always defaults to 50 (step 2 has no intensity slider)
  finalIntensity: number;     // 0–100 — set by user in step 5 re-evaluation slider
}

// ─────────────────────────────────────────────
// EVENT (the core entity)
// ─────────────────────────────────────────────

export type EventStatus = 'active' | 'archived';

// Named AppEvent to avoid collision with the built-in DOM Event type
export interface AppEvent {
  id: string;                       // UUID v4 — use expo-crypto.randomUUID()
  createdAt: string;                // ISO 8601 datetime string — set once at flow start
  situation: string;                // step 1 — free text description
  emotions: EventEmotion[];         // step 2 + 5 — at least one required
  automaticThoughts: AutomaticThought[]; // step 3 — zero or more
  rationalThoughts: RationalThought[];   // step 4 — zero or more
  status: EventStatus;
  archivedAt?: string;              // ISO 8601 — set when archived
}

// ─────────────────────────────────────────────
// STRESS ENTRY
// ─────────────────────────────────────────────

export interface StressEntry {
  id: string;       // UUID v4
  date: string;     // ISO 8601 date string (day granularity: "2026-04-16")
  level: number;    // 0–10
  createdAt: string;
}
```

---

## Static Data (hardcoded, not persisted)

### Default Emotions

```ts
export const DEFAULT_EMOTIONS: Emotion[] = [
  // Negative
  { id: 'deborde',   label: 'Débordé',   emoji: '😰', polarity: 'negative' },
  { id: 'frustre',   label: 'Frustré',   emoji: '😤', polarity: 'negative' },
  { id: 'en_colere', label: 'En colère', emoji: '😡', polarity: 'negative' },
  { id: 'anxieux',   label: 'Anxieux',   emoji: '😨', polarity: 'negative' },
  { id: 'stresse',   label: 'Stressé',   emoji: '😓', polarity: 'negative' },
  { id: 'nerveux',   label: 'Nerveux',   emoji: '😬', polarity: 'negative' },
  { id: 'inquiet',   label: 'Inquiet',   emoji: '😟', polarity: 'negative' },
  { id: 'coupable',  label: 'Coupable',  emoji: '😔', polarity: 'negative' },
  { id: 'decu',      label: 'Déçu',      emoji: '😞', polarity: 'negative' },
  // Positive (tab 2 — visible when "Positives" selected)
  { id: 'content',   label: 'Content',   emoji: '😊', polarity: 'positive' },
  { id: 'fier',      label: 'Fier',      emoji: '😌', polarity: 'positive' },
  { id: 'reconnaissant', label: 'Reconnaissant', emoji: '🥰', polarity: 'positive' },
  { id: 'optimiste', label: 'Optimiste', emoji: '😄', polarity: 'positive' },
  { id: 'calme',     label: 'Calme',     emoji: '😇', polarity: 'positive' },
  { id: 'confiant',  label: 'Confiant',  emoji: '💪', polarity: 'positive' },
];
```

### Default Cognitive Biases

```ts
export const DEFAULT_COGNITIVE_BIASES: CognitiveBias[] = [
  {
    id: 'catastrophisation',
    label: 'Catastrophisation',
    example: 'Et si le pire arrivait ?',
    emoji: '💣',
  },
  {
    id: 'tout_ou_rien',
    label: 'Tout ou rien',
    example: 'Je suis nul.',
    emoji: '😤',
  },
  {
    id: 'raisonnement_emotionnel',
    label: 'Raisonnement émotionnel',
    example: 'Je ressens ça, donc ça doit être vrai.',
    emoji: '🌀',
  },
  {
    id: 'amplification_negatif',
    label: 'Amplification du négatif',
    example: 'Tout ce que je fais est nul.',
    emoji: '🔍',
  },
  {
    id: 'minimisation_positif',
    label: 'Minimisation du positif',
    example: 'C\'est de la chance, pas mon mérite.',
    emoji: '👇',
  },
  {
    id: 'personnalisation',
    label: 'Personnalisation',
    example: 'C\'est de ma faute.',
    emoji: '🎯',
  },
  {
    id: 'generalisation',
    label: 'Généralisation excessive',
    example: 'Ça arrive toujours qu\'à moi.',
    emoji: '♾️',
  },
  {
    id: 'lecture_pensees',
    label: 'Lecture de pensées',
    example: 'Je sais ce qu\'il pense de moi.',
    emoji: '🧠',
  },
  {
    id: 'prediction_futur',
    label: 'Prédiction du futur',
    example: 'Je sais que ça va mal se passer.',
    emoji: '🔮',
  },
  {
    id: 'devoir_absolu',
    label: 'Devoir absolu',
    example: 'Je dois toujours réussir.',
    emoji: '⚠️',
  },
];
```

---

## AsyncStorage Keys

```ts
export const STORAGE_KEYS = {
  EVENTS: '@penss/events',         // JSON array of Event[]
  STRESS_ENTRIES: '@penss/stress', // JSON array of StressEntry[]
};
```

---

## Repository Layer

Implement a simple async repository per entity so screens never call AsyncStorage directly:

```ts
// EventRepository
getAll(): Promise<AppEvent[]>
getById(id: string): Promise<AppEvent | null>
getActive(): Promise<AppEvent[]>           // status === 'active'
getArchived(): Promise<AppEvent[]>         // status === 'archived'
save(event: AppEvent): Promise<void>       // insert or update by id
archive(id: string): Promise<void>         // sets status = 'archived' + archivedAt = now
delete(id: string): Promise<void>

// StressRepository
getAll(): Promise<StressEntry[]>
getByDate(date: string): Promise<StressEntry | null>  // date = "YYYY-MM-DD"
// save() performs an UPSERT by date: if an entry already exists for the same date,
// it is replaced entirely (id and createdAt are preserved from the original entry).
save(entry: StressEntry): Promise<void>
```

---

## Derived / Computed Values (for Statistics)

These are computed in-memory from the persisted arrays — not stored:

```ts
// Count events in a date range (uses createdAt)
countEventsInRange(events: AppEvent[], from: Date, to: Date): number

// Group events by period for the bar chart
// - 'week':  one entry per day (Mon–Sun), label = "lun.", "mar.", etc.
// - 'month': one entry per day of month (1–31), label = day number as string
// - 'year':  one entry per month, label = "jan.", "févr.", "mars", etc.
groupEventsByPeriod(events: AppEvent[], period: 'week' | 'month' | 'year'):
  { label: string; count: number }[]

// Count occurrences of each emotion across events (uses finalIntensity emotion labels)
countEmotions(events: AppEvent[]): { emotionId: string; count: number }[]
```
