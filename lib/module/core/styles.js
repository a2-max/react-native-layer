"use strict";

import { StyleSheet } from 'react-native';
import { Colors, Font, Layout, Opacity } from "./constants.js";

// ─── Shared / Common ─────────────────────────────────────────────────────────

export const commonStyles = StyleSheet.create({
  fill: {
    flex: 1
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  absoluteAnchorBottom: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end'
  }
});

// ─── Layer ───────────────────────────────────────────────────────────────────

export const layerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  }
});

// ─── BottomSheet ─────────────────────────────────────────────────────────────

export const bottomSheetStyles = StyleSheet.create({
  sheet: {
    overflow: 'hidden'
  },
  body: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: Layout.handlePaddingVertical
  },
  handle: {
    width: Layout.handleWidth,
    height: Layout.handleHeight,
    borderRadius: Layout.radiusHandle
  },
  content: {
    paddingHorizontal: Layout.paddingHorizontal
  }
});

// ─── ConfirmModal ────────────────────────────────────────────────────────────

export const confirmModalStyles = StyleSheet.create({
  card: {
    width: Layout.cardWidthPercent,
    maxWidth: Layout.cardMaxWidth,
    borderRadius: Layout.radiusMedium,
    padding: Layout.paddingCard,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8
  },
  title: {
    fontSize: Font.sizeTitle,
    fontWeight: Font.weightSemiBold
  },
  message: {
    fontSize: Font.sizeMessage,
    marginTop: 8,
    lineHeight: 20,
    textAlign: 'center'
  },
  label: {
    fontSize: Font.sizeLabel,
    color: Colors.gray500,
    marginTop: 12
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: Layout.radiusInput,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    fontSize: Font.sizeBody,
    color: Colors.gray900
  },
  buttons: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 10
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Layout.radiusButton,
    alignItems: 'center'
  },
  buttonPressed: {
    opacity: Opacity.pressed
  },
  buttonDisabled: {
    opacity: Opacity.disabled
  },
  cancelText: {
    fontSize: Font.sizeBody,
    fontWeight: Font.weightMedium
  },
  confirmText: {
    fontSize: Font.sizeBody,
    fontWeight: Font.weightSemiBold
  }
});

// ─── Alert ───────────────────────────────────────────────────────────────────

export const alertStyles = StyleSheet.create({
  centerCard: {
    width: Layout.alertWidthPercent,
    maxWidth: Layout.alertMaxWidth,
    borderRadius: Layout.radiusMedium,
    padding: Layout.paddingCard,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8
  },
  bottomSheet: {
    borderTopLeftRadius: Layout.radiusLarge,
    borderTopRightRadius: Layout.radiusLarge,
    padding: Layout.paddingCard,
    paddingTop: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8
  },
  title: {
    fontSize: Font.sizeTitle,
    fontWeight: Font.weightSemiBold,
    textAlign: 'center'
  },
  message: {
    fontSize: Font.sizeMessage,
    marginTop: 8,
    lineHeight: 20,
    textAlign: 'center'
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: Layout.radiusButton,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: Font.sizeBody,
    fontWeight: Font.weightSemiBold
  }
});

// ─── Toast ───────────────────────────────────────────────────────────────────

export const toastStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none'
  },
  pill: {
    maxWidth: Layout.toastMaxWidth,
    marginHorizontal: Layout.toastMarginHorizontal,
    paddingVertical: Layout.toastPaddingVertical,
    paddingHorizontal: Layout.toastPaddingHorizontal,
    borderRadius: Layout.radiusToast,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6
  },
  text: {
    fontSize: Font.sizeToast,
    textAlign: 'center'
  }
});
//# sourceMappingURL=styles.js.map