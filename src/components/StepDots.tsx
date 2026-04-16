import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../constants';

interface StepDotsProps {
  current: number;
  total: number;
}

export const StepDots: React.FC<StepDotsProps> = ({ current, total }) => {
  const dots = [];

  for (let i = 1; i <= total; i++) {
    dots.push(
      <View
        key={i}
        style={{
          width: i === current ? 20 : 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: i === current ? Colors.dotActive : Colors.dotInactive,
          marginHorizontal: Spacing.xs,
        }}
      />
    );
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: Spacing.xs }}>
      {dots}
    </View>
  );
};