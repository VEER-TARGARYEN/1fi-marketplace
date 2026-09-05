import { onlineManager, QueryClient } from '@tanstack/react-query';

// React Query's React Native online manager assumes offline until a NetInfo
// subscription reports otherwise, which would leave queries (and their retries)
// paused forever. We talk to an in-process mock (and, in production, our own
// endpoints), so install a listener that reports online. In a real app this is
// where @react-native-community/netinfo would drive connectivity.
onlineManager.setEventListener((setOnline) => {
  setOnline(true);
  return () => {};
});

/**
 * App-wide React Query client. Sensible defaults for a mobile marketplace:
 * cache results for a minute, keep a failed request surfaced (so the UI can
 * show its error state with a manual retry), and don't refetch aggressively on
 * every focus (native apps re-focus constantly).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 0,
      refetchOnWindowFocus: false,
      // Our data comes from an in-process mock (and, in production, endpoints we
      // control) — never pause fetches based on the online/offline signal, which
      // is unreliable inside embedded webviews / RN without NetInfo.
      networkMode: 'always',
    },
    mutations: {
      retry: 0,
      networkMode: 'always',
    },
  },
});
