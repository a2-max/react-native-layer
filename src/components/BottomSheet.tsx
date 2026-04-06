import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  type LayoutChangeEvent,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Backdrop } from '../core/Backdrop';
import { Animation, Colors, Layout } from '../core/constants';
import { bottomSheetStyles as styles, commonStyles } from '../core/styles';
import type { BottomSheetProps } from '../types/bottomSheet';
import { SafeAreaInsetsProvider, useInsets } from '../hooks/useInsets';
import { closeKeyboard } from '../hooks/useKeyboard';

export const BottomSheet = (props: BottomSheetProps) => {
  const {
    visible,
    onClose,
    animationDuration = Animation.durationDefault,
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

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaInsetsProvider style={{ flex: 1 }}>
        <BottomSheetInner
          {...props}
          animationDuration={animationDuration}
          onModalHide={handleHide}
        />
      </SafeAreaInsetsProvider>
    </Modal>
  );
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
  style,
  handleStyle,
  handleContainerStyle,
  contentContainerStyle,
  onModalHide,
}: BottomSheetProps & { onModalHide: () => void }) => {
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

  const onCloseRef = useRef(onClose);
  const onOpenRef = useRef(onOpen);
  const onDragRef = useRef(onDrag);
  const onDragEndRef = useRef(onDragEnd);
  const onFullScreenRef = useRef(onFullScreen);

  onCloseRef.current = onClose;
  onOpenRef.current = onOpen;
  onDragRef.current = onDrag;
  onDragEndRef.current = onDragEnd;
  onFullScreenRef.current = onFullScreen;

  useEffect(() => {
    maxHeightValue.value = maxHeight;
  }, [maxHeight, maxHeightValue]);

  useEffect(() => {
    dismissThresholdValue.value = dismissThreshold;
  }, [dismissThreshold, dismissThresholdValue]);

  const emitOpen = useCallback(() => {
    onOpenRef.current?.();
  }, []);

  const emitDismiss = useCallback(() => {
    onCloseRef.current();
    onDragEndRef.current?.('dismissed');
  }, []);

  const emitFullscreen = useCallback(() => {
    onFullScreenRef.current?.();
    onDragEndRef.current?.('fullscreen');
  }, []);

  const emitContentSettled = useCallback(() => {
    onDragEndRef.current?.('content');
  }, []);

  const emitDrag = useCallback((direction: 'up' | 'down', fraction: number) => {
    onDragRef.current?.(direction, fraction);
  }, []);

  const handleContainerLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerHeight(e.nativeEvent.layout.height);
  }, []);

  useEffect(() => {
    if (!visible) {
      animatedHeight.value = withTiming(
        0,
        { duration: animationDuration },
        (finished) => {
          if (finished) {
            runOnJS(onModalHide)();
          }
        }
      );
    }
  }, [visible, animationDuration, animatedHeight, onModalHide]);

  useEffect(() => {
    if (visible && contentHeight > 0 && maxHeight > 0) {
      const target = Math.min(contentHeight, maxHeight);
      animatedHeight.value = withTiming(
        target,
        { duration: animationDuration },
        (finished) => {
          if (finished && onOpenRef.current) {
            runOnJS(emitOpen)();
          }
        }
      );
    }
  }, [
    visible,
    contentHeight,
    maxHeight,
    animationDuration,
    animatedHeight,
    emitOpen,
  ]);

  const handleContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const measured = Math.min(
        e.nativeEvent.layout.height + bottomInset,
        maxHeightForContent
      );
      if (Math.abs(measured - contentHeightValue.value) < 1) return;

      contentHeightValue.value = measured;
      setContentHeight(measured);
    },
    [bottomInset, contentHeightValue, maxHeightForContent]
  );

  const panGesture = Gesture.Pan()
    .enabled(draggable)
    .minDistance(Layout.panThreshold)
    .onBegin(() => {
      dragStartHeight.value = animatedHeight.value;
    })
    .onUpdate((gesture) => {
      const full = maxHeightValue.value;
      const upwardDelta = enableUpwardDrag
        ? gesture.translationY
        : Math.max(gesture.translationY, 0);
      const nextHeight = Math.max(
        0,
        Math.min(full, dragStartHeight.value - upwardDelta)
      );

      animatedHeight.value = nextHeight;

      const direction = gesture.translationY < 0 ? 'up' : 'down';
      if (direction === 'down' || enableUpwardDrag) {
        runOnJS(emitDrag)(direction, full > 0 ? nextHeight / full : 0);
      }
    })
    .onEnd((gesture) => {
      const full = maxHeightValue.value;
      const content = contentHeightValue.value;
      const current = animatedHeight.value;

      if (
        gesture.translationY > 0 &&
        current < content - dismissThresholdValue.value
      ) {
        animatedHeight.value = withTiming(
          0,
          { duration: Animation.durationFast },
          (finished) => {
            if (finished) {
              runOnJS(emitDismiss)();
            }
          }
        );
        return;
      }

      const midpoint = (content + full) / 2;

      if (current > midpoint) {
        animatedHeight.value = withTiming(
          full,
          { duration: animationDuration, easing: Easing.out(Easing.cubic) },
          (finished) => {
            if (finished) {
              runOnJS(emitFullscreen)();
            }
          }
        );
      } else {
        animatedHeight.value = withTiming(
          content,
          { duration: animationDuration, easing: Easing.out(Easing.cubic) },
          (finished) => {
            if (finished) {
              runOnJS(emitContentSettled)();
            }
          }
        );
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

  const opacity = useDerivedValue(() =>
    interpolate(
      animatedHeight.value,
      [0, contentHeightValue.value || 1],
      [0, backdropOpacity],
      Extrapolation.CLAMP
    )
  );

  const sheetAnimatedStyle = useAnimatedStyle(() => {
    const clampMax = maxHeightValue.value > 0 ? maxHeightValue.value : 1;
    const borderRadius = interpolate(
      animatedHeight.value,
      [clampMax - 30, clampMax],
      [Layout.radiusLarge, 0],
      Extrapolation.CLAMP
    );

    return {
      height: animatedHeight.value,
      maxHeight: maxHeightValue.value > 0 ? maxHeightValue.value : undefined,
      paddingBottom: bottomInset,
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
    };
  }, [bottomInset]);

  return (
    <View style={StyleSheet.absoluteFill} onLayout={handleContainerLayout}>
      <Backdrop
        opacity={opacity}
        onPress={handleBackdropPress}
        color={backdropColor}
        style={backdropStyle}
      />

      <View
        style={[
          commonStyles.absoluteAnchorBottom,
          { top: topInset, overflow: 'hidden' },
        ]}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[styles.sheet, { backgroundColor }, style, sheetAnimatedStyle]}
        >
          {showHandle && (
            <GestureDetector gesture={panGesture}>
              <View style={[styles.handleContainer, handleContainerStyle]}>
                <View
                  style={[
                    styles.handle,
                    { backgroundColor: handleColor },
                    handleStyle,
                  ]}
                />
              </View>
            </GestureDetector>
          )}

          <View style={[styles.content, contentContainerStyle]}>
            {children}
          </View>
        </Animated.View>
      </View>

      <View
        style={styles.measurer}
        onLayout={handleContentLayout}
        pointerEvents="none"
      >
        {showHandle && (
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
        )}
        {children}
      </View>
    </View>
  );
};
