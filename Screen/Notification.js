import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import querystring from 'querystring';
import moment from 'moment'; // Import moment.js for date formatting

const Notification = ({loanApplication, navigation, personalLoan}) => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [approverName, setApproverName] = useState('');
  const [sendApproval, setSendApproval] = useState(null);


  useEffect(() => {
    fetchLoanApplications();
    fetchNotifications();
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
        kf_status: 123950000 // Assuming 123950000 represents the status for approval
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


  // Draft
  const handleDraft = async (applicationId) => {
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
        kf_status: 123950002 // Assuming 123950000 represents the status for approval
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
        kf_status: 123950004 // Assuming 123950000 represents the status for approval
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
      kf_status: 123950000 // Assuming 123950000 represents the status for approval
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
  const handleDrafts =  async (personalLoanId) => {
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
        kf_status: 123950002 // Assuming 123950000 represents the status for approval
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


  const handleRejectNotification =  async (personalLoanId) => {
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
        kf_status: 123950004 // Assuming 123950000 represents the status for approval
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
            <Text>Approval status: {application.kf_sendapproval}</Text>
            <Text>Name: {application.kf_name} {application.kf_lastname}</Text>
            {/* Display the status name */}
            <Text>Status: {statusNames[application.kf_status]}</Text>
            {/* Buttons for actions */}
            <Text>Created At: {formatDateTime(application.created_at)}</Text>
            <View style={styles.buttonContainer}>
              <Button title={`✓ Approve`} onPress={() => handleApproveLoan(application.kf_loanapplicationid)} color="green" disabled={application.kf_status === 123950000} />
              {/* <Button title="Pending Approval" onPress={() => handlePendingApproval(application.kf_loanapplicationid)} color="black" disabled={application.kf_status === 123950000} />
              <Button title="Draft" onPress={() => handleDraft(application.kf_loanapplicationid)} color="black" disabled={application.kf_status === 123950000} /> */}
           
              <Button title={`✗ Reject`} onPress={() => handleRejectLoan(application.kf_loanapplicationid)} color="red" disabled={application.kf_status === 123950000} />
              <Button title="View Record" onPress={() => handleViewHomeLoan(application)} /> 
              {/* Display date and time */}
            
            </View>
          </View>
        ))}

        <Text style={styles.header}>Personal Loan Notifications</Text>
        {notifications.map((notification, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text>Application Number: {notification.kf_applicationnumber}</Text>
            <Text>Created By: {notification.kf_createdby}</Text>
            <Text>Name: {notification.kf_firstname} {notification.kf_lastname}</Text>
            {/* Display the status name */}
            <Text>Status: {statusNames[notification.kf_status]}</Text>
            {/* Buttons for actions */}
            <Text>Created At: {formatDateTime(notification.created_at)}</Text>
            <View style={styles.buttonContainer}>
              <Button title={`✓ Approve`} onPress={() => handleApproveNotification(notification.kf_personalloanid)} color="green" disabled={notification.kf_status === 123950000} />
              {/* <Button title="Pending Approval" onPress={() => handlePendingApprovals(notification.kf_personalloanid)} color="black" disabled={notification.kf_status === 123950000} />
              <Button title="Draft" onPress={() => handleDrafts(notification.kf_personalloanid)} color="black" disabled={notification.kf_status === 123950000} /> */}
              <Button title={`✗ Reject`} onPress={() => handleRejectNotification(notification.kf_personalloanid)} color="red" disabled={notification.kf_status === 123950000} />
              <Button title="View Record" onPress={() => handleViewPersonalLoan(notification)} />
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
