import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { Platform, Text, ToastAndroid, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../core/constants';
import { toastStyles as styles } from '../core/styles';
import type { ToastConfig, ToastContextValue } from '../types/toast';
import { closeKeyboard } from '../hooks/useKeyboard';

const TOAST_MAX_LINES = 2;
const DEFAULT_DURATION = 3000;
const ANIM_DURATION = 250;

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

/**
 * Hook to show toast messages from anywhere in the app.
 * Must be used inside a `<ToastProvider>`.
 */
export const useToast = (): ToastContextValue => useContext(ToastContext);

/**
 * Wrap your app with `<ToastProvider>` to enable toasts.
 * Toasts render above everything — including modals.
 */
export const ToastProvider = ({ children }: PropsWithChildren) => {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const opacity = useSharedValue(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const usesNativeAndroidToast = Platform.OS === 'android';

  const hide = useCallback(() => {
    opacity.value = withTiming(0, { duration: ANIM_DURATION }, (finished) => {
      if (finished) {
        runOnJS(setToast)(null);
      }
    });
  }, [opacity]);

  const showToast = useCallback(
    (config: ToastConfig) => {
      closeKeyboard();

      if (usesNativeAndroidToast) {
        const duration =
          (config.duration ?? DEFAULT_DURATION) >= DEFAULT_DURATION
            ? ToastAndroid.LONG
            : ToastAndroid.SHORT;
        let gravity = ToastAndroid.BOTTOM;
        if (config.position === 'top') {
          gravity = ToastAndroid.TOP;
        } else if (config.position === 'center') {
          gravity = ToastAndroid.CENTER;
        }

        ToastAndroid.showWithGravity(config.message, duration, gravity);
        return;
      }

      if (timerRef.current) clearTimeout(timerRef.current);

      opacity.value = 0;
      setToast(config);

      opacity.value = withTiming(1, { duration: ANIM_DURATION });

      timerRef.current = setTimeout(() => {
        hide();
      }, config.duration ?? DEFAULT_DURATION);
    },
    [hide, opacity, usesNativeAndroidToast]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  const position = toast?.position ?? 'bottom';
  const bg = toast?.backgroundColor ?? Colors.gray900;
  const textColor = toast?.textColor ?? Colors.white;

  const toastAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  let positionStyle: object;
  if (position === 'top') {
    positionStyle = { top: insets.top + 12 };
  } else if (position === 'center') {
    positionStyle = { top: 0, bottom: 0, justifyContent: 'center' };
  } else {
    // bottom — above safe area
    positionStyle = { bottom: insets.bottom + 32 };
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {!usesNativeAndroidToast && toast ? (
        <View style={[styles.container, positionStyle]} pointerEvents="none">
          <Animated.View
            style={[styles.pill, { backgroundColor: bg }, toastAnimatedStyle]}
          >
            <Text
              style={[styles.text, { color: textColor }]}
              numberOfLines={TOAST_MAX_LINES}
              ellipsizeMode="tail"
            >
              {toast.message}
            </Text>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
};
