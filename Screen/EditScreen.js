import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const EditScreen = ({ route, navigation }) => {
  const { contact, onUpdateSuccess } = route.params || {};
  const [firstname, setFirstname] = useState(contact?.fullname || '');
  const [recordId, setRecordId] = useState(contact.contactid);

  useEffect(() => {
    // Update state and variables when the route parameters change
    setFirstname(contact.fullname);
    setRecordId(contact.contactid);
  }, [contact]);

  const handleUpdateRecord = async () => {
    try {
      // Your authentication logic here

      const tokenResponse = await axios.post(
        'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
        {
          grant_type: 'client_credentials',
          client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
          resource: 'https://org0f7e6203.crm5.dynamics.com',
          scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
          client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
  
      const accessToken = tokenResponse.data.access_token;
  
      const updateRecordResponse = await axios.patch(
        `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/contacts(${recordId})`,
        {
          firstname: firstname,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (updateRecordResponse.status === 204) {
        console.log('Record updated successfully in CRM');
        
        // Notify the parent screen about the successful update
        if (onUpdateSuccess) {
          onUpdateSuccess({ ...contact, firstname: firstname });
        }

        // Optionally, navigate to another screen or perform other actions
        Alert.alert('Updated the record Successfully.', '', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back after the alert is confirmed
              navigation.goBack(); // <-- Fix the typo here
            },
          },
        ]);
        } else {
        console.log('Error updating record in CRM:', updateRecordResponse);
        // Handle the error appropriately, e.g., show an alert
        Alert.alert('Error', 'Failed to update the record in CRM.');
      }
    } catch (error) {
      console.error('Error during update:', error.response?.data || error.message);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <TextInput
          style={styles.input}
          value={firstname}
          placeholder="Name"
          onChangeText={(text) => setFirstname(text)}
        />

        <Button title="Save" onPress={handleUpdateRecord} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '80%',
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    paddingHorizontal: 14,
  },
});

export default EditScreen;
