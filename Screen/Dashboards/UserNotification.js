import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import querystring from 'querystring';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../../common/Header';

const UserNotification = ({ navigation, route }) => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { authenticatedUser, userapplicationid } = route.params; 

  useEffect(() => {
    fetchLoanApplicationsUser();
    fetchNotificationsUser();
  }, []);

  const fetchLoanApplicationsUser = async () => {
    try {
      const tokenResponse = await getToken();
      const accessToken = tokenResponse.data.access_token;

      const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data && response.data.value && Array.isArray(response.data.value)) {
        const filteredApplications = response.data.value.filter(application => application.kf_applyforloan == 1 && application.kf_userapplicantid === userapplicationid);
        setLoanApplications(filteredApplications);
      } else {
        console.error('Invalid loan applications response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching loan applications:', error);
    }
  };

  const fetchNotificationsUser = async () => {
    try {
      const tokenResponse = await getToken();
      const accessToken = tokenResponse.data.access_token;

      const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data && response.data.value && Array.isArray(response.data.value)) {
        const filteredNotifications = response.data.value.filter(notification => notification.kf_applyforloan == 1 && notification.kf_userapplicantid === userapplicationid);
        setNotifications(filteredNotifications);

        // Send notifications to role 2 contacts
        sendNotificationToRole2();
      } else {
        console.error('Invalid notifications response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const getToken = async () => {
    try {
      return await axios.post(
        'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
        querystring.stringify({
          grant_type: 'client_credentials',
          client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
          client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
          resource: 'https://org0f7e6203.crm5.dynamics.com',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
    } catch (error) {
      console.error('Error fetching token:', error);
      throw error;
    }
  };

  const sendNotificationToRole2 = async () => {
    try {
      // Fetch token
      const tokenResponse = await getToken();
      const accessToken = tokenResponse.data.access_token;

      // Fetch contacts
      const contactResponse = await axios.get(
        'https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/contacts',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );

      // Filter contacts with account role code equal to 2
      const filteredContacts = contactResponse.data.value.filter(
        (contact) => contact.accountrolecode == 2
      );

      // Send notifications to filtered contacts
      filteredContacts.forEach((contact) => {
        // Implement notification sending logic here
        console.log('Sending notification to contact:', contact);
      });
    } catch (error) {
      console.error('Error sending notification to role 2 contacts:', error);
    }
  };

  const handleViewHomeLoan = async (loanApplication) => {
    try {
      const tokenResponse = await getToken();
      const accessToken = tokenResponse.data.access_token;

      // Update kf_markasread field in CRM
      await updateKfMarkAsRead(loanApplication.kf_loanapplicationid, accessToken);
      
      navigation.navigate('HomeLoanDetailsScreen', { loanApplication });
    } catch (error) {
      console.error('Error updating kf_markasread:', error);
    }
  };

  const updateKfMarkAsRead = async (recordId, accessToken) => {
    try {
      await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${recordId})`, {
        kf_markasread: true,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (error) {
      console.error('Error updating kf_markasread:', error);
    }
  };

  const handleGoBack = () => {
    // navigation.navigate("Dashboard");
    navigation.goBack();
  };

  return (
    <View>
      <HeaderComponent titleText="User Notification"
        onPress={handleGoBack}
        // onIconPress={handleUpdateRecordAndSendAnnotation}
        screenIcon="md-save"
        screenIconStyle={{ marginTop: 5 }}
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.notificationContainer}>
            <Text style={styles.header}>Home Loan</Text>
            {loanApplications.map((application, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.textContent}>Name: {application.kf_name}</Text>
                <Text style={styles.textContent}>ID: {application.kf_userapplicantid}</Text>
                <Text style={styles.textContent}>Mobile Number: {application.kf_mobilenumber}</Text>
                <View style={styles.buttonContainer}>
                <Button title="View Record" onPress={() => handleViewHomeLoan(application)} style={{width: "50%"}}/>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.notificationContainer}>
            <Text style={styles.header}>Personal Loan</Text>
            {notifications.map((notification, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.textContent}>Name: {notification.kf_firstname}</Text>
                <Text style={styles.textContent}>ID: {notification.kf_userapplicantid}</Text>
                <Text style={styles.textContent}>Mobile Number: {notification.kf_mobile}</Text>
                <View style={styles.buttonContainer}>
                <Button title="View Record" onPress={() => sendNotification(notification)} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // marginTop: 40,
  },
  notificationContainer: {
    borderWidth: 1,
    borderColor: '#b0b0b0',
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "red",
    marginTop: 10
  },
  itemContainer: {
    borderWidth: 1,
    width: '100%',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: 'grey'
  },
  textContent: {
    padding: 2
  },
  buttonContainer: {
    width: "40%",
    marginTop: 8,
    alignSelf: "center"
  }
});

export default UserNotification;