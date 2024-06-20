import { firebase } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RegisterScreen = () => {
  // Logic
  const navigation =
    useNavigation<NativeStackNavigationProp<ROOT_NAVIGATION>>();

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(true);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleEmailSubmit = () => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  };

  const Register = (nickname: string, email: string, password: string) => {
    if (!nickname || !email || !password) {
      Alert.alert('값을 입력해주세요');
    } else {
      return firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(result => {
          const {uid} = result.user;
          firebase.auth().currentUser?.updateProfile({displayName: nickname});
          database().ref('users/').child(uid).set({
            date_created: moment().utc().format(),
            nickname,
            email,
          });
          setNickname('');
          setEmail('');
          setPassword('');
          navigation.navigate('Login');
          console.group('----- Register Group -----');
          console.log('Register: ', result.user);
          console.groupEnd()
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  };

  // Views
  return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          paddingHorizontal: 30,
        }}
        resetScrollToCoords={{x: 0, y: 0}}
        scrollEnabled={false}
        extraHeight={300} // 키보드가 활성화 됐을 때 추가적으로 더 보여질 높이
        enableOnAndroid={true} // 안드로이드에서도 동일하게 작동하도록 설정
        keyboardShouldPersistTaps="handled">
        {/* 텍스트 인풋 레이아웃 */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginBottom: 30,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: 60,
              borderRadius: 15,
              padding: 15,
              backgroundColor: '#e5e5e5',
              marginBottom: 7.5,
            }}>
            <TextInput
              placeholder="닉네임"
              onChangeText={text => setNickname(text)}
              value={nickname}
              onSubmitEditing={handleEmailSubmit}
              returnKeyType="next"
              style={{flex: 1, paddingVertical: 0}}
            />
            <TouchableOpacity onPress={() => setNickname('')}>
              <Image
                source={require('../images/closecircle.png')}
                style={{width: 24, height: 24, marginLeft: 10}}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: 60,
              borderRadius: 15,
              padding: 15,
              backgroundColor: '#e5e5e5',
              marginTop: 7.5,
              marginBottom: 7.5,
            }}>
            <TextInput
              placeholder="이메일"
              onChangeText={text => setEmail(text)}
              value={email}
              ref={emailRef}
              onSubmitEditing={handlePasswordSubmit}
              returnKeyType="next"
              style={{flex: 1, paddingVertical: 0}}
            />
            <TouchableOpacity onPress={() => setEmail('')}>
              <Image
                source={require('../images/closecircle.png')}
                style={{width: 24, height: 24, marginLeft: 10}}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: 60,
              borderRadius: 15,
              padding: 15,
              backgroundColor: '#e5e5e5',
              marginTop: 7.5,
            }}>
            <TextInput
              placeholder="비밀번호"
              onChangeText={text => setPassword(text)}
              value={password}
              ref={passwordRef}
              secureTextEntry={visible}
              onSubmitEditing={() => Register(nickname, email, password)}
              style={{flex: 1, paddingVertical: 0}}
            />
            {visible ? (
              <TouchableOpacity onPress={() => setVisible(!visible)}>
                <Image
                  source={require('../images/visible.png')}
                  style={{width: 24, height: 24, marginLeft: 10}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setVisible(!visible)}>
                <Image
                  source={require('../images/invisible.png')}
                  style={{width: 24, height: 24, marginLeft: 10}}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 버튼 레이아웃 */}
        <View
          style={{
            width: '100%',
            height: 60,
            backgroundColor: '#2978f4',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 15,
            marginTop: 30,
          }}>
          <TouchableOpacity onPress={() => Register(nickname, email, password)}>
            <Text style={{color: 'white', fontSize: 16}}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
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
