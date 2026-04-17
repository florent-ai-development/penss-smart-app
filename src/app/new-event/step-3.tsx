import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientScreen } from '../../components/GradientScreen';
import { StepDots } from '../../components/StepDots';
import { PillButton } from '../../components/PillButton';
import { StressSlider } from '../../components/StressSlider';
import { useNewEventContext } from '../../context/NewEventContext';
import { Colors, Spacing } from '../../constants';

export default function Step3Screen() {
  const insets = useSafeAreaInsets();
  const { draft, addAutomaticThought, removeAutomaticThought } = useNewEventContext();
  const [text, setText] = useState('');
  const [beliefLevel, setBeliefLevel] = useState(50);

  const handleAdd = () => {
    if (text.trim().length === 0) return;
    addAutomaticThought({ text: text.trim(), beliefLevel });
    setText('');
    setBeliefLevel(50);
  };

  const handleNext = () => {
    // Auto-add the current thought if there's text before navigating
    if (text.trim().length > 0) {
      addAutomaticThought({ text: text.trim(), beliefLevel });
      setText('');
      setBeliefLevel(50);
    }
    router.push('/new-event/step-4');
  };

  return (
    <GradientScreen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xl }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.title}>Pensées automatiques</Text>
            <TouchableOpacity onPress={() => router.replace('/')} hitSlop={8}>
              <Ionicons name="close-circle" size={28} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Text area */}
          <TextInput
            style={styles.textArea}
            value={text}
            onChangeText={setText}
            placeholder="Décrivez ici les pensées automatiques qui vous viennent en tête..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
          />

          {/* Belief slider */}
          <Text style={styles.sliderLabel}>Quel est le niveau de croyance de vos pensées automatiques ?</Text>
          <StressSlider
            value={beliefLevel}
            min={0}
            max={100}
            onChange={setBeliefLevel}
          />

          {/* Previously added thoughts — shown just above the add button */}
          {draft.automaticThoughts.length > 0 && (
            <View style={styles.thoughtsList}>
              {draft.automaticThoughts.map((t, i) => (
                <View key={i} style={styles.thoughtRow}>
                  <Text style={styles.thoughtText} numberOfLines={2}>{t.text}</Text>
                  <View style={styles.thoughtMeta}>
                    <Text style={styles.thoughtBelief}>Croyance : {t.beliefLevel}%</Text>
                    <TouchableOpacity onPress={() => removeAutomaticThought(i)} hitSlop={8}>
                      <Ionicons name="close" size={16} color="rgba(255,255,255,0.7)" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Add button */}
          <PillButton label="Ajouter cette pensée" onPress={handleAdd} variant="outline" />

          <StepDots current={3} total={5} />

          <PillButton label="Suite →" onPress={handleNext} variant="primary" />
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  thoughtsList: {
    gap: Spacing.sm,
  },
  thoughtRow: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    padding: 10,
  },
  thoughtText: {
    color: Colors.white,
    fontSize: 13,
    marginBottom: 4,
  },
  thoughtMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thoughtBelief: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    color: Colors.textPrimary,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  sliderLabel: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
