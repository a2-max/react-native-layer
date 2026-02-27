import { registerRootComponent } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-layer';

import App from './src/App';

function Root() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(Root);
