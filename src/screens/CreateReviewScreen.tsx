import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const CreateReviewScreen = ({route}) => {
  //Logics
  const navigation =
    useNavigation<NativeStackNavigationProp<ROOT_NAVIGATION>>();
  const {uid, location, place_name, address_name, category_group_name} =
    route.params;
  const [advantage, setAdvantage] = useState('');
  const [disadvantage, setDisadvantage] = useState('');

  const inputRef = useRef(null);

  const handleAdvantageSubmit = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const AddReview = async () => {
    try {
      await database()
        .ref('locations/')
        .child(uid)
        .push({
          place_name,
          location,
          address_name,
          category_group_name,
          advantage,
          disadvantage,
        })
        .once('value')
        .then(res => {
          console.log('데이터 추가: ', res);
        })
        .catch(err => {
          console.log('데이터 추가 실패: ', err);
        });
    } catch (error) {}
  };

  //Views
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        padding: 30,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          alignSelf: 'flex-start',
        }}>
        <Text style={{fontSize: 40}}>리뷰를 남겨주세요!!</Text>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          alignSelf: 'flex-start',
          marginTop: 30,
        }}>
        <Text style={{fontSize: 14}}>장소: {place_name}</Text>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          alignSelf: 'flex-start',
          marginTop: 30,
        }}>
        <Text style={{fontSize: 14}}>평점</Text>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          marginTop: 30,
        }}>
        <Text style={{fontSize: 14}}>장점</Text>

        <View
          style={{
            width: '100%',
            height: 40,
            borderWidth: 1,
            borderRadius: 10,
            marginTop: 15,
            padding: 10,
          }}>
          <TextInput
            onChangeText={e => setAdvantage(e)}
            value={advantage}
            placeholder="장점"
            style={{margin: 0, padding: 0}}
            onSubmitEditing={handleAdvantageSubmit}
            returnKeyType="next"
          />
        </View>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          marginTop: 20,
        }}>
        <Text style={{fontSize: 14}}>단점</Text>

        <View
          style={{
            width: '100%',
            height: 40,
            borderWidth: 1,
            borderRadius: 10,
            marginTop: 15,
            padding: 10,
          }}>
          <TextInput
            onChangeText={e => setDisadvantage(e)}
            value={disadvantage}
            placeholder="단점"
            style={{margin: 0, padding: 0}}
            onSubmitEditing={AddReview}
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#1581ec',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-end',
            marginTop: 30,
          }}
          onPress={AddReview}>
          <Text style={{color: 'white'}}>추가</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateReviewScreen;
