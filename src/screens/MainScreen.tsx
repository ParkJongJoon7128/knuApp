import { firebase } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

const MainScreen = () => {
  // Logic
  const navigation = useNavigation();

  const LogOut = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('Logout');
        navigation.navigate('Login');
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  // Views
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View>
        <Text>MainScreen</Text>

        <TouchableOpacity
          style={{padding: 10, margin: 10}}
          onPress={() => LogOut()}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;
