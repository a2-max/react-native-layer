import type { ReactNode } from 'react';
import type { ViewStyle, StyleProp } from 'react-native';
import type { LayerProps } from './layer';

/** Drag direction reported by `onDrag`. */
export type DragDirection = 'up' | 'down';

/** Props for the BottomSheet component. */
export interface BottomSheetProps extends Omit<LayerProps, 'children'> {
  children: ReactNode;

  /** If true, the sheet can be dragged. @default true */
  draggable?: boolean;

  /** If true, the sheet can be dragged upward to full-screen. @default false */
  enableUpwardDrag?: boolean;

  /** If true, the drag handle bar is shown. @default true */
  showHandle?: boolean;

  /**
   * Top inset in px — the sheet will NOT cover this area when expanded
   * to full height. Pass your status-bar / notch height here.
   * @default auto-detected via react-native-safe-area-context (falls back to 0)
   */
  topInset?: number;

  /**
   * Bottom inset in px — extra padding added at the bottom of the sheet
   * for home-indicator / nav-bar safe area.
   * @default auto-detected via react-native-safe-area-context (falls back to 0)
   */
  bottomInset?: number;

  /**
   * Distance (px) the user must drag down before the sheet dismisses.
   * @default Layout.dismissThreshold (120)
   */
  dismissThreshold?: number;

  // ── Lifecycle events ────────────────────────────────────

  /** Called continuously while the user drags the sheet. */
  onDrag?: (direction: DragDirection, heightFraction: number) => void;

  /** Called when the drag gesture ends (sheet settled or dismissed). */
  onDragEnd?: (settled: 'content' | 'fullscreen' | 'dismissed') => void;

  /** Called when the sheet reaches full-screen height. */
  onFullScreen?: () => void;

  // ── Color-only convenience props ────────────────────────

  /** Background color of the sheet. @default Colors.white */
  backgroundColor?: string;

  /** Color of the drag handle bar. @default Colors.gray300 */
  handleColor?: string;

  // ── Full style overrides ────────────────────────────────
  /** Style applied to the sheet parent container. */
  styleWrapper?: StyleProp<ViewStyle>;

  /** Style applied to the sheet container. */
  style?: StyleProp<ViewStyle>;

  /** Style applied to the handle bar. */
  handleStyle?: StyleProp<ViewStyle>;

  /** Style applied to the handle bar's wrapper. */
  handleContainerStyle?: StyleProp<ViewStyle>;

  /** Style applied to the children wrapper inside the sheet. */
  contentContainerStyle?: StyleProp<ViewStyle>;
}
