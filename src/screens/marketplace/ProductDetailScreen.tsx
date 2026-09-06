import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  Badge,
  Button,
  Divider,
  ErrorState,
  Rating,
  Skeleton,
  Text,
} from '@/components/common';
import {
  EmiPlanSelector,
  PriceTag,
  ProductImage,
  SpecsList,
  VariantSelector,
} from '@/components/marketplace';
import { useProduct } from '@/hooks/useProducts';
import { useProductConfiguration } from '@/hooks/useProductConfiguration';
import { useUserLimit } from '@/hooks/useUserLimit';
import { useWishlist } from '@/hooks/useWishlist';
import { RootScreenProps } from '@/navigation/types';
import { hitSlop, palette, radii, shadows, spacing } from '@/theme';
import { buildEmiPlans, DEFAULT_EMI_TENURES, lowestMonthlyEmi } from '@/utils/emi';
import { formatCurrency } from '@/utils/format';

const TRUST_POINTS = [
  { icon: 'shield-checkmark-outline', text: 'No credit check — backed by your mutual funds' },
  { icon: 'trending-up-outline', text: 'Your funds stay invested and keep growing' },
  { icon: 'cash-outline', text: '0% interest · prepay anytime with zero charges' },
];

export function ProductDetailScreen({ route, navigation }: RootScreenProps<'ProductDetail'>) {
  const { productId } = route.params;
  const insets = useSafeAreaInsets();

  const productQuery = useProduct(productId);
  const limitQuery = useUserLimit();
  const product = productQuery.data;

  const { selections, setVariant, price, accentColor, variantSummary } =
    useProductConfiguration(product);
  const { isWishlisted, toggle } = useWishlist();

  const tenures = product?.emiTenures ?? DEFAULT_EMI_TENURES;
  const plans = product ? buildEmiPlans(price, tenures, limitQuery.data) : [];

  const [selectedTenure, setSelectedTenure] = useState<number | null>(null);
  // Until the user explicitly picks a plan, keep the selection synced to the
  // recommended tenure — which can change as the price (variant) changes.
  const userPickedTenure = useRef(false);
  const selectTenure = useCallback((tenure: number) => {
    userPickedTenure.current = true;
    setSelectedTenure(tenure);
  }, []);
  useEffect(() => {
    if (!plans.length || userPickedTenure.current) return;
    const recommended = plans.find((p) => p.recommended) ?? plans[0];
    setSelectedTenure(recommended.tenureMonths);
  }, [price, plans.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedPlan = plans.find((p) => p.tenureMonths === selectedTenure) ?? null;
  const canProceed = !!selectedPlan && selectedPlan.withinLimit;

  const onShare = async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `Check out the ${product.name} on 1Fi — No Cost EMI from ${formatCurrency(
          lowestMonthlyEmi(product.basePrice),
        )}/mo, backed by your mutual funds.`,
      });
    } catch {
      /* user dismissed or unsupported */
    }
  };

  const onProceed = () => {
    if (!product || !selectedPlan) return;
    navigation.navigate('Checkout', {
      productId: product.id,
      variantSelections: selections,
      variantSummary,
      tenureMonths: selectedPlan.tenureMonths,
      unitPrice: price,
      monthlyAmount: selectedPlan.monthlyAmount,
    });
  };

  // Floating circular header button
  const FloatingButton = ({
    icon,
    onPress,
    tint,
    label,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    tint?: string;
    label: string;
  }) => (
    <Pressable onPress={onPress} hitSlop={hitSlop} style={styles.floatBtn} accessibilityRole="button" accessibilityLabel={label}>
      <Ionicons name={icon} size={20} color={tint ?? palette.text} />
    </Pressable>
  );

  const header = (
    <View style={[styles.floatHeader, { top: insets.top + spacing.sm, pointerEvents: 'box-none' }]}>
      <FloatingButton icon="arrow-back" onPress={() => navigation.goBack()} label="Go back" />
      <View style={styles.floatRight}>
        <FloatingButton icon="share-outline" onPress={onShare} label="Share" />
        {product && (
          <FloatingButton
            icon={isWishlisted(product.id) ? 'heart' : 'heart-outline'}
            tint={isWishlisted(product.id) ? palette.danger : palette.text}
            onPress={() => toggle(product.id)}
            label="Wishlist"
          />
        )}
      </View>
    </View>
  );

  if (productQuery.isLoading) {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        {header}
        <DetailSkeleton topInset={insets.top} />
      </View>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        {header}
        <View style={styles.errorWrap}>
          <ErrorState
            title="Couldn’t load product"
            message={productQuery.error?.message}
            onRetry={() => productQuery.refetch()}
            retrying={productQuery.isFetching}
          />
        </View>
      </View>
    );
  }

  const badge = product.badges?.find((b) => b !== 'No Cost EMI');

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      {header}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* Hero */}
        <ProductImage
          accentColor={accentColor}
          deviceType={product.deviceType}
          images={product.images}
          idKey={`hero-${product.id}`}
          padding={40}
          style={[styles.hero, { paddingTop: insets.top }]}
        />

        <View style={styles.content}>
          {/* Title block */}
          <View style={styles.titleRow}>
            <Text variant="label" color="textTertiary">
              {product.brand.toUpperCase()}
            </Text>
            <Rating rating={product.rating} count={product.ratingCount} />
          </View>
          <Text variant="h1" style={styles.name}>
            {product.name}
          </Text>
          {product.tagline && (
            <Text variant="body" color="textSecondary" style={styles.tagline}>
              {product.tagline}
            </Text>
          )}
          {badge && (
            <View style={styles.badges}>
              <Badge label={badge} tone="gold" />
              <Badge label="No Cost EMI" tone="success" icon="checkmark-circle" />
            </View>
          )}

          <View style={styles.priceBlock}>
            {/* Scale MRP proportionally so the discount % stays consistent with
                the card across variant changes. */}
            <PriceTag
              price={price}
              mrp={Math.round(product.mrp * (price / product.basePrice))}
              size="lg"
            />
            <View style={styles.emiHint}>
              <Ionicons name="pricetag" size={13} color={palette.primary} />
              <Text variant="label" color="primary" style={styles.emiHintText}>
                No Cost EMI from {formatCurrency(lowestMonthlyEmi(price, tenures))}/mo
              </Text>
            </View>
          </View>

          {/* Variants */}
          {product.variants.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <VariantSelector groups={product.variants} selections={selections} onSelect={setVariant} />
            </>
          )}

          {/* Highlights */}
          <Divider style={styles.divider} />
          <Text variant="h3" style={styles.sectionTitle}>
            Highlights
          </Text>
          <View style={styles.highlights}>
            {product.highlights.map((h) => (
              <View key={h} style={styles.highlightRow}>
                <Ionicons name="checkmark-circle" size={17} color={palette.success} />
                <Text variant="body" color="textSecondary" style={styles.highlightText}>
                  {h}
                </Text>
              </View>
            ))}
          </View>

          {/* EMI plans */}
          <Divider style={styles.divider} />
          <Text variant="h3" style={styles.sectionTitle}>
            Choose your EMI plan
          </Text>
          <Text variant="bodySm" color="textSecondary" style={styles.sectionSub}>
            0% interest · Backed by your mutual funds
          </Text>
          <EmiPlanSelector
            plans={plans}
            selectedTenure={selectedTenure}
            onSelect={selectTenure}
          />

          {/* Why 1Fi */}
          <View style={styles.trustCard}>
            {TRUST_POINTS.map((p) => (
              <View key={p.text} style={styles.trustRow}>
                <Ionicons name={p.icon as keyof typeof Ionicons.glyphMap} size={18} color={palette.primary} />
                <Text variant="bodySm" color="text" style={styles.trustText}>
                  {p.text}
                </Text>
              </View>
            ))}
          </View>

          {/* Specs */}
          <Divider style={styles.divider} />
          <Text variant="h3" style={styles.sectionTitle}>
            Specifications
          </Text>
          <SpecsList specs={product.specs} />
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.cta, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <View style={styles.ctaInfo}>
          {selectedPlan ? (
            <>
              <Text variant="price">{formatCurrency(selectedPlan.monthlyAmount)}/mo</Text>
              <Text variant="caption" color="textSecondary">
                {selectedPlan.tenureMonths} months · No Cost EMI
              </Text>
            </>
          ) : (
            <Text variant="bodySm" color="textSecondary">
              Select an EMI plan
            </Text>
          )}
        </View>
        <Button
          title={canProceed ? 'Proceed' : 'Limit exceeded'}
          onPress={onProceed}
          disabled={!canProceed}
          rightIcon="arrow-forward"
          style={styles.ctaButton}
        />
      </View>
    </View>
  );
}

