"use strict";

import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Keyboard, Modal, StyleSheet, View } from 'react-native';
import { Backdrop } from "./Backdrop.js";
import { Animation, Colors, SCREEN_HEIGHT } from "./constants.js";
import { layerStyles } from "./styles.js";
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
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
      setModalVisible(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true
      }).start(({
        finished
      }) => {
        if (finished) onOpen?.();
      });
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: animationDuration,
        useNativeDriver: true
      }).start(({
        finished
      }) => {
        if (finished) setModalVisible(false);
      });
    }
  }, [visible, animationDuration, translateY]);
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
  const opacity = translateY.interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [backdropOpacity, 0]
  });
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
        style: [layerStyles.container, {
          transform: [{
            translateY
          }]
        }],
        children: children
      })]
    })
  });
};
//# sourceMappingURL=Layer.js.map