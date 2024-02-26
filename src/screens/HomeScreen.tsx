import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

const HomeScreen = () => {
  // Logic
  const navigation = useNavigation();

  // Views
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
