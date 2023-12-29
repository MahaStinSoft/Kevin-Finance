// DrawerContent.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { Ionicons } from '@expo/vector-icons';

const DrawerContent = () => {
  const navigation = useNavigation();

  const handleDrawerItem = (screen) => {
    navigation.navigate(screen);
  };

  const handledLogout = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'false');
      navigation.navigate("ToggleFormScreen");
    } catch (error) {
      console.error('Error clearing authentication state:', error);
    }
    // navigation.navigate("ToggleFormScreen");
  };
  return (
    <View style={styles.container}>
    <TouchableOpacity onPress={() => handleDrawerItem('Dashboards')} style={styles.drawersection}>
      <Ionicons name='home' color="#888" size={20}/>
      <Text style={styles.drawerText}>Dashboard</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleDrawerItem('Accounts')} style={styles.drawersection}>
    <Ionicons name='person' color="#888" size={20}/>
      <Text style={styles.drawerText}>Account</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleDrawerItem('Loans')} style={styles.drawersection}>
    <Ionicons name="md-business"  color="#888" size={20}/>
      <Text style={styles.drawerText}>Loan</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleDrawerItem('Settings')} style={{flexDirection:"row", margin: 10, padding: 5}}>
    <Ionicons name= "settings-sharp"  color="#888" size={20}/>
      <Text style={styles.drawerText}>Setting</Text>
    </TouchableOpacity>
    <View style={styles.logoutContainer}>
    <TouchableOpacity onPress={handledLogout} style={styles.logoutSection}>
    <Ionicons name= "log-out"  color="#888" size={20}/>
      <Text style={styles.drawerLogoutText}>Logout</Text>
    </TouchableOpacity>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    marginTop: 30,
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 25,
    left: 10,
    width: "90%"
  },
  logoutSection: {
    flexDirection:"row",
    margin: 5, 
    borderTopColor: "#d3d3d3",
    borderTopWidth:1,
    padding: 5
  },
  drawersection:{
    borderBottomColor: '#d3d3d3',
    borderBottomWidth:1,
    flexDirection:"row",
    margin: 10, 
    padding:5
  },
  drawerText:{
    fontSize: 18,
    // marginTop: 0, 
    marginLeft: 15, 
  },
  drawerLogoutText: {
    fontSize: 20,
    marginTop: -5,
    marginLeft: 15
  }
});

export default DrawerContent;
