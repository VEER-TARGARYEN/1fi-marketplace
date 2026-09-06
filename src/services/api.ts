/**
 * Mock API for the 1Fi Marketplace.
 *
 * This is the ONLY module that touches the raw mock data. It simulates a real
 * network boundary — latency, optional failures, filtering/sorting server-side —
 * so the data hooks and UI behave exactly as they would against a real backend.
 * Swap these function bodies for `fetch()` calls and nothing else changes.
 */
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { MOCK_USER_LIMIT } from '../data/user';
import {
  Category,
  Order,
  OrderRequest,
  Product,
  ProductQuery,
  SortKey,
  UserLimit,
} from '../types';
import { DEFAULT_EMI_TENURES, firstEmiDate, lowestMonthlyEmi } from '../utils/emi';

/** Tunable network behaviour. `errorRate` can be raised at runtime to demo error states. */
export const apiConfig = {
  latency: { min: 350, max: 800 },
  errorRate: 0, // 0..1 probability a request fails (raise to preview error states)
};

function wait(): Promise<void> {
  const { min, max } = apiConfig.latency;
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function maybeFail(op: string): void {
  if (apiConfig.errorRate > 0 && Math.random() < apiConfig.errorRate) {
    throw new Error(`Could not ${op}. Please check your connection and try again.`);
  }
}

// ─────────────────────────── Categories ───────────────────────────
export async function fetchCategories(): Promise<Category[]> {
  await wait();
  maybeFail('load categories');
  return CATEGORIES;
}

// ─────────────────────────── Products ───────────────────────────
function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products];
  switch (sort) {
    case 'price_asc':
      return copy.sort((a, b) => a.basePrice - b.basePrice);
    case 'price_desc':
      return copy.sort((a, b) => b.basePrice - a.basePrice);
    case 'rating_desc':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'emi_asc':
      return copy.sort(
        (a, b) => lowestMonthlyEmi(a.basePrice) - lowestMonthlyEmi(b.basePrice),
      );
    case 'featured':
    default:
      return copy.sort(
        (a, b) => Number(!!b.featured) - Number(!!a.featured) || b.rating - a.rating,
      );
  }
}

export async function fetchProducts(query: ProductQuery = {}): Promise<Product[]> {
  await wait();
  maybeFail('load products');

  const { category = 'all', search = '', sort = 'featured' } = query;
  const term = search.trim().toLowerCase();

  let result = PRODUCTS.filter((p) => {
    const matchesCategory = category === 'all' || p.category === category;
    const matchesSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.tagline?.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  result = sortProducts(result, sort);
  return result;
}

export async function fetchProductById(id: string): Promise<Product> {
  await wait();
  maybeFail('load this product');

  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) {
    throw new Error('Product not found.');
  }
  return product;
}

// ─────────────────────────── User limit ───────────────────────────
// A mutable copy so a placed order actually moves the available headroom —
// making the mutation → invalidation → UI-update loop observable, as it would
// be against a real backend.
let userLimit: UserLimit = { ...MOCK_USER_LIMIT };

export async function fetchUserLimit(): Promise<UserLimit> {
  await wait();
  maybeFail('load your 1Fi limit');
  return { ...userLimit };
}

// ─────────────────────────── Orders ───────────────────────────
export async function placeOrder(request: OrderRequest): Promise<Order> {
  // Orders take a touch longer — mimic lien-marking + lender approval.
  await new Promise((resolve) => setTimeout(resolve, 1100));
  maybeFail('place your order');

  // Reflect the purchase against the mutual-fund-backed limit.
  userLimit = {
    ...userLimit,
    availableLimit: Math.max(0, userLimit.availableLimit - request.unitPrice),
    usedLimit: userLimit.usedLimit + request.unitPrice,
  };

  const id = `1FI${Math.floor(100000 + Math.random() * 900000)}`;
  return {
    id,
    status: 'confirmed',
    productName: request.productName,
    variantSummary: request.variantSummary,
    unitPrice: request.unitPrice,
    tenureMonths: request.tenureMonths,
    monthlyAmount: request.monthlyAmount,
    firstEmiDate: firstEmiDate(new Date()),
    lienAmount: Math.round(request.unitPrice / userLimit.ltv),
  };
}

export { DEFAULT_EMI_TENURES };
