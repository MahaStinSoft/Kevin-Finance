import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNavigatorComponent from './common/StackNavigatorComponent';
import DrawerContent from './common/DrawerIcon';
import Dashboard from './Screen/Dashboard';
import Account from './Screen/Account';
import Loan from './Screen/Loan';
import Setting from './Screen/setting';

const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={StackNavigatorComponent} options={{ headerShown: false }}/>
        <Drawer.Screen name="Dashboards" component={Dashboard} options={{ headerShown: false }}/>
       <Drawer.Screen name="Accounts" component={Account} options={{ headerShown: false }}/>
       <Drawer.Screen name="Loans" component={Loan} options={{ headerShown: false }}/>
       <Drawer.Screen name="Settings" component={Setting} options={{ headerShown: false }}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;

