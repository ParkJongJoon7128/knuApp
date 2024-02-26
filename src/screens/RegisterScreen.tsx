import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Register } from '../services/auth';

const RegisterScreen = () => {
  // Logic
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Views
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View>
        <TextInput
          onChangeText={e => setName(e)}
          value={name}
          placeholder="Name"
          style={{borderWidth: 1, height: 40, padding: 10, margin: 10}}
        />
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
          onPress={() => Register(name, email, password, navigation)}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
