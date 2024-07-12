import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import MainScreen from '../screens/MainScreen';

const Tab = createBottomTabNavigator<ROOT_NAVIGATION>();

const Tabs = () => {
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
                  padding: 10,
                }}>
                <TextInput
                  placeholder="지도 검색"
                  style={{
                    width: 300,
                    height: 45,
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: '#e7e9eb',
                    marginRight: 15,
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
          headerLeft: false,
          headerShadowVisible: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
