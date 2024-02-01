// DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import AuthNavigator from './context/AuthNavigator';
import CustomDrawerContent from './common/CustomDrawer';
import ToggleFormScreen from './Screen/ToggleFormScreen';
import DashboardScreen from './Screen/Dashboard';
import Account from './Screen/Account';
import Loan from './Screen/Loan';
import Setting from './Screen/setting';

const Drawer = createDrawerNavigator();

const DashboardIcon = () => <Ionicons name="md-home" size={24} color="red" />;
const AccountIcon = () => <Ionicons name="md-person" size={24} color="red" />;
const LoanIcon = () => <Ionicons name="md-cash" size={24} color="red" />;
const SettingIcon = () => <Ionicons name="md-settings" size={24} color="red" />;

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
    initialRouteName="Dashboards"
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
      name="Accounts"
      component={Account}
      options={{
        headerShown: false,
        drawerIcon: AccountIcon,
      }}
    />
    <Drawer.Screen
      name="Dashboards"
      component={AuthNavigator}
      options={{
        headerShown: false,
        drawerIcon: DashboardIcon,
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
};

export default DrawerNavigator;