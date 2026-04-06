/**
 * Returns `true` if the keyboard is currently visible.
 */
export declare function isKeyboardOpen(): boolean;
/**
 * Dismisses the keyboard only if it is currently open.
 * Avoids the flash-open-then-close glitch on some devices.
 */
export declare function closeKeyboard(): void;
/**
 * Hook that provides keyboard state and a safe dismiss function.
 *
 * ```tsx
 * const { isOpen, close } = useKeyboard();
 * ```
 */
export declare function useKeyboard(): {
    /** Whether the keyboard is currently visible (ref-based, no re-render). */
    readonly isOpen: boolean;
    /** Dismiss the keyboard only if it is currently open. */
    close: typeof closeKeyboard;
};
//# sourceMappingURL=useKeyboard.d.ts.map