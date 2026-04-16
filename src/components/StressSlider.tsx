import React, { useRef } from 'react';
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
  const sliderWidth = useRef(0);
  const translateX = useSharedValue(((value - min) / (max - min)) * (sliderWidth.current || 0));

  const progress = useDerivedValue(() => {
    return translateX.value / sliderWidth.current;
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value - 11 }],
      opacity: readonly ? 0.5 : 1,
    };
  });

  const animatedFillStyle = useAnimatedStyle(() => {
    return {
      width: progress.value * sliderWidth.current,
    };
  });

  const startX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .enabled(!readonly)
    .onBegin(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      translateX.value = clamp(startX.value + event.translationX, 0, sliderWidth.current);
      const newValue = Math.round(min + progress.value * (max - min));
      runOnJS(onChange)(Math.max(min, Math.min(max, newValue)));
    });

  return (
    <View>
      <GestureDetector gesture={panGesture}>
        <View
          onLayout={(e) => {
            sliderWidth.current = e.nativeEvent.layout.width;
            translateX.value = ((value - min) / (max - min)) * sliderWidth.current;
          }}
          style={{
            height: 4,
            backgroundColor: Colors.sliderTrack,
            borderRadius: 2,
            width: '100%',
            position: 'relative',
          }}
        >
          <Animated.View
            style={[
              {
                height: 4,
                backgroundColor: Colors.sliderThumb,
                borderRadius: 2,
                position: 'absolute',
                left: 0,
              },
              animatedFillStyle,
            ]}
          />
          <Animated.View
            style={[
              {
                width: 22,
                height: 22,
                backgroundColor: Colors.sliderThumb,
                borderRadius: 11,
                position: 'absolute',
                top: -9,
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