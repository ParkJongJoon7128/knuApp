import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import _ from 'lodash';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import StarRating from 'react-native-star-rating-widget';

const CreateReviewScreen = ({route}) => {
  //Logics
  const navigation =
    useNavigation<NativeStackNavigationProp<ROOT_NAVIGATION>>();
  const {
    uid,
    nickname,
    latitude,
    longitude,
    place_name,
    address_name,
    category_group_name,
    // thumbnail_url,
  } = route.params;
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([]);

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
          uid,
          nickname,
          placeName: place_name,
          addressName: address_name,
          categoryName: category_group_name,
          rating,
          location: {latitude, longitude},
          content,
          images
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

  const getImages = () => {
    if (images.length < 3) {
      return _.map(_.range(0, 1), () => {
        return {
          path: '',
          id: _.uniqueId(),
        };
      });
    } else if (images.length === 3) {
      return _.map(_.range(0), () => {
        return {
          path: '',
          id: _.uniqueId(),
        };
      });
    }
    return images;
  };

  const renderItem = ({item, index}) => {
    // 이미지 첨부했을 때
    const ActiveImage = (
      <View key={index} style={{marginRight: 10}}>
        <Image
          source={{uri: item.path}}
          style={{width: 74, height: 74, borderRadius: 5.7}}
        />
        <TouchableOpacity
          style={{position: 'absolute', top: 6, right: 6}}
          onPress={() => {
            setImages(images.filter((_, idx) => idx !== index));
          }}>
          <Image
            style={{width: 14, height: 14}}
            source={require('../images/cancel.png')}
          />
        </TouchableOpacity>
      </View>
    );
    // 이미지 첨부하지 않았을 때
    const EmptyImage = (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10,
        }}>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: '#b6b6b6',
            borderRadius: 8,
            padding: 25,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            ImageCropPicker.openPicker({
              mediaType: 'photo',
              multiple: true,
            })
              .then(image => {
                console.log('image: ', image);
                setImages([...images, ...image]);
              })
              .catch(e => {
                console.log(e);
              });
          }}>
          <Image
            source={require('../images/camera.png')}
            style={{width: 20, height: 20}}
            resizeMode="contain"
            tintColor="#b6b6b6"
          />
        </TouchableOpacity>
      </View>
    );

    return item.path ? ActiveImage : EmptyImage;
  };

  //Views
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
      {/* 매장 이름 레이아웃 */}
      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          marginBottom: 5,
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{place_name}</Text>
      </View>

      {/* 평점 레이아웃*/}
      <View style={{marginTop: 5, marginBottom: 5}}>
        <StarRating rating={rating} onChange={setRating} starSize={24} />
      </View>

      {/* 텍스트 인풋 레이아웃 */}
      <View
        style={{
          width: '100%',
          height: 150,
          borderRadius: 15,
          padding: 15,
          backgroundColor: '#f6f6f6',
          marginTop: 5,
          marginBottom: 10,
        }}>
        <TextInput
          onChangeText={setContent}
          value={content}
          placeholder="매장의 분위기와 음식의 맛, 양, 서비스 등 매장의 전반적인 부분에 대한 솔직한 리뷰를 작성해주세요."
          multiline={true}
          onSubmitEditing={handleAdvantageSubmit}
          returnKeyType="next"
          style={{margin: 0, padding: 0, flexShrink: 1}}
        />
      </View>

      {/* 이미지 추가 레이아웃 */}
      <View
        style={{
          justifyContent: 'center',
          alignSelf: 'flex-start',
        }}>
        <FlatList
          style={{flexGrow: 0}}
          data={images.concat(getImages())}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          scrollEnabled={false}
        />
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
          }}>
          <TouchableOpacity onPress={AddReview}>
            <Text style={{color: 'white', fontSize: 20}}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default CreateReviewScreen;
