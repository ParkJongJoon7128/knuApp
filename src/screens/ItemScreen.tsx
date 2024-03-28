import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

const ItemScreen = ({route}) => {
  // Logics
  const {item} = route.params;
  const {user} = route.params;

  const P0 = {latitude: 37.564362, longitude: 126.977011};
  const P1 = {latitude: 37.565051, longitude: 126.978567};
  const P2 = {latitude: 37.565383, longitude: 126.976292};

  const navigation = useNavigation<ROOT_NAVIGATION>();
  // const userCollection = firestore().collection('profile');

  // const addItem = (item: any, user: any) => {
  //   try {
  //     userCollection
  //       .doc(user.uid)
  //       .set({user: user.displayName, text: item.title})
  //       .then(res => {
  //         console.log('res: ', res);
  //         navigation.goBack();
  //       })
  //       .catch(err => {
  //         console.log('err: ', err);
  //       });
  //   } catch (error) {
  //     console.log('error: ', error);
  //   }
  // };

  // Views
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 15}}>
        {/* <NaverMapView
          style={{width: '100%', height: '100%', flex: 1}}
          showsMyLocationButton={true}
          center={{...P0, zoom: 16}}
          onTouch={e => console.log('onTouch', JSON.stringify(e.nativeEvent))}
          onCameraChange={e => console.log('onCameraChange', JSON.stringify(e))}
          onMapClick={e => console.log('onMapClick', JSON.stringify(e))}>
          <Marker coordinate={P0} onClick={() => console.log('onClick! p0')} />
          <Marker
            coordinate={P1}
            pinColor="blue"
            onClick={() => console.log('onClick! p1')}
          />
          <Marker
            coordinate={P2}
            pinColor="red"
            onClick={() => console.log('onClick! p2')}
          />
          <Path
            coordinates={[P0, P1]}
            onClick={() => console.log('onClick! path')}
            width={10}
          />
          <Polyline
            coordinates={[P1, P2]}
            onClick={() => console.log('onClick! polyline')}
          />
          <Circle
            coordinate={P0}
            color={'rgba(255,0,0,0.3)'}
            radius={200}
            onClick={() => console.log('onClick! circle')}
          />
          <Polygon
            coordinates={[P0, P1, P2]}
            color={`rgba(0, 0, 0, 0.5)`}
            onClick={() => console.log('onClick! polygon')}
          />
        </NaverMapView> */}
        <Text>{item.title}</Text>
        {/* <View style={{padding: 10, margin: 30, backgroundColor: 'yellow'}}>
          <TouchableOpacity onPress={() => addItem(item, user)}>
            <Text>데이터 추가</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </SafeAreaView>
  );
};

export default ItemScreen;
