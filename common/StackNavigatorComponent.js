import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons'; // Import the icons

// import ToggleFormScreen from '../Screen/LoginPages/ToggleFormScreen';
import DashboardScreen from '../Screen/Dashboards/Dashboard';
import HomeLoanDetailsScreen from '../Screen/userDetails/HomeLoanDetailsScreen';
import PersonalLoanDetailsScreen from '../Screen/userDetails/PersonalLoanDetailScreen';
import EditHomeLoan from '../Screen/Loan/EditHomeLoan';
import EditPersonalLoan from '../Screen/Loan/EditPersonalLoan';
import HomeScreen from '../Screen/LoanCreate/HomeScreen';
import PersonalLoan from '../Screen/LoanCreate/PersonalLoan';
import DynamicDashboardScreen from '../Screen/DynamicDashboardScreen';
import Loan from '../Screen/Loan';
import Setting from '../Screen/setting';
import CustomDrawerContent from './CustomDrawer';
import ScheduleDetailsScreen from '../Screen/EMI/ScheduleDetailScreen';
import AmortizationScreen from '../Screen/EMI/AmortizationScreen';
import ScheduleDetailsScreenHomeLoan from '../Screen/EMI/ScheduleDetailsScreenHomeLoan';
import AmortizationScreenHome from '../Screen/EMI/AmortizationScreenHome';
import SignatureScreen from '../signature';
import AccountScreen from '../Screen/Account';
import ToggleFormScreen from '../Screen/ToggleFormScreen';
// import HomeLoanGaurantee from '../Screen/Gaurantee/HomeLoanGaurantee';
import LoginScreen from '../Screen/LoginPages/LoginScreen';
import LoginManagerScreen from '../Screen/LoginPages/LoginManagerScreen';
import ManagerDashboard from '../Screen/Dashboards/ManagerDashboard';
import AuthNavigator from '../context/AuthNavigator';
import HomeLoanGurantee from '../Screen/Gaurantee/HomeLoanGaurantee';
import HomeLoanGurantee2 from '../Screen/Gaurantee/HomeLoanGaurantee2';
import PersonalLoanGurantee from '../Screen/Gaurantee/PersonalLoanGurantee';
import PersonalLoanGurantee2 from '../Screen/Gaurantee/PersonalLoanGurantee2';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Example icons for each screen
const DashboardIcon = () => <Ionicons name="md-home" size={24} color="red" />;
const AccountIcon = () => <Ionicons name="md-person" size={24} color="red" />;
const LoanIcon = () => <Ionicons name="md-cash" size={24} color="red" />;
const SettingIcon = () => <Ionicons name="md-settings" size={24} color="red" />;

const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="AuthNavigator" component={AuthNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} options={{ headerShown: false }} />
    <Stack.Screen name="ToggleFormScreen" component={ToggleFormScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LoginManagerScreen" component={LoginManagerScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HomeLoanDetailsScreen" component={HomeLoanDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PersonalLoanDetailsScreen" component={PersonalLoanDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HomeLoan" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PersonalLoan" component={PersonalLoan} options={{ headerShown: false }} />
    <Stack.Screen name="EditHomeLoan" component={EditHomeLoan} options={{ headerShown: false }} />
    <Stack.Screen name="EditPersonalLoan" component={EditPersonalLoan} options={{ headerShown: false }} />
    <Stack.Screen name="AmortizationScreen" component={AmortizationScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ScheduleDetailsScreen" component={ScheduleDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ScheduleDetailsScreenHomeLoan" component={ScheduleDetailsScreenHomeLoan} options={{ headerShown: false }} />
    <Stack.Screen name="AmortizationScreenHome" component={AmortizationScreenHome} options={{ headerShown: false }} />
    <Stack.Screen name="SignatureScreen" component={SignatureScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
    <Stack.Screen name="AccountScreen" component={AccountScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HomeLoanGurantee" component={HomeLoanGurantee} options={{ headerShown: false }} />
    <Stack.Screen name="HomeLoanGurantee2" component={HomeLoanGurantee2} options={{ headerShown: false }} />
    <Stack.Screen name="PersonalLoanGurantee" component={PersonalLoanGurantee} options={{ headerShown: false }} />
    <Stack.Screen name="PersonalLoanGurantee2" component={PersonalLoanGurantee2} options={{ headerShown: false }} />
    <Stack.Screen name="DynamicDashboardScreen" component={DynamicDashboardScreen} options={{
      headerShown: false,
      unmountOnBlur: true,
    }} />
  </Stack.Navigator>
);

// const DrawerNavigator = () => (
//   <Drawer.Navigator
//   initialRouteName='Dashboards'
//   drawerContent={(props) => <CustomDrawerContent {...props} />}
//     screenOptions={{
//       drawerStyle: {
//         width: 210,
//         height: "100%"
//       },
//       drawerLabelStyle: {
//         color: 'red',
//         fontSize: 15
//       },
//       drawerItemStyle: {
//         borderBottomColor: 'gray',
//         borderBottomWidth: 1,
//       },
//     }}>
//        <Drawer.Screen
//       name="Dashboards"
//       component={StackNavigator}
//       options={{
//         headerShown: false,
//         drawerIcon: DashboardIcon,
//       }}
//     />
//       <Drawer.Screen
//       name="Profile"
//       component={AccountScreen}
//       options={{
//         headerShown: false,
//         drawerIcon: AccountIcon,
//       }}
//     />
//     {/* <Drawer.Screen
//       name="Dashboards"
//       component={StackNavigator}
//       options={{
//         headerShown: false,
//         drawerIcon: DashboardIcon,
//       }}
//     /> */}
//     <Drawer.Screen
//       name="Loans"
//       component={Loan}
//       options={{
//         headerShown: false,
//         drawerIcon: LoanIcon,
//       }}
//     />
//     <Drawer.Screen
//       name="Settings"
//       component={Setting}
//       options={{
//         headerShown: false,
//         drawerIcon: SettingIcon,
//         drawerItemStyle: {
//           marginBottom: 500
//         },
//       }}
//     />
//   </Drawer.Navigator>
// );

// const AllStackScreens = () => (
//   <Drawer.Navigator>
//     <Drawer.Screen name="MainScreen" component={DrawerNavigator} options={{ headerShown: false }} />
//   </Drawer.Navigator>
// );

export default StackNavigator;
