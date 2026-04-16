import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientScreen } from '../../components/GradientScreen';
import { StepProgress } from '../../components/StepProgress';
import { StepDots } from '../../components/StepDots';
import { PillButton } from '../../components/PillButton';
import { StressSlider } from '../../components/StressSlider';
import { CognitiveBiasButton } from '../../components/CognitiveBiasButton';
import { useNewEventContext } from '../../context/NewEventContext';
import { DEFAULT_COGNITIVE_BIASES } from '../../data/biases';
import { Colors, Spacing } from '../../constants';

export default function Step4Screen() {
  const insets = useSafeAreaInsets();
  const { draft, addRationalThought, removeRationalThought } = useNewEventContext();
  const [text, setText] = useState('');
  const [beliefLevel, setBeliefLevel] = useState(50);
  const [selectedBiasIds, setSelectedBiasIds] = useState<string[]>([]);

  const toggleBias = (id: string) => {
    setSelectedBiasIds(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    if (text.trim().length === 0) return;
    addRationalThought({ text: text.trim(), beliefLevel, selectedBiasIds });
    setText('');
    setBeliefLevel(50);
    setSelectedBiasIds([]);
  };

  const getBiasLabel = (id: string) =>
    DEFAULT_COGNITIVE_BIASES.find(b => b.id === id)?.label ?? id;

  return (
    <GradientScreen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xl }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <StepProgress current={4} total={5} />
            <Text style={styles.title}>Pensées rationnelles</Text>
            <TouchableOpacity onPress={() => router.replace('/')} hitSlop={8}>
              <Ionicons name="close-circle" size={28} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Previously added rational thoughts */}
          {draft.rationalThoughts.length > 0 && (
            <View style={styles.thoughtsList}>
              {draft.rationalThoughts.map((t, i) => (
                <View key={i} style={styles.thoughtRow}>
                  <Text style={styles.thoughtText} numberOfLines={2}>{t.text}</Text>
                  <View style={styles.thoughtMeta}>
                    <Text style={styles.thoughtBelief}>Croyance : {t.beliefLevel}%</Text>
                    <TouchableOpacity onPress={() => removeRationalThought(i)} hitSlop={8}>
                      <Ionicons name="close" size={16} color="rgba(255,255,255,0.7)" />
                    </TouchableOpacity>
                  </View>
                  {t.selectedBiasIds.length > 0 && (
                    <Text style={styles.biasLabels}>
                      Biais : {t.selectedBiasIds.map(getBiasLabel).join(', ')}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Bias question */}
          <Text style={styles.question}>Votre pensée contient-elle des biais ?</Text>

          {/* Bias list */}
          <View style={styles.biasList}>
            {DEFAULT_COGNITIVE_BIASES.map(bias => (
              <CognitiveBiasButton
                key={bias.id}
                title={bias.label}
                subtitle={bias.example}
                emoji={bias.emoji}
                selected={selectedBiasIds.includes(bias.id)}
                onPress={() => toggleBias(bias.id)}
              />
            ))}
          </View>

          {/* Text area */}
          <TextInput
            style={styles.textArea}
            value={text}
            onChangeText={setText}
            placeholder="Prenez du recul par rapport aux pensées automatiques en listant ici des réponses rationnelles face à l'événement ou la situation..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
          />

          {/* Belief slider */}
          <Text style={styles.sliderLabel}>Quel est le niveau de croyance dans les pensées rationnelles ?</Text>
          <StressSlider value={beliefLevel} min={0} max={100} onChange={setBeliefLevel} />

          {/* Add button */}
          <PillButton label="Ajouter cette pensée" onPress={handleAdd} variant="outline" />

          <StepDots current={4} total={5} />

          <PillButton label="Suite →" onPress={() => router.push('/new-event/step-5')} variant="primary" />
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
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  thoughtsList: { gap: Spacing.sm },
  thoughtRow: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    padding: 10,
  },
  thoughtText: { color: Colors.white, fontSize: 13, marginBottom: 4 },
  thoughtMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  thoughtBelief: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  biasLabels: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 },
  question: { fontSize: 16, fontWeight: '600', color: Colors.white },
  biasList: { gap: Spacing.sm },
  textArea: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    padding: 14,
    color: Colors.white,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  sliderLabel: { color: Colors.white, fontSize: 15, fontWeight: '600' },
});
