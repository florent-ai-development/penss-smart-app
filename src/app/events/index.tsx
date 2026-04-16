import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { EventCard } from '../../components/EventCard';
import { PillButton } from '../../components/PillButton';
import { EventRepository } from '../../storage/eventRepository';
import type { AppEvent } from '../../types';
import { Colors, Spacing } from '../../constants';

const repo = new EventRepository();

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState<AppEvent[]>([]);

  useFocusEffect(
    useCallback(() => {
      repo.getActive().then(data =>
        setEvents(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      );
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F6FF' }}>
      <ScreenHeader title="Mes événements" onBack={() => router.replace('/')} />

      {events.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="flash-outline" size={64} color="rgba(41,121,255,0.25)" />
          <Text style={styles.emptyTitle}>Aucun événement enregistré</Text>
          <PillButton
            label="Créer un événement"
            onPress={() => router.push('/new-event/step-1')}
            variant="primary"
          />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => router.push({ pathname: '/events/[id]', params: { id: item.id } })}
            />
          )}
        />
      )}

      {/* FAB */}
      {events.length > 0 && (
        <TouchableOpacity
          style={[styles.fab, { bottom: insets.bottom + 24 }]}
          onPress={() => router.push('/new-event/step-1')}
        >
          <Ionicons name="flash" size={28} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  list: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.iconBgBlue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
