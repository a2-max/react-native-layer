import type { ViewStyle, TextStyle, StyleProp } from 'react-native';

/** Props for the ConfirmModal component. */
export interface ConfirmModalProps {
    /** Whether the modal is visible. */
    visible: boolean;

    /** Title text displayed at the top. */
    title: string;

    /** Optional message body. Ignored when `showInput` is true. */
    message?: string;

    /** Show a text input for guarded confirmation. @default false */
    showInput?: boolean;

    /** Label shown above the text input. */
    inputLabel?: string;

    /** Placeholder text for the input. */
    inputPlaceholder?: string;

    /** The exact string the user must type to enable confirm. */
    validationText?: string;

    /** Text for the confirm button. @default "Confirm" */
    positiveText?: string;

    /** Text for the cancel button. @default "Cancel" */
    negativeText?: string;

    /** Called when the user presses confirm. Receives the input value when `showInput` is true. */
    onConfirm: (value?: string) => void;

    /** Called when the user cancels (button press, backdrop tap, or back button). */
    onCancel: () => void;

    /** Called after the open animation finishes. */
    onOpen?: () => void;

    /** If true, tapping the backdrop will NOT call `onCancel`. @default false */
    disableBackdropClose?: boolean;

    /** Animation duration in ms. @default Animation.durationFast (200) */
    animationDuration?: number;

    // ── Color-only convenience props ────────────────────────

    /** Backdrop overlay color. @default Colors.backdropDark */
    backdropColor?: string;

    /** Card background color. @default Colors.white */
    cardBackgroundColor?: string;

    /** Title text color. @default Colors.gray900 */
    titleColor?: string;

    /** Message text color. @default Colors.gray500 */
    messageColor?: string;

    /** Confirm button background color. @default Colors.gray900 */
    positiveButtonColor?: string;

    /** Confirm button text color. @default Colors.white */
    positiveTextColor?: string;

    /** Cancel button background color. @default Colors.gray100 */
    negativeButtonColor?: string;

    /** Cancel button text color. @default Colors.gray700 */
    negativeTextColor?: string;

    // ── Full style overrides ────────────────────────────────

    /** Style overrides for the backdrop. */
    backdropStyle?: StyleProp<ViewStyle>;

    /** Style overrides for the card container. */
    cardStyle?: StyleProp<ViewStyle>;

    /** Style overrides for the title text. */
    titleStyle?: StyleProp<TextStyle>;

    /** Style overrides for the message text. */
    messageStyle?: StyleProp<TextStyle>;

    /** Style overrides for the input label text. */
    labelStyle?: StyleProp<TextStyle>;

    /** Style overrides for the text input. */
    inputStyle?: StyleProp<ViewStyle>;

    /** Style overrides for the buttons row container. */
    buttonsContainerStyle?: StyleProp<ViewStyle>;

    /** Style overrides for the confirm button text. */
    positiveStyle?: StyleProp<TextStyle>;

    /** Style overrides for the cancel button text. */
    negativeStyle?: StyleProp<TextStyle>;

    /** Style overrides for the confirm button wrapper. */
    positiveButtonStyle?: StyleProp<ViewStyle>;

    /** Style overrides for the cancel button wrapper. */
    negativeButtonStyle?: StyleProp<ViewStyle>;
}
