import { Dimensions } from 'react-native';

// ─── Screen ──────────────────────────────────────────────────────────────────

export const SCREEN_HEIGHT = Dimensions.get('window').height;

// ─── Colors ──────────────────────────────────────────────────────────────────

export const Colors = {
  /** Pure black — used for backdrop overlay. */
  black: '#000',
  /** Pure white — sheet bg, card bg, positive button text. */
  white: '#fff',

  /** Near-black text / primary button bg. */
  gray900: '#111827',
  /** Secondary text / button text. */
  gray700: '#374151',
  /** Muted text — messages, labels. */
  gray500: '#6B7280',
  /** Placeholder text. */
  gray400: '#9CA3AF',
  /** Borders, handle bar. */
  gray300: '#D1D5DB',
  /** Subtle backgrounds — cancel button. */
  gray100: '#F3F4F6',

  /** Semi-transparent backdrop for confirm modal. */
  backdropDark: 'rgba(0,0,0,0.4)',

  /** Success green for toasts. */
  green600: '#16A34A',
  /** Error red for toasts. */
  red600: '#DC2626',
  /** Warning amber for toasts. */
  amber600: '#D97706',
  /** Info blue for toasts. */
  blue600: '#2563EB',
} as const;

// ─── Animation ───────────────────────────────────────────────────────────────

export const Animation = {
  /** Default slide-in / slide-out duration (ms). */
  durationDefault: 250,
  /** Fast dismiss / confirm modal duration (ms). */
  durationFast: 200,
  /** Default backdrop max opacity. */
  backdropOpacity: 0.5,
  /** Spring bounciness for snap animations. */
  bounciness: 4,
  /** Scale value for modal enter animation start. */
  scaleInitial: 0.9,
} as const;

// ─── Layout ──────────────────────────────────────────────────────────────────

export const Layout = {
  /** Distance (px) user must drag down to dismiss sheet. */
  dismissThreshold: 120,
  /** Pan responder movement threshold before gesture activates. */
  panThreshold: 4,
  /** Default border radius for sheets / cards. */
  radiusLarge: 20,
  /** Border radius for cards. */
  radiusMedium: 16,
  /** Border radius for buttons. */
  radiusButton: 10,
  /** Border radius for inputs. */
  radiusInput: 8,
  /** Border radius for handle bar. */
  radiusHandle: 2.5,
  /** Default horizontal content padding. */
  paddingHorizontal: 16,
  /** Card padding. */
  paddingCard: 20,
  /** Handle bar width. */
  handleWidth: 36,
  /** Handle bar height. */
  handleHeight: 5,
  /** Handle container vertical padding. */
  handlePaddingVertical: 10,
  /** Card max width. */
  cardMaxWidth: 340,
  /** Card width percentage. */
  cardWidthPercent: '85%' as const,

  /** Toast border radius. */
  radiusToast: 24,
  /** Toast horizontal margin from screen edge. */
  toastMarginHorizontal: 24,
  /** Toast vertical padding. */
  toastPaddingVertical: 12,
  /** Toast horizontal padding. */
  toastPaddingHorizontal: 18,
  /** Toast max width. */
  toastMaxWidth: 360,
  /** Alert card max width. */
  alertMaxWidth: 320,
  /** Alert card width percentage. */
  alertWidthPercent: '85%' as const,
} as const;

// ─── Opacity ─────────────────────────────────────────────────────────────────

export const Opacity = {
  /** Opacity when a button is pressed. */
  pressed: 0.7,
  /** Opacity when a button is disabled. */
  disabled: 0.35,
} as const;

// ─── Font ────────────────────────────────────────────────────────────────────

export const Font = {
  sizeTitle: 18,
  sizeBody: 15,
  sizeMessage: 14,
  sizeLabel: 13,
  weightSemiBold: '600' as const,
  weightMedium: '500' as const,
  sizeToast: 14,
} as const;
