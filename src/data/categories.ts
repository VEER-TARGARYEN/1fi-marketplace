import { Category } from '../types';

/**
 * Marketplace categories. `all` is a virtual category used by the filter chips.
 * Icons are Ionicons names (rendered by the CategoryChips component).
 */
export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', icon: 'grid-outline' },
  { id: 'smartphones', label: 'Smartphones', icon: 'phone-portrait-outline' },
  { id: 'laptops', label: 'Laptops', icon: 'laptop-outline' },
  { id: 'audio', label: 'Audio', icon: 'headset-outline' },
  { id: 'wearables', label: 'Wearables', icon: 'watch-outline' },
  { id: 'tablets', label: 'Tablets', icon: 'tablet-portrait-outline' },
  { id: 'tvs', label: 'TVs', icon: 'tv-outline' },
  { id: 'gaming', label: 'Gaming', icon: 'game-controller-outline' },
  { id: 'cameras', label: 'Cameras', icon: 'camera-outline' },
];
