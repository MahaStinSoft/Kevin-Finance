// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DrawerNavigator from './Drawer';
import ToggleFormScreen from './Screen/ToggleFormScreen';

const App = () => {
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

  if (isLoggedIn === null) {
    // Loading or Splash screen while checking authentication state
    return null;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <DrawerNavigator />
      ) : (
        <ToggleFormScreen handleLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
};

export default App;
