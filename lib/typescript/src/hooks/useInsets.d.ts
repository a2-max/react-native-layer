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
export declare function useInsets(): Insets;
export type { Insets };
//# sourceMappingURL=useInsets.d.ts.map