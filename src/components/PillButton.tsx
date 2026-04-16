import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../constants';

type PillButtonVariant = 'primary' | 'destructive' | 'outline' | 'ghost';

interface PillButtonProps {
  label: string;
  onPress: () => void;
  variant: PillButtonVariant;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const PillButton: React.FC<PillButtonProps> = ({
  label,
  onPress,
  variant,
  disabled = false,
  icon,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: Colors.btnPrimary,
          borderColor: Colors.btnPrimary,
        };
      case 'destructive':
        return {
          backgroundColor: Colors.btnDestructive,
          borderColor: Colors.btnDestructive,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: Colors.btnOutline,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
    }
  };

  const getButtonTextColor = () => {
    switch (variant) {
      case 'primary':
        return Colors.btnPrimaryText;
      case 'destructive':
        return Colors.btnDestructiveText;
      case 'outline':
        return Colors.btnOutlineText;
      case 'ghost':
        return Colors.textOnGradient;
    }
  };

  const buttonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.buttonBorderRadius,
    borderWidth: variant === 'outline' ? 2 : 0,
    ...getButtonStyle(),
    opacity: disabled ? 0.4 : 1,
  };

  const textStyle: TextStyle = {
    ...Typography.body,
    color: getButtonTextColor(),
    fontWeight: '600',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={buttonStyle}
    >
      {icon && (
        <View style={{ marginRight: Spacing.sm }}>
          {icon}
        </View>
      )}
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};