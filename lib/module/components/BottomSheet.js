"use strict";

import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Keyboard, Modal, PanResponder, StyleSheet, View } from 'react-native';
import { Backdrop } from "../core/Backdrop.js";
import { Animation, Colors, Layout } from "../core/constants.js";
import { bottomSheetStyles as styles, commonStyles } from "../core/styles.js";
import { SafeAreaInsetsProvider, useInsets } from "../hooks/useInsets.js";

/**
 * Outer shell — only controls `<Modal>` visibility and wraps content
 * in `<SafeAreaInsetsProvider>` so `useInsets()` works inside the
 * detached native view hierarchy.
 */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const BottomSheet = props => {
  const {
    visible,
    onClose,
    animationDuration = Animation.durationDefault
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
      setModalVisible(true);
    }
  }, [visible]);
  const handleHide = useCallback(() => {
    setModalVisible(false);
  }, []);
  return /*#__PURE__*/_jsx(Modal, {
    transparent: true,
    visible: modalVisible,
    animationType: "none",
    onRequestClose: onClose,
    statusBarTranslucent: true,
    children: /*#__PURE__*/_jsx(SafeAreaInsetsProvider, {
      style: {
        flex: 1
      },
      children: /*#__PURE__*/_jsx(BottomSheetInner, {
        ...props,
        animationDuration: animationDuration,
        onModalHide: handleHide
      })
    })
  });
};

/**
 * Inner component — rendered inside the Modal + SafeAreaProvider,
 * so `useInsets()` returns real device insets.
 */
