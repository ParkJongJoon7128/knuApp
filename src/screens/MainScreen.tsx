import { KAKAO_REST_API_KEY, KAKAO_SEARCH_LOCATION_API_URL } from '@env';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import NaverMapView, { Marker } from 'react-native-nmap';
import { useRecoilState } from 'recoil';
import {
  BottomSheetDataState,
  locationState,
  userState,
} from '../data/dataState';
import { truncateText } from '../utils/ExternalFunc';

const MainScreen = ({route}) => {
  // Logic
  const navigation =
    useNavigation<NativeStackNavigationProp<ROOT_NAVIGATION>>();
  const {uid, nickname} = route.params;

  const [user, setUser] = useState<any>();
  const [initializing, setInitializing] = useState(true);

  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  const [filterData, setFilterData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [focus, setFocus] = useState(false);

  const [locationList, setLocationList] = useRecoilState(locationState);
  const [userList, setUserList] = useRecoilState(userState);
  const [bottomSheetList, setBottomSheetList] =
    useRecoilState(BottomSheetDataState);

  const mapRef = useRef<NaverMapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['25%', '45%'], []);

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleSheetBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} pressBehavior="close" />,
    [],
  );

  const handleItemPress = (item: any) => {
    setLocation({latitude: item.latitude, longitude: item.longitude});
    setAddress(item.place_name);
    setBottomSheetList(item);
    setFocus(false);
    handlePresentModalPress();
  };

  const searchAddress = async () => {
    try {
      return await axios
        .get(KAKAO_SEARCH_LOCATION_API_URL, {
          headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
            'Content-Type': ' application/json;charset=UTF-8 ',
          },
          params: {
            query: address,
          },
        })
        .then(result => {
          setFilterData(
            result.data.documents.map(data => ({
              place_name: data.place_name,
              address_name: data.address_name,
              category_group_name: data.category_group_name,
              latitude: parseFloat(data.y),
              longitude: parseFloat(data.x),
            })),
          );
          setMasterData(
            result.data.documents.map(data => ({
              place_name: data.place_name,
              address_name: data.address_name,
              category_group_name: data.category_group_name,
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
        });
    } catch (error) {
      console.log('주소 검색 에러: ', error);
      throw error; 
    }
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        // console.log('현재위치: ', position.coords);
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
    database()
      .ref('reviews')
      .child(uid)
      .once('value')
      .then(res => {
        console.log('MainScreen: ', res);
        setUserList(prev => [...prev, res]);
      })
      .catch(err => {
        console.log('데이터 조회 에러:', err);
      });
  }, []);

  const SearchItemView = ({item}) => {
    return (
      <TouchableOpacity onPress={() => handleItemPress(item)}>
        <View style={{display: 'flex', flexDirection: 'column'}}>
          <View
            style={{
              display: 'flex',
              marginTop: 8,
              marginBottom: 3,
              paddingHorizontal: 15,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={require('../images/marker.png')} />
            </View>
            <View
              style={{
                flex: 6,
              }}>
              <Text> {item.place_name}</Text>
            </View>
            {item.category_group_name && (
              <View
                style={{
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: '#b2b2b2',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 12, color: '#b2b2b2'}}>
                  {item.category_group_name}
                </Text>
              </View>
            )}
          </View>
          <View style={{paddingHorizontal: 36, marginTop: 3, marginBottom: 8}}>
            <Text>{item.address_name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const BottomSheetItemView = useCallback(
    ({item, index}: any) => (
      <TouchableOpacity
        onPress={() => {
          mapRef.current?.animateToCoordinate({
            latitude: item.latitude,
            longitude: item.longitude,
          });
          bottomSheetRef.current?.snapToIndex(0);
          console.log('bottomsheetitem: ', item);
        }}>
        <View style={{padding: 15}} key={index}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{fontSize: 20, color: '#1581ec', fontWeight: 'bold'}}>
                {truncateText(item.place_name)}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignSelf: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ReadReview', {
                    uid: uid,
                    placeName: item.place_name,
                  })
                }
                style={{
                  backgroundColor: 'red',
                  paddingVertical: Platform.OS === 'ios' ? 12 : 10,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  justifyContent: 'center',
                }}>
                <Text style={{color: 'white'}}>조회</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CreateReview', {
                    uid: uid,
                    nickname: nickname,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    place_name: item.place_name,
                    address_name: item.address_name,
                    category_group_name: item.category_group_name,
                    place_url: item.place_url,
                  })
                }
                style={{
                  backgroundColor: '#1581ec',
                  paddingVertical: Platform.OS === 'ios' ? 12 : 10,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  justifyContent: 'center',
                  marginLeft: 5,
                }}>
                <Text style={{color: 'white'}}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 8,
            }}>
            <Text>{item.address_name}</Text>
            {item.category_group_name && (
              <View
                style={{
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: '#c5c6c7',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  marginLeft: 8,
                }}>
                <Text style={{color: '#8b8c8c'}}>
                  {item.category_group_name}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

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
      {/* <BottomSheetModalProvider> */}
      {/* NaverMapView를 TextInput과 같은 레벨의 View로 이동 */}
      <View style={styles.mapViewContainer}>
        {focus && address ? (
          <FlatList
            data={filterData}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={SearchItemView}
          />
        ) : (
          <NaverMapView
            style={styles.mapView}
            ref={mapRef}
            showsMyLocationButton={true}
            center={{...location, zoom: 16}}>
            {locationList.map((item, index) => (
              <Marker
                key={index}
                pinColor="blue"
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={item.place_name}
                onClick={() => {
                  bottomSheetRef.current?.snapToIndex(1);
                }}
              />
            ))}
          </NaverMapView>
        )}
      </View>

      {/* TextInput을 절대 위치로 지정하여 Map 위에 위치하도록 함 */}
      <View style={styles.search_wrapper}>
        <View style={styles.textInputContainer}>
          <TextInput
            value={address}
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
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        index={-1}
        backdropComponent={handleSheetBackdrop}
        enablePanDownToClose={true}>
        <BottomSheetFlatList
          data={locationList}
          renderItem={BottomSheetItemView}
          ItemSeparatorComponent={ItemSeparatorView}
        />
      </BottomSheet>
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
  },
  mapView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  search_wrapper: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 10 : 55,
    left: 10,
    right: 10,
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
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
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
  bottomSheetAddButton: {
    backgroundColor: '#1581ec',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    margin: 10,
  },
});

export default MainScreen;
