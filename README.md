# react-native-layer (Expo and react-native-cli)

A lightweight, zero-dependency\* overlay system for React Native — bottom sheets, confirm modals, alerts, toasts, and composable layers with smooth animations, drag gestures, and full safe-area support.

\*Only requires `react-native-safe-area-context` and `react-native-svg` as peer dependencies.

---

## Features

- 📱 **BottomSheet** — content-fitted, draggable to full-screen, auto safe-area handling
- ✅ **ConfirmModal** — alert-style dialog with optional guarded text input confirmation
- 🔔 **Alert** — alert box with semantic types (`success`, `error`, `warning`, `question`), auto icons, center or bottom position
- 🍞 **Toast** — message toast on top of everything and on multiple locations (top, bottom, center) along with custom style controlled
- 🧱 **Layer** — low-level slide-up overlay to build your own custom sheets
- 🎨 Fully themeable — color props for quick styling, full style overrides for everything
- 📐 Auto safe-area insets — respects notch / Dynamic Island / home indicator automatically
- 🤏 Drag gestures with lifecycle events (`onDrag`, `onDragEnd`, `onFullScreen`)
- 🔙 Android back button handled automatically
- 🪶 Tiny footprint — no native code, pure JS/React

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Components](#components)
  - [BottomSheet](#bottomsheet)
  - [ConfirmModal](#confirmmodal)
  - [Alert](#alert)
  - [Toast](#toast-via-toastprovider--usetoast)
  - [Layer](#layer)
- [Hooks](#hooks)
- [Types](#types)
- [Full Example](#full-example)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```sh
npm install react-native-layer react-native-safe-area-context react-native-svg
```

or

```sh
yarn add react-native-layer react-native-safe-area-context react-native-svg
```

### iOS

```sh
cd ios && pod install
```

> **Expo users:** Both `react-native-safe-area-context` and `react-native-svg` are included in the default Expo SDK — no extra setup needed.

### Setup

Wrap your app root with `SafeAreaProvider` and (optionally) `ToastProvider`:

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-layer';

export default function Root() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </SafeAreaProvider>
  );
}
```

> `ToastProvider` is only required if you use toasts. All other components work without it.

---

## Quick Start

```tsx
import { useState } from 'react';
import { Text, Pressable, View } from 'react-native';
import { BottomSheet } from 'react-native-layer';

export default function App() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Pressable onPress={() => setVisible(true)}>
        <Text>Open Sheet</Text>
      </Pressable>

      <BottomSheet visible={visible} onClose={() => setVisible(false)}>
        <Text>Hello from the bottom sheet!</Text>
      </BottomSheet>
    </View>
  );
}
```

That's it — you're up and running. Read on for every component.

---

## Components

### `BottomSheet`

A draggable bottom sheet that auto-fits to its content height. Drag up to expand to full screen, drag down to dismiss. Automatically respects device safe areas (notch, home indicator).

#### Basic

```tsx
<BottomSheet visible={visible} onClose={() => setVisible(false)}>
  <Text>Sheet content</Text>
</BottomSheet>
```

#### With Drag Events

```tsx
<BottomSheet
  visible={visible}
  onClose={() => setVisible(false)}
  onOpen={() => console.log('Opened')}
  onDrag={(direction, fraction) =>
    console.log(`Dragging ${direction} · ${Math.round(fraction * 100)}%`)
  }
  onDragEnd={(settled) => console.log('Settled:', settled)}
  onFullScreen={() => console.log('Full screen!')}
>
  <Text>Drag me up or down</Text>
</BottomSheet>
```

#### Themed

```tsx
<BottomSheet
  visible={visible}
  onClose={() => setVisible(false)}
  backgroundColor="#1E1B4B"
  handleColor="#A78BFA"
  backdropOpacity={0.7}
  contentContainerStyle={{ paddingHorizontal: 20 }}
>
  <Text style={{ color: '#E0E7FF' }}>Dark themed sheet</Text>
</BottomSheet>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | — | Whether the sheet is visible. **Required.** |
| `onClose` | `() => void` | — | Called when the sheet requests to close. **Required.** |
| `onOpen` | `() => void` | — | Called after the open animation finishes. |
| `children` | `ReactNode` | — | Content rendered inside the sheet. **Required.** |
| `draggable` | `boolean` | `true` | Enable/disable drag gestures. |
| `showHandle` | `boolean` | `true` | Show/hide the drag handle bar. |
| `topInset` | `number` | auto | Top safe-area inset (px). Auto-detected from device. |
| `bottomInset` | `number` | auto | Bottom safe-area inset (px). Auto-detected from device. |
| `dismissThreshold` | `number` | `120` | Pixels user must drag down to dismiss. |
| `animationDuration` | `number` | `250` | Open/close animation duration in ms. |
| `backdropOpacity` | `number` | `0.5` | Maximum backdrop opacity. |
| `backdropColor` | `string` | `"#000"` | Backdrop overlay color. |
| `disableBackdropClose` | `boolean` | `false` | Prevent closing by tapping backdrop. |
| `backgroundColor` | `string` | `"#fff"` | Sheet background color. |
| `handleColor` | `string` | `"#D1D5DB"` | Drag handle bar color. |
| `onDrag` | `(direction, fraction) => void` | — | Called continuously while dragging. `direction` is `"up"` or `"down"`, `fraction` is `0`–`1`. |
| `onDragEnd` | `(settled) => void` | — | Called when drag ends. `settled` is `"content"`, `"fullscreen"`, or `"dismissed"`. |
| `onFullScreen` | `() => void` | — | Called when sheet reaches full screen. |
| `style` | `ViewStyle` | — | Sheet container style override. |
| `handleStyle` | `ViewStyle` | — | Handle bar style override. |
| `handleContainerStyle` | `ViewStyle` | — | Handle bar wrapper style override. |
| `contentContainerStyle` | `ViewStyle` | — | Content wrapper style override. |
| `backdropStyle` | `ViewStyle` | — | Backdrop style override. |

---

### `ConfirmModal`

A centered alert-style dialog with confirm/cancel buttons. Supports an optional guarded input — the user must type an exact string to enable the confirm button.

#### Basic

```tsx
<ConfirmModal
  visible={visible}
  title="Delete Item"
  message="Are you sure? This cannot be undone."
  positiveText="Delete"
  positiveButtonColor="#DC2626"
  negativeText="Cancel"
  onCancel={() => setVisible(false)}
  onConfirm={() => {
    console.log('Deleted!');
    setVisible(false);
  }}
/>
```

#### Guarded Input Confirmation

Require the user to type an exact string before the confirm button becomes active:

```tsx
<ConfirmModal
  visible={visible}
  title="Delete Account"
  showInput
  inputLabel='Type "DELETE" to confirm'
  inputPlaceholder="DELETE"
  validationText="DELETE"
  positiveText="Delete Forever"
  positiveButtonColor="#DC2626"
  negativeText="Cancel"
  onCancel={() => setVisible(false)}
  onConfirm={(value) => {
    console.log('Confirmed with:', value);
    setVisible(false);
  }}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | — | Whether the modal is visible. **Required.** |
| `title` | `string` | — | Title text. **Required.** |
| `message` | `string` | — | Message body. Ignored when `showInput` is `true`. |
| `onConfirm` | `(value?: string) => void` | — | Called on confirm. Receives input value when `showInput` is `true`. **Required.** |
| `onCancel` | `() => void` | — | Called on cancel, backdrop tap, or back button. **Required.** |
| `onOpen` | `() => void` | — | Called after open animation finishes. |
| `showInput` | `boolean` | `false` | Show a text input for guarded confirmation. |
| `inputLabel` | `string` | — | Label above the text input. |
| `inputPlaceholder` | `string` | — | Input placeholder text. |
| `validationText` | `string` | — | Exact string user must type to enable confirm. |
| `positiveText` | `string` | `"Confirm"` | Confirm button label. |
| `negativeText` | `string` | `"Cancel"` | Cancel button label. |
| `disableBackdropClose` | `boolean` | `false` | Prevent closing by tapping backdrop. |
| `animationDuration` | `number` | `200` | Animation duration in ms. |
| `backdropColor` | `string` | `"rgba(0,0,0,0.4)"` | Backdrop overlay color. |
| `cardBackgroundColor` | `string` | `"#fff"` | Card background color. |
| `titleColor` | `string` | `"#111827"` | Title text color. |
| `messageColor` | `string` | `"#6B7280"` | Message text color. |
| `positiveButtonColor` | `string` | `"#111827"` | Confirm button background color. |
| `positiveTextColor` | `string` | `"#fff"` | Confirm button text color. |
| `negativeButtonColor` | `string` | `"#F3F4F6"` | Cancel button background color. |
| `negativeTextColor` | `string` | `"#374151"` | Cancel button text color. |
| `backdropStyle` | `ViewStyle` | — | Backdrop style override. |
| `cardStyle` | `ViewStyle` | — | Card container style override. |
| `titleStyle` | `TextStyle` | — | Title text style override. |
| `messageStyle` | `TextStyle` | — | Message text style override. |
| `labelStyle` | `TextStyle` | — | Input label style override. |
| `inputStyle` | `ViewStyle` | — | Text input style override. |
| `buttonsContainerStyle` | `ViewStyle` | — | Buttons row style override. |
| `positiveButtonStyle` | `ViewStyle` | — | Confirm button style override. |
| `negativeButtonStyle` | `ViewStyle` | — | Cancel button style override. |
| `positiveStyle` | `TextStyle` | — | Confirm button text style override. |
| `negativeStyle` | `TextStyle` | — | Cancel button text style override. |

---

### `Alert`

A simple alert box with a single dismiss button. Supports two positions — **center** (scale-in card) and **bottom** (slide-up sheet). Optionally pass a semantic `type` to automatically show an icon and set accent colors.

#### Basic Center Alert

```tsx
<Alert
  visible={visible}
  title="Update Available"
  message="A new version is available. Please update."
  onClose={() => setVisible(false)}
/>
```

#### With Semantic Type (Icon)

Pass `type` to get an auto-colored icon — no extra imports needed:

```tsx
{/* Success — green checkmark icon */}
<Alert
  visible={visible}
  title="Payment Successful"
  message="Your transaction has been completed."
  type="success"
  onClose={() => setVisible(false)}
/>

{/* Error — red X icon */}
<Alert
  visible={visible}
  title="Something Went Wrong"
  message="Please try again later."
  type="error"
  onClose={() => setVisible(false)}
/>

{/* Warning — amber exclamation icon */}
<Alert
  visible={visible}
  title="Low Storage"
  message="Your device is running low on storage."
  type="warning"
  onClose={() => setVisible(false)}
/>

{/* Question — blue question mark icon */}
<Alert
  visible={visible}
  title="Are You Sure?"
  message="This will reset all your preferences."
  type="question"
  onClose={() => setVisible(false)}
/>
```

When `type` is set:
- An SVG icon is rendered automatically above the title (powered by `react-native-svg`)
- The button color defaults to the type's accent color (green / red / amber / blue)
- You can still override `buttonColor` to use your own color

#### Bottom Alert with Custom Colors

```tsx
<Alert
  visible={visible}
  title="Connection Lost"
  message="You are offline. Check your internet connection."
  buttonText="Dismiss"
  position="bottom"
  type="error"
  backgroundColor="#FEF2F2"
  titleColor="#991B1B"
  messageColor="#B91C1C"
  buttonColor="#DC2626"
  buttonTextColor="#fff"
  onClose={() => setVisible(false)}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | — | Whether the alert is visible. **Required.** |
| `title` | `string` | — | Title text. **Required.** |
| `message` | `string` | — | Optional message body. |
| `buttonText` | `string` | `"OK"` | Button label. |
| `onClose` | `() => void` | — | Called on button press, backdrop tap, or back button. **Required.** |
| `onOpen` | `() => void` | — | Called after open animation finishes. |
| `position` | `"center" \| "bottom"` | `"center"` | Where to display the alert. |
| `type` | `"success" \| "error" \| "warning" \| "question"` | — | Semantic type. Adds an icon and sets default button accent color. |
| `iconSize` | `number` | `24` | Size of the type icon in px. Only used when `type` is set. |
| `animationDuration` | `number` | `200` | Animation duration in ms. |
| `backdropColor` | `string` | `"rgba(0,0,0,0.4)"` | Backdrop overlay color. |
| `backgroundColor` | `string` | `"#fff"` | Card / sheet background color. |
| `titleColor` | `string` | `"#111827"` | Title text color. |
| `messageColor` | `string` | `"#6B7280"` | Message text color. |
| `buttonColor` | `string` | type accent or `"#111827"` | Button background color. Auto-set by `type` if not provided. |
| `buttonTextColor` | `string` | `"#fff"` | Button text color. |

**Type → Accent Color Map:**

| `type` | Icon | Default `buttonColor` |
|--------|------|-----------------------|
| `success` | Circled checkmark | `#16A34A` (green) |
| `error` | Circled X | `#DC2626` (red) |
| `warning` | Circled exclamation | `#D97706` (amber) |
| `question` | Circled question mark | `#2563EB` (blue) |

---

### `Toast` (via `ToastProvider` + `useToast`)

A message toast that renders on the **very top of everything** in the app — no modal or overlay can cover it. Supports multiple positions, auto-dismiss with configurable timeout, and text truncation with ellipsis.

#### 1. Wrap with `ToastProvider`

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-layer';

function Root() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </SafeAreaProvider>
  );
}
```

#### 2. Show Toasts from Anywhere

```tsx
import { useToast } from 'react-native-layer';

function MyScreen() {
  const { showToast } = useToast();

  return (
    <Pressable
      onPress={() =>
        showToast({
          message: 'Item saved!',
          position: 'bottom',
          duration: 3000,
        })
      }
    >
      <Text>Save</Text>
    </Pressable>
  );
}
```

#### Themed Toast

```tsx
showToast({
  message: 'Success!',
  position: 'bottom',
  backgroundColor: '#16A34A',
  textColor: '#fff',
  duration: 2000,
});
```

#### Positions

```tsx
showToast({ message: 'Top!', position: 'top' });
showToast({ message: 'Center!', position: 'center' });
showToast({ message: 'Bottom!', position: 'bottom' }); // default
```

> **Note:** Messages longer than 2 lines are automatically truncated with an ellipsis.

#### ToastConfig (passed to `showToast`)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `message` | `string` | — | The message to display. **Required.** Max 2 lines (truncated with ellipsis). |
| `position` | `"top" \| "center" \| "bottom"` | `"bottom"` | Where to show the toast. |
| `duration` | `number` | `3000` | How long to show the toast in ms. |
| `backgroundColor` | `string` | `"#111827"` | Toast pill background color. |
| `textColor` | `string` | `"#fff"` | Toast text color. |

---

### `Layer`

A low-level slide-up overlay primitive. Use this to build your own custom overlays — it handles the modal, backdrop, slide animation, and back button for you.

```tsx
import { Layer } from 'react-native-layer';

<Layer visible={visible} onClose={() => setVisible(false)}>
  <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <Text>Build anything here</Text>
  </View>
</Layer>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | — | Whether the layer is visible. **Required.** |
| `onClose` | `() => void` | — | Called when the layer requests to close. **Required.** |
| `onOpen` | `() => void` | — | Called after open animation finishes. |
| `children` | `ReactNode` | — | Content to render inside the layer. **Required.** |
| `disableBackdropClose` | `boolean` | `false` | Prevent closing by tapping backdrop. |
| `animationDuration` | `number` | `250` | Slide animation duration in ms. |
| `backdropOpacity` | `number` | `0.5` | Maximum backdrop opacity. |
| `backdropColor` | `string` | `"#000"` | Backdrop overlay color. |
| `backdropStyle` | `ViewStyle` | — | Backdrop style override. |

---

## Hooks

### `useInsets`

Returns the device safe-area insets. A thin wrapper around `useSafeAreaInsets` from `react-native-safe-area-context`.

```tsx
import { useInsets } from 'react-native-layer';

function MyComponent() {
  const insets = useInsets();
  // insets.top, insets.bottom, insets.left, insets.right
}
```

> `BottomSheet` uses this internally — you don't need to call it yourself unless building custom overlays.

### `useToast`

Returns `{ showToast }` to trigger toasts from anywhere. Must be used inside `<ToastProvider>`.

```tsx
import { useToast } from 'react-native-layer';

const { showToast } = useToast();
showToast({ message: 'Hello!' });
```

---

## Types

All types are exported for TypeScript users:

```tsx
import type {
  BottomSheetProps,
  ConfirmModalProps,
  AlertProps,
  AlertPosition,     // 'center' | 'bottom'
  AlertType,         // 'success' | 'error' | 'warning' | 'question'
  ToastConfig,
  ToastContextValue,
  ToastPosition,     // 'top' | 'center' | 'bottom'
  LayerProps,
  DragDirection,     // 'up' | 'down'
  Insets,            // { top, bottom, left, right }
} from 'react-native-layer';
```

---

## Theming Cheat Sheet

Every component supports two levels of customization:

1. **Color props** — quick one-liner color changes (e.g. `backgroundColor`, `titleColor`, `buttonColor`)
2. **Style overrides** — full `ViewStyle` / `TextStyle` objects for pixel-perfect control (e.g. `cardStyle`, `titleStyle`)

```tsx
{/* Quick theming with color props */}
<BottomSheet
  visible={visible}
  onClose={close}
  backgroundColor="#1E1B4B"
  handleColor="#A78BFA"
  backdropOpacity={0.7}
>
  {content}
</BottomSheet>

{/* Full control with style overrides */}
<ConfirmModal
  visible={visible}
  title="Custom"
  onConfirm={confirm}
  onCancel={cancel}
  cardStyle={{ borderRadius: 24, padding: 32 }}
  titleStyle={{ fontSize: 22, fontWeight: '800' }}
  positiveButtonStyle={{ borderRadius: 20 }}
/>
```

---

## Full Example

See [`example/src/App.tsx`](example/src/App.tsx) for a complete working example showcasing every component.

---

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
