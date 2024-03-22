import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button,TouchableOpacity } from 'react-native';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import querystring from 'querystring';
import moment from 'moment'; // Import moment.js for date formatting
import Notification from './Notification';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';

const AdminNotification = ({loanApplication, navigation, personalLoan, route }) => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [approverName, setApproverName] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [sendApproval, setSendApproval] = useState(null);
  const [loanApplicationsCount, setLoanApplicationsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const { authenticatedUser } = route.params;

  useEffect(() => {
    // Fetch loan applications and notifications whenever refresh state changes
    fetchLoanApplications();
    fetchNotifications();
    fetchUnreadCount();
    
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
        setLoanApplications(filteredApplications);
        setLoanApplicationsCount(filteredApplications.length);
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
        setNotificationsCount(filteredNotifications.length); // Update count based on the fetched data
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

      setUnreadCount(unreadHomeCount + unreadPersonalLoansCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
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
  
  const handleSettings = () => {
    navigation.navigate( "Setting");
  };
  const handleNavigation = () => {
    navigation.navigate("AdminNotification", { authenticatedUser });
  };

  return (
    <View>
<View style={styles.navBar}>
  <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
    <Ionicons name="list-sharp" size={25} color="#fff" />
  </TouchableOpacity>
  <Text style={styles.text}>Kevin Small Finance</Text>
  <TouchableOpacity style={styles.iconButton} onPress={handleNavigation}>
    <Ionicons name="notifications" size={25} color="#fff" />
    {(
      loanApplications
        .filter(
          application =>
            (sendApproval === null || application.kf_sendapproval === (sendApproval ? 1 : 0)) &&
            authenticatedUser &&
            application.kf_createdby === authenticatedUser.kf_adminname &&
            !application.kf_markasread // Filter only unread home loan applications
        )
        .length +
      notifications
        .filter(
          notification =>
            authenticatedUser &&
            notification.kf_createdby === authenticatedUser.kf_adminname &&
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
                  (sendApproval === null || application.kf_sendapproval === (sendApproval ? 1 : 0)) &&
                  authenticatedUser &&
                  application.kf_createdby === authenticatedUser.kf_adminname &&
                  !application.kf_markasread // Filter only unread home loan applications
              )
              .length +
            notifications
              .filter(
                notification =>
                  authenticatedUser &&
                  notification.kf_createdby === authenticatedUser.kf_adminname &&
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
      <View style={styles.container}>
        <Text style={styles.header}>Home Loan</Text>
        {loanApplications.length === 0 && (
          <Text>Norecords found in home loan</Text>
        )}
        {loanApplications
        .filter(application => sendApproval === null || application.kf_sendapproval === (sendApproval ? 1 : 0))
        .filter(application => authenticatedUser && application.kf_createdby === authenticatedUser.kf_adminname) // Filter based on the authenticated user
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
      
      <Text>Name: {application.kf_name} {application.kf_lastname}</Text>
      <View style={styles.readIndicatorContainer}>
  {application.kf_markasread ? (
    <Image
    source={require('../assets/read_message.png')}
    style={styles.twitterImage1}
  />
  ) : (
    <Image
      source={require('../assets/unread_message.png')}
      style={styles.twitterImage}
    />
  )}
</View>
      <Text>Created By: {application.kf_createdby}</Text>
      <Text>Status: {statusNames[application.kf_status]}</Text>
      <View style={styles.buttonContainer}>
        {/* <Button title={`✓ Approve`} onPress={() => handleApproveLoan(application.kf_loanapplicationid)} color="green" disabled={application.kf_status === 123950000} />
        <Button title={`✗ Reject`} onPress={() => handleRejectLoan(application.kf_loanapplicationid)} color="red" disabled={application.kf_status === 123950000} /> */}
        <Button title="View Record" onPress={() => handleViewHomeLoan(application)} /> 
      </View>
    </View>
    </View>
  ))}

        <Text style={styles.header}>Personal Loan</Text>
        {notifications.length === 0 && (
          <Text>No records found in personal loan</Text>
        )}
        {notifications
  .filter(notification => authenticatedUser && notification.kf_createdby === authenticatedUser.kf_adminname)
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
    <Image
      source={require('../assets/unread_message.png')}
      style={styles.twitterImage}
    />
  )}
</View>
      <Text>Name: {notification.kf_firstname} {notification.kf_lastname}</Text>
      <Text>Status: {statusNames[notification.kf_status]}</Text>
      <Text>Approved By: {notification.kf_approvedby}</Text> 

      <Text>Approval Date: {moment(notification.kf_approvaldatetime).format('MMMM D, YYYY hh:mm A')}</Text>
      <View style={styles.buttonContainer}>
        <Button title="View Record" onPress={() => handleViewPersonalLoan(notification)} />
      </View>
    </View>
    </View>
  ))}
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
    fontSize: 24,
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
    backgroundColor: 'red',
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
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    opacity: 0.7,
    backgroundColor:'#c2e7ff',
  },
  twitterImage: {
    width: 28,
    height: 28,
    position: 'absolute',
    top: -22,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor:'rgba(243,242,241,255)'
  },
  noRecordsText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default AdminNotification;