import { useSafeAreaInsets } from 'react-native-safe-area-context';

export { SafeAreaProvider as SafeAreaInsetsProvider } from 'react-native-safe-area-context';

interface Insets {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

/**
 * Returns real device safe-area insets.
 * Must be rendered inside a `<SafeAreaProvider>`.
 */
export function useInsets(): Insets {
    return useSafeAreaInsets();
}

export type { Insets };
