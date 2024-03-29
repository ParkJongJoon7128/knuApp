import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

const ItemScreen = () => {
  // Logics

  const navigation = useNavigation<ROOT_NAVIGATION>();

  // Views
  return (
    <SafeAreaView>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>ItemScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default ItemScreen;
