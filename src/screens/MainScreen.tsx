import { API_URL, NAVER_MAP_API_KEY_ID, NAVER_MAP_API_SECRET } from '@env';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const MainScreen = () => {
  // Logic
  const navigation = useNavigation();
  const [address, setAddress] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  // const [filterData, setFilterData] = useState([]);
  // const [masterData, setMasterData] = useState([]);

  const userCollection = firestore().collection('users');

  const onAuthStateChanged = (user: any) => {
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
    if (user) {
      try {
        return firebase
          .auth()
          .currentUser?.delete()
          .then(() => {
            console.log('Logout');
            userCollection.doc(user?.uid).delete();
            navigation.navigate('Login');
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // const searchAddress = async (address: string) => {
  //   try {
  //     const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         "address": address
  //       })
  //     });
  //     const resultJSON = await response.json();
  //     setAddress(resultJSON);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // await axios
  //   .get(apiURL, {
  //     params: {
  //       query: address,
  //     },
  //     headers: {
  //       'X-NCP-APIGW-API-KEY-ID': apiKeyID,
  //       'X-NCP-APIGW-API-KEY': apiKey,
  //     },
  //   })
  //   .then(res => console.log(res.data))
  //   .catch(err => {
  //     console.log(err);
  //   });

  const searchAddress = async (address: string) => {
    try {
      const apiURL = API_URL;
      const clientID = NAVER_MAP_API_KEY_ID;
      const clientSecret = NAVER_MAP_API_SECRET;

      const response = await axios.get(apiURL, {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': clientID,
          'X-NCP-APIGW-API-KEY': clientSecret,
        },
        params: {
          query: address,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const test = async () => {
  //   try {
  //     const apiURL = 'https://jsonplaceholder.typicode.com/posts';
  //     fetch(apiURL)
  //       .then(res => res.json())
  //       .then(resJson => {
  //         setFilterData(resJson);
  //         setMasterData(resJson);
  //       })
  //       .catch(err => {
  //         console.log('err: ', err);
  //       });
  //   } catch (error) {
  //     console.log('error: ', error);
  //   }
  // };

  // const searchFilter = text => {
  //   if (text) {
  //     const newData = masterData.filter(item => {
  //       const itemData = item.title ? item.title : '';
  //       const textData = text;
  //       return itemData.indexOf(textData) > -1;
  //     });
  //     setFilterData(newData);
  //     setAddress(text);
  //   } else {
  //     setFilterData(masterData);
  //     setAddress(text);
  //   }
  // };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  // useEffect(() => {
  //   searchAddress();
  // }, []);

  if (initializing) {
    return null;
  }

  // const renderItem = ({item}) => {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         padding: 10,
  //       }}>
  //       <TouchableOpacity
  //         onPress={() => {
  //           navigation.navigate('Item', {item: item, user: user});
  //         }}>
  //         <Text style={{alignSelf: 'flex-start'}}>{item.title}</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  // const ItemSeparatorView = () => {
  //   return (
  //     <View style={{height: 0.5, width: '100%', backgroundColor: '#c8c8c8'}} />
  //   );
  // };

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
          />
        </View>

        <View
          style={{
            margin: 10,
            padding: 10,
            backgroundColor: 'yellow',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => searchAddress(address)}>
            <Text>검색</Text>
          </TouchableOpacity>
        </View>
        <View>
          {/* <FlatList
            data={filterData}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={renderItem}
          /> */}
        </View>

        {/* <View style={{alignSelf: 'flex-start'}}>
          <Text>uid: {user?.uid}</Text>
        </View>

        <View style={{alignSelf: 'flex-start'}}>
          <Text>displayName: {user?.displayName}</Text>
        </View>
        <View style={{alignSelf: 'flex-start'}}>
          <Text>email: {user?.email}</Text>
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
        </TouchableOpacity> */}
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
