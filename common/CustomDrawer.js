import React from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons'; // Import the icons
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawerContent = (props) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'false');
      // Check if navigation prop is available before using it
      if (props.navigation) {
        props.navigation.navigate('ToggleFormScreen');
      }
    } catch (error) {
      console.error('Error clearing authentication state:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
        icon={({ focused, color, size }) => (
          <Ionicons name="md-log-out" size={size} color="red" />
        )}
        labelStyle={{
          color: 'red', 
          fontSize: 15
        }}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
