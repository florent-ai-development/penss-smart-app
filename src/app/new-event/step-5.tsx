import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientScreen } from '../../components/GradientScreen';
import { StepProgress } from '../../components/StepProgress';
import { StepDots } from '../../components/StepDots';
import { PillButton } from '../../components/PillButton';
import { StressSlider } from '../../components/StressSlider';
import { useNewEventContext } from '../../context/NewEventContext';
import { DEFAULT_EMOTIONS } from '../../data/emotions';
import { Colors, Spacing } from '../../constants';

export default function Step5Screen() {
  const insets = useSafeAreaInsets();
  const { draft, setFinalIntensity, saveDraft } = useNewEventContext();

  const getEmotion = (id: string) => DEFAULT_EMOTIONS.find(e => e.id === id);

  const handleSave = async () => {
    await saveDraft();
    router.replace('/events');
  };

  return (
    <GradientScreen>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xl }]}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <StepProgress current={5} total={5} />
          <Text style={styles.title}>Nouvelle évaluation de l'émotion ressentie</Text>
          <TouchableOpacity onPress={() => router.replace('/')} hitSlop={8}>
            <Ionicons name="close-circle" size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* One block per selected emotion */}
        {draft.selectedEmotionIds.map(emotionId => {
          const emotion = getEmotion(emotionId);
          const finalValue = draft.finalEmotionIntensities[emotionId] ?? 50;
          return (
            <View key={emotionId} style={styles.emotionBlock}>
              {/* Emotion chip display */}
              <Text style={styles.sectionLabel}>Rappel de l'émotion ressentie</Text>
              <View style={styles.emotionChipRow}>
                <View style={styles.emotionChip}>
                  <Text style={styles.emotionEmoji}>{emotion?.emoji ?? '❓'}</Text>
                  <Text style={styles.emotionLabel}>{emotion?.label ?? emotionId}</Text>
                </View>
              </View>

              {/* Reference slider (read-only) */}
              <Text style={styles.sectionLabel}>Rappel de l'intensité de l'émotion initiale</Text>
              <StressSlider value={50} min={0} max={100} onChange={() => {}} readonly />

              {/* Editable slider */}
              <Text style={styles.sectionLabel}>
                Maintenant, quel est le niveau d'intensité de l'émotion initialement ressentie ?
              </Text>
              <StressSlider
                value={finalValue}
                min={0}
                max={100}
                onChange={v => setFinalIntensity(emotionId, v)}
              />

              <View style={styles.divider} />
            </View>
          );
        })}

        <StepDots current={5} total={5} />

        <PillButton label="Enregistrer →" onPress={handleSave} variant="primary" />
      </ScrollView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screenHorizontalPadding,
    gap: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  emotionBlock: {
    gap: Spacing.md,
  },
  sectionLabel: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  emotionChipRow: {
    flexDirection: 'row',
  },
  emotionChip: {
    backgroundColor: Colors.cardDark,
    borderRadius: 12,
    padding: Spacing.sm,
    alignItems: 'center',
    minWidth: 72,
  },
  emotionEmoji: { fontSize: 24 },
  emotionLabel: { color: Colors.white, fontSize: 12, marginTop: 4 },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: Spacing.sm,
  },
});
