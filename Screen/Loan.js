import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { primaryColor, textColor, fontSize, fontWeight } from './constant/color';
import HeaderComponent from '../common/Header';
import { Header } from '@react-navigation/stack';

const Loan = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View>
        <HeaderComponent titleText="LoanScreen" onPress={handleGoBack} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
});

export default Loan;
