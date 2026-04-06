import type { ReactNode } from 'react';
import type { ViewStyle, StyleProp } from 'react-native';
/** Props for the base Layer overlay component. */
export interface LayerProps {
    /** Whether the layer is visible. */
    visible: boolean;
    /** Called when the layer requests to close (backdrop press or back button). */
    onClose: () => void;
    /** Called after the open animation finishes. */
    onOpen?: () => void;
    /** If true, tapping the backdrop will NOT call `onClose`. @default false */
    disableBackdropClose?: boolean;
    /** Slide-in / slide-out duration in ms. @default Animation.durationDefault (250) */
    animationDuration?: number;
    /** Maximum opacity of the backdrop. @default Animation.backdropOpacity (0.5) */
    backdropOpacity?: number;
    /** Color of the backdrop overlay. @default Colors.black */
    backdropColor?: string;
    /** Style applied to the backdrop. */
    backdropStyle?: StyleProp<ViewStyle>;
    children: ReactNode;
}
//# sourceMappingURL=layer.d.ts.map