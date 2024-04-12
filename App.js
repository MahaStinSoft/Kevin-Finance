// // import React, { useState, useEffect } from 'react';
// // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // import { NavigationContainer } from '@react-navigation/native';
// // import MainScreen from './MainScreen';
// // import firebase from '@react-native-firebase/app';

// // const firebaseConfig = {
// //   apiKey: "AIzaSyBXW7aUGrXkTO6FV0DeSFfDwhovMTemITE",
// //   authDomain: "crm-financeapp.firebaseapp.com	",
// //   projectId: "crm-financeapp",
// //   storageBucket: "crm-financeapp.appspot.com",
// //   messagingSenderId: "568359651963	",
// //   appId: "1:568359651963:android:9b420a28c2436576ceb0de",
// //   // measurementId: "YOUR_MEASUREMENT_ID"
// //   databaseURL: "https://console.firebase.google.com/project/crm-financeapp/firestore/data/~2F",
// // };

// // // Check if Firebase is already initialized to avoid multiple initializations
// // if (!firebase.apps.length) {
// //   firebase.initializeApp(firebaseConfig);
// // }

// // const App = () => {

// //   return (
// //     <GestureHandlerRootView style={{ flex: 1 }}>
// //       <NavigationContainer>
// //         <MainScreen />
// //       </NavigationContainer>
// //     </GestureHandlerRootView>
// //   );
// // };

// // export default App;





// // import React, { useState, useEffect } from 'react';
// // import { Alert } from 'react-native';
// // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // import { NavigationContainer } from '@react-navigation/native';
// // import MainScreen from './MainScreen';
// // import firebase from '@react-native-firebase/app';
// // import usePushNotification from './common/usePushNotification';
// // import messaging from '@react-native-firebase/messaging';

// // // const firebaseConfig = {
// // //   apiKey: "AIzaSyBXW7aUGrXkTO6FV0DeSFfDwhovMTemITE",
// // //   authDomain: "crm-financeapp.firebaseapp.com	",
// // //   projectId: "crm-financeapp",
// // //   storageBucket: "crm-financeapp.appspot.com",
// // //   messagingSenderId: "568359651963	",
// // //   appId: "1:568359651963:android:9b420a28c2436576ceb0de",
// // //   // measurementId: "YOUR_MEASUREMENT_ID"
// // //   databaseURL: "https://console.firebase.google.com/project/crm-financeapp/firestore/data/~2F",
// // // };

// // // // Check if Firebase is already initialized to avoid multiple initializations
// // // if (!firebase.apps.length) {
// // //   firebase.initializeApp(firebaseConfig);
// // // }

// // const App = () => {

// //   const {
// //     requestUserPermission,
// //     getFCMToken,
// //     listenToBackgroundNotifications,
// //     listenToForegroundNotifications,
// //     onNotificationOpenedAppFromBackground,
// //     onNotificationOpenedAppFromQuit,
// //   } = usePushNotification();

// //   useEffect(() => {
// //     const listenToNotifications = () => {
// //       try {
// //         getFCMToken();
// //         requestUserPermission();
// //         onNotificationOpenedAppFromQuit();
// //         listenToBackgroundNotifications();
// //         listenToForegroundNotifications();
// //         onNotificationOpenedAppFromBackground();
// //       } catch (error) {
// //         console.log(error);
// //       }
// //     };

// //     listenToNotifications();
// //   }, []);

// //   useEffect(() => {
// //     // Handle incoming FCM messages when the app is in the foreground
// //     const unsubscribe = messaging().onMessage(async remoteMessage => {
// //       // Display the notification content in an in-app notification
// //       Alert.alert(
// //         remoteMessage.notification.title,
// //         remoteMessage.notification.body,
// //         [
// //           {
// //             text: 'OK',
// //             onPress: () => console.log('OK Pressed')
// //           }
// //         ]
// //       );
// //     });

// //     // Clean up the subscription when the component unmounts
// //     return unsubscribe;
// //   }, []);

// //   return (
// //     <GestureHandlerRootView style={{ flex: 1 }}>
// //       <NavigationContainer>
// //         <MainScreen />
// //       </NavigationContainer>
// //     </GestureHandlerRootView>
// //   );
// // };

// // export default App;



import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainScreen from './MainScreen';
// import firebase from '@react-native-firebase/app';
// import usePushNotification from './common/usePushNotification';
// import messaging from '@react-native-firebase/messaging';
import NetInfo from "@react-native-community/netinfo";
import CustomAlert from './common/CustomAlert';

