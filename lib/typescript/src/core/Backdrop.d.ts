import { type StyleProp, type ViewStyle } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
interface Props {
    opacity: SharedValue<number>;
    onPress: () => void;
    color?: string;
    style?: StyleProp<ViewStyle>;
}
export declare const Backdrop: ({ opacity, onPress, color, style, }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Backdrop.d.ts.map