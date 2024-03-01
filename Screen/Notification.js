import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';

const Notification = () => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [approverName, setApproverName] = useState('');

  useEffect(() => {
    fetchLoanApplications();
    fetchNotifications();
  }, []);

  const fetchLoanApplications = async () => {
    try {
      const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications');
      if (response.data && response.data.value && Array.isArray(response.data.value)) {
        setLoanApplications(response.data.value);
      } else {
        console.error('Invalid loan applications response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching loan applications:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans');
      if (response.data && response.data.value && Array.isArray(response.data.value)) {
        setNotifications(response.data.value);
      } else {
        console.error('Invalid notifications response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchApproverName = async (notificationId) => {
    try {
      const response = await axios.get(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${notificationId})`);
      if (response.data && response.data.kf_approvername) {
        setApproverName(response.data.kf_approvername);
      } else {
        console.error('Approver name not found in response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching approver name:', error);
    }
  };

  const handleApproveLoan = async (applicationId) => {
    try {
      await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${applicationId})`, {
        kf_status: 123950000 // Assuming 123950000 represents the status for approval
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
      await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${applicationId})`, {
        kf_status: 123950002 // Assuming 123950002 represents the status for Draft
      });
      // Refresh loan applications after approval
      fetchLoanApplications();
    } catch (error) {
      console.error('Error approving loan application:', error);
    }
  };
  const handlePendingApproval = async (applicationId) => {
    try {
      await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${applicationId})`, {
        kf_status: 123950001 // Assuming 123950002 represents the status for Draft
      });
      // Refresh loan applications after approval
      fetchLoanApplications();
    } catch (error) {
      console.error('Error approving loan application:', error);
    }
  };


  const handleRejectLoan = async (applicationId) => {
    try {
      await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${applicationId})`, {
        kf_status: 123950004 // Assuming 123950004 represents the status for rejection
      });
      // Refresh loan applications after rejection
      fetchLoanApplications();
    } catch (error) {
      console.error('Error rejecting loan application:', error);
    }
  };



  // For Personal Loan 


  const handleApproveNotification = async (notificationId) => {
    try {
      await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${notificationId})`, {
        kf_status: 123950000 // Assuming 123950000 represents the status for approval
      });
      // Refresh notifications after approval
      fetchNotifications();
    } catch (error) {
      console.error('Error approving notification:', error);
    }
  };

  const handleDrafts = async (notificationId) => {
    try {
      await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${notificationId})`, {
        kf_status: 123950002 // Assuming 123950000 represents the status for approval
      });
      // Refresh notifications after approval
      fetchNotifications();
    } catch (error) {
      console.error('Error approving notification:', error);
    }
  };
  const handlePendingApprovals = async (notificationId) => {
    try {
      await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${notificationId})`, {
        kf_status: 123950001 // For 123950001 represents the status for approval
      });
      // Refresh notifications after approval
      fetchNotifications();
    } catch (error) {
      console.error('Error approving notification:', error);
    }
  };


  const handleRejectNotification = async (notificationId) => {
    try {
      await axios.patch(`https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${notificationId})`, {
        kf_status: 123950004 // Assuming 123950004 represents the status for rejection
      });
      // Refresh notifications after rejection
      fetchNotifications();
    } catch (error) {
      console.error('Error rejecting notification:', error);
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Loan Applications</Text>
        {loanApplications.map((application, index) => (
  <View key={index} style={styles.itemContainer}>
    <Text>Application Number: {application.kf_applicationnumber}</Text>
    <Text>Created By: {application.kf_createdby}</Text>
    <Text>Name: {application.kf_name} {application.kf_lastname}</Text>
    {/* Display the status name */}
    <Text>Status: {statusNames[application.kf_status]}</Text>
     {/* Display the approver name */}
     {application.kf_status === 123950000 && <Text>Approved By: {approverName}</Text>}
    {/* Buttons for actions */}
    <View style={styles.buttonContainer}>
      <Button title={`✓ Approve`} onPress={() => handleApproveLoan(application.kf_loanapplicationid)} color="green" disabled={application.kf_status === 123950000} />
      <Button title="Pending Approval" onPress={() => handlePendingApproval(application.kf_loanapplicationid, 123950001)} color="black" disabled={application.kf_status === 123950000} />
      <Button title="Draft" onPress={() => handleDraft(application.kf_loanapplicationid, 123950002)} color="black" disabled={application.kf_status === 123950000} />
      <Button title={`✗ Reject`} onPress={() => handleRejectLoan(application.kf_loanapplicationid)} color="red" disabled={application.kf_status === 123950000} />
    </View>
  </View>
))}

        
        <Text style={styles.header}>Notifications</Text>
        {notifications.map((notification, index) => (
  <View key={index} style={styles.itemContainer}>
    <Text>Application Number: {notification.kf_applicationnumber}</Text>
    <Text>Created By: {notification.kf_createdby}</Text>
    <Text>Name: {notification.kf_firstname} {notification.kf_lastname}</Text>
    {/* Display the status name */}
    <Text>Status: {statusNames[notification.kf_status]}</Text>
    {/* Buttons for actions */}
    <View style={styles.buttonContainer}>
      <Button title={`✓ Approve`} onPress={() => handleApproveNotification(notification.kf_personalloanid)} color="green" disabled={notification.kf_status === 123950000} />
      <Button title="Pending Approval" onPress={() => handlePendingApprovals(notification.kf_personalloanid, 123950001)} color="black" disabled={notification.kf_status === 123950000} />
      <Button title="Draft" onPress={() => handleDrafts(notification.kf_personalloanid, 123950002)} color="black" disabled={notification.kf_status === 123950000} />
      <Button title={`✗ Reject`} onPress={() => handleRejectNotification(notification.kf_personalloanid)} color="red" disabled={notification.kf_status === 123950000} />
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
