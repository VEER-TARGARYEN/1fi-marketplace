import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { palette, radii, shadows, spacing } from '@/theme';
import { ShadowKey } from '@/theme/shadows';

interface CardProps extends ViewProps {
  padded?: boolean;
  shadow?: ShadowKey;
  radius?: number;
  style?: ViewStyle | ViewStyle[];
}

/** White rounded surface used for every card in the app. */
export function Card({
  padded = true,
  shadow = 'sm',
  radius = radii.xl,
  style,
  children,
  ...rest
}: CardProps) {
  return (
    <View
      {...rest}
      style={[
        styles.base,
        { borderRadius: radius },
        shadows[shadow],
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
  },
  padded: { padding: spacing.lg },
});
