import { API_URL, KAKAO_REST_API_KEY } from '@env';
import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import NaverMapView from 'react-native-nmap';

const MainScreen = () => {
  // Logic
  const navigation = useNavigation();

  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  const mapRef = useRef<any>(null);

  const onAuthStateChanged = (user: any) => {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  };

  const searchAddress = async (addr: string) => {
    try {
      await axios
        .get(API_URL, {
          // headers: {
          //   'X-Naver-Client-Id': NAVER_MAP_API_KEY_ID,
          //   'X-Naver-Client-Secret': NAVER_MAP_API_SECRET,
          // },
          // params: {
          //   query: addr,
          //   display: 5,
          //   start: 1,
          //   sort: 'sim',
          // },
          // headers: {
          //   'X-NCP-APIGW-API-KEY-ID': NAVER_MAP_API_KEY_ID,
          //   'X-NCP-APIGW-API-KEY': NAVER_MAP_API_SECRET,
          // },
          // params: {
          //   query: address,
          // },
          headers: {
            "Authorization": KAKAO_REST_API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          }, 
          params: {
            query: addr
          }
        })
        .then(result => {
          console.log("검색 결과: ", result.data.documents);
          // const latitude = parseFloat(result.data.items[0].mapy);
          // const longitude = parseFloat(result.data.items[0].mapx);
          // const category = result.data.items[0].category;
          // addLocation(user, {latitude, longitude}, category);
          
          // const latitude = parseFloat(result.data.addresses[0].y);
          // const longitude = parseFloat(result.data.addresses[0].x);
          // const roadAddress = result.data.addresses[0].roadAddress;
          // addLocation(user, {latitude, longitude}, roadAddress);
          // mapRef.current.animateToCoordinate({latitude, longitude});

          const latitude = parseFloat(result.data.documents[0].y);
          const longitude = parseFloat(result.data.documents[0].x);
          const category = result.data.documents[0].category_group_name;
          const placeName = result.data.documents[0].place_name;
          const number = result.data.documents[0].phone;

          addLocation(user, {latitude, longitude}, category, placeName, number)
          mapRef.current.animateToCoordinate({latitude, longitude});
        })
        .catch(err => {
          console.log('주소 검색 실패: ', err);
        });
    } catch (error) {
      console.log('주소 검색 에러: ', error);
    }
  };

  const addLocation = async (
    user: any,
    location: {latitude: number; longitude: number},
    category: any,
    placeName: any,
    number: any,
  ) => {
    try {
      await database()
        .ref('locations/')
        .child(user.uid)
        .push({category, location, placeName, number})
        .once('value')
        .then(res => {
          console.log('데이터 추가: ', res);
        })
        .catch(err => {
          console.log('데이터 추가 실패: ', err);
        });
    } catch (error) {
      console.log('데이터 추가 에러: ', error);
    }
  };

  // const searchAddress = async (address: string) => {
  //   try {
  //     await axios
  //       .get(API_URL, {
  //         headers: {
  //           // 'X-NCP-APIGW-API-KEY-ID': NAVER_MAP_API_KEY_ID,
  //           // 'X-NCP-APIGW-API-KEY': NAVER_MAP_API_SECRET,
  //           "X-Naver-Client-Id": NAVER_MAP_API_KEY_ID,
  //           "X-Naver-Client-Secret": NAVER_MAP_API_SECRET
  //         },
  //         params: {
  //           query: address,
  //           display: 100,
  //           start: 1,
  //           sort: "sim"
  //         },
  //       })
  //       .then(result => {
  //         console.log("주소 검색: ", result.data.items[0].mapy);
  //         console.log("주소 검색: ", result.data.items[0].mapx);
  //         const latitude = parseInt(result.data.items[0].mapy);
  //         const longitude = parseInt(result.data.items[0].mapx);
  //         setLocation({latitude, longitude});
  //         mapRef.current.animateToCoordinate({latitude, longitude});
  //         addLocation(user, {latitude, longitude});
  //       })
  //       .catch(err => {
  //         console.log("주소 검색 에러: ", err);
  //       });
  //   } catch (error) {
  //     console.log("주소 검색 통신 에러: ", error);
  //   }
  // };

  // const addLocation = (
  //   user: any,
  //   location: {latitude: number; longitude: number},
  // ) => {
  //   try {
  //     database()
  //       .ref('locations/')
  //       .on("value")
  //       .child(user.uid)
  //       .update({
  //         address,
  //         location,
  //       })
  //       .then(res => {
  //         console.log('주소 추가: ', res);
  //       })
  //       .catch(res => {
  //         console.log('주소 추가 에러: ', res);
  //       });
  //   } catch (error) {
  //     console.log('주소 추가 통신 에러: ', error);
  //   }
  // };

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('현재위치: ', position.coords);
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLocation({latitude, longitude});
        mapRef.current.animateToCoordinate({latitude, longitude});
      },
      error => {
        console.log('현재 위치 정보 받기 에러: ', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
    return firebase.auth().onAuthStateChanged(onAuthStateChanged);
  }, []);

  if (initializing) {
    return null;
  }

  // Views
  return (
    <SafeAreaView style={styles.container}>
      {/* NaverMapView를 TextInput과 같은 레벨의 View로 이동 */}
      <View style={styles.mapViewContainer}>
        <NaverMapView
          style={styles.mapView}
          ref={mapRef}
          showsMyLocationButton={true}
          center={{...location, zoom: 16}}></NaverMapView>
      </View>

      {/* TextInput을 절대 위치로 지정하여 Map 위에 위치하도록 함 */}
      <View style={styles.textinput_wrapper}>
        <TextInput
          value={address}
          onChangeText={text => setAddress(text)}
          placeholder="주소를 입력해주세요."
          style={styles.textinput}
          onSubmitEditing={() => searchAddress(address)}
          returnKeyType="done"
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
  mapViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  textinput_wrapper: {
    position: 'absolute', // 절대 위치 사용
    top: Platform.OS === 'android' ? 10 : 50, // android 같은 경우 10, iOS 같은 경우 70
    left: 10, // 왼쪽에서 10의 여백을 줌
    right: 10, // 오른쪽에서 10의 여백을 줌
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white', // 배경색 지정
    padding: 10,
  },
  textinput: {
    margin: 0,
    padding: 0,
  },
});

export default MainScreen;
