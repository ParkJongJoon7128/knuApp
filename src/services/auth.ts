import { firebase } from '@react-native-firebase/auth';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Alert } from 'react-native';

export const Register = (
  name: string,
  email: string,
  password: string,
  navigation: NavigationProp<ParamListBase>,
) => {
  if (!name || !email || !password) {
    Alert.alert('값을 입력해주세요');
  } else {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        const {uid} = result.user;
        firebase.auth().currentUser?.updateProfile({
          displayName: name,
        });
        console.log(
          result.user.email,
          result.user.displayName,
          result.user.uid,
        );
        navigation.navigate('Login');
        return uid;
      })
      .catch(err => {
        console.log(err.message);
      });
  }
};

export const Login = (
  email: string,
  password: string,
  navigation: NavigationProp<ParamListBase>,
) => {
  if (!email || !password) {
    Alert.alert('값을 입력해주세요');
  } else {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        console.log(
          result.user.email,
          result.user.displayName,
          result.user.uid,
        );
        navigation.navigate('Main');
      })
      .catch(err => {
        console.log(err.message);
      });
  }
};

export const LogOut = (navigation: NavigationProp<ParamListBase>) => {
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
