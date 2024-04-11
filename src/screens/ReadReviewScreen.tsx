import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { useRecoilState } from 'recoil';
import { ReviewState } from '../data/dataState';

const ShowReviewScreen = ({route}) => {
  // Logics
  const {uid, placeName} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<ROOT_NAVIGATION>>();

  const [rating, setRating] = useState(0);
  const [reviewList, setReviewList] = useRecoilState(ReviewState);

  // useEffect(() => {
  //   database()
  //     .ref('reviews')
  //     .orderByChild('placeName')
  //     .equalTo(place_name)
  //     .once('value')
  //     .then(res => {
  //       const reviews = [];
  //       res.forEach(item => {
  //         reviews.push({
  //           key: item.key,
  //           ...item.val(),
  //         });
  //       });
  //       setReviewList(reviews);
  //     })
  //     .catch(err => {
  //       console.log('데이터 조회 에러:', err);
  //     });
  // }, []);

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
          reviews.map(data => data.rating).reduce((a, c) => a + c) /
            reviews.length,
        );
      })
      .catch(err => {
        console.log('데이터 조회 에러:', err);
      });
  }, []);

  useEffect(() => {
    console.log('ReviewState: ', reviewList);
  }, []);

  const ReviewItemView = useCallback(({item, index}: any) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            {item.placeName}
          </Text>
        </View>
        <View>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>평점: {item.rating}</Text>
        </View>
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
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <Text style={{fontSize: 25, fontWeight: 'bold'}}>평점</Text>
        </View>
        <View style={{margin: 10}}>
          <StarRating rating={rating} onChange={setRating} />
        </View>
        <View
          style={{
            height: 5,
            width: '100%',
            backgroundColor: '#f9f9f9',
          }}
        />
      </View>
      <View
        style={{
          flex: 4,
          margin: 15,
        }}>
        <View style={{justifyContent: 'center', alignSelf: 'flex-start'}}>
          <Text style={{fontSize: 15}}>리뷰 {reviewList.length}개</Text>
        </View>
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
