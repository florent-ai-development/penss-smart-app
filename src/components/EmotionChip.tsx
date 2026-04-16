import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';

interface EmotionChipProps {
  label: string;
}

export const EmotionChip: React.FC<EmotionChipProps> = ({ label }) => {
  return (
    <View
      style={{
        backgroundColor: Colors.chipBg,
        borderRadius: Spacing.emotionButtonBorderRadius,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text style={{ ...Typography.body, color: Colors.chipText, fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
};