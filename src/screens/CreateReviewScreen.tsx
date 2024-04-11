import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import StarRating from 'react-native-star-rating-widget';

const CreateReviewScreen = ({route}) => {
  //Logics
  const navigation =
    useNavigation<NativeStackNavigationProp<ROOT_NAVIGATION>>();
  const {
    uid,
    latitude,
    longitude,
    place_name,
    address_name,
    category_group_name,
    // thumbnail_url,
  } = route.params;
  const [advantage, setAdvantage] = useState('');
  const [disadvantage, setDisadvantage] = useState('');
  const [rating, setRating] = useState(0);

  const inputRef = useRef(null);

  const handleAdvantageSubmit = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const AddReview = async () => {
    try {
      await database()
        .ref('reviews')
        .child(uid)
        .push({
          placeName: place_name,
          addressName: address_name,
          categoryName: category_group_name,
          rating,
          location: {latitude, longitude},
          content: {advantage, disadvantage},
          // latitude,
          // longitude,
          // imageUrl: thumbnail_url,
          email,
        })
        .once('value')
        .then(res => {
          console.log('데이터 추가: ', res);
          navigation.goBack();
        });
    } catch (error) {
      console.log('데이터 추가 실패: ', error);
    }
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
        <View style={{marginTop: 10}}>
          <StarRating rating={rating} onChange={setRating} />
        </View>
        <View
          style={{
            height: 0.5,
            width: '100%',
            backgroundColor: '#c8c8c8',
            marginTop: 15,
          }}
        />
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
