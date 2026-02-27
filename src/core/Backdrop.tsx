import {
  Animated,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Colors } from './constants';

interface Props {
  opacity: Animated.AnimatedInterpolation<string | number>;
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
  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: color },
        style,
        { opacity },
      ]}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onPress} />
    </Animated.View>
  );
};
