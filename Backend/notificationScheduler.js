const express = require('express');
const bodyParser = require('body-parser');
const { schedulePushNotification } = require('./pushNotificationScheduler'); // Import your function

const app = express();
app.use(bodyParser.json());

// Endpoint to schedule a notification
app.post('/schedule-notification', async (req, res) => {
  const { deviceToken, scheduledTime, title, body, data } = req.body;

  try {
    await schedulePushNotification(deviceToken, scheduledTime, title, body, data);
    res.status(200).json({ message: 'Notification scheduled successfully' });
  } catch (error) {
    console.error('Error scheduling notification:', error);
    res.status(500).json({ error: 'Error scheduling notification' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
