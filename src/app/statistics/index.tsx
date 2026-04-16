import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { EventRepository } from '../../storage/eventRepository';
import { DEFAULT_EMOTIONS } from '../../data/emotions';
import { groupEventsByPeriod, countEmotions } from '../../utils/statsHelpers';
import type { AppEvent } from '../../types';
import { Colors, Spacing } from '../../constants';

type Period = 'week' | 'month' | 'year';

const repo = new EventRepository();

const PERIOD_LABELS: Record<Period, string> = {
  week: 'Semaine',
  month: 'Mois',
  year: 'Année',
};

const DONUT_COLORS = [
  '#00C8E0', '#2979FF', '#FF7043', '#66BB6A',
  '#AB47BC', '#FF8A65', '#42A5F5', '#EC407A',
];

function getEmotionLabel(id: string): string {
  return DEFAULT_EMOTIONS.find(e => e.id === id)?.label ?? id;
}

export default function StatisticsScreen() {
  const [period, setPeriod] = useState<Period>('week');
  const [active, setActive] = useState<AppEvent[]>([]);
  const [archived, setArchived] = useState<AppEvent[]>([]);

  useFocusEffect(
    useCallback(() => {
      repo.getActive().then(setActive);
      repo.getArchived().then(setArchived);
    }, [])
  );

  const allEvents = [...active, ...archived];
  const chartData = groupEventsByPeriod(allEvents, period);
  const emotionData = countEmotions(allEvents);

  // Format bar chart data for react-native-gifted-charts
  const barData = chartData.map(item => ({
    value: item.count,
    label: item.label,
    frontColor: Colors.accent,
  }));

  // Format donut data
  const pieData = emotionData.map((item, i) => ({
    value: item.count,
    color: DONUT_COLORS[i % DONUT_COLORS.length],
    text: String(item.count),
  }));

  const hasChartData = barData.some(b => b.value > 0);
  const hasPieData = pieData.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F6FF' }}>
      <ScreenHeader title="Mes statistiques" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Summary card */}
        <LinearGradient
          colors={[Colors.summaryCardStart, Colors.summaryCardEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.summaryCard}
        >
          <View style={styles.summaryTop}>
            <Ionicons name="flash" size={28} color={Colors.white} />
            <Text style={styles.summaryNumber}>{active.length}</Text>
            <Text style={styles.summaryLabel}>Événements</Text>
          </View>
          <Text style={styles.summaryArchived}>
            {archived.length} Événement{archived.length !== 1 ? 's' : ''} archivé{archived.length !== 1 ? 's' : ''}
          </Text>
        </LinearGradient>

        {/* Period tabs */}
        <View style={styles.tabsContainer}>
          {(['week', 'month', 'year'] as Period[]).map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.tab, period === p && styles.tabActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.tabText, period === p && styles.tabTextActive]}>
                {PERIOD_LABELS[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Events over time */}
        <Card>
          <View style={styles.cardHeader}>
            <Ionicons name="trending-up" size={16} color={Colors.textAccent} />
            <Text style={styles.cardTitle}>Les événements recensés dans le temps</Text>
          </View>
          {hasChartData ? (
            <BarChart
              data={barData}
              barWidth={period === 'month' ? 6 : 20}
              spacing={period === 'month' ? 4 : 12}
              barBorderRadius={3}
              noOfSections={Math.max(...barData.map(b => b.value), 1)}
              maxValue={Math.max(...barData.map(b => b.value), 1)}
              yAxisLabelTexts={undefined}
              xAxisLabelTextStyle={{ fontSize: 9, color: Colors.textSecondary }}
              yAxisTextStyle={{ fontSize: 9, color: Colors.textSecondary }}
              hideYAxisText={false}
              yAxisColor="transparent"
              xAxisColor="#E8EFF8"
              isAnimated
              height={120}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>Aucune donnée</Text>
            </View>
          )}
        </Card>

        {/* Emotions donut */}
        <Card>
          <Text style={styles.cardTitle}>Les émotions recensées les plus ressenties</Text>
          {hasPieData ? (
            <>
              <View style={{ alignItems: 'center', marginVertical: Spacing.md }}>
                <PieChart
                  data={pieData}
                  donut
                  radius={80}
                  innerRadius={55}
                  isAnimated
                />
              </View>
              <View style={styles.legend}>
                {emotionData.map((item, i) => (
                  <View key={item.emotionId} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }]} />
                    <Text style={styles.legendLabel}>{getEmotionLabel(item.emotionId)}</Text>
                    <Text style={styles.legendCount}>{item.count}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>Aucune donnée</Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  summaryCard: {
    borderRadius: Spacing.cardBorderRadius,
    padding: Spacing.lg,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 6,
  },
  summaryNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.white,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.white,
  },
  summaryArchived: {
    fontSize: 13,
    color: Colors.white,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E8F0',
    borderRadius: 30,
    padding: 4,
    gap: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 26,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.accent,
    fontWeight: '700',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textAccent,
    flex: 1,
  },
  emptyChart: {
    height: 120,
    borderWidth: 1,
    borderColor: '#D0DBE8',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChartText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  legend: {
    gap: Spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  legendCount: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
