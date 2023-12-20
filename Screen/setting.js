import React from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../common/Header';

const Setting = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View>
      <View>
     <HeaderComponent titleText="SettingScreen" onPress={handleGoBack}/></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'blue', 
  },
  iconButton: {
    marginRight: 16,
  },
  accountText: {
    flex: 1,
    textAlign: 'center',
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginRight: 50,
  },
});

export default Setting;
