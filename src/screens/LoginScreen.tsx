import { firebase } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const LoginScreen = () => {
  // Logic
  const navigation = useNavigation<ROOT_NAVIGATION>();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const inputRef = useRef(null);

  const handleEmailSubmit = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const Login = (email: string, password: string) => {
    if (!email || !password) {
      Alert.alert('값을 입력해주세요');
    } else {
      return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(result => {
          console.log(
            'Login: ',
            result.user.email,
            result.user.displayName,
            result.user.uid,
          );
          setEmail('');
          setPassword('');
          navigation.navigate('Main', {uid: result.user.uid});
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
          <Text style={styles.logo}>Login</Text>
        </View>

        <View style={styles.textinput_wrapper}>
          <TextInput
            onChangeText={e => setEmail(e)}
            value={email}
            placeholder="Email"
            style={styles.textinput}
            onSubmitEditing={handleEmailSubmit}
            returnKeyType="next"
          />
        </View>
        <View style={styles.textinput_wrapper}>
          <TextInput
            onChangeText={e => setPassword(e)}
            value={password}
            placeholder="PassWord"
            secureTextEntry={true}
            style={styles.textinput}
            onSubmitEditing={() => Login(email, password)}
            ref={inputRef}
            returnKeyType="done"
          />
        </View>

        <View style={styles.login_button_wrapper}>
          <TouchableOpacity
            style={styles.login_button}
            onPress={() => Login(email, password)}>
            <Text style={styles.login_button_text}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.register_button_wrapper}>
          <TouchableOpacity
            style={styles.register_button}
            onPress={() => navigation.navigate('Register')}>
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
  login_button_wrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#11998e',
  },
  login_button: {
    padding: 10,
    margin: 5,
  },
  login_button_text: {
    color: '#fff',
  },
  register_button_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  register_button: {
    margin: 10,
  },
  register_button_text: {
    color: '#11998e',
  },
});

export default LoginScreen;
