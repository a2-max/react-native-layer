"use strict";

import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Modal, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, Extrapolation, interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Backdrop } from "../core/Backdrop.js";
import { Animation, Colors, Layout } from "../core/constants.js";
import { bottomSheetStyles as styles, commonStyles } from "../core/styles.js";
import { SafeAreaInsetsProvider, useInsets } from "../hooks/useInsets.js";
import { closeKeyboard } from "../hooks/useKeyboard.js";
import { ToastOutlet } from "./Toast.js";
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
      closeKeyboard();
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
const BottomSheetInner = ({
  children,
  visible,
  onClose,
  onOpen,
  onDrag,
  onDragEnd,
  onFullScreen,
  draggable = true,
  enableUpwardDrag = false,
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
  styleWrapper,
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
  const animatedHeight = useSharedValue(0);
  const dragStartHeight = useSharedValue(0);
  const contentHeightValue = useSharedValue(0);
  const maxHeightValue = useSharedValue(0);
  const dismissThresholdValue = useSharedValue(dismissThreshold);
  const enableUpwardDragValue = useSharedValue(enableUpwardDrag ? 1 : 0);
  const isDragging = useSharedValue(false);
  const isFullscreen = useSharedValue(false);
  const openPending = useSharedValue(false);
  const settledHeight = useRef(0);
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const emitOpen = useCallback(() => {
    onOpenRef.current?.();
  }, []);
  const emitDismiss = useCallback(() => {
    onClose();
    onDragEnd?.('dismissed');
  }, [onClose, onDragEnd]);
  const emitFullscreen = useCallback(() => {
    onFullScreen?.();
    onDragEnd?.('fullscreen');
  }, [onFullScreen, onDragEnd]);
  const emitContentSettled = useCallback(() => {
    onDragEnd?.('content');
  }, [onDragEnd]);
  const emitDrag = useCallback((direction, fraction) => {
    onDrag?.(direction, fraction);
  }, [onDrag]);
  const handleContainerLayout = useCallback(e => {
    setContainerHeight(e.nativeEvent.layout.height);
  }, []);
  useEffect(() => {
    maxHeightValue.value = maxHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxHeight]);
  useEffect(() => {
    dismissThresholdValue.value = dismissThreshold;
  }, [dismissThreshold]);
  useEffect(() => {
    enableUpwardDragValue.value = enableUpwardDrag ? 1 : 0;
  }, [enableUpwardDrag]);
  useEffect(() => {
    if (!visible) {
      settledHeight.current = 0;
      openPending.value = false;
      animatedHeight.value = withTiming(0, {
        duration: animationDuration
      }, finished => {
        if (finished) {
          scheduleOnRN(onModalHide);
        }
      });
    }
  }, [visible, animationDuration, onModalHide]);
  useEffect(() => {
    if (!visible || contentHeight <= 0 || maxHeight <= 0) return;
    const target = Math.min(contentHeight, maxHeight);
    if (target === settledHeight.current) return;
    const opening = settledHeight.current === 0;
    settledHeight.current = target;

    // content resized while open: follow it unless the user is holding the sheet
    if (!opening && (isDragging.value || isFullscreen.value)) return;
    if (opening) {
      isFullscreen.value = false;
      openPending.value = true;
    }
    animatedHeight.value = withTiming(target, {
      duration: animationDuration
    }, finished => {
      if (finished && openPending.value) {
        openPending.value = false;
        scheduleOnRN(emitOpen);
      }
    });
  }, [visible, contentHeight, maxHeight, animationDuration, emitOpen]);
  const handleContentLayout = useCallback(e => {
    const measured = Math.min(e.nativeEvent.layout.height + bottomInset, maxHeightForContent);
    if (Math.abs(measured - contentHeightValue.value) < 1) return;
    contentHeightValue.value = measured;
    setContentHeight(measured);
  }, [bottomInset, maxHeightForContent]);
  const panGesture = Gesture.Pan().enabled(draggable).minDistance(4).onStart(() => {
    isDragging.value = true;
    cancelAnimation(animatedHeight);
    dragStartHeight.value = animatedHeight.value;
  }).onUpdate(gesture => {
    const full = maxHeightValue.value;
    const dy = gesture.translationY;
    const isUpwardDrag = dy < 0;

    // Always allow downward drag.
    // Allow upward drag only when enableUpwardDrag is true.
    if (isUpwardDrag && enableUpwardDragValue.value === 0) {
      // Block height change but still emit the drag callback
      // so consumers can react (e.g. scroll hand-off, visual cues).
      scheduleOnRN(emitDrag, 'up', full > 0 ? animatedHeight.value / full : 0);
      return;
    }
    const nextHeight = Math.max(0, Math.min(full, dragStartHeight.value - dy));
    animatedHeight.value = nextHeight;
    const direction = isUpwardDrag ? 'up' : 'down';
    scheduleOnRN(emitDrag, direction, full > 0 ? nextHeight / full : 0);
  }).onEnd(gesture => {
    isDragging.value = false;
    const full = maxHeightValue.value;
    const content = contentHeightValue.value;
    const current = animatedHeight.value;
    const velocityY = gesture.velocityY;

    // Fast swipe down → dismiss
    if (velocityY > 800 || gesture.translationY > 0 && current < content - dismissThresholdValue.value) {
      animatedHeight.value = withTiming(0, {}, () => scheduleOnRN(emitDismiss));
      return;
    }

    // Fast swipe up - fullscreen (only when upward drag is enabled)
    if (velocityY < -800 && enableUpwardDragValue.value !== 0) {
      isFullscreen.value = true;
      animatedHeight.value = withTiming(full, {}, () => scheduleOnRN(emitFullscreen));
      return;
    }

    // Snap logic
    const midpoint = (content + full) / 2;
    if (enableUpwardDragValue.value !== 0 && current > midpoint) {
      // Snap to fullscreen when upward drag is enabled and past midpoint
      isFullscreen.value = true;
      animatedHeight.value = withTiming(full, {}, () => scheduleOnRN(emitFullscreen));
    } else {
      // Always snap back to content height otherwise
      isFullscreen.value = false;
      animatedHeight.value = withTiming(content, {}, () => scheduleOnRN(emitContentSettled));
    }
  });
  const handleBackdropPress = useCallback(() => {
    if (!disableBackdropClose) onClose();
  }, [disableBackdropClose, onClose]);
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);
  const opacity = useDerivedValue(() => interpolate(animatedHeight.value, [0, contentHeightValue.value || 1], [0, backdropOpacity], Extrapolation.CLAMP));
  const sheetAnimatedStyle = useAnimatedStyle(() => {
    const clampMax = maxHeightValue.value || 1;
    const borderRadius = interpolate(animatedHeight.value, [clampMax - 30, clampMax], [Layout.radiusLarge, 0], Extrapolation.CLAMP);
    return {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: animatedHeight.value,
      maxHeight: maxHeightValue.value || undefined,
      paddingBottom: bottomInset,
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius
    };
  });
  return /*#__PURE__*/_jsx(GestureHandlerRootView, {
    style: {
      flex: 1
    },
    children: /*#__PURE__*/_jsxs(View, {
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
        }, styleWrapper],
        pointerEvents: "box-none",
        children: /*#__PURE__*/_jsx(Animated.View, {
          style: [styles.sheet, {
            backgroundColor
          }, style, sheetAnimatedStyle],
          children: /*#__PURE__*/_jsxs(View, {
            style: styles.body,
            onLayout: handleContentLayout,
            children: [/*#__PURE__*/_jsx(GestureDetector, {
              gesture: panGesture,
              children: /*#__PURE__*/_jsx(View, {
                style: [styles.handleContainer, handleContainerStyle],
                children: showHandle && /*#__PURE__*/_jsx(View, {
                  style: [styles.handle, {
                    backgroundColor: handleColor
                  }, handleStyle]
                })
              })
            }), /*#__PURE__*/_jsx(View, {
              style: [styles.content, contentContainerStyle],
              children: children
            })]
          })
        })
      }), /*#__PURE__*/_jsx(ToastOutlet, {
        active: visible
      })]
    })
  });
};
//# sourceMappingURL=BottomSheet.js.map