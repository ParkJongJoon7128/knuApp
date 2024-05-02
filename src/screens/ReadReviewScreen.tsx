import CheckBox from '@react-native-community/checkbox';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { err } from 'react-native-svg';
import { useRecoilState } from 'recoil';
import { ReviewState } from '../data/dataState';

const ShowReviewScreen = ({route}) => {
  // Logics
  const {uid, placeName} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<ROOT_NAVIGATION>>();

  const [rating, setRating] = useState(0);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const [reviewList, setReviewList] = useRecoilState(ReviewState);

  useEffect(() => {
    database()
      .ref('reviews')
      .once('value')
      .then(snapshot => {
        const reviews = [];
        snapshot.forEach(data => {
          data.forEach(res => {
            const review = res.val();
            if (review.placeName == placeName) {
              reviews.push({
                key: res.key,
                ...review,
              });
            }
          });
        });
        setReviewList(reviews);
        setRating(
          (
            reviews.map(data => data.rating).reduce((a, c) => a + c) /
            reviews.length
          ).toFixed(1),
        );
      })
      .then(() => {
        console.log('ReviewState: ', reviewList);
      })
      .catch(err => {
        console.log('데이터 조회 에러:', err);
      });
  }, []);

  const removeReview = (key: any) => {
    try {
      database().ref('reviews').child(uid).child(key).remove();
    } catch (error) {
      console.log('데이터 삭제: ', err);
    }
  }

  const ReviewItemView = useCallback(({item, index}: any) => {
    console.log("item: ", item)
    return (
      <View key={index} style={{display: 'flex', flexDirection: 'column'}}>
        <View>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            {item.placeName}
          </Text>
        </View>
        <View
          style={{
            marginVertical: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <StarRatingDisplay
              rating={item.rating}
              starSize={18}
              emptyColor="white"
            />
          </View>
          {item.uid === uid && (
            <View
              style={{
                borderRadius: 10,
                backgroundColor: '#efefef',
                paddingVertical: 5,
                paddingHorizontal: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={() => removeReview(item.key)}>
                <Text>삭제</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View>
          <FlatList
            data={item.images}
            style={{flexGrow: 0}}
            renderItem={imageItemView}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            horizontal={true}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text>{item.content}</Text>
        </View>
      </View>
    );
  }, [uid]);

  const imageItemView = useCallback(({item, index}: any) => {
    return (
      <View key={index} style={{marginRight: 10}}>
        <Image
          source={{uri: item.path}}
          style={{width: 74, height: 74, borderRadius: 5.7}}
        />
      </View>
    );
  }, []);

  const ItemSeparatorView = () => {
    return (
      <View
        style={{height: 0.5, width: '100%', backgroundColor: '#c8c8c8'}}></View>
    );
  };

  // Views
  return (
    // 전체 레이아웃
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      {/* 상단 리뷰 레이아웃 */}
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              <StarRatingDisplay rating={rating} />
            </View>
            <View>
              <Text style={{fontSize: 32, fontWeight: 'bold'}}>{rating}</Text>
            </View>
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={{color: '#b5b5b5', fontWeight: 'bold'}}>
            {reviewList.length}명 평가
          </Text>
        </View>
      </View>
      <View
        style={{
          height: 7,
          width: '100%',
          backgroundColor: '#f9f9f9',
        }}
      />

      {/* 중간 리뷰 헤더 레이아웃 */}
      <View
        style={{
          flex: 4,
          marginTop: 20,
          // paddingVertical: 30,
          // marginHorizontal: 20
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'flex-start',
              marginBottom: 5,
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              리뷰 {reviewList.length}
            </Text>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'flex-start',
              marginTop: 5,
            }}>
            <View>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
                boxType="square"
                onAnimationType="fade"
                offAnimationType="fade"
                style={{width: 16, height: 16}}
              />
            </View>
            <View style={{marginLeft: 10}}>
              <Text>사진 리뷰만 보기 </Text>
            </View>
          </View>

          <View
            style={{
              height: 1,
              marginVertical: 20,
              backgroundColor: '#d2d2d2',
            }}
          />
        </View>

        {/* 중간 리뷰 레이아웃 */}
        <View style={{marginHorizontal: 20}}>
          <FlatList
            data={reviewList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ReviewItemView}
            ItemSeparatorComponent={ItemSeparatorView}
          />
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
});

export default ShowReviewScreen;