const App = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [showAlert, setShowAlert] = useState(false); 

  // const {
  //   requestUserPermission,
  //   getFCMToken,
  //   listenToBackgroundNotifications,
  //   listenToForegroundNotifications,
  //   onNotificationOpenedAppFromBackground,
  //   onNotificationOpenedAppFromQuit,
  // } = usePushNotification();

  useEffect(() => {
    const listenToNetwork = () => {
      NetInfo.fetch().then(state => {
        setIsConnected(state.isConnected);
      });

      const unsubscribe = NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected);
      });

      return () => {
        unsubscribe();
      };
    };

    listenToNetwork();
  }, []);

  // useEffect(() => {
  //   const listenToNotifications = () => {
  //     try {
  //       getFCMToken();
  //       requestUserPermission();
  //       onNotificationOpenedAppFromQuit();
  //       listenToBackgroundNotifications();
  //       listenToForegroundNotifications();
  //       onNotificationOpenedAppFromBackground();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   listenToNotifications();
  // }, []);

  // useEffect(() => {
  //   // Handle incoming FCM messages when the app is in the foreground
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     // Display the notification content in an in-app notification
  //     Alert.alert(
  //       remoteMessage.notification.title,
  //       remoteMessage.notification.body,
  //       [
  //         {
  //           text: 'OK',
  //           onPress: () => console.log('OK Pressed')
  //         }
  //       ]
  //     );
  //   });

  //   // Clean up the subscription when the component unmounts
  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Network state changed:', state.isConnected);
      setIsConnected(state.isConnected);

      if (!state.isConnected) {
        console.log('No Internet Connection');
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MainScreen />
        <CustomAlert
          // visible={handleShowAlert}
          visible={showAlert && !isConnected}
          onClose={handleCloseAlert}
          onConfirm={handleCloseAlert}
          headerMessage="No Internet Connection"
          message="Please check your internet connection and try again."
          Button1="Cancel"
          Button2="OK"
          style={[styles.alertStyle, {height: "23%"}]}
          modalHeaderStyle={[styles.modalheaderStyle, {right: 40}]}
          textStyle={styles.textStyle}
        />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  alertStyle:{
    // backgroundColor: "blue",
    width: "80%",
      },
      modalheaderStyle:{
        // backgroundColor: "green",
        right: 85
      },
      textStyle:{
        // backgroundColor: "yellow"
      }
});

export default App;






// import React, {useState, useEffect} from 'react';

// import {
//   SafeAreaView,
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   PermissionsAndroid,
//   Platform,
//   Button,
// } from 'react-native';

// //import all the components we are going to use.
// import Geolocation from '@react-native-community/geolocation';

// const App = () => {
//   const [
//     currentLongitude,
//     setCurrentLongitude
//   ] = useState('...');
//   const [
//     currentLatitude,
//     setCurrentLatitude
//   ] = useState('...');
//   const [
//     locationStatus,
//     setLocationStatus
//   ] = useState('');

//   useEffect(() => {
//     const requestLocationPermission = async () => {
//       if (Platform.OS === 'ios') {
//         getOneTimeLocation();
//         subscribeLocationLocation();
//       } else {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             {
//               title: 'Location Access Required',
//               message: 'This App needs to Access your location',
//             },
//           );
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             //To Check, If Permission is granted
//             getOneTimeLocation();
//             subscribeLocationLocation();
//           } else {
//             setLocationStatus('Permission Denied');
//           }
//         } catch (err) {
//           console.warn(err);
//         }
//       }
//     };
//     requestLocationPermission();
//     return () => {
//       Geolocation.clearWatch(watchID);
//     };
//   }, []);

//   const getOneTimeLocation = () => {
//     setLocationStatus('Getting Location ...');
//     Geolocation.getCurrentPosition(
//       //Will give you the current location
//       (position) => {
//         setLocationStatus('You are Here');

//         //getting the Longitude from the location json
//         const currentLongitude = 
//           JSON.stringify(position.coords.longitude);

//         //getting the Latitude from the location json
//         const currentLatitude = 
//           JSON.stringify(position.coords.latitude);

//         //Setting Longitude state
//         setCurrentLongitude(currentLongitude);
        
//         //Setting Longitude state
//         setCurrentLatitude(currentLatitude);
//       },
//       (error) => {
//         setLocationStatus(error.message);
//       },
//       {
//         enableHighAccuracy: false,
//         timeout: 30000,
//         maximumAge: 1000
//       },
//     );
//   };

//   const subscribeLocationLocation = () => {
//     watchID = Geolocation.watchPosition(
//       (position) => {
//         //Will give you the location on location change
        
//         setLocationStatus('You are Here');
//         console.log(position);

//         //getting the Longitude from the location json        
//         const currentLongitude =
//           JSON.stringify(position.coords.longitude);

//         //getting the Latitude from the location json
//         const currentLatitude = 
//           JSON.stringify(position.coords.latitude);

//         //Setting Longitude state
//         setCurrentLongitude(currentLongitude);

