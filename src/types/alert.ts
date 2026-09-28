/** Position of the Alert component. */
export type AlertPosition = 'center' | 'bottom';

/** Semantic type that determines the icon and default accent colors. */
export type AlertType = 'success' | 'error' | 'warning' | 'question';

/** Props for the Alert component. */
export interface AlertProps {
  /** Whether the alert is visible. */
  visible: boolean;

  /** Title text displayed at the top. */
  title: string;

  /** Optional message body. */
  message?: string;

  /** Text for the primary button. @default "OK" */
  buttonText?: string;

  /** Called when the user presses the button or dismisses. */
  onClose: () => void;

  /** Called after the open animation finishes. */
  onOpen?: () => void;

  /** Position of the alert. @default "center" */
  position?: AlertPosition;

  /** If true, tapping the backdrop won't close the alert. @default false */
  disableBackdropClose?: boolean;

  /** Semantic alert type – adds an icon and sets default accent colors. */
  type?: AlertType;

  /** Size of the type icon in px. @default 24 */
  iconSize?: number;

  /** Animation duration in ms. @default Animation.durationFast (200) */
  animationDuration?: number;

  // ── Color-only convenience props ────────────────────────

  /** Backdrop overlay color. @default Colors.backdropDark */
  backdropColor?: string;

  /** Card / sheet background color. @default Colors.white */
  backgroundColor?: string;

  /** Title text color. @default Colors.gray900 */
  titleColor?: string;

  /** Message text color. @default Colors.gray500 */
  messageColor?: string;

  /** Button background color. @default Colors.gray900 */
  buttonColor?: string;

  /** Button text color. @default Colors.white */
  buttonTextColor?: string;
}
