import { ProductQuery } from '../types';

/**
 * Centralised query keys so caches stay consistent and invalidation is typo-proof.
 */
export const queryKeys = {
  categories: ['categories'] as const,
  userLimit: ['userLimit'] as const,
  featured: ['products', 'featured'] as const,
  products: (query: ProductQuery) => ['products', 'list', query] as const,
  product: (id: string) => ['products', 'detail', id] as const,
};
