import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, StyleSheet } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRoute } from '@react-navigation/native'; 
import { useNavigation } from '@react-navigation/native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export default function SendNotification({ sendApproval }) {
  const route = useRoute(); // Get route object using useRoute hook
  const navigation = useNavigation();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [loanApplication, setLoanApplication] = useState(route.params.loanApplication || {});
  const [recordId, setRecordId] = useState(route.params.loanApplication?.kf_loanApplicationid || '');
  
  console.log('Send notification:', sendApproval);

  // useEffect(() => {
  //   if (sendApproval === 'Yes') {
  //     schedulePushNotification(applicationnumber, firstname, lastname, loanAmount, createdby);
  //   }
  // }, [sendApproval]);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    schedulePushNotification(applicationnumber, firstname, lastname, loanAmount, createdby);

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // const { applicationnumber, firstname, lastname, loanAmountRequested } = route.params;
  const { applicationnumber,firstname, lastname, loanAmount, createdby } = route.params; // Access firstname, lastname, and loanAmount from route.params
  // Access applicationnumber from route.params
  console.log("applicationnumber: ", firstname);

  return (
    <View style={styles.Container}>
      <Text>Created By: {createdby}</Text>
      <Text>ApplicationNumber: {applicationnumber}</Text>
      <Text>Name: {firstname}{lastname}</Text>
      <Text>Loan Amount : {loanAmount}</Text>
    </View>
  );

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "New Application Created",
//       body: 'One new application arrived from createdby ',
//       data: { 
//         applicationnumber: applicationnumber,
//         firstname: firstname,
//         lastname: lastname,
//         loanAmount: loanAmount,
//         createdby: createdby
//       },
//     },
//     trigger: { seconds: 2 },
//   });
// }

async function schedulePushNotification(applicationnumber, firstname, lastname, loanAmount, createdby) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Kevin Finance App`,
      body: `Application has been arrived\nCreated By: ${createdby}\nApplication No: ${applicationnumber}\nApplicant Name: ${firstname} ${lastname}`,
      data: { 
        applicationnumber: applicationnumber,
        firstname: firstname,
        lastname: lastname,
        loanAmount: loanAmount,
        createdby: createdby
      },
    },
    trigger: { seconds: 2 },
  });
  navigation.navigate('EditHomeLoan', { applicationnumber, firstname, lastname, loanAmount, createdby, loan, loanApplication });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})





// import { useState, useEffect, useRef } from 'react';
// import { Text, View, Button, Platform } from 'react-native';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// export default function SendNotification({ sendApproval }) {
//   const [expoPushToken, setExpoPushToken] = useState('');
//   const [notification, setNotification] = useState(false);
//   const notificationListener = useRef();
//   const responseListener = useRef();
//  console.log('Send notification:', sendApproval)
//   useEffect(() => {
//     registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

//     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//       setNotification(notification);
//     });

//     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//       console.log(response);
//     });

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener.current);
//       Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (sendApproval === 'Yes') {
//       schedulePushNotification();
//     }
//   }, [sendApproval]);

//   return (
//     // <View
//     //   style={{
//     //     flex: 1,
//     //     alignItems: 'center',
//     //     justifyContent: 'space-around',
//     //   }}>
//     //   <Text>Your expo push token: {expoPushToken}</Text>
//     //   <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//     //     <Text>Title: {notification && notification.request.content.title} </Text>
//     //     <Text>Body: {notification && notification.request.content.body}</Text>
//     //     <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
//     //   </View>
//     // </View>
//     <View></View>
//   );
// }

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Created New Record",
//       body: 'Here is the notification body',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 2 },
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     // Learn more about projectId:
//     // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
//     token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   return token;
// }
