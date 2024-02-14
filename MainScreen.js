
// MainScreen.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthNavigator from './common/StackNavigatorComponent';
import AllStackScreens from './common/StackNavigatorComponent';
import DashboardScreen from './Screen/Dashboards/Dashboard';
import HomeLoanCard from './Screen/card/HomeLoanCard';
import PersonalLoanCard from './Screen/card/PersonalLoanCard';
import EditHomeLoan from './Screen/Loan/EditHomeLoan';
import EditPersonalLoan from './Screen/Loan/EditPersonalLoan';
import HomeScreen from './Screen/LoanCreate/HomeScreen';
import PersonalLoan from './Screen/LoanCreate/PersonalLoan';
import HomeLoanDetailsScreen from './Screen/userDetails/HomeLoanDetailsScreen';
import PersonalLoanDetailsScreen from './Screen/userDetails/PersonalLoanDetailScreen';
import ScheduleDetailsScreen from './Screen/EMI/ScheduleDetailScreen';
import AmortizationScreen from './Screen/EMI/AmortizationScreen';
import ScheduleDetailsScreenHomeLoan from './Screen/EMI/ScheduleDetailsScreenHomeLoan';
import AmortizationScreenHome from './Screen/EMI/AmortizationScreenHome';
import ToggleFormScreen from './Screen/ToggleFormScreen';
import AccountScreen from './Screen/Account';
import Setting from './Screen/setting';
import LoginManagerScreen from './Screen/LoginPages/LoginManagerScreen';
import LoginScreen from './Screen/LoginPages/LoginScreen';
import ManagerDashboard from './Screen/Dashboards/ManagerDashboard';

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
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ToggleFormScreen" component={ToggleFormScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HomeLoan" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PersonalLoan" component={PersonalLoan} options={{ headerShown: false }} />
          <Stack.Screen name="EditHomeLoan" component={EditHomeLoan}  options={{ headerShown: false }}/>
          <Stack.Screen name="EditPersonalLoan" component={EditPersonalLoan} options={{ headerShown: false }} />
          <Stack.Screen name="HomeLoanDetailsScreen" component={HomeLoanDetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PersonalLoanDetailsScreen" component={PersonalLoanDetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AmortizationScreen" component={AmortizationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ScheduleDetailsScreen" component={ScheduleDetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ScheduleDetailsScreenHomeLoan" component={ScheduleDetailsScreenHomeLoan} options={{ headerShown: false }} />
          <Stack.Screen name="AmortizationScreenHome" component={AmortizationScreenHome} options={{ headerShown: false }} />
          <Stack.Screen name="AccountScreen" component={AccountScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
          <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} options={{ headerShown: false }} />
          <Stack.Screen name="LoginManagerScreen" component={LoginManagerScreen} options={{ headerShown: false }} />
          </>
      )}
      </Stack.Navigator>
  );
};

export default MainScreen;
