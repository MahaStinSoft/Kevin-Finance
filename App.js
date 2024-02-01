import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainScreen from './MainScreen';

const App = () => {
<<<<<<< HEAD
=======
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
    return null;
  }
>>>>>>> 89a9976f91d5025128048b9c9d12d1f686b472d9

  return (
    <NavigationContainer>
      <MainScreen/>
    </NavigationContainer>
  );
};

export default App;
