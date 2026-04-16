import React, { useState } from 'react';
import {
  View, Text, Alert, StyleSheet, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { randomUUID } from 'expo-crypto';
import { GradientScreen } from '../../components/GradientScreen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StressSlider } from '../../components/StressSlider';
import { StressEmoji } from '../../components/StressEmoji';
import { PillButton } from '../../components/PillButton';
import { StressRepository } from '../../storage/stressRepository';
import { Colors, Spacing } from '../../constants';

const repo = new StressRepository();

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatTodayFr(): string {
  const d = new Date();
  const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function StressEvaluationScreen() {
  const [level, setLevel] = useState(5);

  const doSave = async () => {
    const today = todayString();
    const existing = await repo.getByDate(today);
    const entry = {
      id: existing?.id ?? randomUUID(),
      date: today,
      level,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    await repo.save(entry);
    router.back();
  };

  const handleSave = async () => {
    const today = todayString();
    const existing = await repo.getByDate(today);
    if (existing) {
      Alert.alert(
        'Mesure déjà enregistrée',
        "Une mesure existe déjà pour aujourd'hui. Voulez-vous la remplacer ?",
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Remplacer', onPress: doSave },
        ]
      );
    } else {
      await doSave();
    }
  };

  return (
    <GradientScreen>
      <ScreenHeader title="Évaluation du stress" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Title + date */}
        <Text style={styles.title}>Votre niveau de stress global de la journée</Text>
        <Text style={styles.dateText}>{formatTodayFr()}</Text>

        {/* Emoji */}
        <View style={styles.emojiContainer}>
          <StressEmoji level={level} />
        </View>

        {/* Slider */}
        <Text style={styles.sliderLabel}>Évaluez votre niveau de stress</Text>
        <StressSlider
          value={level}
          min={0}
          max={10}
          onChange={setLevel}
          leftLabel="0 – Calme"
          rightLabel="10 – Extrême"
        />

        {/* Buttons */}
        <PillButton
          label="Voir l'historique"
          onPress={() => router.push('/stress/history')}
          variant="ghost"
          icon={<Ionicons name="time" size={16} color={Colors.white} />}
        />
        <PillButton
          label="Enregistrer cette mesure"
          onPress={handleSave}
          variant="primary"
        />
      </ScrollView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.screenHorizontalPadding,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
  },
  emojiContainer: {
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  sliderLabel: {
    fontSize: 15,
    color: Colors.white,
    alignSelf: 'flex-start',
  },
});
