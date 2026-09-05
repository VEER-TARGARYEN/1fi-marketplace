import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { spacing } from '@/theme';
import { discountPercent, formatCurrency } from '@/utils/format';

interface PriceTagProps {
  price: number;
  mrp: number;
  size?: 'md' | 'lg';
}

/** Price + struck-through MRP + discount %, laid out consistently everywhere. */
export function PriceTag({ price, mrp, size = 'md' }: PriceTagProps) {
  const off = discountPercent(mrp, price);
  const showMrp = mrp > price;

  return (
    <View style={styles.row}>
      <Text variant={size === 'lg' ? 'h2' : 'price'}>{formatCurrency(price)}</Text>
      {showMrp && (
        <>
          <Text variant="bodySm" color="textTertiary" style={styles.mrp}>
            {formatCurrency(mrp)}
          </Text>
          <Text variant="label" color="success">
            {off}% off
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  mrp: {
    marginLeft: spacing.sm,
    marginRight: spacing.xs,
    textDecorationLine: 'line-through',
  },
});
