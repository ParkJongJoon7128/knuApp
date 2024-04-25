import CheckBox from '@react-native-community/checkbox';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    return (
      <View
        key={index}
        style={{paddingVertical: 10, display: 'flex', flexDirection: 'column'}}>
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
          {reviewList.map(data =>
            data.uid === uid ? (
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
            ) : (
              <></>
            ),
          )}
        </View>
        <View>
          <Text>{item.content}</Text>
        </View>
      </View>
    );
  }, [uid]);

  const ItemSeparatorView = () => {
    return (
      <View
        style={{height: 0.5, width: '100%', backgroundColor: '#c8c8c8'}}></View>
    );
  };

  // Views
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 30,
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
      </View>
      <View
        style={{
          flex: 4,
          marginHorizontal: 15,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignSelf: 'flex-start',
            marginVertical: 15,
          }}>
          <View>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              리뷰 {reviewList.length}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={newValue => setToggleCheckBox(newValue)}
              boxType="square"
              onAnimationType="fade"
              offAnimationType="fade"
              style={{width: 16, height: 16}}
            />
            <View
              style={{
                marginHorizontal: 10,
              }}>
              <Text>사진 리뷰만 보기 </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: 1,
            width: '100%',
            backgroundColor: '#d2d2d2',
          }}
        />
        <FlatList
          data={reviewList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={ReviewItemView}
          ItemSeparatorComponent={ItemSeparatorView}
        />
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
