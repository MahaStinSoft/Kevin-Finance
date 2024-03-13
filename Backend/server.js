const admin = require('firebase-admin');
const serviceAccount = require('./Auth/serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://crm-financeapp-default-rtdb.firebaseio.com/'
});

// Function to schedule a push notification
const schedulePushNotification = async (deviceToken, scheduledTime, title, body, data) => {
    try {
      // Calculate TTL value based on the difference between scheduled time and current time
      const currentTime = Date.now();
      const ttl = scheduledTime - currentTime;
      
      // Create a notification payload
      const payload = {
        notification: {
          title: title,
          body: body
        },
        data: data || {}, // Additional data to send with the notification
        token: deviceToken,
        android: {
          ttl: ttl, // Use calculated TTL value
          priority: 'high'
        }
      };
  
      // Schedule the notification
      const response = await admin.messaging().send(payload);
  
      console.log('Notification scheduled successfully:', response);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };
  
// Example usage
const deviceToken = 'dsZi_WSXQq-trObekZN7pQ:APA91bHU0xpxwOLs12_ioM1Ji8LhJFIuqMvgyBkLaIsicjlJ3GpSx7P3632c7yVUmZo1Rn-6AiC_qMU-rRxlioWUa90YaTeHLPuuZGYZTVT_8vn8_HsvDgbiNWOYSHXbG3q4r-cZlDR6';
const scheduledTime = Date.now() + (60 * 1000); // Current time + 1 minute
const title = 'Scheduled Notification';
const body = 'This is a scheduled notification from your app.';
const data = { key: 'value' }; // Optional additional data

schedulePushNotification(deviceToken, scheduledTime, title, body, data);