const BottomSheetInner = ({
  children,
  visible,
  onClose,
  onOpen,
  onDrag,
  onDragEnd,
  onFullScreen,
  draggable = true,
  showHandle = true,
  topInset: topInsetProp,
  bottomInset: bottomInsetProp,
  dismissThreshold = Layout.dismissThreshold,
  animationDuration = Animation.durationDefault,
  backdropOpacity = Animation.backdropOpacity,
  backdropColor = Colors.black,
  backdropStyle,
  disableBackdropClose = false,
  backgroundColor = Colors.white,
  handleColor = Colors.gray300,
  style,
  handleStyle,
  handleContainerStyle,
  contentContainerStyle,
  onModalHide
}) => {
  const insets = useInsets();
  const topInset = topInsetProp ?? insets.top;
  const bottomInset = bottomInsetProp ?? insets.bottom;
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const maxHeight = containerHeight > 0 ? containerHeight - topInset : 0;
  const maxHeightForContent = maxHeight > 0 ? maxHeight : Infinity;
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const dragStartHeight = useRef(0);

  // ── Stable refs for PanResponder ────────────────────────
  const contentHeightRef = useRef(0);
  const maxHeightRef = useRef(0);
  const onCloseRef = useRef(onClose);
  const onDragRef = useRef(onDrag);
  const onDragEndRef = useRef(onDragEnd);
  const onFullScreenRef = useRef(onFullScreen);
  const dismissThresholdRef = useRef(dismissThreshold);
  onCloseRef.current = onClose;
  onDragRef.current = onDrag;
  onDragEndRef.current = onDragEnd;
  onFullScreenRef.current = onFullScreen;
  dismissThresholdRef.current = dismissThreshold;
  maxHeightRef.current = maxHeight;

  // ── Measure the real modal container ────────────────────
  const handleContainerLayout = useCallback(e => {
    setContainerHeight(e.nativeEvent.layout.height);
  }, []);

  // ── Close animation ─────────────────────────────────────
  useEffect(() => {
    if (!visible) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: false
      }).start(({
        finished
      }) => {
        if (finished) onModalHide();
      });
    }
  }, [visible, animationDuration]);

  // ── Animate open once measurements are ready ────────────
  useEffect(() => {
    if (visible && contentHeight > 0 && maxHeight > 0) {
      const target = Math.min(contentHeight, maxHeight);
      Animated.timing(animatedHeight, {
        toValue: target,
        duration: animationDuration,
        useNativeDriver: false
      }).start(({
        finished
      }) => {
        if (finished) onOpen?.();
      });
    }
  }, [visible, contentHeight, maxHeight, animationDuration]);

  // ── Content measurement (hidden measurer) ───────────────
  const handleContentLayout = useCallback(e => {
    const measured = Math.min(e.nativeEvent.layout.height + bottomInset, maxHeightForContent);
    if (Math.abs(measured - contentHeightRef.current) < 1) return;
    contentHeightRef.current = measured;
    setContentHeight(measured);
  }, [bottomInset, maxHeightForContent]);

  // ── PanResponder ────────────────────────────────────────
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Layout.panThreshold,
    onPanResponderGrant: () => {
      // @ts-ignore – _value is internal but stable
      dragStartHeight.current = animatedHeight._value;
    },
    onPanResponderMove: (_, gesture) => {
      const full = maxHeightRef.current;
      const newHeight = Math.max(0, Math.min(full, dragStartHeight.current - gesture.dy));
      animatedHeight.setValue(newHeight);
      const direction = gesture.dy < 0 ? 'up' : 'down';
      onDragRef.current?.(direction, full > 0 ? newHeight / full : 0);
    },
    onPanResponderRelease: (_, gesture) => {
      const full = maxHeightRef.current;
      const cHeight = contentHeightRef.current;
      // @ts-ignore
      const current = animatedHeight._value;
      if (gesture.dy > 0 && current < cHeight - dismissThresholdRef.current) {
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: Animation.durationFast,
          useNativeDriver: false
        }).start(() => {
          onCloseRef.current();
          onDragEndRef.current?.('dismissed');
        });
        return;
      }
      const midpoint = (cHeight + full) / 2;
      if (current > midpoint) {
        Animated.spring(animatedHeight, {
          toValue: full,
          useNativeDriver: false,
          bounciness: Animation.bounciness
        }).start(() => {
          onFullScreenRef.current?.();
          onDragEndRef.current?.('fullscreen');
        });
      } else {
        Animated.spring(animatedHeight, {
          toValue: cHeight,
          useNativeDriver: false,
          bounciness: Animation.bounciness
        }).start(() => {
          onDragEndRef.current?.('content');
        });
      }
    }
  })).current;

  // ── Backdrop press ──────────────────────────────────────
  const handleBackdropPress = useCallback(() => {
    if (!disableBackdropClose) onClose();
  }, [disableBackdropClose, onClose]);

  // ── Android back ────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  // ── Backdrop opacity linked to height ───────────────────
  const opacity = animatedHeight.interpolate({
    inputRange: [0, contentHeight || 1],
    outputRange: [0, backdropOpacity],
    extrapolate: 'clamp'
  });

  // ── Border radius: flatten when near full-screen ────────
  const clampMax = maxHeight > 0 ? maxHeight : 1;
  const borderRadius = animatedHeight.interpolate({
    inputRange: [clampMax - 30, clampMax],
    outputRange: [Layout.radiusLarge, 0],
    extrapolate: 'clamp'
  });
  return /*#__PURE__*/_jsxs(View, {
    style: StyleSheet.absoluteFill,
    onLayout: handleContainerLayout,
    children: [/*#__PURE__*/_jsx(Backdrop, {
      opacity: opacity,
      onPress: handleBackdropPress,
      color: backdropColor,
      style: backdropStyle
    }), /*#__PURE__*/_jsx(View, {
      style: [commonStyles.absoluteAnchorBottom, {
        top: topInset,
        overflow: 'hidden'
      }],
      pointerEvents: "box-none",
      children: /*#__PURE__*/_jsxs(Animated.View, {
        style: [styles.sheet, {
          backgroundColor
        }, style, {
          height: animatedHeight,
          maxHeight: maxHeight > 0 ? maxHeight : undefined,
          paddingBottom: bottomInset,
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius
        }],
        children: [showHandle && /*#__PURE__*/_jsx(View, {
          style: [styles.handleContainer, handleContainerStyle],
          ...(draggable ? panResponder.panHandlers : {}),
          children: /*#__PURE__*/_jsx(View, {
            style: [styles.handle, {
              backgroundColor: handleColor
            }, handleStyle]
          })
        }), /*#__PURE__*/_jsx(View, {
          style: [styles.content, contentContainerStyle],
          children: children
        })]
      })
    }), /*#__PURE__*/_jsxs(View, {
      style: styles.measurer,
      onLayout: handleContentLayout,
      pointerEvents: "none",
      children: [showHandle && /*#__PURE__*/_jsx(View, {
        style: styles.handleContainer,
        children: /*#__PURE__*/_jsx(View, {
          style: styles.handle
        })
      }), children]
    })]
  });
};
//# sourceMappingURL=BottomSheet.js.map