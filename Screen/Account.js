import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../common/Header';

const Account = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <HeaderComponent titleText="Account" onPress={handleGoBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
});

export default Account;
