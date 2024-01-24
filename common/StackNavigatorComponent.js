import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons'; // Import the icons

import ToggleFormScreen from '../Screen/ToggleFormScreen';
import DashboardScreen from '../Screen/Dashboard';
import HomeLoanDetailsScreen from '../Screen/userDetails/HomeLoanDetailsScreen';
import PersonalLoanDetailsScreen from '../Screen/userDetails/PersonalLoanDetailScreen';
import EditHomeLoan from '../Screen/Loan/EditHomeLoan';
import EditPersonalLoan from '../Screen/Loan/EditPersonalLoan';
import HomeScreen from '../Screen/HomeScreen';
import PersonalLoan from '../Screen/PersonalLoan';
import DynamicDashboardScreen from '../Screen/DynamicDashboardScreen';
import Account from '../Screen/Account';
import Loan from '../Screen/Loan';
import Setting from '../Screen/setting';
import CustomDrawerContent from './CustomDrawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Example icons for each screen
const DashboardIcon = () => <Ionicons name="md-home" size={24} color="red" />;
const AccountIcon = () => <Ionicons name="md-person" size={24} color="red" />;
const LoanIcon = () => <Ionicons name="md-cash" size={24} color="red" />;
const SettingIcon = () => <Ionicons name="md-settings" size={24} color="red" />;

const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ToggleFormScreen" component={ToggleFormScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HomeLoanDetailsScreen" component={HomeLoanDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PersonalLoanDetailsScreen" component={PersonalLoanDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HomeLoan" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PersonalLoan" component={PersonalLoan} options={{ headerShown: false }} />
    <Stack.Screen name="EditHomeLoan" component={EditHomeLoan} options={{ headerShown: false }} />
    <Stack.Screen name="EditPersonalLoan" component={EditPersonalLoan} options={{ headerShown: false }} />
    <Stack.Screen name="DynamicDashboardScreen" component={DynamicDashboardScreen} options={{
          headerShown: false,
          unmountOnBlur: true,  
        }} />
  </Stack.Navigator>
);

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerStyle: {
        width: 210,
      },
      drawerLabelStyle: {
        color: 'red', 
        fontSize: 15
      },
      drawerItemStyle: {
        borderBottomColor: 'gray', 
        borderBottomWidth: 1, 
      },
    }}>
    <Drawer.Screen
      name="Dashboards"
      component={StackNavigator}
      options={{
        headerShown: false,
        drawerIcon: DashboardIcon, 
      }}
    />
    <Drawer.Screen
      name="Accounts"
      component={Account}
      options={{
        headerShown: false,
        drawerIcon: AccountIcon, 
      }}
    />
    <Drawer.Screen
      name="Loans"
      component={Loan}
      options={{
        headerShown: false,
        drawerIcon: LoanIcon, 
      }}
    />
    <Drawer.Screen
      name="Settings"
      component={Setting}
      options={{
        headerShown: false,
        drawerIcon: SettingIcon, 
      drawerItemStyle: {
        marginBottom: 500
      },
      }}
    />
  </Drawer.Navigator>
);

const AuthNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Main" component={DrawerNavigator} options={{ headerShown: false }} />
  </Drawer.Navigator>
);

export default AuthNavigator;
