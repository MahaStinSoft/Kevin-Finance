import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import querystring from 'querystring';
import moment from 'moment'; // Import moment.js for date formatting
// import { schedulePushNotification } from '../common/notificationUtils';
import PushNotification from 'react-native-push-notification';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import ButtonComponent from '../common/ButtonComponent';

const Notification = ({ loanApplication, navigation, personalLoan, route }) => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  // const [approverName, setApproverName] = useState('');
  const [sendApproval, setSendApproval] = useState(null);
  const [showRejectCommentBox, setShowRejectCommentBox] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [selectedPersonalLoanId, setSelectedPersonalLoanId] = useState(null);
  const unreadMessagesCount = loanApplications.filter(application => !application.kf_markasread).length + notifications.filter(notification => !notification.kf_markasread).length;
  const totalRecords = loanApplications.length + notifications.length;
  const [refresh, setRefresh] = useState(false);
  const { kf_adminname } = route.params;


  useEffect(() => {
    // Fetch loan applications and notifications whenever refresh state changes
    fetchLoanApplications();
    fetchNotifications();

    // Reset refresh state after re-render
    setRefresh(false);
  }, [refresh]);



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
        // Filter loan applications where kf_sendapproval is equal to 1
        const filteredApplications = response.data.value.filter(application => application.kf_sendapproval == 1);

        // Sort the filtered applications based on a timestamp or any other relevant field indicating when the approval was sent
      filteredApplications.sort((a, b) => new Date(b.approvalSentTimestamp) - new Date(a.approvalSentTimestamp));
        setLoanApplications(filteredApplications);

        if (loanApplications.length < filteredApplications.length) {
          const newApplication = filteredApplications[filteredApplications.length - 1]; // Assuming the last fetched application is the new one
          // schedulePushNotification(newApplication.kf_applicationnumber, newApplication.kf_name, newApplication.kf_lastname, newApplication.kf_amount, newApplication.kf_createdby); // Schedule push notification with relevant data
        }
      } else {
        console.error('Invalid loan applications response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching loan applications:', error);
    }
  };

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
        // Filter personal loan notifications where kf_sendapproval is equal to 1
        const filteredNotifications = response.data.value.filter(notification => notification.kf_sendapproval == 1);
        filteredNotifications.sort((a, b) => new Date(b.approvalSentTimestamp) - new Date(a.approvalSentTimestamp));
        setNotifications(filteredNotifications);

        // Schedule push notification if new notifications are fetched
        if (notifications.length < filteredNotifications.length) {
          const newNotification = filteredNotifications[filteredNotifications.length - 1]; // Assuming the last fetched notification is the new one
          // schedulePushNotification(newNotification.kf_applicationnumber, newNotification.kf_firstname, newNotification.kf_lastname, newNotification.kf_amount, newNotification.kf_createdby); // Schedule push notification with relevant data
        }
      } else {
        console.error('Invalid notifications response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // const handleApproveLoan = async (applicationId) => {
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

  //     await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${applicationId})`, {
  //       kf_status: 123950000, // Approved status
  //       kf_approvedby: kf_adminname, // Set the admin name
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     // Refresh loan applications after approval
  //     fetchLoanApplications();
  //   } catch (error) {
  //     console.error('Error approving loan application:', error);
  //   }
  // };

  const handleApproveLoan = async (applicationId) => {
    // Display an alert confirming the approval action
    Alert.alert(
      'Approve Loan',
      'Are you sure you want to approve?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
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

              await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${applicationId})`, {
                kf_status: 123950000, // Approved status
                kf_approvedby: kf_adminname, // Set the admin name
              }, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });

              // Refresh loan applications after approval
              fetchLoanApplications();
            } catch (error) {
              console.error('Error approving loan application:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleRejectLoan = async (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowRejectCommentBox(true);
  };

  const handleRejectNotification = async (personalLoanId) => {
    setSelectedPersonalLoanId(personalLoanId); // Set the selected personal loan ID
    setShowRejectCommentBox(true); // Open the comment box
  };

  // For Personal Loan 

  // Add functions to handle personal loan approvals, drafts, pending approvals, and rejections
  // const handleApproveNotification = async (personalLoanId) => {
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

  //     await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${personalLoanId})`, {
  //       kf_status: 123950000, // Approved status
  //       kf_approvedby: kf_adminname, // Assuming 123950000 represents the status for approval
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     // Refresh notifications after approval
  //     fetchNotifications();
  //   } catch (error) {
  //     console.error('Error approving personal loan:', error);
  //   }
  // };

  const handleApproveNotification = async (personalLoanId) => {
    // Display an alert confirming the approval action
    Alert.alert(
      'Approve Personal Loan',
      'Are you sure you want to approve?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
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

              await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${personalLoanId})`, {
                kf_status: 123950000, // Approved status
                kf_approvedby: kf_adminname, // Assuming 123950000 represents the status for approval
              }, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });

              // Refresh notifications after approval
              fetchNotifications();
            } catch (error) {
              console.error('Error approving personal loan:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handlePendingApprovals = async (personalLoanId) => {
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

      await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${personalLoanId})`, {
        kf_status: 123950001 // Assuming 123950000 represents the status for approval
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Refresh notifications after approval
      fetchNotifications();
    } catch (error) {
      console.error('Error approving personal loan:', error);
    }
  };

  const handleRejectWithComment = async () => {

    if (!rejectComment) {
      alert('Please enter a reject reason.');
      return; // Exit the function if reject comment is empty
    }

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

      // Use the selectedApplicationId state to update the specific loan/personalLoan with the reject reason
      await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${selectedApplicationId})`, {
        kf_status: 123950004,
        kf_reason: rejectComment, // Assuming 123950004 represents the status for rejection
        kf_sendapproval: false,
        // Add this field to your entity
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Refresh loan applications after rejection
      fetchLoanApplications();

      // Close the comment box after submission
      setShowRejectCommentBox(false);
      setRejectComment('');
      setSelectedApplicationId(null);
    } catch (error) {
      console.error('Error rejecting loan application:', error);
    }
  };

  const handleRejectPersonalLoanWithComment = async () => {

    if (!rejectComment) {
      alert('Please enter a reject reason.');
      return; // Exit the function if reject comment is empty
    }

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

      // Use the selectedPersonalLoanId state to update the specific personal loan with the reject reason
      await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${selectedPersonalLoanId})`, {
        kf_status: 123950004,
        kf_reason: rejectComment, // Assuming 123950004 represents the status for rejection
        kf_sendapproval: false,
        // Add this field to your entity
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Refresh personal loan notifications after rejection
      fetchNotifications();

      // Close the comment box after submission
      setShowRejectCommentBox(false);
      setRejectComment('');
      setSelectedPersonalLoanId(null);
    } catch (error) {
      console.error('Error rejecting personal loan:', error);
    }
  };

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
  // personal loan

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

  // Function to format date and time
  const formatDateTime = (dateTime) => {
    return moment(dateTime).format('MMM DD, YYYY h:mm A'); // Example format: "Mar 05, 2024 11:12 AM"
  };

  const handleGoBack = () => {
    // navigation.navigate("Dashboard");
    navigation.goBack();
  };

  const handleNavigation = () => {
    navigation.navigate("Notification", { kf_adminname });
  };

  const approvedApplications = loanApplications.filter(application => application.kf_status === 123950000);

  return (
    <View>
      <View style={styles.navBar}>
        {/* <TouchableOpacity style={styles.iconButton} onPress={() => navigation.openDrawer()}>
              <Ionicons name="list-sharp" size={25} color="#fff" />
            </TouchableOpacity> */}
        <TouchableOpacity style={styles.iconButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.text}>Notification</Text>


        <TouchableOpacity style={styles.iconButton} onPress={handleNavigation}>
          <View>
            <Ionicons name="notifications" size={25} color="#fff" />
            {unreadMessagesCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{unreadMessagesCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.container}>
        <View style={{borderWidth: 1, borderColor: "#b0b0b0", paddingHorizontal: 10, marginTop: 10, borderRadius: 10}}>
          <Text style={styles.header}>Home Loan</Text>
          {loanApplications.length === 0 && (
            <View style={styles.noRecordsContainer}>
            <Text style={styles.noRecordsText}>No Records Found</Text>
            </View>
          )}
          {loanApplications
          .sort((a, b) => (a.kf_markasread === b.kf_markasread ? 0 : a.kf_markasread ? 1 : -1)) 
          .map((application, index) => (
            <View
              key={index}
              style={[
                styles.itemContainer,
                application.kf_markasread ? styles.readItemContainer : styles.unreadItemContainer
              ]}
            >
              <Text>Application Number: {application.kf_applicationnumber}</Text>
              <Text>Created By: {application.kf_createdby}</Text>
              <Text>Admin Name: {kf_adminname}</Text>
              <Text>Name: {application.kf_name} {application.kf_lastname}</Text>
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
              <Text>Status: {statusNames[application.kf_status]}</Text>
              <Text>Created At: {formatDateTime(application.created_at)}</Text>
              <View style={styles.buttonContainer}>
                <Button title="View Record" onPress={() => handleViewHomeLoan(application)} />
                {showRejectCommentBox && selectedApplicationId === application.kf_loanapplicationid && (
                  <Modal
                    transparent
                    animationType="slide"
                    visible={showRejectCommentBox}
                    onRequestClose={() => setShowRejectCommentBox(false)}
                  >
                    <View style={styles.modalContainer}>
                      <View style={styles.commentBoxContainer}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", }}>Enter Reject Reason:</Text>
                        <TextInput
                          style={styles.commentInput}
                          multiline
                          value={rejectComment}
                          onChangeText={(text) => setRejectComment(text)}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                          <ButtonComponent title="Submit" onPress={handleRejectWithComment} style={{ width: "40%", height: "45%", backgroundColor: "green" }} />
                          <ButtonComponent title="Cancel" onPress={() => setShowRejectCommentBox(false)} style={{ width: "40%", height: "45%" }} />
                        </View>
                      </View>
                    </View>
                  </Modal>
                )}
                <Button title={`✓ Approve`} onPress={() => handleApproveLoan(application.kf_loanapplicationid)} color="green" disabled={application.kf_status === 123950000} />
                <Button title={`✗ Reject`} onPress={() => handleRejectLoan(application.kf_loanapplicationid)} color="red" disabled={application.kf_status === 123950000} />

              </View>
            </View>
          ))}
          </View>

          <View style={{borderWidth: 1, borderColor: "#b0b0b0", paddingHorizontal: 10, marginTop: 10, borderRadius: 10}}>
          <Text style={styles.header}>Personal Loan </Text>
          {notifications.length === 0 && (
             <View style={styles.noRecordsContainer}>
             <Text style={styles.noRecordsText}>No Records Found</Text>
             </View>
          )}
          {notifications
          .sort((a, b) => (a.kf_markasread === b.kf_markasread ? 0 : a.kf_markasread ? 1 : -1)) 
          .map((notification, index) => (
            <View
              key={index}
              style={[
                styles.itemContainer,
                notification.kf_markasread ? styles.readItemContainer : styles.unreadItemContainer
              ]}
            >
              <Text>Application Number: {notification.kf_applicationnumber}</Text>
              <Text>Admin Name: {kf_adminname}</Text>
              <Text>Created By: {notification.kf_createdby}</Text>
              <Text>Name: {notification.kf_firstname} {notification.kf_lastname}</Text>
              {/* Display the status name */}
              <View style={styles.readIndicatorContainer}>
                {notification.kf_markasread ? (
                  <Image
                    source={require('../assets/read_message.png')}
                    style={styles.twitterImage1}
                  />
                ) : (
                  // <Image
                  //   source={require('../assets/unread_message.png')}
                  //   style={styles.twitterImage}
                  // />
                  <Text style={styles.twitterImage}>Unread</Text>

                )}
              </View>
              <Text>Status: {statusNames[notification.kf_status]}</Text>
              {/* Buttons for actions */}
              <Text>Created At: {formatDateTime(notification.created_at)}</Text>
              <View style={styles.buttonContainer}>
                <Button title="View Record" onPress={() => handleViewPersonalLoan(notification)} />
                {showRejectCommentBox && selectedPersonalLoanId === notification.kf_personalloanid && (
                  <Modal
                    transparent
                    animationType="slide"
                    visible={showRejectCommentBox}
                    onRequestClose={() => setShowRejectCommentBox(false)}
                  >
                    <View style={styles.modalContainer}>
                      <View style={styles.commentBoxContainer}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Enter Reject Reason:</Text>
                        <TextInput
                          style={styles.commentInput}
                          multiline
                          value={rejectComment}
                          onChangeText={(text) => setRejectComment(text)}
                        />

                        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                          <ButtonComponent title="Submit" onPress={handleRejectPersonalLoanWithComment} style={{ width: "40%", height: "45%", backgroundColor: "green" }} />
                          <ButtonComponent title="Cancel" onPress={() => setShowRejectCommentBox(false)} style={{ width: "40%", height: "45%" }} />
                        </View>
                      </View>
                    </View>
                  </Modal>
                )}
                <Button title={`✓ Approve`} onPress={() => handleApproveNotification(notification.kf_personalloanid)} color="green" disabled={notification.kf_status === 123950000} />
                <Button title={`✗ Reject`} onPress={() => handleRejectNotification(notification.kf_personalloanid)} color="red" disabled={notification.kf_status === 123950000} />
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
    marginTop: 35,
    flex: 1,
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black background
  },

  commentBoxContainer: {
    backgroundColor: 'white', // White background color for the comment box
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },

  commentInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 5,
    color: 'black', // Black text color for the comment input
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  itemContainer: {
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    boxShadow: 'none',
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
  badgeContainer: {
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
    fontSize: 10, // Adjust font size for better visibility
  },
  unreadItemContainer: {
    borderWidth: 2,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#ff8080',
    // opacity: 0.7,
    // backgroundColor: '#c2e7ff',
  },
  twitterImage: {
    width: "30%",
    height: 28,
    position: 'absolute',
    top: -75,
    right: -40,
    // justifyContent: 'center',
    // alignItems: 'center',
    color: "red",
    fontWeight: "bold",
  },
  twitterImage1: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: -75,
    right: 5,
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
  // noRecordsContainer: {
  //   borderColor: '#ff6347', // Red color
  //   borderWidth: 2,
  //   borderRadius: 10, // Rounded corners
  //   padding: 15,
  //   marginHorizontal: 20,
  //   marginVertical: 20,
  //   backgroundColor: '#ffe4e1', // Light red background color
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // noRecordsText: {
  //   color: '#ff6347', // Red color
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  // },
});

export default Notification;