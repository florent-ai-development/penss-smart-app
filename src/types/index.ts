// ─────────────────────────────────────────────
// EMOTION
// ─────────────────────────────────────────────

export type EmotionPolarity = 'negative' | 'positive';

export interface Emotion {
  id: string;
  label: string;
  emoji: string;
  polarity: EmotionPolarity;
}

// ─────────────────────────────────────────────
// COGNITIVE BIAS
// ─────────────────────────────────────────────

export interface CognitiveBias {
  id: string;
  label: string;
  example: string;
  emoji?: string;
}

// ─────────────────────────────────────────────
// AUTOMATIC THOUGHT (step 3)
// ─────────────────────────────────────────────

export interface AutomaticThought {
  text: string;
  beliefLevel: number;
}

// ─────────────────────────────────────────────
// RATIONAL THOUGHT (step 4)
// ─────────────────────────────────────────────

export interface RationalThought {
  text: string;
  beliefLevel: number;
  selectedBiasIds: string[];
}

// ─────────────────────────────────────────────
// EVENT EMOTION ENTRY (step 2 + step 5 re-eval)
// ─────────────────────────────────────────────

export interface EventEmotion {
  emotionId: string;
  initialIntensity: number;
  finalIntensity: number;
  customEmoji?: string;
}

// ─────────────────────────────────────────────
// EVENT (the core entity)
// ─────────────────────────────────────────────

export type EventStatus = 'active' | 'archived';

// Named AppEvent to avoid collision with the built-in DOM Event type
export interface AppEvent {
  id: string;
  createdAt: string;
  situation: string;
  emotions: EventEmotion[];
  automaticThoughts: AutomaticThought[];
  rationalThoughts: RationalThought[];
  status: EventStatus;
  archivedAt?: string;
}

// ─────────────────────────────────────────────
// STRESS ENTRY
// ─────────────────────────────────────────────

export interface StressEntry {
  id: string;
  date: string;
  level: number;
  createdAt: string;
}