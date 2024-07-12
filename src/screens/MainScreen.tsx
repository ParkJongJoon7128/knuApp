import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import NaverMapView, { Marker } from 'react-native-nmap';
import { data } from '../data/location';

const MainScreen = () => {
  // Logic
  const mapRef = useRef<NaverMapView>(null);

  const knuAddr = {
    latitude: 37.2700052079,
    longitude: 127.12624831737,
  };

  useEffect(() => {
    data.map((place, index) => {
      console.log({
        index: index,
        category: place.category,
        latitude: parseFloat(place.y),
        longitude: parseFloat(place.x),
      });
    });
  }, []);

  // Views
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <NaverMapView
        style={{width: '100%', height: '100%', marginTop: 20}}
        ref={mapRef}
        showsMyLocationButton={true}
        center={{...knuAddr, zoom: 16}}>
        {data.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(place.y),
              longitude: parseFloat(place.x),
            }}
            onClick={() => console.log(`${place.name}`)}
          />
        ))}
      </NaverMapView>
    </View>
  );
};

export default MainScreen;
