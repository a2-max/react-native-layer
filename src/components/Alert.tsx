import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Animation, Colors } from '../core/constants';
import { alertStyles as styles, commonStyles } from '../core/styles';
import type { AlertProps, AlertType } from '../types/alert';
import { SafeAreaInsetsProvider, useInsets } from '../hooks/useInsets';
import {
  SuccessIcon,
  ErrorIcon,
  WarningIcon,
  QuestionIcon,
} from '../icons/AlertIcons';

// ── Type → default accent colors ────────────────────────────────────────────

const hexToRgba = (hex: string, opacity: number): string => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const TYPE_COLORS: Record<AlertType, { icon: string; button: string }> = {
  success: { icon: '#16A34A', button: '#16A34A' },
  error: { icon: '#DC2626', button: '#DC2626' },
  warning: { icon: '#D97706', button: '#D97706' },
  question: { icon: '#2563EB', button: '#2563EB' },
};

const TYPE_ICON: Record<
  AlertType,
  React.ComponentType<{ size?: number; color?: string }>
> = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  question: QuestionIcon,
};

export const Alert = (props: AlertProps) => {
  const {
    visible,
    onClose,
    animationDuration = Animation.durationFast,
  } = props;
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (visible) setModalVisible(true);
  }, [visible]);

  const handleHide = useCallback(() => {
    setModalVisible(false);
  }, []);

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaInsetsProvider style={{ flex: 1 }}>
        <AlertInner
          {...props}
          animationDuration={animationDuration}
          onModalHide={handleHide}
        />
      </SafeAreaInsetsProvider>
    </Modal>
  );
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
  onModalHide,
}: AlertProps & { onModalHide: () => void }) => {
  const insets = useInsets();
  const opacity = useSharedValue(0);
  const scale = useSharedValue<number>(Animation.scaleInitial);
  const translateY = useSharedValue(200);
  const onOpenRef = useRef(onOpen);

  onOpenRef.current = onOpen;

  const resolvedButtonColor =
    buttonColor ?? (type ? TYPE_COLORS[type].button : Colors.gray900);

  const IconComponent = type ? TYPE_ICON[type] : null;
  const iconColor = type ? TYPE_COLORS[type].icon : undefined;

  useEffect(() => {
    if (visible) {
      if (position === 'center') {
        opacity.value = 0;
        scale.value = Animation.scaleInitial;
        opacity.value = withTiming(
          1,
          { duration: animationDuration },
          (finished) => {
            if (finished && onOpenRef.current) {
              runOnJS(onOpenRef.current)();
            }
          }
        );
        scale.value = withTiming(1, {
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
        });
      } else {
        opacity.value = 0;
        translateY.value = 200;
        opacity.value = withTiming(
          1,
          { duration: animationDuration },
          (finished) => {
            if (finished && onOpenRef.current) {
              runOnJS(onOpenRef.current)();
            }
          }
        );
        translateY.value = withTiming(0, {
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
        });
      }
    } else if (position === 'center') {
      opacity.value = withTiming(
        0,
        { duration: animationDuration },
        (finished) => {
          if (finished) {
            runOnJS(onModalHide)();
          }
        }
      );
      scale.value = withTiming(Animation.scaleInitial, {
        duration: animationDuration,
      });
    } else {
      opacity.value = withTiming(
        0,
        { duration: animationDuration },
        (finished) => {
          if (finished) {
            runOnJS(onModalHide)();
          }
        }
      );
      translateY.value = withTiming(200, {
        duration: animationDuration,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [
    visible,
    animationDuration,
    position,
    onModalHide,
    opacity,
    scale,
    translateY,
  ]);

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const centerCardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const bottomCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (position === 'center') {
    return (
      <View style={commonStyles.center}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: backdropColor },
            backdropAnimatedStyle,
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.centerCard,
            { backgroundColor },
            centerCardAnimatedStyle,
          ]}
        >
          {IconComponent ? (
            <View
              style={[
                iconStyles.wrapper,
                { backgroundColor: hexToRgba(iconColor!, 0.2) },
              ]}
            >
              <IconComponent size={iconSize} color={iconColor} />
            </View>
          ) : null}
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          {message ? (
            <Text style={[styles.message, { color: messageColor }]}>
              {message}
            </Text>
          ) : null}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: resolvedButtonColor,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: buttonTextColor }]}>
              {buttonText}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  // ── Bottom position ─────────────────────────────────────
  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: backdropColor },
          backdropAnimatedStyle,
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <View style={commonStyles.absoluteAnchorBottom} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              backgroundColor,
              paddingBottom: insets.bottom + 20,
            },
            bottomCardAnimatedStyle,
          ]}
        >
          {IconComponent ? (
            <View
              style={[
                iconStyles.wrapper,
                { backgroundColor: hexToRgba(iconColor!, 0.2) },
              ]}
            >
              <IconComponent size={iconSize} color={iconColor} />
            </View>
          ) : null}
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          {message ? (
            <Text style={[styles.message, { color: messageColor }]}>
              {message}
            </Text>
          ) : null}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: resolvedButtonColor,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: buttonTextColor }]}>
              {buttonText}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
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
    padding: 10,
  },
});
