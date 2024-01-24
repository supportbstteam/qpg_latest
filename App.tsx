import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import store from './src/Reducer/rootReducer';
import Toast from 'react-native-toast-message';
import { toastConfig } from './toastConfig';

function App(): JSX.Element {
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Code to be executed after the timeout
      SplashScreen.hide();
    }, 2000);
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
      <Toast config={toastConfig} />
    </Provider>
  );
}

export default App;
