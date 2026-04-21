import React, { useState } from 'react';
import {
  View, Text, Alert, StyleSheet,
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
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
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
      <ScreenHeader title="Évaluation du stress" onBack={() => router.canGoBack() ? router.back() : router.replace('/')} />
      <View style={styles.content}>
        {/* Title + date */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Votre niveau de stress{'\n'}global de la journée</Text>
          <Text style={styles.dateText}>{formatTodayFr()}</Text>
        </View>

        {/* Emoji */}
        <View style={styles.emojiContainer}>
          <StressEmoji level={level} />
        </View>

        {/* Slider */}
        <View style={styles.sliderBlock}>
          <Text style={styles.sliderLabel}>Évaluez votre niveau de stress</Text>
          <StressSlider
            value={level}
            min={0}
            max={10}
            onChange={setLevel}
            leftLabel="0 – Calme"
            rightLabel="10 – Extrême"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonsBlock}>
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
        </View>
      </View>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screenHorizontalPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    justifyContent: 'space-between',
  },
  titleBlock: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 32,
  },
  dateText: {
    fontSize: 15,
    color: Colors.white,
    opacity: 0.8,
    textAlign: 'center',
  },
  emojiContainer: {
    alignItems: 'center',
  },
  sliderBlock: {
    gap: Spacing.md,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  buttonsBlock: {
    gap: Spacing.sm,
  },
});
