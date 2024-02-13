import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../Screen/Dashboards/Dashboard';
import ManagerDashboard from '../Screen/Dashboards/ManagerDashboard';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  // Assume you have some logic to determine the user's role (admin or manager)
  const isLoggedInAsManager = true; // Placeholder logic for demonstration

  return (
    <Stack.Navigator>
      {isLoggedInAsManager ? (
        <Stack.Screen
          name="ManagerDashboard"
          component={ManagerDashboard}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
