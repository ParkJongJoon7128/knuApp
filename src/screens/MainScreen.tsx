import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

const MainScreen = () => {
  // Logic
  const navigation = useNavigation();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const userCollection = firestore().collection('users');

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  };

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

  const Delete = () => {
    const user = firebase.auth().currentUser;
    if(user){
      try {
        return firebase
        .auth()
        .currentUser?.delete()
        .then(() => {
            console.log('Logout');
            userCollection.doc(user?.uid).delete();
            navigation.navigate('Login');
          })
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return null;
  }

  // Views
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View>
        <View>
          <Text>{user?.uid}</Text>
        </View>

        <View>
          <Text>{user?.displayName}</Text>
        </View>

        <View>
          <Text>{user?.email}</Text>
        </View>

        <TouchableOpacity
          style={{padding: 10, margin: 10}}
          onPress={() => LogOut()}>
          <Text>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{padding: 10, margin: 10}}
          onPress={() => Delete()}>
          <Text>회원 탈퇴</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;
