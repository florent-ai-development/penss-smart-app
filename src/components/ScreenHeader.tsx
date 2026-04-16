import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../constants';

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  rightSlot?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack, rightSlot }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: Colors.headerBg,
        paddingTop: insets.top + 10,
        paddingBottom: Spacing.md + 4,
        paddingHorizontal: Spacing.screenHorizontalPadding,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {/* Fixed-width left slot keeps title truly centered */}
      <TouchableOpacity onPress={onBack} style={{ width: 40, alignItems: 'flex-start' }}>
        <Ionicons name="arrow-back" size={24} color={Colors.white} />
      </TouchableOpacity>

      <Text style={[Typography.headerTitle, { flex: 1, textAlign: 'center' }]}>{title}</Text>

      {/* Fixed-width right slot mirrors the left for symmetry */}
      <View style={{ width: 40, alignItems: 'flex-end' }}>
        {rightSlot ?? null}
      </View>
    </View>
  );
};