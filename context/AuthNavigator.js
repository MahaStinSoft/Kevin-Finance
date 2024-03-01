import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardScreen from '../Screen/Dashboards/Dashboard';
import ManagerDashboard from '../Screen/Dashboards/ManagerDashboard';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const [matchedUser, setMatchedUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchAuthenticatedUser = async () => {
      try {
        const userJSON = await AsyncStorage.getItem('authenticatedUser');
        if (userJSON) {
          const user = JSON.parse(userJSON);
          setMatchedUser(user);
        }
      } catch (error) {
        console.error('Error fetching authenticated user:', error);
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };

    fetchAuthenticatedUser();
  }, []);

  // Assume you have some logic to determine the user's role (admin or manager)
  const isLoggedInAsManager = matchedUser && matchedUser.accountrolecode === 3;

  if (loading) {
    return null; // You can render a loader while fetching user data
  }

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
