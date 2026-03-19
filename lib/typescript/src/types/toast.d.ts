/** Position of the Toast. */
export type ToastPosition = 'top' | 'center' | 'bottom';
/** Configuration passed to `showToast()`. */
export interface ToastConfig {
    /** The message to display. */
    message: string;
    /** Where to show the toast. @default "bottom" */
    position?: ToastPosition;
    /** How long to show the toast in ms. @default 3000 */
    duration?: number;
    /** Background color of the toast pill. @default Colors.gray900 */
    backgroundColor?: string;
    /** Text color of the toast message. @default Colors.white */
    textColor?: string;
}
/** Context value returned by `useToast()`. */
export interface ToastContextValue {
    /** Show a toast message. */
    showToast: (config: ToastConfig) => void;
}
//# sourceMappingURL=toast.d.ts.map