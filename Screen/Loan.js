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
    navigation.navigate("Dashboard");
  };

  const handleSavedRecordHomeLoan = () => {
    navigation.navigate("HomeLoan");
    console.log("Home Loan Selected");
  };

  const handleSavedRecord = () => {
    navigation.navigate("PersonalScreen");
    console.log("Personal loan Selected");
  };

  return (
    <View style={styles.container}>
      <View>
        <HeaderComponent titleText="LoanScreen" onPress={handleGoBack} />
      </View>
      <TouchableOpacity
        style={[styles.loanOption, { borderBottomWidth: 1, borderBottomColor: '#ccc' }]}
        onPress={handleSavedRecordHomeLoan}
      >
        <Text style={styles.loanOptionText}>Home Loan</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loanOption} onPress={handleSavedRecord}>
        <Text style={styles.loanOptionText}>Personal Loan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // paddingHorizontal: 20,
  },
  loanOption: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 20,
  },
  loanOptionText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Loan;
