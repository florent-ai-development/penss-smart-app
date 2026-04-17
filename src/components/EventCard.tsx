import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../constants';
import { EmotionChip } from './EmotionChip';
import { AppEvent, Emotion } from '../types';
import { DEFAULT_EMOTIONS } from '../data/emotions';

interface EventCardProps {
  event: AppEvent;
  onPress: () => void;
  archived?: boolean;
  customEmotions?: Emotion[];
}

function getEmotionLabel(emotionId: string, customEmotions: Emotion[]): string {
  return (
    DEFAULT_EMOTIONS.find(e => e.id === emotionId)?.label ??
    customEmotions.find(e => e.id === emotionId)?.label ??
    emotionId
  );
}

function formatEventDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} - ${hh}:${mm}`;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress, archived = false, customEmotions = [] }) => {
  const iconName = archived ? 'archive' : 'flash';
  const iconBg = archived ? Colors.iconBgGray : Colors.iconBgBlue;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: Colors.cardWhite,
        borderRadius: Spacing.cardBorderRadius,
        padding: Spacing.cardPadding,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: Spacing.iconBorderRadius,
            backgroundColor: iconBg,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: Spacing.md,
            flexShrink: 0,
          }}
        >
          <Ionicons name={iconName} size={22} color={Colors.white} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
            <Ionicons name="calendar-outline" size={13} color={Colors.textDate} />
            <Text style={{ ...Typography.date, marginLeft: 4 }}>
              {formatEventDate(event.createdAt)}
            </Text>
          </View>
          <Text style={{ ...Typography.body, fontWeight: '600', marginBottom: Spacing.sm }} numberOfLines={1}>
            {event.situation}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs }}>
            {event.emotions.map(emotion => (
              <EmotionChip key={emotion.emotionId} label={getEmotionLabel(emotion.emotionId, customEmotions)} />
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};