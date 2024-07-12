import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SearchPasswordScreen from '../screens/SearchPasswordScreen';
import Tabs from './Tabs';

const Stack = createNativeStackNavigator<ROOT_NAVIGATION>();

const Stacks = () => {
  return (
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
        }}
      />
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{headerShown: false, gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
};

export default Stacks;
