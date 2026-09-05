import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card } from '@/components/common/Card';
import { Skeleton } from '@/components/common/Skeleton';
import { radii, spacing } from '@/theme';

/** Loading placeholder that mirrors ProductCard's layout to avoid layout shift. */
export function ProductCardSkeleton({ style }: { style?: ViewStyle }) {
  return (
    <View style={style}>
      <Card padded={false} shadow="sm" style={styles.card}>
        <Skeleton height={132} radius={0} />
        <View style={styles.body}>
          <Skeleton width={60} height={9} />
          <Skeleton width="90%" height={15} style={styles.gap} />
          <Skeleton width="55%" height={12} style={styles.gap} />
          <Skeleton width="70%" height={18} style={styles.gapLg} />
          <Skeleton width="80%" height={22} radius={radii.sm} style={styles.gap} />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  body: { padding: spacing.md },
  gap: { marginTop: spacing.sm },
  gapLg: { marginTop: spacing.md },
});
