import React from 'react';
// import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ToggleFormScreen from '../Screen/ToggleFormScreen';
import Dashboard from '../Screen/Dashboard';
import PersonalLoan from '../Screen/PersonalLoan';
import LoginForm from '../Screen/LoginForm';
import SplashScreen from '../Screen/SplashScreen';
import Logo from '../Screen/Logo';
import HomeScreen from '../Screen/HomeScreen';
import Setting from '../Screen/setting';
import ContactDetailsScreen from './ContactDetailsScreen'; 

const Stack = createStackNavigator();

const LogoImage = () => {
  return (
    <Logo />
  );
}
// initialRouteName="ToggleFormScreen"
const StackNavigatorComponent = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator >
      {/* <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          headerShown: false,
          animationEnabled: false,
          gestureEnabled: false,
          headerLeft: () => <LogoImage />,
        }}
      /> */}
      <Stack.Screen
        name="ToggleFormScreen"
        component={ToggleFormScreen}
        options={{
          headerShown: false,
          animationEnabled: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginForm}
        options={{
          headerShown: false,
          animationEnabled: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
          animationEnabled: false,
          gestureEnabled: false,
          headerStyle: {
            backgroundColor: 'rgba(255, 28, 53, 255)',
          },
        }}
      />
      <Stack.Screen
        name="HomeLoan"
        component={HomeScreen}
        options={{
          headerShown: false,
          animationEnabled: false,
          gestureEnabled: false,
          headerStyle: {
            backgroundColor: 'rgba(255, 28, 53, 255)',
          },
        }}
      />
      <Stack.Screen
        name="PersonalScreen"
        component={PersonalLoan}
        options={{
          headerShown: false,
          animationEnabled: false,
          gestureEnabled: false,
          headerStyle: {
            backgroundColor: 'rgba(255, 28, 53, 255)',
          },
        }}
      />
      <Stack.Screen
        name="setting"
        component={Setting}
        options={{
          headerShown: false,
          animationEnabled: false,
          gestureEnabled: false,
          headerStyle: {
            backgroundColor: 'rgba(255, 28, 53, 255)',
          },
        }}
      />
      <Stack.Screen
        name="UserDetails"
        component={ContactDetailsScreen}
        options={{
          headerShown: false,
          animationEnabled: false,
          gestureEnabled: false,
          headerStyle: {
            backgroundColor: 'rgba(255, 28, 53, 255)',
          },
        }}
      />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigatorComponent;
