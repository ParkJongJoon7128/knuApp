import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { LogOut } from '../services/auth';

const MainScreen = () => {
  // Logic
  const navigation = useNavigation();

  // Views
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View>
        <Text>MainScreen</Text>

        <TouchableOpacity
          style={{padding: 10, margin: 10}}
          onPress={() => LogOut(navigation)}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;
