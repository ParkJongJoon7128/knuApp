import { firebase } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SearchPasswordScreen = () => {
  // Logics
  const navigation =
    useNavigation<NativeStackNavigationProp<ROOT_NAVIGATION>>();

  const [email, setEmail] = useState('');

  const inputRef = useRef(null);

  const handlePwdSubmit = () => {
    findPassWord();
  };

  const findPassWord = () => {
    if (!email) {
      Alert.alert('값을 입력해주세요');
    } else {
      return firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          console.log('비밀번호 초기화');
          navigation.goBack();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  // Views
  return (
    // 전체 레이아웃
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
      {/* 상단 뷰 레이아웃 */}
      <View
        style={{
          flex: 3,
          justifyContent: 'center',
          alignSelf: 'flex-start',
          width: '100%',
        }}>
        <View style={{display: 'flex', flexDirection: 'row', marginBottom: 10}}>
          <Image
            source={require('../images/sms.png')}
            style={{width: 18, height: 18, marginRight: 2.5}}
          />
          <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft: 2.5}}>
            안내드려요
          </Text>
        </View>

        <View style={{marginTop: 10}}>
          <Text>가입한 이메일 주소를 입력해주세요.</Text>

          <Text>해당 이메일로 비밀번호 재설정을 위한 링크를 보내드립니다.</Text>
        </View>

        <View
          style={{
            height: 1,
            marginTop: 30,
            // marginVertical: 30,
            backgroundColor: '#d2d2d2',
          }}
        />
      </View>

      {/* 하단 뷰 레이아웃 */}
      <View
        style={{
          flex: 7,
          width: '100%',
        }}>
        <View style={{marginBottom: 5}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>이메일</Text>
        </View>

        {/* 텍스트 인풋 레이아웃 */}
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
            marginTop: 5,
            marginBottom: 20,
          }}>
          <TextInput
            placeholder="이메일"
            onChangeText={text => setEmail(text)}
            value={email}
            onSubmitEditing={handlePwdSubmit}
            returnKeyType="done"
            style={{flex: 1, paddingVertical: 0}}
          />
        </View>

        {/* 버튼 레이아웃 */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 60,
            backgroundColor: '#2978f4',
            borderRadius: 15,
            marginTop: 20
          }}>
          <TouchableOpacity onPress={findPassWord}>
            <Text style={{color: 'white', fontSize: 16}}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SearchPasswordScreen;
