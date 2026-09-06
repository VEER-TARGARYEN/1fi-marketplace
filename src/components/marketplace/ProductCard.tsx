import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { PressableScale } from '@/components/common/PressableScale';
import { Rating } from '@/components/common/Rating';
import { Text } from '@/components/common/Text';
import { useWishlist } from '@/hooks/useWishlist';
import { hitSlop, palette, radii, spacing } from '@/theme';
import { Product } from '@/types';
import { lowestMonthlyEmi } from '@/utils/emi';
import { discountPercent, formatCurrency } from '@/utils/format';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  style?: ViewStyle;
}

/** Highlight the most eye-catching badge on a product. */
function primaryBadge(product: Product): { label: string; tone: 'gold' | 'primary' } | null {
  const badge = product.badges?.find((b) => b !== 'No Cost EMI');
  if (!badge) return null;
  const tone = badge === 'New' ? 'primary' : 'gold';
  return { label: badge, tone };
}

function ProductCardBase({ product, onPress, style }: ProductCardProps) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const monthly = lowestMonthlyEmi(product.basePrice);
  const off = discountPercent(product.mrp, product.basePrice);
  const badge = primaryBadge(product);
  // Some product names already lead with the brand ("Sony WH-1000XM6") — avoid
  // "Sony Sony …" in the accessibility label.
  const fullName = product.name.toLowerCase().startsWith(product.brand.toLowerCase())
    ? product.name
    : `${product.brand} ${product.name}`;

  // The wishlist button is a SIBLING overlay (not nested inside the card's
  // Pressable) so we never render an invalid button-inside-button on web.
  return (
    <View style={[styles.wrap, style]}>
      <PressableScale
        onPress={() => onPress(product)}
        accessibilityRole="button"
        accessibilityLabel={`${fullName}, from ${formatCurrency(monthly)} per month`}
      >
        <Card padded={false} shadow="sm" style={styles.card}>
          <View style={styles.imageWrap}>
            <ProductImage
              accentColor={product.accentColor}
              deviceType={product.deviceType}
              images={product.images}
              idKey={`card-${product.id}`}
              style={styles.image}
            />
            {badge && (
              <View style={styles.badgeWrap}>
                <Badge label={badge.label} tone={badge.tone} />
              </View>
            )}
            {off > 0 && (
              <View style={styles.offTag}>
                <Text variant="caption" color="white">
                  {off}% OFF
                </Text>
              </View>
            )}
          </View>

          <View style={styles.body}>
            <Text variant="caption" color="textTertiary" style={styles.brand}>
              {product.brand.toUpperCase()}
            </Text>
            <Text variant="title" numberOfLines={2} style={styles.name}>
              {product.name}
            </Text>
            <Rating rating={product.rating} count={product.ratingCount} compact />

            <View style={styles.priceRow}>
              <Text variant="price" style={styles.price}>
                {formatCurrency(product.basePrice)}
              </Text>
              {product.mrp > product.basePrice && (
                <Text variant="bodySm" color="textTertiary" style={styles.mrp}>
                  {formatCurrency(product.mrp)}
                </Text>
              )}
            </View>

            <View style={styles.emiPill}>
              <Ionicons name="pricetag" size={11} color={palette.primary} />
              <Text variant="caption" color="primary" style={styles.emiText}>
                No Cost EMI from {formatCurrency(monthly)}/mo
              </Text>
            </View>
          </View>
        </Card>
      </PressableScale>

      <Pressable
        onPress={() => toggle(product.id)}
        hitSlop={hitSlop}
        style={styles.heart}
        accessibilityRole="button"
        accessibilityLabel={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Ionicons
          name={wishlisted ? 'heart' : 'heart-outline'}
          size={18}
          color={wishlisted ? palette.danger : palette.textSecondary}
        />
      </Pressable>
    </View>
  );
}

export const ProductCard = React.memo(ProductCardBase);

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  card: { overflow: 'hidden' },
  imageWrap: { position: 'relative' },
  image: { height: 132, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl },
  badgeWrap: { position: 'absolute', top: spacing.sm, left: spacing.sm },
  heart: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offTag: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: palette.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  body: { padding: spacing.md },
  brand: { marginBottom: 2 },
  name: { marginBottom: spacing.xs, minHeight: 44 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  price: { fontSize: 17 },
  mrp: { marginLeft: spacing.xs, textDecorationLine: 'line-through' },
  emiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    backgroundColor: palette.primaryTint,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  emiText: { marginLeft: 4 },
});
