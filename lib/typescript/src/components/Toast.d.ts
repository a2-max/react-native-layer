import { type PropsWithChildren } from 'react';
import type { ToastContextValue } from '../types/toast';
/**
 * Hook to show toast messages from anywhere in the app.
 * Must be used inside a `<ToastProvider>`.
 */
export declare const useToast: () => ToastContextValue;
/**
 * Wrap your app with `<ToastProvider>` to enable toasts.
 * Toasts render above everything — including modals.
 */
export declare const ToastProvider: ({ children }: PropsWithChildren) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Toast.d.ts.map