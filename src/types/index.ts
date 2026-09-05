/**
 * Domain model for the 1Fi Marketplace.
 *
 * These types are the single contract shared by the mock API, the data hooks
 * and the UI. Components import from here — never from raw JSON — so the data
 * source can be swapped for a real backend without touching the UI.
 */

export type CategoryId =
  | 'smartphones'
  | 'laptops'
  | 'audio'
  | 'wearables'
  | 'tablets'
  | 'tvs'
  | 'gaming'
  | 'cameras';

/** Shape used by the branded fallback product graphic (see DeviceGraphic). */
export type DeviceGraphicType =
  | 'phone'
  | 'laptop'
  | 'earbuds'
  | 'headphones'
  | 'watch'
  | 'tablet'
  | 'tv'
  | 'console'
  | 'camera';

export interface Category {
  id: CategoryId | 'all';
  label: string;
  /** Ionicons/MaterialCommunityIcons name for the category chip. */
  icon: string;
}

export interface VariantOption {
  id: string;
  label: string;
  /** For color options: hex swatch. */
  swatch?: string;
  /** Added to (or subtracted from) the product base price. */
  priceDelta?: number;
  /** Optional image override (e.g. per colour). */
  image?: string | null;
  inStock?: boolean;
}

export interface VariantGroup {
  id: string; // "storage" | "color" | "ram" | "size"
  name: string; // "Storage"
  type: 'chip' | 'swatch';
  values: VariantOption[];
}

export interface ProductSpec {
  label: string;
  value: string;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  tagline?: string;
  rating: number; // 0..5
  ratingCount: number;
  basePrice: number; // selling price of the default variant, in INR
  mrp: number; // struck-through reference price
  accentColor: string; // drives the branded product graphic
  deviceType: DeviceGraphicType;
  images?: string[]; // optional remote images; graphic used when empty
  badges?: string[];
  highlights: string[];
  specs: ProductSpec[];
  variants: VariantGroup[];
  featured?: boolean;
  /** Allowed EMI tenures for this product; defaults to the global set. */
  emiTenures?: number[];
}

export interface EmiPlan {
  tenureMonths: number;
  monthlyAmount: number;
  totalPayable: number; // equals price — no-cost EMI
  interestRate: 0;
  noCost: true;
  recommended?: boolean;
  /** Fraction (0..1) of the user's available limit this plan blocks. */
  limitUsage: number;
  /** Whether the user's available 1Fi limit covers this purchase. */
  withinLimit: boolean;
}

export interface UserLimit {
  totalLimit: number;
  availableLimit: number;
  usedLimit: number;
  pledgedValue: number; // market value of pledged mutual funds
  ltv: number; // loan-to-value ratio applied
  currency: 'INR';
}

export interface ProductQuery {
  category?: CategoryId | 'all';
  search?: string;
  sort?: SortKey;
}

export type SortKey =
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'emi_asc';

export interface OrderRequest {
  productId: string;
  productName: string;
  variantSelections: Record<string, string>;
  variantSummary: string;
  tenureMonths: number;
  unitPrice: number;
  monthlyAmount: number;
}

export interface Order {
  id: string;
  status: 'confirmed';
  productName: string;
  variantSummary: string;
  unitPrice: number;
  tenureMonths: number;
  monthlyAmount: number;
  firstEmiDate: string; // human-readable
  lienAmount: number; // MF value lien-marked
}
