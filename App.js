import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainScreen from './MainScreen';
import firebase from '@react-native-firebase/app';
import usePushNotification from './common/usePushNotification';
import messaging from '@react-native-firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBXW7aUGrXkTO6FV0DeSFfDwhovMTemITE",
  authDomain: "crm-financeapp.firebaseapp.com	",
  projectId: "crm-financeapp",
  storageBucket: "crm-financeapp.appspot.com",
  messagingSenderId: "568359651963	",
  appId: "1:568359651963:android:9b420a28c2436576ceb0de",
  // measurementId: "YOUR_MEASUREMENT_ID"
  databaseURL: "https://console.firebase.google.com/project/crm-financeapp/firestore/data/~2F",
};

// Check if Firebase is already initialized to avoid multiple initializations
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const App = () => {

  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

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


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MainScreen />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
