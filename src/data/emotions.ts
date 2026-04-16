import type { Emotion, EmotionPolarity } from '../types';

export const DEFAULT_EMOTIONS: Emotion[] = [
  // Negative
  { id: 'deborde',   label: 'Débordé',   emoji: '😰', polarity: 'negative' as EmotionPolarity },
  { id: 'frustre',   label: 'Frustré',   emoji: '😤', polarity: 'negative' as EmotionPolarity },
  { id: 'en_colere', label: 'En colère', emoji: '😡', polarity: 'negative' as EmotionPolarity },
  { id: 'anxieux',   label: 'Anxieux',   emoji: '😨', polarity: 'negative' as EmotionPolarity },
  { id: 'stresse',   label: 'Stressé',   emoji: '😓', polarity: 'negative' as EmotionPolarity },
  { id: 'nerveux',   label: 'Nerveux',   emoji: '😬', polarity: 'negative' as EmotionPolarity },
  { id: 'inquiet',   label: 'Inquiet',   emoji: '😟', polarity: 'negative' as EmotionPolarity },
  { id: 'coupable',  label: 'Coupable',  emoji: '😔', polarity: 'negative' as EmotionPolarity },
  { id: 'decu',      label: 'Déçu',      emoji: '😞', polarity: 'negative' as EmotionPolarity },
  // Positive (tab 2 — visible when "Positives" selected)
  { id: 'content',   label: 'Content',   emoji: '😊', polarity: 'positive' as EmotionPolarity },
  { id: 'fier',      label: 'Fier',      emoji: '😌', polarity: 'positive' as EmotionPolarity },
  { id: 'reconnaissant', label: 'Reconnaissant', emoji: '🥰', polarity: 'positive' as EmotionPolarity },
  { id: 'optimiste', label: 'Optimiste', emoji: '😄', polarity: 'positive' as EmotionPolarity },
  { id: 'calme',     label: 'Calme',     emoji: '😇', polarity: 'positive' as EmotionPolarity },
  { id: 'confiant',  label: 'Confiant',  emoji: '💪', polarity: 'positive' as EmotionPolarity },
];