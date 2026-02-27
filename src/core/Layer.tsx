import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    BackHandler,
    Keyboard,
    Modal,
    StyleSheet,
    View,
} from 'react-native';
import { Backdrop } from './Backdrop';
import { Animation, Colors, SCREEN_HEIGHT } from './constants';
import { layerStyles } from './styles';
import type { LayerProps } from '../types/layer';

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
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            Keyboard.dismiss();
            setModalVisible(true);
            Animated.timing(translateY, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) onOpen?.();
            });
        } else {
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT,
                duration: animationDuration,
                useNativeDriver: true,
            }).start(({ finished }) => {
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
        outputRange: [backdropOpacity, 0],
    });

    return (
        <Modal
            transparent
            visible={modalVisible}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={StyleSheet.absoluteFill}>
                <Backdrop
                    opacity={opacity}
                    onPress={handleBackdropPress}
                    color={backdropColor}
                    style={backdropStyle}
                />

                <Animated.View
                    style={[
                        layerStyles.container,
                        { transform: [{ translateY }] },
                    ]}
                >
                    {children}
                </Animated.View>
            </View>
        </Modal>
    );
};