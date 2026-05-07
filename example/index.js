import { registerRootComponent } from 'expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@whoisrijan/react-native-layer';

import App from './src/App';

const flexStyle = { flex: 1 };

function Root() {
  return (
    <GestureHandlerRootView style={flexStyle}>
      <SafeAreaProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(Root);
