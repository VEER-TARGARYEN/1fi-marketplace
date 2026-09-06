import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Badge } from '@/components/common/Badge';
import { Text } from '@/components/common/Text';
import { palette, radii, spacing } from '@/theme';
import { EmiPlan } from '@/types';
import { formatCurrency } from '@/utils/format';

interface EmiPlanSelectorProps {
  plans: EmiPlan[];
  selectedTenure: number | null;
  onSelect: (tenure: number) => void;
}

/** Selectable list of no-cost EMI plans for the current product/variant. */
export function EmiPlanSelector({ plans, selectedTenure, onSelect }: EmiPlanSelectorProps) {
  return (
    <View style={styles.list}>
      {plans.map((plan) => {
        const active = plan.tenureMonths === selectedTenure;
        const disabled = !plan.withinLimit;

        return (
          <Pressable
            key={plan.tenureMonths}
            onPress={() => !disabled && onSelect(plan.tenureMonths)}
            disabled={disabled}
            style={[
              styles.card,
              active && styles.cardActive,
              disabled && styles.cardDisabled,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: active, disabled }}
            accessibilityLabel={`${formatCurrency(plan.monthlyAmount)} per month for ${plan.tenureMonths} months, no cost EMI`}
          >
            <View style={[styles.radio, active && styles.radioActive]}>
              {active && <View style={styles.radioDot} />}
            </View>

            <View style={styles.middle}>
              <View style={styles.amountRow}>
                <Text variant="title">{formatCurrency(plan.monthlyAmount)}</Text>
                <Text variant="bodySm" color="textSecondary">
                  {' '}
                  /mo for {plan.tenureMonths} months
                </Text>
              </View>
              {disabled ? (
                <Text variant="caption" color="danger" style={styles.sub}>
                  Exceeds available limit
                </Text>
              ) : (
                <Text variant="caption" color="textSecondary" style={styles.sub}>
                  0% interest · {formatCurrency(plan.totalPayable)} total
                </Text>
              )}
            </View>

            <View style={styles.right}>
              {plan.recommended && !disabled && <Badge label="Best" tone="primary" />}
              <Badge label="No Cost" tone="success" icon="checkmark-circle" style={styles.noCost} />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  cardActive: { borderColor: palette.primary, backgroundColor: palette.primaryTint },
  cardDisabled: { opacity: 0.5 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: palette.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: palette.primary },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: radii.pill,
    backgroundColor: palette.primary,
  },
  middle: { flex: 1, marginLeft: spacing.md },
  amountRow: { flexDirection: 'row', alignItems: 'baseline' },
  sub: { marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 4 },
  noCost: {},
});
