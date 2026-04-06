"use strict";

import { useSafeAreaInsets } from 'react-native-safe-area-context';
export { SafeAreaProvider as SafeAreaInsetsProvider } from 'react-native-safe-area-context';
/**
 * Returns real device safe-area insets.
 * Must be rendered inside a `<SafeAreaProvider>`.
 */
export function useInsets() {
  return useSafeAreaInsets();
}
//# sourceMappingURL=useInsets.js.map