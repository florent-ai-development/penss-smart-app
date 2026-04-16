import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { Colors, Typography, Spacing } from '../constants';

interface StepProgressProps {
  current: number;
  total: number;
}

export const StepProgress: React.FC<StepProgressProps> = ({ current, total }) => {
  const progress = current / total;
  const circumference = 2 * Math.PI * 20;

  return (
    <View style={{ width: 52, height: 52 }}>
      <Svg width={52} height={52}>
        <Circle
          cx={26}
          cy={26}
          r={20}
          stroke={Colors.progressArcBg}
          strokeWidth={4}
          fill="transparent"
        />
        <Circle
          cx={26}
          cy={26}
          r={20}
          stroke={Colors.progressArcFill}
          strokeWidth={4}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress * circumference}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={{ ...Typography.stepCounter, textAlign: 'center', marginTop: -52 }}>
        {current} sur {total}
      </Text>
    </View>
  );
};