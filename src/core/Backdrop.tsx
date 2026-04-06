import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Colors } from './constants';

interface Props {
  opacity: SharedValue<number>;
  onPress: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const Backdrop = ({
  opacity,
  onPress,
  color = Colors.black,
  style,
}: Props) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: color },
        style,
        animatedStyle,
      ]}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onPress} />
    </Animated.View>
  );
};
