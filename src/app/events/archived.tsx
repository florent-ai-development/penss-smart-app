import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../components/ScreenHeader';
import { EventCard } from '../../components/EventCard';
import { EventRepository } from '../../storage/eventRepository';
import { CustomEmotionsRepository } from '../../storage/customEmotionsRepository';
import type { AppEvent, Emotion } from '../../types';
import { Colors, Spacing } from '../../constants';

const repo = new EventRepository();
const customRepo = new CustomEmotionsRepository();

export default function ArchivedEventsScreen() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [customEmotions, setCustomEmotions] = useState<Emotion[]>([]);

  useFocusEffect(
    useCallback(() => {
      repo.getArchived().then(data =>
        setEvents(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      );
      customRepo.getAll().then(setCustomEmotions);
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F6FF' }}>
      <ScreenHeader title="Événements archivés" onBack={() => router.back()} />

      {events.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="archive-outline" size={64} color="rgba(41,121,255,0.25)" />
          <Text style={styles.emptyTitle}>Aucun événement archivé</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              archived
              customEmotions={customEmotions}
              onPress={() => router.push({ pathname: '/events/[id]', params: { id: item.id } })}
            />
          )}
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
});
