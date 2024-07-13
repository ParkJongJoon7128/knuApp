import React from 'react';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';

const SearchLocationScreen = () => {
  // Logics

  // Views
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <Text>SearchLocationScreen</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchLocationScreen;
