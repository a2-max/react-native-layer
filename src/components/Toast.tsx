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
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
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

interface OutletContextValue {
  toast: ToastConfig | null;
  opacity: SharedValue<number>;
  activeOutlet: number;
  register: (id: number) => () => void;
}

const OutletContext = createContext<OutletContextValue | null>(null);

let nextOutletId = 1;

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
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const [outlets, setOutlets] = useState<number[]>([]);
  const opacity = useSharedValue(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hide = useCallback(() => {
    opacity.value = withTiming(0, { duration: ANIM_DURATION }, (finished) => {
      if (finished) {
        scheduleOnRN(setToast, null);
      }
    });
  }, [opacity]);

  const showToast = useCallback(
    (config: ToastConfig) => {
      closeKeyboard();
      if (timerRef.current) clearTimeout(timerRef.current);

      if (Platform.OS === 'android' && config.native) {
        opacity.value = 0;
        setToast(null);

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

      opacity.value = 0;
      setToast(config);

      opacity.value = withTiming(1, { duration: ANIM_DURATION });

      timerRef.current = setTimeout(() => {
        hide();
      }, config.duration ?? DEFAULT_DURATION);
    },
    [hide, opacity]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const register = useCallback((id: number) => {
    setOutlets((list) => [...list, id]);
    return () => setOutlets((list) => list.filter((item) => item !== id));
  }, []);

  const activeOutlet = outlets[outlets.length - 1] ?? 0;

  const contextValue = useMemo(() => ({ showToast }), [showToast]);
  const outletValue = useMemo(
    () => ({ toast, opacity, activeOutlet, register }),
    [toast, opacity, activeOutlet, register]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      <OutletContext.Provider value={outletValue}>
        {children}
        {activeOutlet === 0 && toast ? (
          <ToastView toast={toast} opacity={opacity} />
        ) : null}
      </OutletContext.Provider>
    </ToastContext.Provider>
  );
};

/** Renders the toast inside a modal layer while that layer is open and on top. */
export const ToastOutlet = ({ active }: { active: boolean }) => {
  const outlet = useContext(OutletContext);
  const [id] = useState(() => nextOutletId++);
  const register = outlet?.register;

  useEffect(() => {
    if (active) return register?.(id);
    return undefined;
  }, [active, register, id]);

  if (!outlet?.toast || outlet.activeOutlet !== id) return null;

  return <ToastView toast={outlet.toast} opacity={outlet.opacity} />;
};

const ToastView = ({
  toast,
  opacity,
}: {
  toast: ToastConfig;
  opacity: SharedValue<number>;
}) => {
  const insets = useSafeAreaInsets();
  const position = toast.position ?? 'bottom';
  const bg = toast.backgroundColor ?? Colors.gray900;
  const textColor = toast.textColor ?? Colors.white;

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
  );
};
