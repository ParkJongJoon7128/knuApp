import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Login } from '../services/auth';

const LoginScreen = () => {
  // Logic
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Views
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View>
        <TextInput
          onChangeText={e => setEmail(e)}
          value={email}
          placeholder="Email"
          style={{borderWidth: 1, height: 40, padding: 10, margin: 10}}
        />
        <TextInput
          onChangeText={e => setPassword(e)}
          value={password}
          placeholder="PassWord"
          style={{borderWidth: 1, height: 40, padding: 10, margin: 10}}
        />

        <TouchableOpacity
          style={{padding: 10, margin: 10}}
          onPress={() => Login(email, password, navigation)}>
          <Text>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{padding: 10, margin: 5}}
          onPress={() => navigation.navigate('Register')}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
