import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import NaverMapView, { Marker } from 'react-native-nmap';
import { data } from '../data/location';

const MainScreen = () => {
  // Logic
  const mapRef = useRef<NaverMapView>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const knuAddr = {
    latitude: 37.2700052079,
    longitude: 127.12624831737,
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
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

  const locationRenderItem = ({item}) => {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: item.imageUrl?.toString()}}
          style={{width: '100%', height: 200}}
        />
        <Text style={{alignSelf: 'flex-start'}}>{item.name}</Text>
      </View>
    );
  };

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
          onChange={handleSheetChanges}
          backdropComponent={handleSheetBackdrop}>
          <BottomSheetView>
            <FlatList
              data={data}
              renderItem={locationRenderItem}
              keyExtractor={(_, index) => index.toString()}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

export default MainScreen;
