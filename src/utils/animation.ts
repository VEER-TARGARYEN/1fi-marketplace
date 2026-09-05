import { Platform } from 'react-native';

/**
 * The native animated driver isn't available on web (RCTAnimation is absent),
 * so we opt into it only on native. Using it unconditionally logs a warning and
 * falls back to JS anyway.
 */
export const USE_NATIVE_DRIVER = Platform.OS !== 'web';
