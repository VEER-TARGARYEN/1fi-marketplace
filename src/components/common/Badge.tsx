import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { palette, radii, spacing } from '@/theme';
import { Text } from './Text';

type Tone = 'primary' | 'success' | 'gold' | 'neutral' | 'danger' | 'dark';

interface BadgeProps {
  label: string;
  tone?: Tone;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

const TONES: Record<Tone, { bg: string; fg: string }> = {
  primary: { bg: palette.primaryTint, fg: palette.primary },
  success: { bg: palette.successTint, fg: palette.success },
  gold: { bg: palette.goldSoft, fg: '#B26A00' },
  neutral: { bg: '#F0F0F4', fg: palette.textSecondary },
  danger: { bg: palette.dangerTint, fg: palette.danger },
  dark: { bg: 'rgba(20,19,25,0.72)', fg: palette.white },
};

/** Small pill label — e.g. "No Cost EMI", "Bestseller", "10% OFF". */
export function Badge({ label, tone = 'neutral', icon, style }: BadgeProps) {
  const { bg, fg } = TONES[tone];
  return (
    <View style={[styles.base, { backgroundColor: bg }, style]}>
      {icon && <Ionicons name={icon} size={11} color={fg} style={styles.icon} />}
      <Text variant="caption" color={fg} style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  icon: { marginRight: 3 },
  label: { textTransform: 'uppercase' },
});
