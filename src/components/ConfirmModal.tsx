import { useEffect, useRef, useState } from 'react';
import {
    Animated,
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
import { Animation, Colors } from '../core/constants';
import { commonStyles, confirmModalStyles as styles } from '../core/styles';
import type { ConfirmModalProps } from '../types/confirmModal';

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
    negativeButtonStyle,
}: ConfirmModalProps) => {
    const [value, setValue] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(Animation.scaleInitial)).current;

    useEffect(() => {
        if (visible) {
            setModalVisible(true);
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
                Animated.spring(scale, {
                    toValue: 1,
                    useNativeDriver: true,
                    bounciness: Animation.bounciness,
                }),
            ]).start(({ finished }) => {
                if (finished) onOpen?.();
            });
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
            }).start(({ finished }) => {
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
                            { opacity },
                        ]}
                    >
                        <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
                    </Animated.View>

                    {/* Card */}
                    <Animated.View
                        style={[
                            styles.card,
                            { backgroundColor: cardBackgroundColor },
                            cardStyle,
                            { opacity, transform: [{ scale }] },
                        ]}
                    >
                        <Text style={[styles.title, { color: titleColor }, !showInput && { textAlign: 'center' }, titleStyle]}>
                            {title}
                        </Text>

                        {!showInput && message ? (
                            <Text style={[styles.message, { color: messageColor }, messageStyle]}>
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
                                <Text style={[styles.cancelText, { color: negativeTextColor }, negativeStyle]}>
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
                                <Text style={[styles.confirmText, { color: positiveTextColor }, positiveStyle]}>
                                    {positiveText}
                                </Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};