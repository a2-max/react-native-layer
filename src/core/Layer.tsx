import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Modal, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Backdrop } from './Backdrop';
import { Animation, Colors, SCREEN_HEIGHT } from './constants';
import { layerStyles } from './styles';
import type { LayerProps } from '../types/layer';
import { closeKeyboard } from '../hooks/useKeyboard';
import { ToastOutlet } from '../components/Toast';

export const Layer = ({
  visible,
  onClose,
  onOpen,
  children,
  disableBackdropClose = false,
  animationDuration = Animation.durationDefault,
  backdropOpacity = Animation.backdropOpacity,
  backdropColor = Colors.black,
  backdropStyle,
}: LayerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useSharedValue(SCREEN_HEIGHT);

  const handleOpen = useCallback(() => {
    onOpen?.();
  }, [onOpen]);

  useEffect(() => {
    if (visible) {
      closeKeyboard();
      setModalVisible(true);
      translateY.value = SCREEN_HEIGHT;
      translateY.value = withTiming(
        0,
        { duration: animationDuration },
        (finished) => {
          if (finished && onOpen) {
            scheduleOnRN(handleOpen);
          }
        }
      );
    } else {
      translateY.value = withTiming(
        SCREEN_HEIGHT,
        { duration: animationDuration },
        (finished) => {
          if (finished) {
            scheduleOnRN(setModalVisible, false);
          }
        }
      );
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

  const opacity = useDerivedValue(() =>
    interpolate(
      translateY.value,
      [0, SCREEN_HEIGHT],
      [backdropOpacity, 0],
      Extrapolation.CLAMP
    )
  );

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={StyleSheet.absoluteFill}>
        <Backdrop
          opacity={opacity}
          onPress={handleBackdropPress}
          color={backdropColor}
          style={backdropStyle}
        />

        <Animated.View style={[layerStyles.container, containerStyle]}>
          {children}
        </Animated.View>

        <ToastOutlet active={visible} />
      </GestureHandlerRootView>
    </Modal>
  );
};
