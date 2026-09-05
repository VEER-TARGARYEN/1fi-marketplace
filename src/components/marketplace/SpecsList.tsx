import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { palette, radii, spacing } from '@/theme';
import { ProductSpec } from '@/types';

/** Two-column grid of key product specs, each with an icon. */
export function SpecsList({ specs }: { specs: ProductSpec[] }) {
  return (
    <View style={styles.grid}>
      {specs.map((spec) => (
        <View key={spec.label} style={styles.item}>
          <View style={styles.iconWrap}>
            <Ionicons
              name={(spec.icon as keyof typeof Ionicons.glyphMap) ?? 'ellipse-outline'}
              size={18}
              color={palette.primary}
            />
          </View>
          <View style={styles.text}>
            <Text variant="caption" color="textTertiary">
              {spec.label.toUpperCase()}
            </Text>
            <Text variant="bodyMedium" numberOfLines={2}>
              {spec.value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.lg },
  item: { flexDirection: 'row', alignItems: 'center', width: '50%', paddingRight: spacing.sm },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: palette.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  text: { flex: 1 },
});
