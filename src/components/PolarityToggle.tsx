import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';

interface PolarityToggleProps {
  value: 'negative' | 'positive';
  onChange: (v: 'negative' | 'positive') => void;
}

export const PolarityToggle: React.FC<PolarityToggleProps> = ({ value, onChange }) => {
  const segments = [
    { label: 'Négatives', value: 'negative' as const },
    { label: 'Positives', value: 'positive' as const },
  ];

  return (
    <View
      style={{
        backgroundColor: Colors.cardDark,
        borderRadius: Spacing.buttonBorderRadius,
        padding: Spacing.xs,
        flexDirection: 'row',
      }}
    >
      {segments.map((segment) => (
        <TouchableOpacity
          key={segment.value}
          onPress={() => onChange(segment.value)}
          style={{
            flex: 1,
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            borderRadius: Spacing.buttonBorderRadius - Spacing.xs,
            backgroundColor: value === segment.value ? '#2A2F3E' : 'transparent',
          }}
        >
          <Text
            style={{
              ...Typography.body,
              color: value === segment.value ? Colors.white : 'rgba(255,255,255,0.5)',
              fontWeight: value === segment.value ? '600' : '400',
            }}
          >
            {segment.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};