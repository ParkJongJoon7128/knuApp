import { API_URL, NAVER_MAP_API_KEY_ID, NAVER_MAP_API_SECRET } from '@env';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import NaverMapView, { Marker } from 'react-native-nmap';

const MainScreen = () => {
  // Logic
  const navigation = useNavigation();
  const userCollection = firestore().collection('users');

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

  const searchAddress = async (address: string) => {
    try {
      const apiURL = API_URL;
      const clientID = NAVER_MAP_API_KEY_ID;
      const clientSecret = NAVER_MAP_API_SECRET;

      await axios
        .get(apiURL, {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': clientID,
            'X-NCP-APIGW-API-KEY': clientSecret,
          },
          params: {
            query: address,
          },
        })
        .then(result => {
          console.log(result.data);
          const latitude = parseFloat(result.data.addresses[0].y);
          const longitude = parseFloat(result.data.addresses[0].x);
          setLocation({latitude, longitude});
          mapRef.current.animateToCoordinate({latitude, longitude});
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

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
        console.log(error);
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
        center={{...location, zoom: 16}}>
        <Marker
          ref={mapRef}
          coordinate={location}
          pinColor="blue"
          onClick={() => console.log('onClick! p1')}
        />
      </NaverMapView>
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
