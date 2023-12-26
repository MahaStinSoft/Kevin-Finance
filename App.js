import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ToggleFormScreen from './Screen/ToggleFormScreen';
import DrawerContent from './common/DrawerIcon';
import DashboardScreen from './Screen/Dashboard';
import Account from './Screen/Account';
import Loan from './Screen/Loan';
import Setting from './Screen/setting';
import ContactDetailsScreen from './common/ContactDetailsScreen';
import HomeScreen from './Screen/HomeScreen';
import PersonalLoan from './Screen/PersonalLoan';
import EditScreen from './Screen/EditScreen';

const Drawer = createDrawerNavigator();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    // Reset isLoggedIn to null when the component mounts
    setIsLoggedIn(null);
  }, []);

  const checkLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(value === 'true');
    } catch (error) {
      console.error('Error retrieving authentication state:', error);
    }
  };

  const handleLogin = () => {
    // Update isLoggedIn state and navigate to Dashboard
    setIsLoggedIn(true);
  };

  // const handleLogout = async () => {
  //   // Update isLoggedIn state, remove user data, and navigate to ToggleFormScreen
  //   setIsLoggedIn(false);
  //   await AsyncStorage.removeItem('isLoggedIn');
  // };

  if (isLoggedIn === null) {
    // Loading or Splash screen while checking authentication state
    return null;
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
        {isLoggedIn ? (
          <>
            <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="Accounts" component={Account} options={{ headerShown: false }} />
            <Drawer.Screen name="Loans" component={Loan} options={{ headerShown: false }} />
            <Drawer.Screen name="Settings" component={Setting} options={{ headerShown: false }} />
            <Drawer.Screen name="ToggleFormScreen" component={ToggleFormScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="UserDetails" component={ContactDetailsScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="PersonalScreen" component={PersonalLoan} options={{ headerShown: false }} />
            <Drawer.Screen name="HomeLoan" component={HomeScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="EditScreen" component={EditScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <Drawer.Screen name="ToggleFormScreen" component={ToggleFormScreen} options={{ headerShown: false }} initialParams={{ handleLogin }} />
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;

