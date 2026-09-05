import { SegmentTab } from '@/components/shop';

export type ShopTabKey = 'topBrands' | 'nearby' | 'marketplace';

/** The three Shop options. Marketplace is the fully-built assignment feature. */
export const SHOP_TABS: SegmentTab<ShopTabKey>[] = [
  { key: 'topBrands', label: 'Top Brands' },
  { key: 'nearby', label: 'Nearby Stores' },
  { key: 'marketplace', label: '1Fi Marketplace' },
];
