/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { RecoilRoot } from 'recoil';
import CreateReviewScreen from './src/screens/CreateReviewScreen';
import LoginScreen from './src/screens/LoginScreen';
import MainScreen from './src/screens/MainScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ReadReviewScreen from './src/screens/ReadReviewScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SearchPasswordScreen from './src/screens/SearchPasswordScreen';

const Stack = createStackNavigator();

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
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="SearchPwd"
            component={SearchPasswordScreen}
            options={{
              headerTitle: '비밀번호 찾기',
              headerBackTitleVisible: false,
              // headerTintColor: 'black',
            }}
          />

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="CreateReview"
            component={CreateReviewScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="ReadReview"
            component={ReadReviewScreen}
            options={{title: '리뷰관리'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default App;
