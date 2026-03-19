"use strict";

import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Animation, Colors } from "../core/constants.js";
import { alertStyles as styles, commonStyles } from "../core/styles.js";
import { SafeAreaInsetsProvider, useInsets } from "../hooks/useInsets.js";
import { SuccessIcon, ErrorIcon, WarningIcon, QuestionIcon } from "../icons/AlertIcons.js";

// ── Type → default accent colors ────────────────────────────────────────────
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const hexToRgba = (hex, opacity) => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
const TYPE_COLORS = {
  success: {
    icon: '#16A34A',
    button: '#16A34A'
  },
  error: {
    icon: '#DC2626',
    button: '#DC2626'
  },
  warning: {
    icon: '#D97706',
    button: '#D97706'
  },
  question: {
    icon: '#2563EB',
    button: '#2563EB'
  }
};
const TYPE_ICON = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  question: QuestionIcon
};
export const Alert = props => {
  const {
    visible,
    onClose,
    animationDuration = Animation.durationFast
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (visible) setModalVisible(true);
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
      children: /*#__PURE__*/_jsx(AlertInner, {
        ...props,
        animationDuration: animationDuration,
        onModalHide: handleHide
      })
    })
  });
};
const AlertInner = ({
  visible,
  title,
  message,
  buttonText = 'OK',
  onClose,
  onOpen,
  position = 'center',
  type,
  iconSize = 24,
  animationDuration = Animation.durationFast,
  backdropColor = Colors.backdropDark,
  backgroundColor = Colors.white,
  titleColor = Colors.gray900,
  messageColor = Colors.gray500,
  buttonColor,
  buttonTextColor = Colors.white,
  onModalHide
}) => {
  const insets = useInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(Animation.scaleInitial)).current;
  const translateY = useRef(new Animated.Value(200)).current;
  const resolvedButtonColor = buttonColor ?? (type ? TYPE_COLORS[type].button : Colors.gray900);
  const IconComponent = type ? TYPE_ICON[type] : null;
  const iconColor = type ? TYPE_COLORS[type].icon : undefined;
  useEffect(() => {
    if (visible) {
      if (position === 'center') {
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
        Animated.parallel([Animated.timing(opacity, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true
        }), Animated.timing(translateY, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true
        })]).start(({
          finished
        }) => {
          if (finished) onOpen?.();
        });
      }
    } else if (position === 'center') {
      Animated.timing(opacity, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true
      }).start(({
        finished
      }) => {
        if (finished) {
          scale.setValue(Animation.scaleInitial);
          onModalHide();
        }
      });
    } else {
      Animated.parallel([Animated.timing(opacity, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true
      }), Animated.timing(translateY, {
        toValue: 200,
        duration: animationDuration,
        useNativeDriver: true
      })]).start(({
        finished
      }) => {
        if (finished) onModalHide();
      });
    }
  }, [visible, animationDuration, position]);
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);
  if (position === 'center') {
    return /*#__PURE__*/_jsxs(View, {
      style: commonStyles.center,
      children: [/*#__PURE__*/_jsx(Animated.View, {
        style: [StyleSheet.absoluteFill, {
          backgroundColor: backdropColor,
          opacity
        }],
        children: /*#__PURE__*/_jsx(Pressable, {
          style: StyleSheet.absoluteFill,
          onPress: onClose
        })
      }), /*#__PURE__*/_jsxs(Animated.View, {
        style: [styles.centerCard, {
          backgroundColor,
          opacity,
          transform: [{
            scale
          }]
        }],
        children: [IconComponent ? /*#__PURE__*/_jsx(View, {
          style: [iconStyles.wrapper, {
            backgroundColor: hexToRgba(iconColor, 0.2)
          }],
          children: /*#__PURE__*/_jsx(IconComponent, {
            size: iconSize,
            color: iconColor
          })
        }) : null, /*#__PURE__*/_jsx(Text, {
          style: [styles.title, {
            color: titleColor
          }],
          children: title
        }), message ? /*#__PURE__*/_jsx(Text, {
          style: [styles.message, {
            color: messageColor
          }],
          children: message
        }) : null, /*#__PURE__*/_jsx(Pressable, {
          style: ({
            pressed
          }) => [styles.button, {
            backgroundColor: resolvedButtonColor,
            opacity: pressed ? 0.7 : 1
          }],
          onPress: onClose,
          children: /*#__PURE__*/_jsx(Text, {
            style: [styles.buttonText, {
              color: buttonTextColor
            }],
            children: buttonText
          })
        })]
      })]
    });
  }

  // ── Bottom position ─────────────────────────────────────
  return /*#__PURE__*/_jsxs(View, {
    style: StyleSheet.absoluteFill,
    children: [/*#__PURE__*/_jsx(Animated.View, {
      style: [StyleSheet.absoluteFill, {
        backgroundColor: backdropColor,
        opacity
      }],
      children: /*#__PURE__*/_jsx(Pressable, {
        style: StyleSheet.absoluteFill,
        onPress: onClose
      })
    }), /*#__PURE__*/_jsx(View, {
      style: commonStyles.absoluteAnchorBottom,
      pointerEvents: "box-none",
      children: /*#__PURE__*/_jsxs(Animated.View, {
        style: [styles.bottomSheet, {
          backgroundColor,
          paddingBottom: insets.bottom + 20,
          transform: [{
            translateY
          }]
        }],
        children: [IconComponent ? /*#__PURE__*/_jsx(View, {
          style: [iconStyles.wrapper, {
            backgroundColor: hexToRgba(iconColor, 0.2)
          }],
          children: /*#__PURE__*/_jsx(IconComponent, {
            size: iconSize,
            color: iconColor
          })
        }) : null, /*#__PURE__*/_jsx(Text, {
          style: [styles.title, {
            color: titleColor
          }],
          children: title
        }), message ? /*#__PURE__*/_jsx(Text, {
          style: [styles.message, {
            color: messageColor
          }],
          children: message
        }) : null, /*#__PURE__*/_jsx(Pressable, {
          style: ({
            pressed
          }) => [styles.button, {
            backgroundColor: resolvedButtonColor,
            opacity: pressed ? 0.7 : 1
          }],
          onPress: onClose,
          children: /*#__PURE__*/_jsx(Text, {
            style: [styles.buttonText, {
              color: buttonTextColor
            }],
            children: buttonText
          })
        })]
      })
    })]
  });
};
const iconStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    alignSelf: 'center',
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  }
});
//# sourceMappingURL=Alert.js.map