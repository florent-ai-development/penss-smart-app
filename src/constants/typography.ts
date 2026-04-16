import { Colors } from './colors';

export const Typography = {
  // Screen titles in header bars
  headerTitle: { fontSize: 18, fontWeight: '600' as const, color: Colors.white },

  // Section titles inside cards (e.g., "Situation", "Émotions")
  sectionTitle: { fontSize: 15, fontWeight: '700' as const, color: Colors.textAccent },

  // Body text inside cards
  body: { fontSize: 14, fontWeight: '400' as const, color: Colors.textPrimary },

  // Step header title ("Détail de la situation")
  stepTitle: { fontSize: 20, fontWeight: '700' as const, color: Colors.white },

  // Step counter label ("1 sur 5")
  stepCounter: { fontSize: 13, fontWeight: '600' as const, color: Colors.white },

  // Question text inside a step
  question: { fontSize: 16, fontWeight: '600' as const, color: Colors.white },

  // Placeholder text inside text areas
  placeholder: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },

  // Emotion button label
  emotionLabel: { fontSize: 12, fontWeight: '500' as const, color: Colors.white },

  // Date label
  date: { fontSize: 13, fontWeight: '500' as const, color: Colors.textDate },

  // Slider scale labels ("0 – Calme", "10 – Extrême")
  sliderLabel: { fontSize: 11, color: Colors.white },

  // Slider current value
  sliderValue: { fontSize: 22, fontWeight: '700' as const, color: Colors.white },

  // Home menu item label
  menuItem: { fontSize: 16, fontWeight: '500' as const, color: Colors.textPrimary },

  // Stat summary large number
  statNumber: { fontSize: 36, fontWeight: '800' as const, color: Colors.white },

  // Stat summary sub-label
  statLabel: { fontSize: 14, color: Colors.white },

  // Chart axis labels
  chartAxis: { fontSize: 10, color: Colors.textSecondary },
};