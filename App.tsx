/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { RecoilRoot } from 'recoil';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  // Logic

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }

    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
  }, []);

  // Views
  return (
    <RecoilRoot>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default App;
