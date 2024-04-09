import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import querystring from 'querystring';
import moment from 'moment'; // Import moment.js for date formatting
import Notification from './Notification';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';

const AdminNotification = ({ loanApplication, navigation, personalLoan, route }) => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [approverName, setApproverName] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [sendApproval, setSendApproval] = useState(null);
  const [kf_applyforloan, setKfApplyForLoan] = useState(null);
  const [loanApplicationsCount, setLoanApplicationsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const { authenticatedUser } = route.params;

  useEffect(() => {
    // Fetch loan applications and notifications whenever refresh state changes
    fetchLoanApplications();
    fetchNotifications();
    fetchUnreadCount();
    // fetchLoanApplication();
    // fetchNotification();
    // Reset refresh state after re-render
    setRefresh(false);
  } ,[refresh]);

  // useEffect(() =>{
    
  // } ,[refresh]);
  

//   const fetchLoanApplication = async () => {
//   try {
//     const tokenResponse = await axios.post(
//       'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
//       querystring.stringify({
//         grant_type: 'client_credentials',
//         client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
//         resource: 'https://org0f7e6203.crm5.dynamics.com',
//         scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
//         client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
//       }),
//       {
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       }
//     );

//     const accessToken = tokenResponse.data.access_token;

//     const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (response.data && response.data.value && Array.isArray(response.data.value)) {
//       // Filter loan applications where kf_sendapproval is equal to 1, kf_createdby is null or empty, and kf_applyforloan is 1
//       const filteredApplications = response.data.value.filter(application => 
//         (!application.kf_createdby || application.kf_createdby.trim() === '') &&
//         application.kf_applyforloan == 1
//       );
//       setLoanApplications(filteredApplications);
//       setLoanApplicationsCount(filteredApplications.length);
//     } else {
//       console.error('Invalid loan applications response format:', response.data);
//     }
//   } catch (error) {
//     console.error('Error fetching loan applications:', error);
//   }
// };

// const fetchNotification = async () => {
//   try {
//     const tokenResponse = await axios.post(
//       'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
//       querystring.stringify({
//         grant_type: 'client_credentials',
//         client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
//         resource: 'https://org0f7e6203.crm5.dynamics.com',
//         scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
//         client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
//       }),
//       {
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       }
//     );

//     const accessToken = tokenResponse.data.access_token;

//     const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (response.data && response.data.value && Array.isArray(response.data.value)) {
//       // Filter personal loan notifications where kf_sendapproval is equal to 1
//       const filteredNotifications = response.data.value.filter(notification => 
//         (!notification.kf_createdby || notification.kf_createdby.trim() === '') &&
//         notification.kf_applyforloan == 1);
//       // const filteredNotifications = response.data.value.filter(notification => notification.kf_sendapproval == 1);
//       setNotifications(filteredNotifications);
//       setNotificationsCount(filteredNotifications.length); // Update count based on the fetched data
//     } else {
//       console.error('Invalid notifications response format:', response.data);
//     }
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//   }
// };


// Over all count of user creatations without apply for loan = yes (1)
// const fetchLoanApplication = async () => {
//   try {
//     const tokenResponse = await axios.post(
//       'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
//       querystring.stringify({
//         grant_type: 'client_credentials',
//         client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
//         resource: 'https://org0f7e6203.crm5.dynamics.com',
//         scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
//         client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
//       }),
//       {
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       }
//     );

//     const accessToken = tokenResponse.data.access_token;

