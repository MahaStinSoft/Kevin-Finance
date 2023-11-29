import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { primaryColor,textColor, fontSize, fontWeight } from './constant/color';

const Setting = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={handleGoBack}>
        <Ionicons name="chevron-back" size={40} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.accountText}>Setting Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5, 
    backgroundColor: primaryColor
  },
  iconButton: {
    marginRight: 16, 
  },
  accountText: {
    flex: 1, 
    textAlign: 'center',
    color: textColor,
    fontSize: fontSize,
    fontWeight: fontWeight
  },
});

export default Setting;
