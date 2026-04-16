import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, Dimensions } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';

interface EmotionButtonProps {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const buttonWidth = (width - 2 * 16 - 2 * 8) / 3;

export const EmotionButton: React.FC<EmotionButtonProps> = ({ emoji, label, selected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: buttonWidth,
        height: 80,
        backgroundColor: selected ? 'rgba(0, 200, 224, 0.22)' : Colors.cardDark,
        borderRadius: Spacing.emotionButtonBorderRadius,
        borderWidth: 2,
        borderColor: selected ? Colors.accent : 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: Spacing.xs }}>{emoji}</Text>
      <Text style={[Typography.emotionLabel, selected && { color: Colors.accent, fontWeight: '700' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};