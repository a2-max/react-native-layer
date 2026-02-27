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
import {
    Animated,
    Keyboard,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../core/constants';
import { toastStyles as styles } from '../core/styles';
import type { ToastConfig, ToastContextValue } from '../types/toast';

const TOAST_MAX_LINES = 2;
const DEFAULT_DURATION = 3000;
const ANIM_DURATION = 250;

const ToastContext = createContext<ToastContextValue>({
    showToast: () => { },
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
    const opacity = useRef(new Animated.Value(0)).current;
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const hide = useCallback(() => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: ANIM_DURATION,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) setToast(null);
        });
    }, [opacity]);

    const showToast = useCallback(
        (config: ToastConfig) => {
            Keyboard.dismiss();

            // Clear any existing timer
            if (timerRef.current) clearTimeout(timerRef.current);

            // If a toast is already visible, hide it first then show the new one
            if (toast) {
                opacity.setValue(0);
            }

            setToast(config);

            Animated.timing(opacity, {
                toValue: 1,
                duration: ANIM_DURATION,
                useNativeDriver: true,
            }).start();

            timerRef.current = setTimeout(() => {
                hide();
            }, config.duration ?? DEFAULT_DURATION);
        },
        [toast, opacity, hide],
    );

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const contextValue = useMemo(() => ({ showToast }), [showToast]);

    const position = toast?.position ?? 'bottom';
    const bg = toast?.backgroundColor ?? Colors.gray900;
    const textColor = toast?.textColor ?? Colors.white;

    // ── Position calculation ────────────────────────────────
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

            {toast ? (
                <View
                    style={[styles.container, positionStyle]}
                    pointerEvents="none"
                >
                    <Animated.View
                        style={[styles.pill, { backgroundColor: bg, opacity }]}
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
