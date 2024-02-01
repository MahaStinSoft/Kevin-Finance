import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import axios from 'axios';

const EmailScreen = () => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const sendEmail = async () => {
    try {
      const response = await axios.post('https://your-backend-api/send-email', {
        recipientEmail,
        subject,
        body,
      });

      console.log('Email sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
  };

  return (
    <View style={{ marginTop: 100, padding: 15 }}>
      <TextInput
        placeholder="Recipient's Email"
        keyboardType="email-address"
        value={recipientEmail}
        onChangeText={(text) => setRecipientEmail(text)}
      />
      <TextInput
        placeholder="Subject"
        value={subject}
        onChangeText={(text) => setSubject(text)}
      />
      <TextInput
        placeholder="Email Body"
        multiline
        value={body}
        onChangeText={(text) => setBody(text)}
      />

      <Button title="Send Email" onPress={sendEmail} />
    </View>
  );
};

export default EmailScreen;
