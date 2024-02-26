import { firebase } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const RegisterScreen = () => {
  // Logic
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const Register = (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      Alert.alert('값을 입력해주세요');
    } else {
      return firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(result => {
          const {uid} = result.user;
          firebase.auth().currentUser?.updateProfile({
            displayName: name,
          });
          console.log(
            result.user.email,
            result.user.displayName,
            result.user.uid,
          );
          setName('');
          setEmail('');
          setPassword('');
          navigation.navigate('Login');
          return uid;
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  };

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
          onPress={() => Register(name, email, password)}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
