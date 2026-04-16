import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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

  const handleStressPress = useCallback(async () => {
    const existing = await stressRepo.getByDate(todayString());
    if (existing) {
      Alert.alert(
        'Déjà enregistré',
        "Vous avez déjà évalué votre stress aujourd'hui. Revenez demain pour une nouvelle mesure.",
        [{ text: 'OK' }]
      );
    } else {
      router.push('/stress');
    }
  }, []);

  return (
    <GradientScreen>
      <View style={[styles.container, { paddingTop: insets.top + Spacing.md }]}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.iconButton}>
            <Ionicons name="settings" size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Central Logo Area */}
        <View style={styles.logoArea}>
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
          <HomeMenuItem
            icon={<Ionicons name="bar-chart" size={24} color={Colors.white} />}
            label="Mes statistiques"
            onPress={() => router.push('/statistics')}
          />
        </View>
      </View>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: Spacing.xxl + Spacing.lg,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    ...Typography.body,
    color: Colors.textOnGradient,
    marginTop: Spacing.md,
  },
  menuList: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
});
