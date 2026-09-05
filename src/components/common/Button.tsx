import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { palette, radii, shadows, spacing } from '@/theme';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

const HEIGHTS: Record<Size, number> = { sm: 40, md: 48, lg: 54 };

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const height = HEIGHTS[size];
  const textColor = variant === 'primary' ? palette.white : variant === 'secondary' ? palette.primary : variant === 'outline' ? palette.text : palette.primary;

  const content = (
    <View style={styles.row}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {leftIcon && <Ionicons name={leftIcon} size={18} color={textColor} style={styles.iconLeft} />}
          <Text variant="button" color={textColor} numberOfLines={1}>
            {title}
          </Text>
          {rightIcon && <Ionicons name={rightIcon} size={18} color={textColor} style={styles.iconRight} />}
        </>
      )}
    </View>
  );

  const base: ViewStyle = {
    height,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.xl,
    opacity: isDisabled ? 0.55 : 1,
    width: fullWidth ? '100%' : undefined,
  };

  if (variant === 'primary') {
    return (
      <PressableScale
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={[base, !isDisabled && shadows.primary, style]}
      >
        <LinearGradient
          colors={palette.ctaGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: radii.lg }]}
        />
        {content}
      </PressableScale>
    );
  }

  const variantStyle: ViewStyle =
    variant === 'secondary'
      ? { backgroundColor: palette.primaryTint }
      : variant === 'outline'
        ? { backgroundColor: palette.surface, borderWidth: 1.5, borderColor: palette.borderStrong }
        : { backgroundColor: palette.transparent };

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[base, styles.center, variantStyle, style]}
    >
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { justifyContent: 'center' },
  iconLeft: { marginRight: spacing.sm },
  iconRight: { marginLeft: spacing.sm },
});
