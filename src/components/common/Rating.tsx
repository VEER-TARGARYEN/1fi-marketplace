import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { palette, spacing } from '@/theme';
import { formatCount, formatRating } from '@/utils/format';
import { Text } from './Text';

interface RatingProps {
  rating: number;
  count?: number;
  size?: number;
  compact?: boolean;
}

/** Star rating with optional review count, e.g. ★ 4.8 (18.4K). */
export function Rating({ rating, count, size = 13, compact = false }: RatingProps) {
  return (
    <View style={styles.row}>
      <Ionicons name="star" size={size} color={palette.star} />
      <Text variant="label" color="text" style={styles.value}>
        {formatRating(rating)}
      </Text>
      {count != null && !compact && (
        <Text variant="label" color="textTertiary" style={styles.count}>
          ({formatCount(count)})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  value: { marginLeft: 3 },
  count: { marginLeft: spacing.xs },
});
