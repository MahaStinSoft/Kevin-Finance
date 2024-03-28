import * as Notifications from 'expo-notifications';

export async function schedulePushNotification(applicationnumber, firstname, lastname, loanAmount, createdby) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Kevin Finance App`,
      body: `Application has been arrived\nApplication No: ${applicationnumber}\nCreated By: ${createdby}\nApplicant Name: ${firstname} ${lastname}`,
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
}
