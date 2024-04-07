import { API_URL, KAKAO_REST_API_KEY } from '@env';
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
  const [bottomSheetList, setBottomSheetList] =
    useRecoilState(BottomSheetDataState);
  const [filterData, setFilterData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [focus, setFocus] = useState(false);

  const mapRef = useRef<NaverMapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['25%', '65%'], []);

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
      await axios
        .get(API_URL, {
          headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
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

  useEffect(() => {
    console.log('locationState: ', locationList);
    console.log('userState: ', userList);
  }, []);

  const SearchItemView = ({item}) => {
    return (
      <TouchableOpacity onPress={() => handleItemPress(item)}>
        <View style={{flex: 1, paddingVertical: 12, paddingHorizontal: 15}}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text
                style={{
                  fontSize: 15,
                  color: 'black',
                }}>
                {item.place_name}
              </Text>
            </View>
            <View
              style={{
                borderRadius: 15,
                borderWidth: 1,
                borderColor: '#d2d2d2',
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}>
              <Text style={{fontSize: 12, color: '#d2d2d2'}}>
                {item.category_group_name}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 5,
            }}>
            <Text style={{fontSize: 12, color: '#b2b2b2'}}>
              {item.address_name}
            </Text>
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
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                {item.place_name}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignSelf: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ReadReview', {uid: uid})}
                style={{
                  backgroundColor: 'red',
                  paddingVertical: Platform.OS === 'ios' ? 12 : 10,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  // height: 40,
                  justifyContent: 'center',
                }}>
                <Text style={{color: 'white'}}>조회</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Review', {
                    uid: uid,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    place_name: item.place_name,
                    address_name: item.address_name,
                    category_group_name: item.category_group_name,
                  })
                }
                style={{
                  backgroundColor: '#1581ec',
                  paddingVertical: Platform.OS === 'ios' ? 12 : 10,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  // height: 40,
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
              marginTop: 10,
            }}>
            <View>
              <Text>주소: {item.address_name}</Text>
            </View>
            {item.category_group_name ? (
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
            ) : (
              <></>
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
                onClick={() => console.log('onclick!!', item)}
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