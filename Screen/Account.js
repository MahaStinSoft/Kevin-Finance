import React, { useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';

const Account = ({ navigation }) => {
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true; 
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  return (
    <View>
      <Text>Account</Text>
    </View>
  );
};

export default Account;
