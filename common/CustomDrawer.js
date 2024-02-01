import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
{/* <View style={styles.drawerHeader}>
        <Text style={styles.headerText}>My App</Text>
      </View> */}
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

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default CustomDrawerContent;

// CustomDrawer.js
// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const CustomDrawerContent = (props) => {
//   const handleLogout = async () => {
//     // Perform logout logic here
//     await AsyncStorage.removeItem('isLoggedIn');
//     // Add any additional cleanup or navigation logic
//     props.navigation.navigate('ToggleFormScreen'); // Replace with your login screen
//   };

//   return (
//     <DrawerContentScrollView {...props}>
//       <View style={styles.drawerHeader}>
//         {/* You can customize the header as needed */}
//         <Text style={styles.headerText}>My App</Text>
//       </View>
//       <DrawerItemList {...props} />
//       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </DrawerContentScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   drawerHeader: {
//     padding: 16,
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   logoutButton: {
//     padding: 16,
//     borderTopColor: '#ccc',
//     borderTopWidth: 1,
//   },
//   logoutText: {
//     fontSize: 16,
//     color: 'red', // Customize the color as needed
//   },
// });

// export default CustomDrawerContent;