// ─────────────────────────── Loading skeleton ───────────────────────────
function DetailSkeleton({ topInset }: { topInset: number }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Skeleton height={300 + topInset} radius={0} />
      <View style={styles.content}>
        <Skeleton width={80} height={11} />
        <Skeleton width="70%" height={26} style={{ marginTop: spacing.md }} />
        <Skeleton width="90%" height={14} style={{ marginTop: spacing.sm }} />
        <Skeleton width={160} height={28} style={{ marginTop: spacing.xl }} />
        <Skeleton width="100%" height={64} radius={radii.lg} style={{ marginTop: spacing.xxl }} />
        <Skeleton width="100%" height={64} radius={radii.lg} style={{ marginTop: spacing.md }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.surface },
  floatHeader: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  floatRight: { flexDirection: 'row', gap: spacing.sm },
  floatBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  hero: { height: 340 },
  content: { padding: spacing.xl },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { marginTop: spacing.xs },
  tagline: { marginTop: spacing.xs },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  priceBlock: { marginTop: spacing.lg },
  emiHint: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  emiHintText: { marginLeft: 5 },
  divider: { marginVertical: spacing.xl },
  sectionTitle: { marginBottom: spacing.md },
  sectionSub: { marginTop: -spacing.sm, marginBottom: spacing.lg },
  highlights: { gap: spacing.md },
  highlightRow: { flexDirection: 'row', alignItems: 'flex-start' },
  highlightText: { flex: 1, marginLeft: spacing.sm },
  trustCard: {
    marginTop: spacing.xl,
    backgroundColor: palette.primaryTint,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  trustRow: { flexDirection: 'row', alignItems: 'center' },
  trustText: { flex: 1, marginLeft: spacing.sm },
  errorWrap: { flex: 1, justifyContent: 'center' },
  cta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    ...shadows.lg,
  },
  ctaInfo: { flex: 1 },
  ctaButton: { minWidth: 170 },
});
