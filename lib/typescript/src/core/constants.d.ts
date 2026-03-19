export declare const SCREEN_HEIGHT: number;
export declare const Colors: {
    /** Pure black — used for backdrop overlay. */
    readonly black: "#000";
    /** Pure white — sheet bg, card bg, positive button text. */
    readonly white: "#fff";
    /** Near-black text / primary button bg. */
    readonly gray900: "#111827";
    /** Secondary text / button text. */
    readonly gray700: "#374151";
    /** Muted text — messages, labels. */
    readonly gray500: "#6B7280";
    /** Placeholder text. */
    readonly gray400: "#9CA3AF";
    /** Borders, handle bar. */
    readonly gray300: "#D1D5DB";
    /** Subtle backgrounds — cancel button. */
    readonly gray100: "#F3F4F6";
    /** Semi-transparent backdrop for confirm modal. */
    readonly backdropDark: "rgba(0,0,0,0.4)";
    /** Success green for toasts. */
    readonly green600: "#16A34A";
    /** Error red for toasts. */
    readonly red600: "#DC2626";
    /** Warning amber for toasts. */
    readonly amber600: "#D97706";
    /** Info blue for toasts. */
    readonly blue600: "#2563EB";
};
export declare const Animation: {
    /** Default slide-in / slide-out duration (ms). */
    readonly durationDefault: 250;
    /** Fast dismiss / confirm modal duration (ms). */
    readonly durationFast: 200;
    /** Default backdrop max opacity. */
    readonly backdropOpacity: 0.5;
    /** Spring bounciness for snap animations. */
    readonly bounciness: 4;
    /** Scale value for modal enter animation start. */
    readonly scaleInitial: 0.9;
};
export declare const Layout: {
    /** Distance (px) user must drag down to dismiss sheet. */
    readonly dismissThreshold: 120;
    /** Pan responder movement threshold before gesture activates. */
    readonly panThreshold: 4;
    /** Default border radius for sheets / cards. */
    readonly radiusLarge: 20;
    /** Border radius for cards. */
    readonly radiusMedium: 16;
    /** Border radius for buttons. */
    readonly radiusButton: 10;
    /** Border radius for inputs. */
    readonly radiusInput: 8;
    /** Border radius for handle bar. */
    readonly radiusHandle: 2.5;
    /** Default horizontal content padding. */
    readonly paddingHorizontal: 16;
    /** Card padding. */
    readonly paddingCard: 20;
    /** Handle bar width. */
    readonly handleWidth: 36;
    /** Handle bar height. */
    readonly handleHeight: 5;
    /** Handle container vertical padding. */
    readonly handlePaddingVertical: 10;
    /** Card max width. */
    readonly cardMaxWidth: 340;
    /** Card width percentage. */
    readonly cardWidthPercent: "85%";
    /** Toast border radius. */
    readonly radiusToast: 24;
    /** Toast horizontal margin from screen edge. */
    readonly toastMarginHorizontal: 24;
    /** Toast vertical padding. */
    readonly toastPaddingVertical: 12;
    /** Toast horizontal padding. */
    readonly toastPaddingHorizontal: 18;
    /** Toast max width. */
    readonly toastMaxWidth: 360;
    /** Alert card max width. */
    readonly alertMaxWidth: 320;
    /** Alert card width percentage. */
    readonly alertWidthPercent: "85%";
};
export declare const Opacity: {
    /** Opacity when a button is pressed. */
    readonly pressed: 0.7;
    /** Opacity when a button is disabled. */
    readonly disabled: 0.35;
};
export declare const Font: {
    readonly sizeTitle: 18;
    readonly sizeBody: 15;
    readonly sizeMessage: 14;
    readonly sizeLabel: 13;
    readonly weightSemiBold: "600";
    readonly weightMedium: "500";
    readonly sizeToast: 14;
};
//# sourceMappingURL=constants.d.ts.map