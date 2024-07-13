import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Stacks from './Stacks';

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stacks />
    </NavigationContainer>
  );
};

export default AppNavigator;
