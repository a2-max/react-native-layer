import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

/** Circled checkmark — used for "success" alerts. */
export const SuccessIcon = ({ size = 24, color = '#16A34A' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
    <Path
      d="M3.4375 5.3125L4.375 6.25L6.5625 4.0625"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 8.75C7.07107 8.75 8.75 7.07107 8.75 5C8.75 2.92893 7.07107 1.25 5 1.25C2.92893 1.25 1.25 2.92893 1.25 5C1.25 7.07107 2.92893 8.75 5 8.75Z"
      stroke={color}
      strokeWidth="1.16667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Circled X — used for "error" alerts. */
export const ErrorIcon = ({ size = 24, color = '#DC2626' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
    <Path
      d="M6.25 3.75L3.75 6.25"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.75 3.75L6.25 6.25"
      stroke={color}
      strokeWidth="1.16667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 8.75C7.07107 8.75 8.75 7.07107 8.75 5C8.75 2.92893 7.07107 1.25 5 1.25C2.92893 1.25 1.25 2.92893 1.25 5C1.25 7.07107 2.92893 8.75 5 8.75Z"
      stroke={color}
      strokeWidth="1.16667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Circled exclamation — used for "warning" alerts. */
export const WarningIcon = ({ size = 24, color = '#D97706' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 10.625V6.25"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="10" cy="13.4375" r="0.78125" fill={color} />
  </Svg>
);

/** Circled question mark — used for "question" alerts. */
export const QuestionIcon = ({ size = 24, color = '#2563EB' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Circle
      cx="10"
      cy="14.0625"
      r="0.71875"
      fill={color}
      stroke={color}
      strokeWidth="0.125"
    />
    <Path
      d="M10 11.25V10.625C11.3805 10.625 12.5 9.64531 12.5 8.4375C12.5 7.22969 11.3805 6.25 10 6.25C8.61953 6.25 7.5 7.22969 7.5 8.4375V8.75"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
