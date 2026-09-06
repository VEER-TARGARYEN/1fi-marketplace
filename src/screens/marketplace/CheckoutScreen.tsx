import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, Divider, ErrorState, ScreenHeader, Skeleton, Text } from '@/components/common';
import { ProductImage } from '@/components/marketplace';
import { usePlaceOrder } from '@/hooks/usePlaceOrder';
import { useProduct } from '@/hooks/useProducts';
import { useUserLimit } from '@/hooks/useUserLimit';
import { RootScreenProps } from '@/navigation/types';
import { palette, radii, shadows, spacing } from '@/theme';
import { firstEmiDate } from '@/utils/emi';
import { formatCurrency } from '@/utils/format';

/** A single label/value line in a summary card. */
function Row({
  label,
  value,
  strong,
  valueColor,
}: {
  label: string;
  value: string;
  strong?: boolean;
  valueColor?: string;
}) {
  return (
    <View style={styles.row}>
      <Text variant={strong ? 'title' : 'body'} color={strong ? 'text' : 'textSecondary'}>
        {label}
      </Text>
      <Text variant={strong ? 'title' : 'bodyMedium'} color={valueColor ?? 'text'}>
        {value}
      </Text>
    </View>
  );
}

export function CheckoutScreen({ route, navigation }: RootScreenProps<'Checkout'>) {
  const { productId, variantSummary, tenureMonths, unitPrice, monthlyAmount } = route.params;
  const insets = useSafeAreaInsets();

  const productQuery = useProduct(productId);
  const limitQuery = useUserLimit();
  const placeOrder = usePlaceOrder();

  const product = productQuery.data;
  const limit = limitQuery.data;

  const lienAmount = limit ? Math.round(unitPrice / limit.ltv) : unitPrice * 2;
  const availableAfter = limit ? limit.availableLimit - unitPrice : 0;
  const emiDate = firstEmiDate(new Date());

  const onConfirm = () => {
    if (!product) return;
    placeOrder.mutate(
      {
        productId: product.id,
        productName: product.name,
        variantSelections: route.params.variantSelections,
        variantSummary,
        tenureMonths,
        unitPrice,
        monthlyAmount,
      },
      {
        onSuccess: (order) => navigation.replace('OrderSuccess', { order }),
      },
    );
  };

  if (!product) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Checkout" onBack={() => navigation.goBack()} />
        {productQuery.isError ? (
          <View style={styles.loading}>
            <ErrorState
              title="Couldn’t load checkout"
              message={productQuery.error?.message}
              onRetry={() => productQuery.refetch()}
              retrying={productQuery.isFetching}
            />
          </View>
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator color={palette.primary} />
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScreenHeader title="Checkout" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order summary */}
        <Card style={styles.card}>
          <View style={styles.productRow}>
            <ProductImage
              accentColor={product.accentColor}
              deviceType={product.deviceType}
              images={product.images}
              idKey={`checkout-${product.id}`}
              padding={8}
              style={styles.thumb}
            />
            <View style={styles.productInfo}>
              <Text variant="caption" color="textTertiary">
                {product.brand.toUpperCase()}
              </Text>
              <Text variant="title" numberOfLines={2}>
                {product.name}
              </Text>
              {!!variantSummary && (
                <Text variant="bodySm" color="textSecondary" numberOfLines={2} style={styles.variant}>
                  {variantSummary}
                </Text>
              )}
              <Text variant="price" style={styles.unitPrice}>
                {formatCurrency(unitPrice)}
              </Text>
            </View>
          </View>
        </Card>

        {/* EMI plan */}
        <Text variant="h3" style={styles.sectionTitle}>
          Your EMI plan
        </Text>
        <Card style={styles.card}>
          <View style={styles.planHeader}>
            <View>
              <Text variant="h2" color="primary">
                {formatCurrency(monthlyAmount)}
                <Text variant="body" color="textSecondary">
                  {' '}
                  /mo
                </Text>
              </Text>
              <Text variant="bodySm" color="textSecondary">
                {tenureMonths} months · No Cost EMI
              </Text>
            </View>
            <View style={styles.zeroBadge}>
              <Text variant="h3" color="success">
                0%
              </Text>
              <Text variant="caption" color="success">
                interest
              </Text>
            </View>
          </View>
          <Divider />
          <Row label="Total payable" value={formatCurrency(unitPrice)} />
          <Row label="Interest & fees" value="₹0" valueColor={palette.success} />
          <Row label="First EMI on" value={emiDate} />
        </Card>

        {/* Mutual fund lien / limit impact */}
        <Text variant="h3" style={styles.sectionTitle}>
          Backed by your mutual funds
        </Text>
        <Card style={styles.card}>
          {limit ? (
            <>
              <View style={styles.lienRow}>
                <View style={styles.lienIcon}>
                  <Ionicons name="lock-closed" size={18} color={palette.primary} />
                </View>
                <Text variant="bodySm" color="textSecondary" style={styles.lienText}>
                  We’ll lien-mark {formatCurrency(lienAmount)} of your mutual funds. Your units stay
                  invested and continue to grow.
                </Text>
              </View>
              <Divider />
              <Row label="Available 1Fi limit" value={formatCurrency(limit.availableLimit)} />
              <Row label="This purchase" value={`− ${formatCurrency(unitPrice)}`} />
              <Divider />
              <Row label="Limit after purchase" value={formatCurrency(availableAfter)} strong />
            </>
          ) : limitQuery.isError ? (
            <Text variant="bodySm" color="textSecondary">
              Your units stay invested — limit details are unavailable right now.
            </Text>
          ) : (
            <>
              <Skeleton width="100%" height={38} radius={radii.md} />
              <Divider />
              <Skeleton width="100%" height={16} style={styles.skeletonGap} />
              <Skeleton width="70%" height={16} />
            </>
          )}
        </Card>

        {placeOrder.isError && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={palette.danger} />
            <Text variant="bodySm" color="danger" style={styles.errorText}>
              {placeOrder.error?.message ?? 'Could not place order. Please try again.'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky confirm */}
      <View style={[styles.cta, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <Button
          title="Confirm & place order"
          onPress={onConfirm}
          loading={placeOrder.isPending}
          fullWidth
          leftIcon="shield-checkmark"
        />
        <Text variant="caption" color="textTertiary" center style={styles.ctaNote}>
          By continuing you agree to lien-mark the mutual funds shown above.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.xl, paddingBottom: 150 },
  card: { marginBottom: spacing.lg },
  skeletonGap: { marginTop: spacing.md, marginBottom: spacing.sm },
  productRow: { flexDirection: 'row' },
  thumb: { width: 84, height: 84, borderRadius: radii.md },
  productInfo: { flex: 1, marginLeft: spacing.lg },
  variant: { marginTop: 2 },
  unitPrice: { marginTop: spacing.sm },
  sectionTitle: { marginBottom: spacing.md },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  zeroBadge: {
    alignItems: 'center',
    backgroundColor: palette.successTint,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  lienRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  lienIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: palette.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  lienText: { flex: 1 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.dangerTint,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  errorText: { flex: 1, marginLeft: spacing.sm },
  cta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: palette.surface,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    ...shadows.lg,
  },
  ctaNote: { marginTop: spacing.sm },
});
