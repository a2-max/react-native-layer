"use strict";

import { useCallback, useEffect, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Animation, Colors } from "../core/constants.js";
import { commonStyles, confirmModalStyles as styles } from "../core/styles.js";
import { closeKeyboard } from "../hooks/useKeyboard.js";
import { ToastOutlet } from "./Toast.js";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
export const ConfirmModal = ({
  visible,
  title,
  message,
  showInput = false,
  inputLabel,
  inputPlaceholder,
  validationText,
  positiveText = 'Confirm',
  negativeText = 'Cancel',
  onConfirm,
  onCancel,
  onOpen,
  disableBackdropClose = false,
  animationDuration = Animation.durationFast,
  backdropColor = Colors.backdropDark,
  cardBackgroundColor = Colors.white,
  titleColor = Colors.gray900,
  messageColor = Colors.gray500,
  positiveButtonColor = Colors.gray900,
  positiveTextColor = Colors.white,
  negativeButtonColor = Colors.gray100,
  negativeTextColor = Colors.gray700,
  backdropStyle,
  cardStyle,
  titleStyle,
  messageStyle,
  labelStyle,
  inputStyle,
  buttonsContainerStyle,
  positiveStyle,
  negativeStyle,
  positiveButtonStyle,
  negativeButtonStyle
}) => {
  const [value, setValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(Animation.scaleInitial);

  // ✅ SAFE CALLBACK
  const handleOpen = useCallback(() => {
    onOpen?.();
  }, [onOpen]);
  const resetAfterClose = useCallback(() => {
    setModalVisible(false);
    setValue('');
  }, []);
  useEffect(() => {
    if (visible) {
      closeKeyboard();
      setModalVisible(true);
      opacity.value = 0;
      scale.value = Animation.scaleInitial;
      opacity.value = withTiming(1, {
        duration: animationDuration
      }, finished => {
        if (finished) {
          scheduleOnRN(handleOpen);
        }
      });
      scale.value = withTiming(1, {
        duration: animationDuration,
        easing: Easing.out(Easing.cubic)
      });
    } else {
      opacity.value = withTiming(0, {
        duration: animationDuration
      }, finished => {
        if (finished) {
          scheduleOnRN(resetAfterClose);
        }
      });
      scale.value = withTiming(Animation.scaleInitial, {
        duration: animationDuration
      });
    }
  }, [visible, animationDuration, handleOpen, resetAfterClose]);
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onCancel();
      return true;
    });
    return () => sub.remove();
  }, [visible, onCancel]);
  const isValid = !showInput || !validationText || value === validationText;
  const handleBackdropPress = useCallback(() => {
    if (!disableBackdropClose) {
      onCancel();
    }
  }, [disableBackdropClose, onCancel]);
  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{
      scale: scale.value
    }]
  }));
  return /*#__PURE__*/_jsxs(Modal, {
    transparent: true,
    visible: modalVisible,
    animationType: "none",
    onRequestClose: onCancel,
    statusBarTranslucent: true,
    children: [/*#__PURE__*/_jsx(KeyboardAvoidingView, {
      style: commonStyles.fill,
      behavior: Platform.OS === 'ios' ? 'padding' : undefined,
      children: /*#__PURE__*/_jsxs(View, {
        style: commonStyles.center,
        children: [/*#__PURE__*/_jsx(Animated.View, {
          style: [StyleSheet.absoluteFill, {
            backgroundColor: backdropColor
          }, backdropStyle, backdropAnimatedStyle],
          children: /*#__PURE__*/_jsx(Pressable, {
            style: StyleSheet.absoluteFill,
            onPress: handleBackdropPress
          })
        }), /*#__PURE__*/_jsxs(Animated.View, {
          style: [styles.card, {
            backgroundColor: cardBackgroundColor
          }, cardStyle, cardAnimatedStyle],
          children: [/*#__PURE__*/_jsx(Text, {
            style: [styles.title, {
              color: titleColor
            }, !showInput && {
              textAlign: 'center'
            }, titleStyle],
            children: title
          }), !showInput && message ? /*#__PURE__*/_jsx(Text, {
            style: [styles.message, {
              color: messageColor
            }, messageStyle],
            children: message
          }) : null, showInput && /*#__PURE__*/_jsxs(_Fragment, {
            children: [inputLabel ? /*#__PURE__*/_jsx(Text, {
              style: [styles.label, labelStyle],
              children: inputLabel
            }) : null, /*#__PURE__*/_jsx(TextInput, {
              style: [styles.input, inputStyle],
              value: value,
              onChangeText: setValue,
              placeholder: inputPlaceholder,
              placeholderTextColor: Colors.gray400,
              autoCapitalize: "none",
              autoCorrect: false
            })]
          }), /*#__PURE__*/_jsxs(View, {
            style: [styles.buttons, buttonsContainerStyle],
            children: [/*#__PURE__*/_jsx(Pressable, {
              style: ({
                pressed
              }) => [styles.button, {
                backgroundColor: negativeButtonColor
              }, negativeButtonStyle, pressed && styles.buttonPressed],
              onPress: onCancel,
              children: /*#__PURE__*/_jsx(Text, {
                style: [styles.cancelText, {
                  color: negativeTextColor
                }, negativeStyle],
                children: negativeText
              })
            }), /*#__PURE__*/_jsx(Pressable, {
              style: ({
                pressed
              }) => [styles.button, {
                backgroundColor: positiveButtonColor
              }, positiveButtonStyle, !isValid && styles.buttonDisabled, pressed && isValid && styles.buttonPressed],
              disabled: !isValid,
              onPress: () => onConfirm(showInput ? value : undefined),
              children: /*#__PURE__*/_jsx(Text, {
                style: [styles.confirmText, {
                  color: positiveTextColor
                }, positiveStyle],
                children: positiveText
              })
            })]
          })]
        })]
      })
    }), /*#__PURE__*/_jsx(ToastOutlet, {
      active: visible
    })]
  });
};
//# sourceMappingURL=ConfirmModal.js.map