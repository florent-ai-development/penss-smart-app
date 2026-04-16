import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientScreen } from '../../components/GradientScreen';
import { StepProgress } from '../../components/StepProgress';
import { StepDots } from '../../components/StepDots';
import { PillButton } from '../../components/PillButton';
import { useNewEventContext } from '../../context/NewEventContext';
import { Colors, Spacing } from '../../constants';

function formatDraftDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} - ${hh}:${mm}`;
}

export default function Step1Screen() {
  const insets = useSafeAreaInsets();
  const { draft, setSituation } = useNewEventContext();

  return (
    <GradientScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xl }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header row */}
          <View style={styles.headerRow}>
            <StepProgress current={1} total={5} />
            <Text style={styles.title}>Détail de la situation</Text>
            <TouchableOpacity onPress={() => router.replace('/')} hitSlop={8}>
              <Ionicons name="close-circle" size={28} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Date */}
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color={Colors.white} />
            <Text style={styles.dateText}>Date  {formatDraftDate(draft.createdAt)}</Text>
          </View>

          {/* Text area */}
          <TextInput
            style={styles.textArea}
            value={draft.situation}
            onChangeText={setSituation}
            placeholder="Décrivez ici l'événement ou la situation qui a déclenché la contrariété..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
          />

          {/* Step dots */}
          <StepDots current={1} total={5} />

          {/* CTA */}
          <PillButton
            label="Suite →"
            onPress={() => router.push('/new-event/step-2')}
            variant="primary"
            disabled={draft.situation.trim().length === 0}
          />
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
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.white,
  },
  textArea: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    padding: 14,
    color: Colors.white,
    fontSize: 14,
    minHeight: 140,
    textAlignVertical: 'top',
  },
});
