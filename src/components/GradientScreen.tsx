import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, ViewStyle } from 'react-native';

interface GradientScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GradientScreen: React.FC<GradientScreenProps> = ({ children, style }) => {
  return (
    <LinearGradient
      colors={['#4DD9F0', '#2979FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[{ flex: 1 }, style]}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </LinearGradient>
  );
};