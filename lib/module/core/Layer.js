"use strict";

import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Modal, StyleSheet, View } from 'react-native';
import Animated, { Extrapolation, interpolate, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { Backdrop } from "./Backdrop.js";
import { Animation, Colors, SCREEN_HEIGHT } from "./constants.js";
import { layerStyles } from "./styles.js";
import { closeKeyboard } from "../hooks/useKeyboard.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Layer = ({
  visible,
  onClose,
  onOpen,
  children,
  disableBackdropClose = false,
  animationDuration = Animation.durationDefault,
  backdropOpacity = Animation.backdropOpacity,
  backdropColor = Colors.black,
  backdropStyle
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const handleOpen = useCallback(() => {
    onOpenRef.current?.();
  }, []);
  useEffect(() => {
    if (visible) {
      closeKeyboard();
      setModalVisible(true);
      translateY.value = SCREEN_HEIGHT;
      translateY.value = withTiming(0, {
        duration: animationDuration
      }, finished => {
        if (finished && onOpenRef.current) {
          runOnJS(handleOpen)();
        }
      });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, {
        duration: animationDuration
      }, finished => {
        if (finished) {
          runOnJS(setModalVisible)(false);
        }
      });
    }
  }, [visible, animationDuration, handleOpen, translateY]);
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);
  const handleBackdropPress = useCallback(() => {
    if (!disableBackdropClose) onClose();
  }, [disableBackdropClose, onClose]);
  const opacity = useDerivedValue(() => interpolate(translateY.value, [0, SCREEN_HEIGHT], [backdropOpacity, 0], Extrapolation.CLAMP));
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: translateY.value
    }]
  }));
  return /*#__PURE__*/_jsx(Modal, {
    transparent: true,
    visible: modalVisible,
    animationType: "none",
    onRequestClose: onClose,
    statusBarTranslucent: true,
    children: /*#__PURE__*/_jsxs(View, {
      style: StyleSheet.absoluteFill,
      children: [/*#__PURE__*/_jsx(Backdrop, {
        opacity: opacity,
        onPress: handleBackdropPress,
        color: backdropColor,
        style: backdropStyle
      }), /*#__PURE__*/_jsx(Animated.View, {
        style: [layerStyles.container, containerStyle],
        children: children
      })]
    })
  });
};
//# sourceMappingURL=Layer.js.map