//         //Setting Latitude state
//         setCurrentLatitude(currentLatitude);
//       },
//       (error) => {
//         setLocationStatus(error.message);
//       },
//       {
//         enableHighAccuracy: false,
//         maximumAge: 1000
//       },
//     );
//   };

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <View style={styles.container}>
//         <View style={styles.container}>
//           <Image
//             source={{
//               uri:
//                 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/location.png',
//             }}
//             style={{width: 100, height: 100}}
//           />
//           <Text style={styles.boldText}>
//             {locationStatus}
//           </Text>
//           <Text
//             style={{
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginTop: 16,
//             }}>
//             Longitude: {currentLongitude}
//           </Text>
//           <Text
//             style={{
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginTop: 16,
//             }}>
//             Latitude: {currentLatitude}
//           </Text>
//           <View style={{marginTop: 20}}>
//             <Button
//               title="Refresh"
//               onPress={getOneTimeLocation}
//             />
//           </View>
//         </View>
//         <Text
//           style={{
//             fontSize: 18,
//             textAlign: 'center',
//             color: 'grey'
//           }}>
//           React Native Geolocation
//         </Text>
//         <Text
//           style={{
//             fontSize: 16,
//             textAlign: 'center',
//             color: 'grey'
//           }}>
//           www.aboutreact.com
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   boldText: {
//     fontSize: 25,
//     color: 'red',
//     marginVertical: 16,
//     textAlign: 'center'
//   },
// });

// export default App;






// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   PermissionsAndroid,
//   Platform,
//   Button,
// } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';

// const App = () => {
//   const [currentLongitude, setCurrentLongitude] = useState('...');
//   const [currentLatitude, setCurrentLatitude] = useState('...');
//   const [locationStatus, setLocationStatus] = useState('');
//   const [currentAddress, setCurrentAddress] = useState('');

//   useEffect(() => {
//     const requestLocationPermission = async () => {
//       if (Platform.OS === 'ios') {
//         getOneTimeLocation();
//         subscribeLocationLocation();
//       } else {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             {
//               title: 'Location Access Required',
//               message: 'This App needs to Access your location',
//             },
//           );
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             getOneTimeLocation();
//             subscribeLocationLocation();
//           } else {
//             setLocationStatus('Permission Denied');
//           }
//         } catch (err) {
//           console.warn(err);
//         }
//       }
//     };
//     requestLocationPermission();
//     return () => {
//       Geolocation.clearWatch(watchID);
//     };
//   }, []);

//   const getOneTimeLocation = () => {
//     setLocationStatus('Getting Location ...');
//     Geolocation.getCurrentPosition(
//       (position) => {
//         setLocationStatus('You are Here');
//         const currentLongitude = JSON.stringify(position.coords.longitude);
//         const currentLatitude = JSON.stringify(position.coords.latitude);
//         setCurrentLongitude(currentLongitude);
//         setCurrentLatitude(currentLatitude);

//         // Call function to fetch address
//         fetchAddress(position.coords.latitude, position.coords.longitude);
//       },
//       (error) => {
//         setLocationStatus(error.message);
//       },
//       {
//         enableHighAccuracy: false,
//         timeout: 30000,
//         maximumAge: 1000,
//       },
//     );
//   };

//   const fetchAddress = async (latitude, longitude) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
//       );
//       const data = await response.json();
//       if (data.display_name) {
//         setCurrentAddress(data.display_name);
//       } else {
//         setCurrentAddress('Address not found');
//       }
//     } catch (error) {
//       console.error('Error fetching address:', error);
//       setCurrentAddress('Error fetching address');
//     }
//   };

//   const subscribeLocationLocation = () => {
//     watchID = Geolocation.watchPosition(
//       (position) => {
//         setLocationStatus('You are Here');
//         const currentLongitude = JSON.stringify(position.coords.longitude);
//         const currentLatitude = JSON.stringify(position.coords.latitude);
//         setCurrentLongitude(currentLongitude);
//         setCurrentLatitude(currentLatitude);

//         // Call function to fetch address
//         fetchAddress(position.coords.latitude, position.coords.longitude);
//       },
//       (error) => {
//         setLocationStatus(error.message);
//       },
//       {
//         enableHighAccuracy: false,
//         maximumAge: 1000,
//       },
//     );
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View style={styles.container}>
//         <View style={styles.container}>
//           <Image
//             source={{
//               uri:
//                 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/location.png',
//             }}
//             style={{ width: 100, height: 100 }}
//           />
//           <Text style={styles.boldText}>{locationStatus}</Text>
//           <Text
//             style={{
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginTop: 16,
//             }}>
//             Latitude: {currentLatitude}
//           </Text>
//           <Text
//             style={{
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginTop: 16,
//             }}>
//             Longitude: {currentLongitude}
//           </Text>
         
//           <Text
//             style={{
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginTop: 16,
//             }}>
//             Address: {currentAddress}
//           </Text>
//           <View style={{ marginTop: 20 }}>
//             <Button title="Refresh" onPress={getOneTimeLocation} />
//           </View>
//         </View>
//         <Text
//           style={{
//             fontSize: 18,
//             textAlign: 'center',
//             color: 'grey',
//           }}>
//           React Native Geolocation
//         </Text>
//         <Text
//           style={{
//             fontSize: 16,
//             textAlign: 'center',
//             color: 'grey',
//           }}>
//           www.aboutreact.com
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   boldText: {
//     fontSize: 25,
//     color: 'red',
//     marginVertical: 16,
//     textAlign: 'center',
//   },
// });

// export default App;
