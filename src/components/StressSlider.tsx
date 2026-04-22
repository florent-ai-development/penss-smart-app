import React from 'react';
import { View, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  clamp,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing } from '../constants';

interface StressSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  readonly?: boolean;
}

export const StressSlider: React.FC<StressSliderProps> = ({
  value,
  min,
  max,
  onChange,
  leftLabel,
  rightLabel,
  readonly = false,
}) => {
  const sliderWidth = useSharedValue(0);
  const translateX = useSharedValue(-1); // -1 = not yet initialized

  const progress = useDerivedValue(() => {
    if (sliderWidth.value === 0) return (value - min) / (max - min);
    return translateX.value / sliderWidth.value;
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    const pos = sliderWidth.value === 0
      ? ((value - min) / (max - min)) * 0
      : translateX.value;
    return {
      transform: [{ translateX: pos - 14 }],
      opacity: readonly ? 0.5 : 1,
    };
  });

  const animatedFillStyle = useAnimatedStyle(() => {
    return {
      width: progress.value * sliderWidth.value,
    };
  });

  const startX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .enabled(!readonly)
    .onBegin(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      translateX.value = clamp(startX.value + event.translationX, 0, sliderWidth.value);
      const newValue = Math.round(min + progress.value * (max - min));
      runOnJS(onChange)(Math.max(min, Math.min(max, newValue)));
    });

  return (
    <View>
      <GestureDetector gesture={panGesture}>
        <View
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            sliderWidth.value = w;
            translateX.value = ((value - min) / (max - min)) * w;
          }}
          style={{
            height: 14,
            backgroundColor: Colors.sliderTrack,
            borderRadius: 7,
            width: '100%',
            position: 'relative',
          }}
        >
          <Animated.View
            style={[
              {
                height: 14,
                backgroundColor: Colors.sliderThumb,
                borderRadius: 7,
                position: 'absolute',
                left: 0,
              },
              animatedFillStyle,
            ]}
          />
          <Animated.View
            style={[
              {
                width: 28,
                height: 28,
                backgroundColor: Colors.sliderThumb,
                borderRadius: 14,
                position: 'absolute',
                top: -7,
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 2,
              },
              animatedThumbStyle,
            ]}
          />
        </View>
      </GestureDetector>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: Spacing.sm,
        }}
      >
        <Text style={Typography.sliderLabel}>{leftLabel || min.toString()}</Text>
        <Text style={Typography.sliderLabel}>{rightLabel || max.toString()}</Text>
      </View>

      <Text
        style={{
          ...Typography.sliderValue,
          textAlign: 'center',
          marginTop: Spacing.sm,
        }}
      >
        {value}
      </Text>
    </View>
  );
};