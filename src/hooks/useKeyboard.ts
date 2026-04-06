import { useEffect, useRef } from 'react';
import { Keyboard } from 'react-native';

let keyboardOpen = false;

Keyboard.addListener('keyboardDidShow', () => {
  keyboardOpen = true;
});
Keyboard.addListener('keyboardDidHide', () => {
  keyboardOpen = false;
});

/**
 * Returns `true` if the keyboard is currently visible.
 */
export function isKeyboardOpen(): boolean {
  return keyboardOpen;
}

/**
 * Dismisses the keyboard only if it is currently open.
 * Avoids the flash-open-then-close glitch on some devices.
 */
export function closeKeyboard(): void {
  if (keyboardOpen) {
    Keyboard.dismiss();
  }
}

/**
 * Hook that provides keyboard state and a safe dismiss function.
 *
 * ```tsx
 * const { isOpen, close } = useKeyboard();
 * ```
 */
export function useKeyboard() {
  const isOpen = useRef(keyboardOpen);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      isOpen.current = true;
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      isOpen.current = false;
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return {
    /** Whether the keyboard is currently visible (ref-based, no re-render). */
    get isOpen() {
      return isOpen.current;
    },
    /** Dismiss the keyboard only if it is currently open. */
    close: closeKeyboard,
  };
}
