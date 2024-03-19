// import React, { useEffect, useState } from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import DashboardScreen from '../Screen/Dashboards/Dashboard';
// import ManagerDashboard from '../Screen/Dashboards/ManagerDashboard';
// import UserDashboard from '../Screen/Dashboards/UserDashboard';

// const Stack = createStackNavigator();

// const AuthNavigator = () => {
//   const [matchedUser, setMatchedUser] = useState(null);
//   const [loading, setLoading] = useState(true); // Add loading state


//   useEffect(() => {
//     const fetchAuthenticatedUser = async () => {
//       try {
//         const userJSON = await AsyncStorage.getItem('authenticatedUser');
//         if (userJSON) {
//           const user = JSON.parse(userJSON);
//           setMatchedUser(user);
//         }
//       } catch (error) {
//         console.error('Error fetching authenticated user:', error);
//       } finally {
//         setLoading(false); // Set loading to false once fetching is done
//       }
//     };

//     fetchAuthenticatedUser();
//   }, []);

//   if (loading) {
//     return null; // You can render a loader while fetching user data
//   }

//   // Adjust the logic based on your requirements
//   const isLoggedInAsManager = matchedUser && matchedUser.accountrolecode === 3;
//   const isLoggedInAsUser = matchedUser && matchedUser.kf_email && matchedUser.kf_email.endsWith('.com');

//   return (
//     <Stack.Navigator>
//       {isLoggedInAsUser ? (
//         <Stack.Screen
//           name="UserDashboard"
//           component={UserDashboard}
//           options={{ headerShown: false }}
//         />
//       ) : isLoggedInAsManager ? (
//         <Stack.Screen
//           name="ManagerDashboard"
//           component={ManagerDashboard}
//           options={{ headerShown: false }}
//         />
//       ) :(
//         <Stack.Screen
//           name="Dashboard"
//           component={DashboardScreen}
//           options={{ headerShown: false }}
//         />
//       )}
//     </Stack.Navigator>
//   );
// };

// export default AuthNavigator;




// import React, { useEffect, useState } from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import DashboardScreen from '../Screen/Dashboards/Dashboard';
// import ManagerDashboard from '../Screen/Dashboards/ManagerDashboard';
// import UserDashboard from '../Screen/Dashboards/UserDashboard';
// import { BackHandler } from 'react-native'; // Import BackHandler from 'react-native'

// const Stack = createStackNavigator();

// const AuthNavigator = () => {
//   const [matchedUser, setMatchedUser] = useState(null);
//   const [loading, setLoading] = useState(true); // Add loading state

//   useEffect(() => {
//     const fetchAuthenticatedUser = async () => {
//       try {
//         const userJSON = await AsyncStorage.getItem('authenticatedUser');
//         if (userJSON) {
//           const user = JSON.parse(userJSON);
//           setMatchedUser(user);
//         }
//       } catch (error) {
//         console.error('Error fetching authenticated user:', error);
//       } finally {
//         setLoading(false); // Set loading to false once fetching is done
//       }
//     };

//     fetchAuthenticatedUser();
//   }, []);

//   useEffect(() => {
//     const handleBackButton = () => {
//       if (matchedUser) {
//         BackHandler.exitApp(); // Close the app if the user is logged in
//         return true; // Prevent default behavior
//       }
//       return false; // Allow default behavior (go back)
//     };

//     BackHandler.addEventListener('hardwareBackPress', handleBackButton);

//     return () => {
//       BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
//     };
//   }, [matchedUser]);

//   // Adjust the logic based on your requirements
//   const isLoggedInAsManager = matchedUser && matchedUser.accountrolecode === 3;
//   const isLoggedInAsUser = matchedUser && matchedUser.kf_email && matchedUser.kf_email.endsWith('.com');

//   return (
//     <Stack.Navigator>
//       {isLoggedInAsUser ? (
//         <Stack.Screen
//           name="UserDashboard"
//           component={UserDashboard}
//           options={{ headerShown: false }}
//         />
//       ) : isLoggedInAsManager ? (
//         <Stack.Screen
//           name="ManagerDashboard"
//           component={ManagerDashboard}
//           options={{ headerShown: false }}
//         />
//       ) :(
//         <Stack.Screen
//           name="Dashboard"
//           component={DashboardScreen}
//           options={{ headerShown: false }}
//         />
//       )}
//     </Stack.Navigator>
//   );
// };

// export default AuthNavigator;




// import React, { useEffect, useState } from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import DashboardScreen from '../Screen/Dashboards/Dashboard';
// import ManagerDashboard from '../Screen/Dashboards/ManagerDashboard';
// import UserDashboard from '../Screen/Dashboards/UserDashboard';
// import { BackHandler } from 'react-native';

// const Stack = createStackNavigator();

// const AuthNavigator = () => {
//   const [matchedUser, setMatchedUser] = useState(null);
//   const [loading, setLoading] = useState(true); // Add loading state

//   useEffect(() => {
//     const fetchAuthenticatedUser = async () => {
//       try {
//         const userJSON = await AsyncStorage.getItem('authenticatedUser');
//         if (userJSON) {
//           const user = JSON.parse(userJSON);
//           setMatchedUser(user);
//         }
//       } catch (error) {
//         console.error('Error fetching authenticated user:', error);
//       } finally {
//         setLoading(false); // Set loading to false once fetching is done
//       }
//     };

//     fetchAuthenticatedUser();
//   }, []);

//   useEffect(() => {
//     const handleBackButton = () => {
//       // Close the app when back button is pressed
//       BackHandler.exitApp();
//       return true; // Prevent default behavior
//     };

//     BackHandler.addEventListener('hardwareBackPress', handleBackButton);

//     return () => {
//       BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
//     };
//   }, []);

//   // Adjust the logic based on your requirements
//   const isLoggedInAsManager = matchedUser && matchedUser.accountrolecode === 3;
//   const isLoggedInAsUser = matchedUser && matchedUser.kf_email && matchedUser.kf_email.endsWith('.com');

//   return (
//     <Stack.Navigator>
//       {isLoggedInAsUser ? (
//         <Stack.Screen
//           name="UserDashboard"
//           component={UserDashboard}
//           options={{ headerShown: false }}
//         />
//       ) : isLoggedInAsManager ? (
//         <Stack.Screen
//           name="ManagerDashboard"
//           component={ManagerDashboard}
//           options={{ headerShown: false }}
//         />
//       ) :(
//         <Stack.Screen
//           name="Dashboard"
//           component={DashboardScreen}
//           options={{ headerShown: false }}
//         />
//       )}
//     </Stack.Navigator>
//   );
// };

// export default AuthNavigator;



import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardScreen from '../Screen/Dashboards/Dashboard';
import ManagerDashboard from '../Screen/Dashboards/ManagerDashboard';
import UserDashboard from '../Screen/Dashboards/UserDashboard';
// import LoginScreen from '../Screen/Login'; // Import your Login screen
import LoginScreen from '../Screen/LoginPages/LoginScreen';

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
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
