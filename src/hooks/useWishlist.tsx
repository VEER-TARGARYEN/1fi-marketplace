import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const STORAGE_KEY = '@1fi/wishlist';

interface WishlistContextValue {
  ids: string[];
  isWishlisted: (id: string) => boolean;
  toggle: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

/**
 * Wishlist state, persisted to AsyncStorage so favourites survive app restarts.
 * Kept in a provider so the heart icon and any future "Saved" screen share one
 * source of truth.
 */
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  // If the user toggles before async hydration resolves, we must not let the
  // slower hydrate clobber their change (last-writer-wins data loss).
  const dirtyRef = useRef(false);

  // Hydrate once on mount.
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active || dirtyRef.current || !raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setIds(parsed.filter((x): x is string => typeof x === 'string'));
        }
      })
      .catch(() => {
        /* ignore missing/corrupt storage */
      });
    return () => {
      active = false;
    };
  }, []);

  // Functional update so concurrent toggles compose, and one write per change.
  const toggle = useCallback((id: string) => {
    dirtyRef.current = true;
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      isWishlisted: (id: string) => ids.includes(id),
      toggle,
    }),
    [ids, toggle],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
}
