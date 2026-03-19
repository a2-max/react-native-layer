import { Animated, type StyleProp, type ViewStyle } from 'react-native';
interface Props {
    opacity: Animated.AnimatedInterpolation<string | number>;
    onPress: () => void;
    color?: string;
    style?: StyleProp<ViewStyle>;
}
export declare const Backdrop: ({ opacity, onPress, color, style, }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Backdrop.d.ts.map