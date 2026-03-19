"use strict";

import { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Animation, Colors } from "../core/constants.js";
import { commonStyles, confirmModalStyles as styles } from "../core/styles.js";
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
  // Color-only props
  backdropColor = Colors.backdropDark,
  cardBackgroundColor = Colors.white,
  titleColor = Colors.gray900,
  messageColor = Colors.gray500,
  positiveButtonColor = Colors.gray900,
  positiveTextColor = Colors.white,
  negativeButtonColor = Colors.gray100,
  negativeTextColor = Colors.gray700,
  // Style overrides
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
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(Animation.scaleInitial)).current;
  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([Animated.timing(opacity, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true
      }), Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: Animation.bounciness
      })]).start(({
        finished
      }) => {
        if (finished) onOpen?.();
      });
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true
      }).start(({
        finished
      }) => {
        if (finished) {
          setModalVisible(false);
          scale.setValue(Animation.scaleInitial);
          setValue('');
        }
      });
    }
  }, [visible, animationDuration, opacity, scale]);
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onCancel();
      return true;
    });
    return () => sub.remove();
  }, [visible, onCancel]);
  const isValid = !showInput || !validationText || value === validationText;
  const handleBackdropPress = () => {
    if (!disableBackdropClose) {
      onCancel();
    }
  };
  return /*#__PURE__*/_jsx(Modal, {
    transparent: true,
    visible: modalVisible,
    animationType: "none",
    onRequestClose: onCancel,
    statusBarTranslucent: true,
    children: /*#__PURE__*/_jsx(KeyboardAvoidingView, {
      style: commonStyles.fill,
      behavior: Platform.OS === 'ios' ? 'padding' : undefined,
      children: /*#__PURE__*/_jsxs(View, {
        style: commonStyles.center,
        children: [/*#__PURE__*/_jsx(Animated.View, {
          style: [StyleSheet.absoluteFill, {
            backgroundColor: backdropColor
          }, backdropStyle, {
            opacity
          }],
          children: /*#__PURE__*/_jsx(Pressable, {
            style: StyleSheet.absoluteFill,
            onPress: handleBackdropPress
          })
        }), /*#__PURE__*/_jsxs(Animated.View, {
          style: [styles.card, {
            backgroundColor: cardBackgroundColor
          }, cardStyle, {
            opacity,
            transform: [{
              scale
            }]
          }],
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
    })
  });
};
//# sourceMappingURL=ConfirmModal.js.map