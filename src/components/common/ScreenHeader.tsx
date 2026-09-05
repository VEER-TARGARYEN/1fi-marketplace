import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hitSlop, palette, radii, spacing } from '@/theme';
import { Text } from './Text';

interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

/** Solid top app bar with a back button — used on Checkout and Success. */
export function ScreenHeader({ title, onBack, right }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={hitSlop} style={styles.iconBtn} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color={palette.text} />
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}
        <Text variant="title" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <View style={styles.right}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, marginHorizontal: spacing.sm },
  right: { minWidth: 40, alignItems: 'flex-end' },
});
