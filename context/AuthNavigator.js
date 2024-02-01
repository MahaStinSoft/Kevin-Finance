// AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardScreen from '../Screen/Dashboard';
import ToggleFormScreen from '../Screen/ToggleFormScreen';
import HomeLoanDetailsScreen from '../Screen/userDetails/HomeLoanDetailsScreen';
import PersonalLoanDetailsScreen from '../Screen/userDetails/PersonalLoanDetailScreen'; 
import HomeScreen from '../Screen/HomeScreen';
import PersonalLoan from '../Screen/PersonalLoan';
import EditHomeLoan from '../Screen/Loan/EditHomeLoan';
import EditPersonalLoan from '../Screen/Loan/EditPersonalLoan';
import AccountScreen from '../Screen/Account';
import Loan from '../Screen/Loan';
import Setting from '../Screen/setting';

import DrawerNavigator from '../Drawer';


const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator 
    // initialRouteName='ToggleFormScreen'
    >
    <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ToggleFormScreen" component={ToggleFormScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HomeLoanDetailsScreen" component={HomeLoanDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PersonalLoanDetailsScreen" component={PersonalLoanDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HomeLoan" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PersonalLoan" component={PersonalLoan} options={{ headerShown: false }} />
    <Stack.Screen name="EditHomeLoan" component={EditHomeLoan} options={{ headerShown: false }} />
    <Stack.Screen name="EditPersonalLoan" component={EditPersonalLoan} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
