import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { StressRepository } from '../../storage/stressRepository';
import type { StressEntry } from '../../types';
import { Colors, Spacing } from '../../constants';

const repo = new StressRepository();

const STRESS_COLORS = [
  { max: 2, color: '#66BB6A', emoji: '😌' },
  { max: 4, color: '#9CCC65', emoji: '🙂' },
  { max: 5, color: '#FFA726', emoji: '😐' },
  { max: 7, color: '#EF5350', emoji: '😟' },
  { max: 9, color: '#E53935', emoji: '😰' },
  { max: 10, color: '#B71C1C', emoji: '😱' },
];

function getStressInfo(level: number) {
  return STRESS_COLORS.find(s => level <= s.max) ?? STRESS_COLORS[STRESS_COLORS.length - 1];
}

function formatHistoryDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${parseInt(d)}/${parseInt(m)}/${y}`;
}

function StressHistoryCard({ entry }: { entry: StressEntry }) {
  const info = getStressInfo(entry.level);
  return (
    <Card>
      <View style={styles.cardTop}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={Colors.textDate} />
          <Text style={styles.dateText}>{formatHistoryDate(entry.date)}</Text>
        </View>
        <View style={[styles.emojiSquare, { backgroundColor: info.color }]}>
          <Text style={{ fontSize: 22 }}>{info.emoji}</Text>
        </View>
      </View>
      <View style={styles.levelRow}>
        <Text style={styles.levelLabel}>Niveau de stress</Text>
        <Text style={styles.levelValue}>{entry.level}/10</Text>
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${(entry.level / 10) * 100}%` as any, backgroundColor: info.color },
          ]}
        />
      </View>
    </Card>
  );
}

export default function StressHistoryScreen() {
  const [entries, setEntries] = useState<StressEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      repo.getAll().then(data =>
        setEntries(data.sort((a, b) => b.date.localeCompare(a.date)))
      );
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScreenHeader title="Historique du stress" onBack={() => router.back()} />

      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 64 }}>😌</Text>
          <Text style={styles.emptyTitle}>Aucune mesure enregistrée</Text>
          <Text style={styles.emptyHint}>
            Utilisez l'évaluation du stress pour enregistrer votre premier niveau.
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <StressHistoryCard entry={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  list: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textDate,
  },
  emojiSquare: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  levelLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  levelValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8EFF8',
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
});
