import React from 'react';
import { View, Text } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';

interface StressEmojiProps {
  level: number;
}

const getStressColor = (level: number): string => {
  if (level >= 0 && level <= 2) return Colors.stressColor0to2;
  if (level >= 3 && level <= 4) return Colors.stressColor3to4;
  if (level === 5) return Colors.stressColor5;
  if (level >= 6 && level <= 7) return Colors.stressColor6to7;
  if (level >= 8 && level <= 9) return Colors.stressColor8to9;
  return Colors.stressColor10;
};

const getStressEmoji = (level: number): string => {
  if (level >= 0 && level <= 2) return '😌';
  if (level >= 3 && level <= 4) return '🙂';
  if (level === 5) return '😐';
  if (level >= 6 && level <= 7) return '😟';
  if (level >= 8 && level <= 9) return '😰';
  return '😱';
};

export const StressEmoji: React.FC<StressEmojiProps> = ({ level }) => {
  const color = getStressColor(level);
  const emoji = getStressEmoji(level);

  return (
    <View
      style={{
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 64 }}>{emoji}</Text>
    </View>
  );
};