import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../constants';

interface CognitiveBiasButtonProps {
  title: string;
  subtitle: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
}

export const CognitiveBiasButton: React.FC<CognitiveBiasButtonProps> = ({
  title,
  subtitle,
  emoji,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: selected ? '#0D47A1' : Colors.cardDark,
        borderRadius: Spacing.emotionButtonBorderRadius,
        padding: Spacing.md,
        borderWidth: 2,
        borderColor: selected ? '#42A5F5' : 'rgba(255,255,255,0.08)',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {emoji && (
        <Text style={{ fontSize: 22, marginRight: Spacing.sm }}>{emoji}</Text>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ ...Typography.body, color: selected ? '#BBDEFB' : Colors.white, fontWeight: '600' }}>
          {title}
        </Text>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
          "{subtitle}"
        </Text>
      </View>
      {selected && (
        <Ionicons name="checkmark-circle" size={20} color="#42A5F5" style={{ marginLeft: Spacing.sm }} />
      )}
    </TouchableOpacity>
  );
};