import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import NaverMapView, { Marker } from 'react-native-nmap';
import BottomSheetScrollViewHeader from '../components/BottomSheetScrollViewHeader';
import { data } from '../data/location';

const MainScreen = () => {
  // Logic
  const mapRef = useRef<NaverMapView>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['35%', '50%'], []);

  const knuAddr = {
    latitude: 37.2700052079,
    longitude: 127.12624831737,
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);


  const handleSheetBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="collapse"
        style={[props.style, {backgroundColor: 'transparent'}]}
      />
    ),
    [],
  );

  const locationrenderItem = useCallback(
    item => (
      <View
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          paddingHorizontal: 15,
        }}>
        <Image
          source={{uri: item.imageUrl?.toString()}}
          style={{width: '100%', height: 250, borderRadius: 15}}
          resizeMode="center"
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignSelf: 'flex-start',
            marginTop: 10,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold', marginRight: 5}}>
              {item.name}
            </Text>

            <Text style={{color: 'gray'}}>{item.category}</Text>
          </View>

          <View>
            <TouchableOpacity>
              <Image
                source={require('../assets/images/unclicked_star.png')}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            borderWidth: 0.5,
            borderColor: 'lightgray',
            marginVertical: 20,
          }}
        />
      </View>
    ),
    [],
  );

  useEffect(() => {
    handlePresentModalPress();
  }, [handlePresentModalPress]);

  // Views
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <BottomSheetModalProvider>
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

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backdropComponent={handleSheetBackdrop}
          enablePanDownToClose={false}>
          <BottomSheetScrollView>
            <BottomSheetScrollViewHeader />
            {data.map(item => locationrenderItem(item))}
          </BottomSheetScrollView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

export default MainScreen;
