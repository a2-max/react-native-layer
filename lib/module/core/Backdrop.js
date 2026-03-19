"use strict";

import { Animated, Pressable, StyleSheet } from 'react-native';
import { Colors } from "./constants.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const Backdrop = ({
  opacity,
  onPress,
  color = Colors.black,
  style
}) => {
  return /*#__PURE__*/_jsx(Animated.View, {
    pointerEvents: "box-none",
    style: [StyleSheet.absoluteFill, {
      backgroundColor: color
    }, style, {
      opacity
    }],
    children: /*#__PURE__*/_jsx(Pressable, {
      style: StyleSheet.absoluteFill,
      onPress: onPress
    })
  });
};
//# sourceMappingURL=Backdrop.js.map