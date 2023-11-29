import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Dashboard from './Screen/Dashboard';
import ToggleFormScreen from './Screen/ToggleFormScreen';
import Logo from './Screen/Logo';
import Account from './Screen/Account';
import Loan from './Screen/Loan';
import Setting from './Screen/setting';
import HomeScreen from './Screen/HomeScreen';
import PersonalLoan from './Screen/PersonalLoan';
import SplashScreen from './Screen/SplashScreen';
import LoginForm from './Screen/LoginForm';

const LogoImage = () => {
  return (
    <View>
      <Logo />
    </View>
  );
}

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator initialRouteName="ToggleFormScreen">
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
          headerShown: true,
          animationEnabled: false,
          gestureEnabled: false,
          headerStyle: {
            backgroundColor: 'rgba(255, 28, 53, 255)', // Set the desired background color
          },
        }}
      />
      <Stack.Screen
        name="PersonalScreen"
        component={PersonalLoan}
        options={{
          headerShown: true,
          animationEnabled: false,
          gestureEnabled: false,
          headerStyle: {
            backgroundColor: 'rgba(255, 28, 53, 255)', // Set the desired background color
          },
        }}
      />
      <Stack.Screen
        name="setting"
        component={Setting}
        options={{
          headerShown: true,
          animationEnabled: false,
          gestureEnabled: false,
          headerStyle: {
            backgroundColor: 'rgba(255, 28, 53, 255)', // Set the desired background color
          },
        }}
      />
    </Stack.Navigator>
  );
}

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <DrawerItemList {...props} />
      <View style={styles.logoutButtonContainer}>
        <DrawerItem
          label="Logout"
          onPress={() => props.navigation.navigate("ToggleFormScreen")}
          labelStyle={{ color: 'rgba(255, 28, 53, 255)' }} 
        />
      </View>
    </DrawerContentScrollView>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="HomeScreen"
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerLabelStyle: {
            color: 'rgba(255, 28, 53, 255)',
          },
        }}
      >
        <Drawer.Screen
          name="HomeScreen"
          component={DashboardStack}
          options={{
            headerRight: () => (
              <TouchableOpacity
                style={styles.notificationIcon}
                onPress={() => console.log('Notification icon pressed')}
              >
                <Icon name="bell" size={20} color="red" />
              </TouchableOpacity>
            ),
            headerShown: false, // Hide header for this screen
          }}
        />
        <Drawer.Screen
          name="Account"
          component={Account}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen name="Loans" component={Loan} 
        options={{
          headerShown: false,
        }}/>
        <Drawer.Screen name="Settings" component={Setting} 
        options={{
          headerShown: false,
        }}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    borderTopWidth: 1,
    borderTopColor: 'gray',
  },
  logoutButtonContainer: {
    marginTop: 500, 
  },
  notificationIcon: {
    marginRight: 15,
  },
});

export default App;
