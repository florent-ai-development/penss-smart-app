import type { CognitiveBias } from '../types';

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