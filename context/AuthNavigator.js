import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardScreen from '../Screen/Dashboards/Dashboard';
import ManagerDashboard from '../Screen/Dashboards/ManagerDashboard';
import UserDashboard from '../Screen/Dashboards/UserDashboard';
// import LoginScreen from '../Screen/Login'; // Import your Login screen
import LoginScreen from '../Screen/LoginPages/LoginScreen';
import Setting from '../Screen/setting';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const [matchedUser, setMatchedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backPressCount, setBackPressCount] = useState(0);

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
        setLoading(false);
      }
    };

    fetchAuthenticatedUser();
  }, []);

 

  const isLoggedInAsManager = matchedUser && matchedUser.accountrolecode === 3;
  const isLoggedInAsUser = matchedUser && matchedUser.kf_email && matchedUser.kf_email.endsWith('.com');

  return (
    <Stack.Navigator>
      {isLoggedInAsUser ? (
        <Stack.Screen
          name="UserDashboard"
          component={UserDashboard}
          options={{ headerShown: false }}
        />
      ) : isLoggedInAsManager ? (
        <Stack.Screen
          name="ManagerDashboard"
          component={ManagerDashboard}
          options={{ headerShown: false }}
        />
      ) :(
        <>
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
        name="Setting"
        component={Setting}
        options={{ headerShown: false }}
        initialParams={{ isLoggedInAsManager: isLoggedInAsManager }}
      />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
