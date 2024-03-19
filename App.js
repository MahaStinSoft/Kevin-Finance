// import React, { useState, useEffect } from 'react';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { NavigationContainer } from '@react-navigation/native';
// import MainScreen from './MainScreen';
// import firebase from '@react-native-firebase/app';

// const firebaseConfig = {
//   apiKey: "AIzaSyBXW7aUGrXkTO6FV0DeSFfDwhovMTemITE",
//   authDomain: "crm-financeapp.firebaseapp.com	",
//   projectId: "crm-financeapp",
//   storageBucket: "crm-financeapp.appspot.com",
//   messagingSenderId: "568359651963	",
//   appId: "1:568359651963:android:9b420a28c2436576ceb0de",
//   // measurementId: "YOUR_MEASUREMENT_ID"
//   databaseURL: "https://console.firebase.google.com/project/crm-financeapp/firestore/data/~2F",
// };

// // Check if Firebase is already initialized to avoid multiple initializations
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// const App = () => {

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <NavigationContainer>
//         <MainScreen />
//       </NavigationContainer>
//     </GestureHandlerRootView>
//   );
// };

// export default App;





// import React, { useState, useEffect } from 'react';
// import { Alert } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { NavigationContainer } from '@react-navigation/native';
// import MainScreen from './MainScreen';
// import firebase from '@react-native-firebase/app';
// import usePushNotification from './common/usePushNotification';
// import messaging from '@react-native-firebase/messaging';

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

// const App = () => {

//   const {
//     requestUserPermission,
//     getFCMToken,
//     listenToBackgroundNotifications,
//     listenToForegroundNotifications,
//     onNotificationOpenedAppFromBackground,
//     onNotificationOpenedAppFromQuit,
//   } = usePushNotification();

//   useEffect(() => {
//     const listenToNotifications = () => {
//       try {
//         getFCMToken();
//         requestUserPermission();
//         onNotificationOpenedAppFromQuit();
//         listenToBackgroundNotifications();
//         listenToForegroundNotifications();
//         onNotificationOpenedAppFromBackground();
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     listenToNotifications();
//   }, []);

//   useEffect(() => {
//     // Handle incoming FCM messages when the app is in the foreground
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       // Display the notification content in an in-app notification
//       Alert.alert(
//         remoteMessage.notification.title,
//         remoteMessage.notification.body,
//         [
//           {
//             text: 'OK',
//             onPress: () => console.log('OK Pressed')
//           }
//         ]
//       );
//     });

//     // Clean up the subscription when the component unmounts
//     return unsubscribe;
//   }, []);

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <NavigationContainer>
//         <MainScreen />
//       </NavigationContainer>
//     </GestureHandlerRootView>
//   );
// };

// export default App;



import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainScreen from './MainScreen';
import firebase from '@react-native-firebase/app';
import usePushNotification from './common/usePushNotification';
import messaging from '@react-native-firebase/messaging';
import NetInfo from "@react-native-community/netinfo";

const App = () => {
  const [isConnected, setIsConnected] = useState(true);

  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

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

  useEffect(() => {
    const listenToNotifications = () => {
      try {
        getFCMToken();
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToBackgroundNotifications();
        listenToForegroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (error) {
        console.log(error);
      }
    };

    listenToNotifications();
  }, []);

  useEffect(() => {
    // Handle incoming FCM messages when the app is in the foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Display the notification content in an in-app notification
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed')
          }
        ]
      );
    });

    // Clean up the subscription when the component unmounts
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isConnected) {
      Alert.alert(
        "No Internet Connection",
        "Please check your internet connection and try again.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    }
  }, [isConnected]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MainScreen />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
