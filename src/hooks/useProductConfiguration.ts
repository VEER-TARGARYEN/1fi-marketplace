import { useCallback, useEffect, useMemo, useState } from 'react';
import { palette } from '@/theme';
import { Product } from '@/types';

/**
 * Manages the user's variant choices for a product and derives the values that
 * depend on them: the effective price, the accent color (from the selected
 * colour) and a human-readable variant summary. Keeps ProductDetail declarative.
 */
export function useProductConfiguration(product?: Product) {
  const [selections, setSelections] = useState<Record<string, string>>({});

  // Initialise each group to its base (zero-delta) value so the default price
  // matches the product's advertised base price.
  useEffect(() => {
    if (!product) return;
    const initial: Record<string, string> = {};
    for (const group of product.variants) {
      const base = group.values.find((v) => (v.priceDelta ?? 0) === 0) ?? group.values[0];
      if (base) initial[group.id] = base.id;
    }
    setSelections(initial);
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const setVariant = useCallback((groupId: string, valueId: string) => {
    setSelections((prev) => ({ ...prev, [groupId]: valueId }));
  }, []);

  const price = useMemo(() => {
    if (!product) return 0;
    return product.variants.reduce((sum, group) => {
      const value = group.values.find((v) => v.id === selections[group.id]);
      return sum + (value?.priceDelta ?? 0);
    }, product.basePrice);
  }, [product, selections]);

  const accentColor = useMemo(() => {
    if (!product) return palette.primary;
    const colorGroup = product.variants.find((g) => g.type === 'swatch');
    const selected = colorGroup?.values.find((v) => v.id === selections[colorGroup.id]);
    return selected?.swatch ?? product.accentColor;
  }, [product, selections]);

  const variantSummary = useMemo(() => {
    if (!product) return '';
    return product.variants
      .map((group) => group.values.find((v) => v.id === selections[group.id])?.label)
      .filter(Boolean)
      .join(' · ');
  }, [product, selections]);

  return { selections, setVariant, price, accentColor, variantSummary };
}
