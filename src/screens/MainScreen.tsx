import { API_URL, KAKAO_REST_API_KEY } from '@env';
import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import NaverMapView from 'react-native-nmap';
import { useRecoilState } from 'recoil';
import { locationState, userState } from '../data/dataState';

const MainScreen = ({route}) => {
  // Logic
  const navigation =
    useNavigation<NativeStackNavigationProp<ROOT_NAVIGATION>>();
  const {uid} = route.params;

  const [user, setUser] = useState<any>();
  const [initializing, setInitializing] = useState(true);

  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  const [locationList, setLocationList] = useRecoilState(locationState);
  const [userList, setUserList] = useRecoilState(userState);
  const [filterData, setFilterData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [focus, setFocus] = useState(false);

  const mapRef = useRef<any>(null);

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  };

  const searchAddress = async () => {
    try {
      await axios
        .get(API_URL, {
          headers: {
            Authorization: KAKAO_REST_API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          params: {
            query: address,
          },
        })
        .then(result => {
          console.log('검색 결과: ', result.data.documents);
          setFilterData(
            result.data.documents.map(data => ({
              place_name: data.place_name,
              latitude: parseFloat(data.y),
              longitude: parseFloat(data.x),
            })),
          );
          setMasterData(
            result.data.documents.map(data => ({
              place_name: data.place_name,
              latitude: parseFloat(data.y),
              longitude: parseFloat(data.x),
            })),
          );
          setLocationList(
            result.data.documents.map(data => ({
              address_name: data.address_name,
              category_group_name: data.category_group_name,
              phone_number: data.phone,
              place_name: data.place_name,
              latitude: parseFloat(data.y),
              longitude: parseFloat(data.x),
            })),
          );
        })
        .catch(err => {
          console.log('주소 검색 실패: ', err);
        });
    } catch (error) {
      console.log('주소 검색 에러: ', error);
    }
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('현재위치: ', position.coords);
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        mapRef.current?.animateToCoordinate({latitude, longitude});
        setLocation({latitude, longitude});
      },
      error => {
        console.log('현재 위치 정보 받기 에러: ', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
    return firebase.auth().onAuthStateChanged(onAuthStateChanged);
  }, []);

  useEffect(() => {
    console.log('locationState: ', locationList);
    console.log('userState: ', userList);
  }, []);

  useEffect(() => {
    database()
      .ref('locations/')
      .child(uid)
      .once('value')
      .then(res => {
        console.log('초기 데이터: ', res);
        setUserList(prev => [...prev, res]);
      })
      .catch(err => {
        console.log('데이터 조회 에러:', err);
      });
  }, []);

  const ItemView = ({item}) => {
    const handleItemPress = () => {
      setLocation({latitude: item.latitude, longitude: item.longitude})
      setFocus(false);
    }
    return (
      <TouchableOpacity
        onPress={handleItemPress}>
        <View style={{padding: 10}}>
          <Text>{item.place_name}</Text>
          <View style={{marginTop: 10}}>
            <Text>위도: {item.latitude.toString()}</Text>
            <Text>경도: {item.longitude.toString()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  

  const ItemSeparatorView = () => {
    return (
      <View
        style={{height: 0.5, width: '100%', backgroundColor: '#c8c8c8'}}></View>
    );
  };

  if (initializing) {
    return null;
  }

  const searchFilter = (text: string) => {
    if (text) {
      const newData = masterData.filter(item => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilterData(newData);
      setAddress(text);
    } else {
      setFilterData(masterData);
      setAddress(text);
    }
  };

  // Views
  return (
    <SafeAreaView style={styles.container}>
      {/* NaverMapView를 TextInput과 같은 레벨의 View로 이동 */}
      <View style={styles.mapViewContainer}>
        {focus ? (
          <FlatList
            data={filterData}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
          />
        ) : (
          <NaverMapView
            style={styles.mapView}
            ref={mapRef}
            showsMyLocationButton={true}
            center={{...location, zoom: 16}}
          />
        )}
      </View>

      {/* TextInput을 절대 위치로 지정하여 Map 위에 위치하도록 함 */}
      <View style={styles.search_wrapper}>
        <View style={styles.textInputContainer}>
          <TextInput
            value={address}
            // onChangeText={text => setAddress(text)}
            onChangeText={text => searchFilter(text)}
            placeholder="주소를 입력해주세요."
            style={styles.textinput}
            onSubmitEditing={searchAddress}
            returnKeyType="done"
            onFocus={e => setFocus(!!e)}
            underlineColorAndroid="transparent"
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={searchAddress}>
          <Text style={styles.buttonText}>검색</Text>
        </TouchableOpacity>
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
    marginTop: Platform.OS === 'android' ? 60 : 40,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  mapView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  search_wrapper: {
    position: 'absolute', // 절대 위치 사용
    top: Platform.OS === 'android' ? 10 : 55, // android 같은 경우 10, iOS 같은 경우 70
    left: 10, // 왼쪽에서 10의 여백을 줌
    right: 10, // 오른쪽에서 10의 여백을 줌
    height: 50,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  textinput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    flex: 1,
    backgroundColor: 'white',
  },
  searchButton: {
    backgroundColor: '#1581ec',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    includeFontPadding: false,
  },
});

export default MainScreen;
