import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientScreen } from '../components/GradientScreen';
import { HomeMenuItem } from '../components/HomeMenuItem';
import { StressRepository } from '../storage/stressRepository';
import { Colors, Typography, Spacing } from '../constants';

const stressRepo = new StressRepository();

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [stressError, setStressError] = useState(false);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (errorTimer.current) clearTimeout(errorTimer.current); }, []);

  const handleStressPress = useCallback(async () => {
    const existing = await stressRepo.getByDate(todayString());
    if (existing) {
      setStressError(true);
      if (errorTimer.current) clearTimeout(errorTimer.current);
      errorTimer.current = setTimeout(() => setStressError(false), 3000);
    } else {
      setStressError(false);
      router.push('/stress');
    }
  }, []);

  return (
    <GradientScreen>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.container, { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.iconButton}>
            <Ionicons name="settings" size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Central Logo Area */}
        <View style={styles.logoArea}>
          <Text style={styles.appTitle}>Penss'</Text>
          <TouchableOpacity onPress={() => router.push('/new-event/step-1')} style={styles.logoContainer}>
            <Ionicons name="flash" size={60} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.logoText}>Taper pour saisir un nouvel événement.</Text>
        </View>

        {/* Menu List */}
        <View style={styles.menuList}>
          <HomeMenuItem
            icon={<Ionicons name="flash" size={24} color={Colors.white} />}
            label="Mes événements"
            onPress={() => router.push('/events')}
          />
          <HomeMenuItem
            icon={<Ionicons name="archive" size={24} color={Colors.white} />}
            label="Mes événements archivés"
            onPress={() => router.push('/events/archived')}
          />
          <HomeMenuItem
            icon={<MaterialCommunityIcons name="pulse" size={24} color={Colors.white} />}
            label="Évaluation du stress"
            onPress={handleStressPress}
          />
          {stressError && (
            <View style={styles.errorBanner}>
              <Ionicons name="information-circle" size={16} color={Colors.white} style={{ marginRight: Spacing.xs }} />
              <Text style={styles.errorText}>
                Vous avez déjà évalué votre stress aujourd'hui. Revenez demain pour une nouvelle évaluation.
              </Text>
            </View>
          )}
          <HomeMenuItem
            icon={<Ionicons name="time" size={24} color={Colors.white} />}
            label="Historique du stress"
            onPress={() => router.push('/stress/history')}
          />
          <HomeMenuItem
            icon={<Ionicons name="bar-chart" size={24} color={Colors.white} />}
            label="Mes statistiques"
            onPress={() => router.push('/statistics')}
          />
        </View>
      </ScrollView>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screenHorizontalPadding,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconButton: {
    padding: Spacing.sm,
  },
  logoArea: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  appTitle: {
    color: Colors.white,
    fontSize: 36,
    fontWeight: '700' as const,
    marginBottom: Spacing.lg,
    letterSpacing: 1,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 12,
  },
  logoText: {
    ...Typography.body,
    color: Colors.textOnGradient,
    marginTop: Spacing.md,
  },
  menuList: {
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 10,
    padding: Spacing.sm,
  },
  errorText: {
    ...Typography.body,
    color: Colors.white,
    flex: 1,
    fontSize: 13,
  },
});
