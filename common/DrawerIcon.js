// DrawerContent.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DrawerContent = ({ navigation }) => {
  const handleDrawerItem = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleDrawerItem('Dashboards')}>
        <Text>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDrawerItem('Accounts')}>
        <Text>Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDrawerItem('Loans')}>
        <Text>Loan</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDrawerItem('Settings')}>
        <Text>Setting</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default DrawerContent;
