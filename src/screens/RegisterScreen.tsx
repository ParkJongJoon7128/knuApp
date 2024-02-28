import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
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

  const userCollection = firestore().collection('users');

  const Register = (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      Alert.alert('값을 입력해주세요');
    } else {
      return firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(result => {
          const {uid} = result.user;
          firebase.auth().currentUser?.updateProfile({displayName: name});
          userCollection.doc(uid).set({uid, name, email});
          setName('');
          setEmail('');
          setPassword('');
          navigation.navigate('Login');
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  };

  // Views
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.logo_wrapper}>
          <Text style={styles.logo}>Register</Text>
        </View>

        <View style={styles.textinput_wrapper}>
          <TextInput
            onChangeText={e => setName(e)}
            value={name}
            placeholder="Name"
            style={styles.textinput}
          />
        </View>

        <View style={styles.textinput_wrapper}>
          <TextInput
            onChangeText={e => setEmail(e)}
            value={email}
            placeholder="Email"
            style={styles.textinput}
          />
        </View>

        <View style={styles.textinput_wrapper}>
          <TextInput
            onChangeText={e => setPassword(e)}
            value={password}
            placeholder="PassWord"
            secureTextEntry={true}
            style={styles.textinput}
          />
        </View>

        <View style={styles.register_button_wrapper}>
          <TouchableOpacity
            onPress={() => Register(name, email, password)}
            style={styles.register_button}>
            <Text style={styles.register_button_text}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logo_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logo: {
    fontSize: 25,
    marginBottom: 15,
  },
  textinput_wrapper: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  textinput: {
    margin: 0,
    padding: 0,
  },
  register_button_wrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#11998e',
  },
  register_button: {
    padding: 10,
    margin: 5,
  },
  register_button_text: {
    color: '#fff',
  },
});

export default RegisterScreen;
