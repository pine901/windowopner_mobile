/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Platform, UIManager} from 'react-native';
import {NativeBaseProvider, StatusBar} from 'native-base';
import Route from '@/Route';
import StoreProvider from '@/mst/StoreProvider';

import DropdownAlert from '@/components/DropDownAlert';
import LoadingHud from '@/components/hud';
import theme from '@/styles/theme/NativeBase';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

console.disableYellowBox = true;

const App: () => React$Node = () => {
  return (
    <StoreProvider>
      {/* This already has SafeAreaProvider */}
      <NativeBaseProvider theme={theme}>
        <StatusBar barStyle={'dark-content'}/>
        <Route />
        <LoadingHud />
        <DropdownAlert />
      </NativeBaseProvider>
    </StoreProvider>
  );
};

export default App;
