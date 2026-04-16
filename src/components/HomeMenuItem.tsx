import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../constants';

interface HomeMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export const HomeMenuItem: React.FC<HomeMenuItemProps> = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: Colors.cardWhite,
        borderRadius: Spacing.cardBorderRadius,
        padding: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: Spacing.iconBorderRadius,
          backgroundColor: Colors.iconBgBlue,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: Spacing.md,
        }}
      >
        {icon}
      </View>

      <Text style={Typography.menuItem}>{label}</Text>

      <View style={{ marginLeft: 'auto' }}>
        <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};