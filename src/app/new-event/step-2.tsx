import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientScreen } from '../../components/GradientScreen';
import { StepDots } from '../../components/StepDots';
import { PillButton } from '../../components/PillButton';
import { PolarityToggle } from '../../components/PolarityToggle';
import { EmotionButton } from '../../components/EmotionButton';
import { CustomizeEmotionsModal } from '../../components/CustomizeEmotionsModal';
import { useNewEventContext } from '../../context/NewEventContext';
import { DEFAULT_EMOTIONS } from '../../data/emotions';
import { CustomEmotionsRepository } from '../../storage/customEmotionsRepository';
import type { Emotion } from '../../types';
import { Colors, Spacing } from '../../constants';

const customRepo = new CustomEmotionsRepository();

export default function Step2Screen() {
  const insets = useSafeAreaInsets();
  const { draft, toggleEmotion } = useNewEventContext();
  const [polarity, setPolarity] = useState<'negative' | 'positive'>('negative');
  const [customEmotions, setCustomEmotions] = useState<Emotion[]>([]);
  const [showCustomize, setShowCustomize] = useState(false);

  const loadCustom = async () => {
    const data = await customRepo.getAll();
    setCustomEmotions(data);
  };

  useEffect(() => { loadCustom(); }, []);

  const allEmotions: Emotion[] = [
    ...DEFAULT_EMOTIONS,
    ...customEmotions,
  ];

  const filtered = allEmotions.filter(e => e.polarity === polarity);

  return (
    <GradientScreen>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>L'émotion ressentie</Text>
          <TouchableOpacity onPress={() => router.replace('/')} hitSlop={8}>
            <Ionicons name="close-circle" size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.question}>Quelles émotions ressentez-vous ?</Text>

        <PolarityToggle value={polarity} onChange={setPolarity} />

        {/* Emotion grid */}
        <View style={styles.grid}>
          {filtered.map(item => (
            <EmotionButton
              key={item.id}
              emoji={item.emoji}
              label={item.label}
              selected={draft.selectedEmotionIds.includes(item.id)}
              onPress={() => toggleEmotion(item.id)}
            />
          ))}
        </View>

        {/* Personnaliser */}
        <TouchableOpacity
          style={styles.customizeBtn}
          onPress={() => setShowCustomize(true)}
        >
          <Ionicons name="options-outline" size={18} color={Colors.white} style={{ marginRight: 6 }} />
          <Text style={styles.customizeBtnText}>Personnaliser</Text>
        </TouchableOpacity>

        <StepDots current={2} total={5} />

        <PillButton
          label="Suite →"
          onPress={() => router.push('/new-event/step-3')}
          variant="primary"
          disabled={draft.selectedEmotionIds.length === 0}
        />
      </ScrollView>

      <CustomizeEmotionsModal
        visible={showCustomize}
        onClose={() => setShowCustomize(false)}
        onChanged={loadCustom}
      />
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screenHorizontalPadding,
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  customizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardDark,
    borderRadius: 30,
    paddingVertical: 12,
  },
  customizeBtnText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
});
