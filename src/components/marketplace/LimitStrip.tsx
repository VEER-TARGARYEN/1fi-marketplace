import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@/components/common/Card';
import { PressableScale } from '@/components/common/PressableScale';
import { Skeleton } from '@/components/common/Skeleton';
import { Text } from '@/components/common/Text';
import { palette, radii, spacing } from '@/theme';
import { UserLimit } from '@/types';
import { formatCompactCurrency, formatCurrency } from '@/utils/format';

interface LimitStripProps {
  limit?: UserLimit;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  onPress?: () => void;
}

const TRUST = ['0% interest', 'No credit check', 'Prepay anytime'];

/**
 * The mutual-fund-backed purchase power that powers every EMI. Anchoring the
 * marketplace with this makes the core 1Fi value prop explicit: you're shopping
 * against your investments, not a credit card.
 */
export function LimitStrip({ limit, loading, error, onRetry, onPress }: LimitStripProps) {
  if (loading) {
    return (
      <Card style={styles.card}>
        <Skeleton width={120} height={12} />
        <Skeleton width={180} height={26} style={{ marginTop: spacing.sm }} />
        <Skeleton width="100%" height={8} radius={radii.pill} style={{ marginTop: spacing.lg }} />
      </Card>
    );
  }

  // Failed to load (or no data) — offer a compact retry instead of an endless
  // shimmer, consistent with the app's other error states.
  if (error || !limit) {
    return (
      <PressableScale onPress={onRetry} activeScale={0.98} accessibilityRole="button">
        <Card style={styles.card}>
          <View style={styles.errorRow}>
            <Ionicons name="wallet-outline" size={18} color={palette.textSecondary} />
            <Text variant="bodySm" color="textSecondary" style={styles.errorText}>
              Couldn’t load your 1Fi limit
            </Text>
            <View style={styles.retry}>
              <Ionicons name="refresh" size={14} color={palette.primary} />
              <Text variant="label" color="primary" style={styles.retryText}>
                Retry
              </Text>
            </View>
          </View>
        </Card>
      </PressableScale>
    );
  }

  const pct = Math.max(0.04, Math.min(1, limit.availableLimit / limit.totalLimit));

  return (
    <PressableScale onPress={onPress} activeScale={0.98} accessibilityRole="button">
      <Card padded={false} shadow="md" style={styles.card}>
        <LinearGradient
          colors={['#F7F3FF', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.inner}>
          <View style={styles.headerRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="wallet" size={18} color={palette.white} />
            </View>
            <View style={styles.headerText}>
              <Text variant="label" color="textSecondary">
                Available 1Fi limit
              </Text>
              <Text variant="h2">{formatCurrency(limit.availableLimit)}</Text>
            </View>
            <View style={styles.detailsHint}>
              <Text variant="caption" color="primary">
                Details
              </Text>
              <Ionicons name="chevron-forward" size={13} color={palette.primary} />
            </View>
          </View>

          <View style={styles.track}>
            <LinearGradient
              colors={palette.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.fill, { width: `${pct * 100}%` }]}
            />
          </View>
          <Text variant="bodySm" color="textSecondary" style={styles.metaLine}>
            {formatCompactCurrency(limit.usedLimit)} used of{' '}
            {formatCompactCurrency(limit.totalLimit)} · Backed by{' '}
            {formatCompactCurrency(limit.pledgedValue)} in mutual funds
          </Text>

          <View style={styles.trustRow}>
            {TRUST.map((t) => (
              <View key={t} style={styles.trustItem}>
                <Ionicons name="checkmark-circle" size={13} color={palette.success} />
                <Text variant="caption" color="textSecondary" style={styles.trustText}>
                  {t}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Card>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  errorRow: { flexDirection: 'row', alignItems: 'center' },
  errorText: { flex: 1, marginLeft: spacing.sm },
  retry: { flexDirection: 'row', alignItems: 'center' },
  retryText: { marginLeft: 4 },
  inner: { padding: spacing.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1, marginLeft: spacing.md },
  detailsHint: { flexDirection: 'row', alignItems: 'center' },
  track: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: palette.primaryTintStrong,
    overflow: 'hidden',
    marginTop: spacing.lg,
  },
  fill: { height: '100%', borderRadius: radii.pill },
  metaLine: { marginTop: spacing.sm },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  trustItem: { flexDirection: 'row', alignItems: 'center' },
  trustText: { marginLeft: 4 },
});
