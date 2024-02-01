
// MainScreen.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthNavigator from './common/StackNavigatorComponent';
import ToggleFormScreen from './Screen/ToggleFormScreen';
import AllStackScreens from './common/StackNavigatorComponent';
import DashboardScreen from './Screen/Dashboard';
import HomeLoanCard from './Screen/card/HomeLoanCard';
import PersonalLoanCard from './Screen/card/PersonalLoanCard';
import EditHomeLoan from './Screen/Loan/EditHomeLoan';
import EditPersonalLoan from './Screen/Loan/EditPersonalLoan';
import HomeScreen from './Screen/HomeScreen';
import PersonalLoan from './Screen/PersonalLoan';
import HomeLoanDetailsScreen from './Screen/userDetails/HomeLoanDetailsScreen';
import PersonalLoanDetailsScreen from './Screen/userDetails/PersonalLoanDetailScreen';

import Logo from './Screen/Logo';

const Stack = createNativeStackNavigator();

const MainScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  console.log('LoginStatus', isLoggedIn);

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
    <Stack.Navigator>
      {isLoggedIn ? (
          <Stack.Screen name="Main" component={AllStackScreens} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="ToggleFormScreen" component={ToggleFormScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HomeLoan" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PersonalLoan" component={PersonalLoan} options={{ headerShown: false }} />
          <Stack.Screen name="EditHomeLoan" component={EditHomeLoan}  options={{ headerShown: false }}/>
          <Stack.Screen name="EditPersonalLoan" component={EditPersonalLoan} options={{ headerShown: false }} />
          <Stack.Screen name="HomeLoanDetailsScreen" component={HomeLoanDetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PersonalLoanDetailsScreen" component={PersonalLoanDetailsScreen} options={{ headerShown: false }} />
          </>
      )}
      </Stack.Navigator>
  );
};

export default MainScreen;
