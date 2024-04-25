import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// import ToggleFormScreen from '../Screen/LoginPages/ToggleFormScreen';
import DashboardScreen from '../Screen/Dashboards/Dashboard';
import HomeLoanDetailsScreen from '../Screen/userDetails/HomeLoanDetailsScreen';
import PersonalLoanDetailsScreen from '../Screen/userDetails/PersonalLoanDetailScreen';
import EditHomeLoan from '../Screen/Loan/EditHomeLoan';
import EditPersonalLoan from '../Screen/Loan/EditPersonalLoan';
import HomeScreen from '../Screen/LoanCreate/HomeScreen';
import PersonalLoan from '../Screen/LoanCreate/PersonalLoan';
import DynamicDashboardScreen from '../Screen/DynamicDashboardScreen';
import Setting from '../Screen/setting';
import AmortizationScreen from '../Screen/EMI/AmortizationScreen';
import AmortizationScreenHome from '../Screen/EMI/AmortizationScreenHome';
import SignatureScreen from '../Screen/Signature/signature';
import PersonalSignatureScreen from '../Screen/Signature/PersonalSignatureScreen';
import AccountScreen from '../Screen/Account';
import LoginScreen from '../Screen/LoginPages/LoginScreen';
import LoginManagerScreen from '../Screen/LoginPages/LoginManagerScreen';
import ManagerDashboard from '../Screen/Dashboards/ManagerDashboard';
import AuthNavigator from '../context/AuthNavigator';
import HomeLoanGurantee from '../Screen/Gaurantee/HomeLoanGaurantee';
import HomeLoanGurantee2 from '../Screen/Gaurantee/HomeLoanGaurantee2';
import PersonalLoanGurantee from '../Screen/Gaurantee/PersonalLoanGurantee';
import PersonalLoanGurantee2 from '../Screen/Gaurantee/PersonalLoanGurantee2';
import EditLoanDetail from '../Screen/EMI/EditLoanDetail';
import SendNotification from './SendNotification';
import Gurantee1SignatureHome from '../Screen/Signature/Gurantee1SignatureHome';
import Gurantee2SignatureHome from '../Screen/Signature/Gurantee2SignatureHome';
import Gurantee1SignaturePersonal from '../Screen/Signature/Gurantee1SignaturePersonal';
import Gurantee2SignaturePersonal from '../Screen/Signature/Gurantee2SignaturePersonal';
import LoginForm from '../Screen/LoginPages/LoginForm';
import LoginUserForm from '../Screen/LoginPages/LoginUser';
import UserDashboard from '../Screen/Dashboards/UserDashboard';
import UserRegisterScreen from '../Screen/LoginPages/UserRegister';
import UserConfrim from '../Screen/LoginPages/USerConfrim';
import Welcome from '../Screen/LoginPages/Welcome';
import VerificationScreen from '../Screen/LoginPages/Verification';
import Notification from '../Screen/notification/Notification';
import AdminNotification from '../Screen/notification/AdminNotification';
import UserNotification from '../Screen/notification/UserNotification';

const Stack = createStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="AuthNavigator" component={AuthNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
    <Stack.Screen name="UserConfrim" component={UserConfrim} options={{ headerShown: false }} />
    <Stack.Screen name="UserRegisterScreen" component={UserRegisterScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} options={{ headerShown: false }} />
    <Stack.Screen name="LoginForm" component={LoginForm} options={{ headerShown: false }} />
    <Stack.Screen name="LoginManagerScreen" component={LoginManagerScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HomeLoanDetailsScreen" component={HomeLoanDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PersonalLoanDetailsScreen" component={PersonalLoanDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HomeLoan" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PersonalLoan" component={PersonalLoan} options={{ headerShown: false }} />
    <Stack.Screen name="EditHomeLoan" component={EditHomeLoan} options={{ headerShown: false }} />
    <Stack.Screen name="EditPersonalLoan" component={EditPersonalLoan} options={{ headerShown: false }} />
    <Stack.Screen name="AmortizationScreen" component={AmortizationScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AmortizationScreenHome" component={AmortizationScreenHome} options={{ headerShown: false }} />
    <Stack.Screen name="SignatureScreen" component={SignatureScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PersonalSignatureScreen" component={PersonalSignatureScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
    <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
    <Stack.Screen name="AccountScreen" component={AccountScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HomeLoanGurantee" component={HomeLoanGurantee} options={{ headerShown: false }} />
    <Stack.Screen name="HomeLoanGurantee2" component={HomeLoanGurantee2} options={{ headerShown: false }} />
    <Stack.Screen name="PersonalLoanGurantee" component={PersonalLoanGurantee} options={{ headerShown: false }} />
    <Stack.Screen name="PersonalLoanGurantee2" component={PersonalLoanGurantee2} options={{ headerShown: false }} />
    <Stack.Screen name="EditLoanDetail" component={EditLoanDetail} options={{ headerShown: false }} />
    <Stack.Screen name="SendNotification" component={SendNotification} options={{ headerShown: false }} />
    <Stack.Screen name="AdminNotification" component={AdminNotification} options={{ headerShown: false }} />
    <Stack.Screen name="Gurantee1SignatureHome" component={Gurantee1SignatureHome} options={{ headerShown: false }} />
    <Stack.Screen name="Gurantee2SignatureHome" component={Gurantee2SignatureHome} options={{ headerShown: false }} />
    <Stack.Screen name="Gurantee1SignaturePersonal" component={Gurantee1SignaturePersonal} options={{ headerShown: false }} />
    <Stack.Screen name="Gurantee2SignaturePersonal" component={Gurantee2SignaturePersonal} options={{ headerShown: false }} />
    <Stack.Screen name="LoginUserForm" component={LoginUserForm} options={{ headerShown: false }} />
    <Stack.Screen name="UserDashboard" component={UserDashboard} options={{ headerShown: false }} />
    <Stack.Screen name="VerificationScreen" component={VerificationScreen} options={{ headerShown: false }} />
    <Stack.Screen name="UserNotification" component={UserNotification} options={{ headerShown: false }} />
    <Stack.Screen name="DynamicDashboardScreen" component={DynamicDashboardScreen} options={{
      headerShown: false,
      unmountOnBlur: true,
    }} />
  </Stack.Navigator>
);

export default StackNavigator;
