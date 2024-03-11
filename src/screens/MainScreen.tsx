import { API_URL, NAVER_MAP_API_KEY_ID, NAVER_MAP_API_SECRET } from '@env';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
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
      <View style={styles.wrapper}>
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
      </View>
      <View style={{width: '100%', height: '100%'}}>
        <NaverMapView
          style={{
            width: '100%',
            height: '100%',
          }}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  textinput_wrapper: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  textinput: {
    margin: 0,
    padding: 0,
  },
});

export default MainScreen;
