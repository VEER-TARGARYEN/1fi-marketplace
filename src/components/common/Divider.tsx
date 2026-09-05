import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { palette, spacing } from '@/theme';

/** Thin hairline separator. */
export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.line, style]} />;
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.border,
    marginVertical: spacing.md,
  },
});