//     const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (response.data && response.data.value && Array.isArray(response.data.value)) {
//       // Filter loan applications where kf_sendapproval is equal to 1 and kf_createdby is null or empty
//       const filteredApplications = response.data.value.filter(application => (!application.kf_createdby || application.kf_createdby.trim() === '')
//          );
//       setLoanApplications(filteredApplications);
//       setLoanApplicationsCount(filteredApplications.length);
//     } else {
//       console.error('Invalid loan applications response format:', response.data);
//     }
//   } catch (error) {
//     console.error('Error fetching loan applications:', error);
//   }
// };
const fetchLoanApplications = async () => {
  try {
    const tokenResponse = await axios.post(
      'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
      querystring.stringify({
        grant_type: 'client_credentials',
        client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
        resource: 'https://org0f7e6203.crm5.dynamics.com',
        scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
        client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data && response.data.value && Array.isArray(response.data.value)) {
      // Filter loan applications based on conditions
      const filteredApplications = response.data.value.filter(application => {
        if ((!application.kf_createdby || application.kf_createdby.trim() === '') && application.kf_applyforloan == 1) {
          return true;
        } else if (application.kf_sendapproval == 1) {
          return true;
        } else {
          return false;
        }
      });

      setLoanApplications(filteredApplications);
      setLoanApplicationsCount(filteredApplications.length);
    } else {
      console.error('Invalid loan applications response format:', response.data);
    }
  } catch (error) {
    console.error('Error fetching loan applications:', error);
  }
};

  // const fetchLoanApplications = async () => {
  //   try {
  //     const tokenResponse = await axios.post(
  //       'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
  //       querystring.stringify({
  //         grant_type: 'client_credentials',
  //         client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
  //         resource: 'https://org0f7e6203.crm5.dynamics.com',
  //         scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
  //         client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
  //       }),
  //       {
  //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //       }
  //     );

  //     const accessToken = tokenResponse.data.access_token;

  //     const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications', {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     if (response.data && response.data.value && Array.isArray(response.data.value)) {
  //       // Filter loan applications where kf_sendapproval is equal to 1
  //       const filteredApplications = response.data.value.filter(application => application.kf_sendapproval == 1);
  //       setLoanApplications(filteredApplications);
  //       setLoanApplicationsCount(filteredApplications.length);
  //     } else {
  //       console.error('Invalid loan applications response format:', response.data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching loan applications:', error);
  //   }
  // };

  const fetchNotifications = async () => {
    try {
      const tokenResponse = await axios.post(
        'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
        querystring.stringify({
          grant_type: 'client_credentials',
          client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
          resource: 'https://org0f7e6203.crm5.dynamics.com',
          scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
          client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
  
      const accessToken = tokenResponse.data.access_token;
  
      const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.data && response.data.value && Array.isArray(response.data.value)) {
        // Filter personal loan notifications based on conditions
        const filteredNotifications = response.data.value.filter(notification => {
          if ((!notification.kf_createdby || notification.kf_createdby.trim() === '') && notification.kf_applyforloan == 1) {
            return true;
          } else if (notification.kf_sendapproval == 1) {
            return true;
          } else {
            return false;
          }
        });
  
        setNotifications(filteredNotifications);
        setNotificationsCount(filteredNotifications.length);
      } else {
        console.error('Invalid notifications response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  // const fetchNotifications = async () => {
  //   try {
  //     const tokenResponse = await axios.post(
  //       'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
  //       querystring.stringify({
  //         grant_type: 'client_credentials',
  //         client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
  //         resource: 'https://org0f7e6203.crm5.dynamics.com',
  //         scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
  //         client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
  //       }),
  //       {
  //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //       }
  //     );

  //     const accessToken = tokenResponse.data.access_token;

  //     const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans', {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     if (response.data && response.data.value && Array.isArray(response.data.value)) {
  //       // Filter personal loan notifications where kf_sendapproval is equal to 1
  //       const filteredNotifications = response.data.value.filter(notification => notification.kf_sendapproval == 1);
  //       setNotifications(filteredNotifications);
  //       setNotificationsCount(filteredNotifications.length); // Update count based on the fetched data
  //     } else {
  //       console.error('Invalid notifications response format:', response.data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching notifications:', error);
  //   }
  // };



  // Define status names
  const statusNames = {
    123950000: 'Approved',
    123950001: 'Pending Approval',
    123950002: 'Draft',
    123950003: 'Cancelled',
    123950004: 'Expired',
  };

  const handleSendApproval = (selectedOption) => {
    let booleanValue;
    switch (selectedOption) {
      case 'No':
        booleanValue = false;
        break;
      case 'Yes':
        booleanValue = true;
        break;
      default:
        booleanValue = null;
    }
    setSendApproval(booleanValue);
  };


  const handleViewPersonalLoan = async (personalLoan) => {
    try {
      const tokenResponse = await axios.post(
        'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
        querystring.stringify({
          grant_type: 'client_credentials',
          client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
          resource: 'https://org0f7e6203.crm5.dynamics.com',
          scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
          client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const accessToken = tokenResponse.data.access_token;
      // Update kf_markasread field in CRM
      await updateKfMarkAsRead(personalLoan.kf_personalloanid);
      // Navigate to PersonalLoanDetailsScreen
      navigation.navigate('PersonalLoanDetailsScreen', { personalLoan });
      setRefresh(true);
    } catch (error) {
      console.error('Error updating kf_markasread:', error);
    }
  };

  // Update handleViewHomeLoan function
  const handleViewHomeLoan = async (loanApplication) => {
    try {
      const tokenResponse = await axios.post(
        'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
        querystring.stringify({
          grant_type: 'client_credentials',
          client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
          resource: 'https://org0f7e6203.crm5.dynamics.com',
          scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
          client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const accessToken = tokenResponse.data.access_token;
      // Update kf_markasread field in CRM
      await updateKfMarkAsRead(loanApplication.kf_loanapplicationid);
      // Navigate to HomeLoanDetailsScreen
      navigation.navigate('HomeLoanDetailsScreen', { loanApplication });
      setRefresh(true);
    } catch (error) {
      console.error('Error updating kf_markasread:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const tokenResponse = await axios.post(
        'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
        querystring.stringify({
          grant_type: 'client_credentials',
          client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
          resource: 'https://org0f7e6203.crm5.dynamics.com',
          scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
          client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      const responseHome = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responsePersonalLoans = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const unreadHomeCount = responseHome.data.value.filter(
        notification => !notification.kf_markasread && notification.kf_createdby === authenticatedUser.kf_adminname
      ).length;

      const unreadPersonalLoansCount = responsePersonalLoans.data.value.filter(
        notification => !notification.kf_markasread && notification.kf_createdby === authenticatedUser.kf_adminname
      ).length;

      // Update the unread count state variable
      setUnreadCount(unreadHomeCount + unreadPersonalLoansCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // const fetchUnreadCount = async () => {
  //   try {
  //     const tokenResponse = await axios.post(
  //       'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
  //       querystring.stringify({
  //         grant_type: 'client_credentials',
  //         client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
  //         resource: 'https://org0f7e6203.crm5.dynamics.com',
  //         scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
  //         client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
  //       }),
  //       {
  //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //       }
  //     );

  //     const accessToken = tokenResponse.data.access_token;

  //     const responseHome = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications', {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     const responsePersonalLoans = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans', {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     const unreadHomeCount = responseHome.data.value.filter(
  //       notification => !notification.kf_markasread && notification.kf_createdby === authenticatedUser.kf_adminname
  //     ).length;

  //     const unreadPersonalLoansCount = responsePersonalLoans.data.value.filter(
  //       notification => !notification.kf_markasread && notification.kf_createdby === authenticatedUser.kf_adminname
  //     ).length;

  //     setUnreadCount(unreadHomeCount + unreadPersonalLoansCount);
  //   } catch (error) {
  //     console.error('Error fetching unread count:', error);
  //   }
  // };

  // Function to update kf_markasread field in CRM
  const updateKfMarkAsRead = async (recordId) => {
    try {
      // Send a request to update kf_markasread field in CRM
      const tokenResponse = await axios.post(
        'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
        querystring.stringify({
          grant_type: 'client_credentials',
          client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
          resource: 'https://org0f7e6203.crm5.dynamics.com',
          scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
          client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const accessToken = tokenResponse.data.access_token;
      await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${recordId})`, {
        kf_markasread: true, // Assuming true represents read status
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${recordId})`, {
        kf_markasread: true, // Assuming true represents read status
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Error updating kf_markasread:', error);
    }
  };

  const handleGoBack = () => {
    // navigation.navigate("Dashboard");
    navigation.goBack();
  };

  const handleNavigation = () => {
    navigation.navigate("AdminNotification", { authenticatedUser });
  };
  const pickRecord = async (record) => {
    // Display an alert to confirm picking the record
    Alert.alert(
        'Confirm Accept Record',
        'Are you sure you want to Select this record?',
        [
            { text: 'No', onPress: () => console.log('Cancel pressed') },
            {
                text: 'Yes',
                onPress: async () => {
                    try {
                        // Make the necessary API call to update the record's "created by" field
                        const tokenResponse = await axios.post(
                            'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
                            querystring.stringify({
                                grant_type: 'client_credentials',
                                client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
                                resource: 'https://org0f7e6203.crm5.dynamics.com',
                                scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
                                client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
                            }),
                            {
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            }
                        );

                        const accessToken = tokenResponse.data.access_token;

                        // Check if it's a personal loan or a loan application
                        if (record.kf_loanapplicationid) {
                            // If it's a loan application, update the "created by" field
                            await axios.patch(
                                `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${record.kf_loanapplicationid})`,
                                { kf_createdby: authenticatedUser.kf_adminname },
                                {
                                    headers: { Authorization: `Bearer ${accessToken}` },
                                }
                            );
                        } else if (record.kf_personalloanid) {
                            // If it's a personal loan, perform the necessary action
                            // Update the personal loan record as needed
                            // Example:
                            await axios.patch(
                                `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${record.kf_personalloanid})`,
                                { kf_createdby: authenticatedUser.kf_adminname },
                                {
                                    headers: { Authorization: `Bearer ${accessToken}` },
                                }
                            );
                        }

                        // After successful update, refresh the data
                        setRefresh(true);
                    } catch (error) {
                        console.error('Error picking record:', error);
                    }
                },
            },
        ]
    );
};

  // const pickRecord = async (record) => {
  //   // Display an alert to confirm picking the record
  //   Alert.alert(
  //     'Confirm Pick Record',
  //     'Are you sure you want to pick this record?',
  //     [
  //       { text: 'No', onPress: () => console.log('Cancel pressed') },
  //       {
  //         text: 'Yes',
  //         onPress: async () => {
  //           try {
  //             // Make the necessary API call to update the record's "created by" field
  //             const tokenResponse = await axios.post(
  //               'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
  //               querystring.stringify({
  //                 grant_type: 'client_credentials',
  //                 client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
  //                 resource: 'https://org0f7e6203.crm5.dynamics.com',
  //                 scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
  //                 client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
  //               }),
  //               {
  //                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //               }
  //             );

  //             const accessToken = tokenResponse.data.access_token;

  //             await axios.patch(
  //               `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${record.kf_loanapplicationid})`,
  //               { kf_createdby: authenticatedUser.kf_adminname },
  //               {
  //                 headers: { Authorization: `Bearer ${accessToken}` },
  //               }
  //             );

              
    
  //             // After successful update, refresh the data
  //             setRefresh(true);
  //           } catch (error) {
  //             console.error('Error picking record:', error);
  //           }
  //         },
  //       },
  //     ]
  //   );
  // };

  return (
    <View>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.iconButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.text}>Notification</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleNavigation}>
          <Ionicons name="notifications" size={25} color="#fff" />
         {(
  loanApplications
    .filter(
      application =>
        ((sendApproval === null || application.kf_sendapproval === (sendApproval ? 1 : 0)) &&
        authenticatedUser &&
        (application.kf_createdby === authenticatedUser.kf_adminname || !application.kf_createdby) &&
        !application.kf_markasread) // Filter only unread home loan applications and applications with createdby null or empty
    )
    .length +
  notifications
    .filter(
      notification =>
        authenticatedUser &&
        (notification.kf_createdby === authenticatedUser.kf_adminname || !notification.kf_createdby) &&
        !notification.kf_markasread // Filter only unread personal loan notifications
    )
    .length
) > 0 && (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>
      {
        loanApplications
          .filter(
            application =>
              ((sendApproval === null || application.kf_sendapproval === (sendApproval ? 1 : 0)) &&
              authenticatedUser &&
              (application.kf_createdby === authenticatedUser.kf_adminname || !application.kf_createdby) &&
              !application.kf_markasread) // Filter only unread home loan applications and applications with createdby null or empty
          )
          .length +
        notifications
          .filter(
            notification =>
              authenticatedUser &&
              (notification.kf_createdby === authenticatedUser.kf_adminname || !notification.kf_createdby) &&
              !notification.kf_markasread // Filter only unread personal loan notifications
          )
          .length
      }
    </Text>
  </View>
)}

        </TouchableOpacity>
      </View>

      {/* </View> */}
      <ScrollView>
        <View >
        </View>
        <View style={styles.container}>
   <View style={{ borderWidth: 1, borderColor: "#b0b0b0", paddingHorizontal: 10, marginTop: 10, borderRadius: 10 }}>
  <Text style={styles.header}>Home Loan</Text>
  {loanApplications
  .filter(application => 
    ((kf_applyforloan === null || application.kf_applyforloan === (kf_applyforloan ? 1 : 0)) &&
    (authenticatedUser && (application.kf_createdby === authenticatedUser.kf_adminname || application.kf_createdby === null) || !authenticatedUser))
  )
    .sort((a, b) => (a.kf_markasread === b.kf_markasread ? 0 : a.kf_markasread ? 1 : -1)) 
    .map((application, index) => (
      <View
        key={index}
        style={[
          styles.itemContainer1,
          application.kf_markasread ? styles.readItemContainer : styles.unreadItemContainer
        ]}
      >      
        <View key={index}>
          <Text>Application Number: {application.kf_applicationnumber}</Text>
          <Text>Created By: {application.kf_createdby}</Text>
          <View style={styles.readIndicatorContainer}>
            {application.kf_markasread ? (
              <Image
                source={require('../assets/read_message.png')}
                style={styles.twitterImage1}
              />
            ) : (
              <Text style={styles.twitterImage}>Unread</Text>
            )}
          </View>

          <Text>Name: {application.kf_name} {application.kf_lastname}</Text>

          <Text>Status: {statusNames[application.kf_status]}</Text>
          <Text>Approved By: {application.kf_approvedby}</Text>
          <View style={styles.buttonContainer}>
            <Button title="View Record" onPress={() => handleViewHomeLoan(application)} />
            {!application.kf_createdby && ( // Check if kf_createdby is null or empty
            <Button title="✓ Accept" onPress={() => pickRecord(application)} color="green" />
          )}
          </View>
        </View>
      </View>
    ))}

  {/* Condition to display "No Records Found" */}
  {loanApplications.length > 0 && loanApplications.filter(application => (kf_applyforloan === null || application.kf_applyforloan === (kf_applyforloan ? 1 : 0))).filter(application => authenticatedUser && application.kf_createdby === authenticatedUser.kf_adminname || !application.kf_createdby).length === 0 && (
    <View style={styles.noRecordsContainer}>
      <Text style={styles.noRecordsText}>No Records Found</Text>
    </View>
  )}
</View>

          <View style={{ borderWidth: 1, borderColor: "#b0b0b0", paddingHorizontal: 10, marginTop: 10, borderRadius: 10 }}>
            <Text style={styles.header}>Personal Loan</Text>
        
            {notifications
             .filter(notification => 
              ((kf_applyforloan === null || notification.kf_applyforloan === (kf_applyforloan ? 1 : 0)) &&
              (authenticatedUser && (notification.kf_createdby === authenticatedUser.kf_adminname || notification.kf_createdby === null) || !authenticatedUser))
            )   
              .sort((a, b) => (a.kf_markasread === b.kf_markasread ? 0 : a.kf_markasread ? 1 : -1)) 
              .map((notification, index) => (
                <View
                  key={index}
                  style={[
                    styles.itemContainer1,
                    notification.kf_markasread ? styles.readItemContainer : styles.unreadItemContainer
                  ]}
                >
                  <View key={index} >
                    <Text>Application Number: {notification.kf_applicationnumber}</Text>
                    <Text>Created By: {notification.kf_createdby}</Text>
                    <View style={styles.readIndicatorContainer}>
                      {notification.kf_markasread ? (
                        <Image
                          source={require('../assets/read_message.png')}
                          style={styles.twitterImage1}
                        />
                      ) : (
                        <Text style={styles.twitterImage}>Unread</Text>
                      )}
                    </View>
                    <Text>Name: {notification.kf_firstname} {notification.kf_lastname}</Text>
                    <Text>Status: {statusNames[notification.kf_status]}</Text>
                    <Text>Approved By: {notification.kf_approvedby}</Text>
                    <View style={styles.buttonContainer}>
                      <Button title="View Record" onPress={() => handleViewPersonalLoan(notification)} />
                      {!notification.kf_createdby && ( // Check if kf_createdby is null or empty
            <Button title="✓ Accept" onPress={() => pickRecord(notification)} color="green" />
          )}
                    </View>
                  </View>
                </View>
              ))}
{/* 
            {notifications.length > 0 && notifications.filter(notification => authenticatedUser && notification.kf_createdby === authenticatedUser.kf_adminname).length === 0 && (
  <View style={styles.noRecordsContainer}>
  <Text style={styles.noRecordsText}>No Records Found</Text> */}
  {notifications.length > 0 && notifications.filter(notification => (kf_applyforloan === null || notification.kf_applyforloan === (kf_applyforloan ? 1 : 0))).filter(notification => authenticatedUser && notification.kf_createdby === authenticatedUser.kf_adminname || !notification.kf_createdby).length === 0 && (
    <View style={styles.noRecordsContainer}>
      <Text style={styles.noRecordsText}>No Records Found</Text>
</View>
)}            
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
    marginTop: 40,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // itemContainer: {
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   padding: 10,
  //   marginBottom: 10,
  //   borderRadius: 5,
  // },
  itemContainer1: {
    borderWidth: 1,
    // borderColor: '#ccc',
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(255, 28, 53, 255)',
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },
  iconButton: {
    marginHorizontal: 10,
  },
  badge: {
    position: 'absolute',
    top: -7, // Adjust the position of the badge vertically
    right: -7, // Adjust the position of the badge horizontally
    backgroundColor: '#697d71',
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the badge is above the icon
    borderWidth: 1, // Add border for better visibility
    borderColor: '#fff', // White border color for better contrast
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12, // Adjust font size for better visibility
  },
  unreadItemContainer: {
    borderWidth: 2,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#ccc',
    // opacity: 0.7,
    // backgroundColor:'#c2e7ff',
  },
  twitterImage: {
    // width: 28,
    // height: 28,
    // position: 'absolute',
    // top: -22,
    // right: 0,
    // justifyContent: 'center',
    // alignItems: 'center',
    width: "30%",
    height: 28,
    position: 'absolute',
    top: -40,
    right: -45,
    // justifyContent: 'center',
    // alignItems: 'center',
    color: "red",
    fontWeight: "bold",
  },
  twitterImage1: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: -40,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readItemContainer: {
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(243,242,241,255)'
  },
  noRecordsContainer: {
    backgroundColor: '#FFF', // Background color of the container
    borderRadius: 8, // Border radius to make it look like a card
    padding: 16, // Padding around the text
    margin: 16, // Margin around the container
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84,
    elevation: 5, // Elevation for Android shadow
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
  noRecordsText: {
    color: '#0000cc', // Text color
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Center align the text
  },
});

export default AdminNotification;