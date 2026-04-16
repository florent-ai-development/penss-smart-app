import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View
      style={[
        {
          backgroundColor: Colors.cardWhite,
          borderRadius: Spacing.cardBorderRadius,
          padding: Spacing.cardPadding,
          shadowColor: Colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};