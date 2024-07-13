import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useRef } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import MainScreen from '../screens/MainScreen';
import SearchLocationScreen from '../screens/SearchLocationScreen';

const Tab = createBottomTabNavigator<ROOT_NAVIGATION>();

const Tabs = () => {
  // Logics
  const searchRef = useRef<TextInput>(null);

  // Views
  return (
    <Tab.Navigator initialRouteName="MainTabs">
      <Tab.Screen
        name="MainTabs"
        component={MainScreen}
        options={{
          tabBarLabel: '주변',
          tabBarIcon: ({color}) => {
            return (
              <Image
                source={require('../assets/images/location.png')}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: color,
                }}
              />
            );
          },
          headerTitle: props => {
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row', // 자식 요소들을 수평으로 배치
                  justifyContent: 'space-between', // 자식 요소들 간의 공간을 균등하게 배분
                  alignItems: 'center', // 자식 요소들을 수직으로 가운데 정렬
                  // padding: 10,
                }}>
                <TextInput
                  placeholder="지도 검색"
                  // onPressIn={() => navigation.navigate('SearchLocationTabs')}
                  // onFocus={() => navigation.navigate('SearchLocationTabs')}
                  style={{
                    width: 310,
                    height: 40,
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: '#e7e9eb',
                    marginRight: 10,
                  }}
                />
                <TouchableOpacity>
                  <Image
                    source={require('../assets/images/bookmark.png')}
                    style={{width: 30, height: 30}}
                  />
                </TouchableOpacity>
              </View>
            );
          },
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen
        name="SearchLocationTabs"
        component={SearchLocationScreen}
        options={{
          tabBarLabel: '검색',
          tabBarIcon: ({color}) => {
            return (
              <Image
                source={require('../assets/images/search.png')}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: color,
                }}
              />
            );
          },
          headerTitle: props => {
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row', // 자식 요소들을 수평으로 배치
                  justifyContent: 'space-between', // 자식 요소들 간의 공간을 균등하게 배분
                  alignItems: 'center', // 자식 요소들을 수직으로 가운데 정렬
                  // padding: 10,
                }}>
                <TextInput
                  ref={searchRef}
                  placeholder="지도 검색"
                  style={{
                    width: 350,
                    height: 40,
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: '#e7e9eb',
                    // marginRight: 60,
                  }}
                />
              </View>
            );
          },
          headerShadowVisible: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
