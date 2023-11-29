import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import ToggleFormScreen from './ToggleFormScreen';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';
import Logo from './Logo';


const LogoImage = () => {

  return (
    <View style={styles.logoContainer}>
    <Logo/>
  </View>
);
}

const Stack = createStackNavigator();

function MainScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="ToggleForm"
          component={ToggleFormScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="Dashboard" component={Dashboard} 
        options={{
          headerShown: true,
          animationEnabled: false,
          gestureEnabled: false,
          headerLeft: () => <LogoImage/>,
        }}/>
        <Stack.Screen name="Login" component={LoginForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginLeft: -90,
    backgroundColor: '#009387',
    padding: 10,
    borderRadius: 80,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  logo: {
    color: '#fff',
    fontSize: 15,
  },
});
