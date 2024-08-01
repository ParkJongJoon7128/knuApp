import React from 'react';
import { Image, Text, View } from 'react-native';

const BottomSheetScrollViewHeader = () => {
  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginVertical: 15,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 0.5,
          borderColor: 'lightgray',
          borderRadius: 15,
          alignSelf: 'center',
          paddingHorizontal: 10,
          paddingVertical: 3,
        }}>
        <Image
          source={require('../assets/images/pin.png')}
          style={{width: 16, height: 16, marginRight: 3}}
          resizeMode="contain"
          tintColor="#007AFF"
        />
        <Text style={{fontWeight: '700', fontSize: 16}}>
          강남대학교 맛집 리스트
        </Text>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 35,
          marginBottom: 15,
        }}>
        <Text style={{fontWeight: '700', fontSize: 20, marginRight: 5}}>
          주변
        </Text>
        <View
          style={{
            width: '100%',
            borderWidth: 0.5,
            borderColor: 'lightgray',
          }}
        />
      </View>
    </>
  );
};

export default BottomSheetScrollViewHeader;
