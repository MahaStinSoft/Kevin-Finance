import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button ,Modal ,TextInput} from 'react-native';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import querystring from 'querystring';
import moment from 'moment'; // Import moment.js for date formatting
import { schedulePushNotification } from '../common/notificationUtils';
import messaging from '@react-native-firebase/messaging';

const Notification = ({loanApplication, navigation, personalLoan,route}) => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  // const [approverName, setApproverName] = useState('');
  const [sendApproval, setSendApproval] = useState(null);
  const [showRejectCommentBox, setShowRejectCommentBox] = useState(false);
const [rejectComment, setRejectComment] = useState('');
const [selectedApplicationId, setSelectedApplicationId] = useState(null);
const [selectedPersonalLoanId, setSelectedPersonalLoanId] = useState(null); 
  const { kf_adminname } = route.params;


  const listenToForegroundNotifications = async () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'A new message arrived! (FOREGROUND)',
        JSON.stringify(remoteMessage),
      );
    });
    return unsubscribe;
  }

  useEffect(() => {
    fetchLoanApplications();
    fetchNotifications();
  }, []);

  useEffect(() => {
    listenToForegroundNotifications();
  }, []);

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
        setLoanApplications(filteredApplications);

        if (loanApplications.length < filteredApplications.length) {
          const newApplication = filteredApplications[filteredApplications.length - 1]; // Assuming the last fetched application is the new one
          schedulePushNotification(newApplication.kf_applicationnumber, newApplication.kf_name, newApplication.kf_lastname, newApplication.kf_amount, newApplication.kf_createdby); // Schedule push notification with relevant data
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
        setNotifications(filteredNotifications);

        // Schedule push notification if new notifications are fetched
      if (notifications.length < filteredNotifications.length) {
        const newNotification = filteredNotifications[filteredNotifications.length - 1]; // Assuming the last fetched notification is the new one
        schedulePushNotification(newNotification.kf_applicationnumber, newNotification.kf_firstname, newNotification.kf_lastname, newNotification.kf_amount, newNotification.kf_createdby); // Schedule push notification with relevant data
      }
      } else {
        console.error('Invalid notifications response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleApproveLoan = async (applicationId) => {
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
const handleApproveNotification = async (personalLoanId) => {
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


  const handleViewPersonalLoan = (personalLoan) => {
    navigation.navigate('PersonalLoanDetailsScreen', { personalLoan }); // Pass Personal Loan data
  };

  const handleViewHomeLoan = (loanApplication) => {
    navigation.navigate('HomeLoanDetailsScreen', { loanApplication }); // Pass Home Loan application data
  };

   // Function to format date and time
   const formatDateTime = (dateTime) => {
    return moment(dateTime).format('MMM DD, YYYY h:mm A'); // Example format: "Mar 05, 2024 11:12 AM"
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Loan Applications</Text>
        {loanApplications
  .filter(application => sendApproval === null || application.kf_sendapproval === (sendApproval ? 1 : 0))
  .map((application, index) => (
    <View key={index} style={styles.itemContainer}>
            <Text>Application Number: {application.kf_applicationnumber}</Text>
            <Text>Created By: {application.kf_createdby}</Text>
            <Text>Admin Name: {kf_adminname}</Text>
            <Text>Name: {application.kf_name} {application.kf_lastname}</Text>
            {/* Display the status name */}
            <Text>Status: {statusNames[application.kf_status]}</Text>
            {/* Buttons for actions */}
            <Text>Created At: {formatDateTime(application.created_at)}</Text>
            <View style={styles.buttonContainer}>
              <Button title={`✓ Approve`} onPress={() => handleApproveLoan(application.kf_loanapplicationid)} color="green" disabled={application.kf_status === 123950000} />
              <Button title={`✗ Reject`} onPress={() => handleRejectLoan(application.kf_loanapplicationid)} color="red" disabled={application.kf_status === 123950000} />
              <Button title="View Record" onPress={() => handleViewHomeLoan(application)} /> 
              {/* Display date and time */}
              {showRejectCommentBox && selectedApplicationId === application.kf_loanapplicationid && (
          <Modal
            transparent
            animationType="slide"
            visible={showRejectCommentBox}
            onRequestClose={() => setShowRejectCommentBox(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.commentBoxContainer}>
                <Text>Enter Reject Reason:</Text>
                <TextInput
                  style={styles.commentInput}
                  multiline
                  value={rejectComment}
                  onChangeText={(text) => setRejectComment(text)}
                />
                <Button title="Submit Reject Reason" onPress={handleRejectWithComment} />
                <Button title="Cancel" onPress={() => setShowRejectCommentBox(false)} />
              </View>
            </View>
          </Modal>
        )}
            </View>
          </View>
        ))}


        <Text style={styles.header}>Personal Loan Notifications</Text>
        {notifications.map((notification, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text>Application Number: {notification.kf_applicationnumber}</Text>
            <Text>Admin Name: {kf_adminname}</Text>
            <Text>Created By: {notification.kf_createdby}</Text>
            <Text>Name: {notification.kf_firstname} {notification.kf_lastname}</Text>
            {/* Display the status name */}
            <Text>Status: {statusNames[notification.kf_status]}</Text>
            {/* Buttons for actions */}
            <Text>Created At: {formatDateTime(notification.created_at)}</Text>
            <View style={styles.buttonContainer}>
              <Button title={`✓ Approve`} onPress={() => handleApproveNotification(notification.kf_personalloanid)} color="green" disabled={notification.kf_status === 123950000} />
              <Button title={`✗ Reject`} onPress={() => handleRejectNotification(notification.kf_personalloanid)} color="red" disabled={notification.kf_status === 123950000} />
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
                <Text>Enter Reject Reason:</Text>
                <TextInput
                  style={styles.commentInput}
                  multiline
                  value={rejectComment}
                  onChangeText={(text) => setRejectComment(text)}
                />
                <Button title="Submit Reject Reason" onPress={handleRejectPersonalLoanWithComment} />
                <Button title="Cancel" onPress={() => setShowRejectCommentBox(false)} />
              </View>
            </View>
          </Modal>
        )}

            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});

export default Notification;

