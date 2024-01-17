// DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ToggleFormScreen from './Screen/ToggleFormScreen';
import DrawerContent from './common/DrawerIcon';
import DashboardScreen from './Screen/Dashboard';
import Account from './Screen/Account';
import Loan from './Screen/Loan';
import Setting from './Screen/setting';
import HomeLoanDetailsScreen from './Screen/userDetails/HomeLoanDetailsScreen';
import PersonalLoanDetailsScreen from './Screen/userDetails/PersonalLoanDetailScreen';
import HomeScreen from './Screen/HomeScreen';
import PersonalLoan from './Screen/PersonalLoan';
import EditHomeLoan from './Screen/Loan/EditHomeLoan';
import EditpersonalLoan from './Screen/Loan/EditPersonalLoan';
import DynamicDashboardScreen from './Screen/DynamicDashboardScreen';
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} screenOptions={{
        drawerStyle: {
          width: 210,
        },
      }}>
      <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="Accounts" component={Account} options={{ headerShown: false }} />
            <Drawer.Screen name="Loans" component={Loan} options={{ headerShown: false }} />
            <Drawer.Screen name="Settings" component={Setting} options={{ headerShown: false }} />
            <Drawer.Screen name="ToggleFormScreen" component={ToggleFormScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="HomeLoanDetailsScreen" component={HomeLoanDetailsScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="PersonalLoanDetailsScreen" component={PersonalLoanDetailsScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="PersonalLoan" component={PersonalLoan} options={{ headerShown: false }} />
            <Drawer.Screen name="HomeLoan" component={HomeScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="EditHomeLoan" component={EditHomeLoan} options={{ headerShown: false }} />
            <Drawer.Screen name="EditPersonalLoan" component={EditpersonalLoan} options={{ headerShown: false }} />
             <Drawer.Screen
        name="DynamicDashboardScreen"
        component={DynamicDashboardScreen}
        options={{
          headerShown: false,
          unmountOnBlur: true,  // Add this option to prevent reloading
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;