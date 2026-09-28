import { useCallback, useEffect, useState } from 'react';
import {
  BackHandler,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Animation, Colors } from '../core/constants';
import { commonStyles, confirmModalStyles as styles } from '../core/styles';
import type { ConfirmModalProps } from '../types/confirmModal';
import { closeKeyboard } from '../hooks/useKeyboard';
import { ToastOutlet } from './Toast';

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
  negativeButtonStyle,
}: ConfirmModalProps) => {
  const [value, setValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const opacity = useSharedValue(0);
  const scale = useSharedValue<number>(Animation.scaleInitial);

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

      opacity.value = withTiming(
        1,
        { duration: animationDuration },
        (finished) => {
          if (finished) {
            scheduleOnRN(handleOpen);
          }
        }
      );

      scale.value = withTiming(1, {
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      opacity.value = withTiming(
        0,
        { duration: animationDuration },
        (finished) => {
          if (finished) {
            scheduleOnRN(resetAfterClose);
          }
        }
      );

      scale.value = withTiming(Animation.scaleInitial, {
        duration: animationDuration,
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
    opacity: opacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={commonStyles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={commonStyles.center}>
          {/* Backdrop */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: backdropColor },
              backdropStyle,
              backdropAnimatedStyle,
            ]}
          >
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={handleBackdropPress}
            />
          </Animated.View>

          {/* Card */}
          <Animated.View
            style={[
              styles.card,
              { backgroundColor: cardBackgroundColor },
              cardStyle,
              cardAnimatedStyle,
            ]}
          >
            <Text
              style={[
                styles.title,
                { color: titleColor },
                !showInput && { textAlign: 'center' },
                titleStyle,
              ]}
            >
              {title}
            </Text>

            {!showInput && message ? (
              <Text
                style={[styles.message, { color: messageColor }, messageStyle]}
              >
                {message}
              </Text>
            ) : null}

            {showInput && (
              <>
                {inputLabel ? (
                  <Text style={[styles.label, labelStyle]}>{inputLabel}</Text>
                ) : null}
                <TextInput
                  style={[styles.input, inputStyle]}
                  value={value}
                  onChangeText={setValue}
                  placeholder={inputPlaceholder}
                  placeholderTextColor={Colors.gray400}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </>
            )}

            <View style={[styles.buttons, buttonsContainerStyle]}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: negativeButtonColor },
                  negativeButtonStyle,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onCancel}
              >
                <Text
                  style={[
                    styles.cancelText,
                    { color: negativeTextColor },
                    negativeStyle,
                  ]}
                >
                  {negativeText}
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: positiveButtonColor },
                  positiveButtonStyle,
                  !isValid && styles.buttonDisabled,
                  pressed && isValid && styles.buttonPressed,
                ]}
                disabled={!isValid}
                onPress={() => onConfirm(showInput ? value : undefined)}
              >
                <Text
                  style={[
                    styles.confirmText,
                    { color: positiveTextColor },
                    positiveStyle,
                  ]}
                >
                  {positiveText}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
      <ToastOutlet active={visible} />
    </Modal>
  );
};
