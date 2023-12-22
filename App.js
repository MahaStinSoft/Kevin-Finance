import React, {useState, useEffect} from 'react';
import {Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import ToggleFormScreen from './Screen/ToggleFormScreen';
import LoginForm from './Screen/LoginForm';
import StackNavigatorComponent from './common/StackNavigatorComponent';
import DrawerContent from './common/DrawerIcon';
import Dashboard from './Screen/Dashboard';
import Account from './Screen/Account';
import Loan from './Screen/Loan';
import Setting from './Screen/setting';

const Drawer = createDrawerNavigator();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(value === 'true');
    } catch (error) {
      console.error('Error retrieving authentication state:', error);
    }
  };

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);
    if (isLoggedIn !== null) {
      console.log('Navigation to dashboard:', isLoggedIn);
    }
  }, [isLoggedIn]);

  if (isLoggedIn === null) {
    // Loading or Splash screen while checking authentication state
    return null;
  }
  return (
    <NavigationContainer>
      {isLoggedIn? (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
        {/* <Drawer.Screen name="Home" component={StackNavigatorComponent} options={{ headerShown: false }}/> */}
        <Drawer.Screen name="Dashboards" component={Dashboard} options={{ headerShown: false }}/>
       <Drawer.Screen name="Accounts" component={Account} options={{ headerShown: false }}/>
       <Drawer.Screen name="Loans" component={Loan} options={{ headerShown: false }}/>
       <Drawer.Screen name="Settings" component={Setting} options={{ headerShown: false }}/>
       <Drawer.Screen name="ToggleFormScreen" component={ToggleFormScreen} options={{ headerShown: false }}/>
      </Drawer.Navigator>
      ):(
        <ToggleFormScreen/>
      )}
    </NavigationContainer>
  );
}

export default App;

