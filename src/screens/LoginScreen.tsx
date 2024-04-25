import { firebase } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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

const LoginScreen = () => {
  // Logic
  const navigation =
    useNavigation<NativeStackNavigationProp<ROOT_NAVIGATION>>();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [visible, setVisible] = useState(true);

  const inputRef = useRef(null);

  const handleEmailSubmit = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const Login = (email: string, pwd: string) => {
    if (!email || !pwd) {
      Alert.alert('값을 입력해주세요');
    } else {
      return firebase
        .auth()
        .signInWithEmailAndPassword(email, pwd)
        .then(result => {
          console.log(
            'Login: ',
            result.user.email,
            result.user.displayName,
            result.user.uid,
          );
          setEmail('');
          setPwd('');
          navigation.navigate('Main', {
            uid: result.user.uid,
            nickname: result.user.displayName,
          });
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  };

  // Views
  return (
    // 전체 레이아
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
              placeholder="이메일"
              onChangeText={text => setEmail(text)}
              value={email}
              onSubmitEditing={handleEmailSubmit}
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
              onChangeText={text => setPwd(text)}
              value={pwd}
              ref={inputRef}
              secureTextEntry={visible}
              onSubmitEditing={() => () => Login(email, pwd)}
              returnKeyType="done"
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
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 30,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: 60,
              backgroundColor: '#2978f4',
              borderRadius: 15,
              marginBottom: 10,
            }}>
            <TouchableOpacity onPress={() => Login(email, pwd)}>
              <Text style={{color: 'white', fontSize: 20}}>로그인</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 회원가입 버튼 레이아웃 */}
        <View style={{display: 'flex', alignSelf: 'flex-end', marginTop: 10}}>
          <TouchableOpacity
            // style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}>
            <Text>회원가입</Text>
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
