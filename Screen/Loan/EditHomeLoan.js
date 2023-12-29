import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ScrollView, Text } from 'react-native';
import axios from 'axios';

import HeaderComponent from '../../common/Header';
import ButtonComponent from '../../common/ButtonComponent';
import LoanStatusPicker from '../../common/LoanStatusPicker ';

const EditHomeLoan = ({ route, navigation }) => {
  const { loanApplication, onUpdateSuccess } = route.params || {};
  const [firstname, setFirstname] = useState(loanApplication?.kf_name || ''); 
  const [lastname, setLastname] = useState(loanApplication?.kf_lastname || ''); 
  const [gender, setGender] = useState(loanApplication?.kf_gender || '');
  const [mobileNumber, setMobileNumber] = useState(loanApplication?.kf_mobilenumber || '');
  const [email, setEmail] = useState(loanApplication?.kf_email || '');
  const [address1, setAddress1] = useState(loanApplication?.kf_address1 || '');
  const [address2, setAddress2] = useState(loanApplication?.kf_address2 || '');
  const [address3, setAddress3] = useState(loanApplication?.kf_address3 || '');
  const [city, setCity] = useState(loanApplication?.kf_city || '');
  const [state, setState] = useState(loanApplication?.kf_state || '');
  const [loanAmountRequested, setLoanAmountRequested] = useState(loanApplication?.kf_loanamountrequested || '');
  const [status, setStatus] = useState(loanApplication?.kf_status || '');
  const [statusReason, setstatusReason] = useState(loanApplication?.kf_statusreason || '');
  const [approvalDate, setApprovalDate] = useState(loanApplication?.kf_dateofapproval || '');
  const [approver, setApprover] = useState(loanApplication?.kf_dateofapproval || '');
  const [firstEMIDate, setfirstEMIDate] = useState(loanApplication?.kf_firstemidate || '');
  const [aadharcardNumber, setAadharcardNumber] = useState(loanApplication?.kf_aadharnumber || '');
  const [pancardNumber, setPancardNumber] = useState(loanApplication?.kf_pannumber || '');

  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const [recordId, setRecordId] = useState(loanApplication.kf_loanapplicationid);

  const handleGoBack = () => {
    navigation.goBack();
  };


  useEffect(() => {
    // Update state and variables when the route parameters change
    setFirstname(loanApplication.kf_name);
    setLastname(loanApplication.kf_lastname);
    setGender(loanApplication.kf_gender);
    setMobileNumber(loanApplication.kf_mobilenumber);
    setEmail(loanApplication.kf_email);
    setAddress1(loanApplication.kf_address1);
    setAddress2(loanApplication.kf_address2);
    setAddress3(loanApplication.kf_address3);
    setCity(loanApplication.kf_city);
    setState(loanApplication.kf_state);
    setLoanAmountRequested(loanApplication.kf_loanamountrequested);
    setStatus(loanApplication.kf_status);
    setstatusReason(loanApplication.kf_statusreason);
    setApprovalDate(loanApplication.kf_dateofapproval);
    setApprover(loanApplication.kf_approver);
    setfirstEMIDate(loanApplication.kf_firstemidate);
    setAadharcardNumber(loanApplication.kf_aadharnumber);
    setPancardNumber(loanApplication.kf_pannumber);
    setRecordId(loanApplication.kf_loanapplicationid);
  }, [loanApplication]);

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
        `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${recordId})`,
        {
          kf_name: firstname,
          kf_lastname: lastname,
          kf_gender: gender,
          kf_mobilenumber: mobileNumber,
          kf_email: email,
          kf_address1: address1,
          kf_address2: address2,
          kf_address3: address3,
          kf_city: city,
          kf_state: state,
          kf_loanamountrequested: loanAmountRequested,
          kf_status: status,
          kf_statusreason: statusReason,
          kf_dateofapproval: approvalDate,
          kf_approver: approver,
          kf_firstemidate: firstEMIDate,
          kf_aadharnumber: aadharcardNumber,
          kf_pannumber: pancardNumber,
          // Include other fields as needed
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
          onUpdateSuccess({
            ...loanApplication,
            kf_name: firstname,
            kf_lastname: lastname,
            kf_gender: gender,
            kf_mobilenumber: mobileNumber,
            kf_email: email,
            kf_address1: address1,
            kf_address2: address2,
            kf_address3: address3,
            kf_city: city,
            kf_state: state,
            kf_loanamountrequested: loanAmountRequested,
            kf_status: status,
            kf_statusreason: statusReason,
            kf_dateofapproval: approvalDate,
            kf_approver: approver,
            kf_firstemidate: firstEMIDate,
            kf_aadharnumber: aadharcardNumber,
            kf_pannumber: pancardNumber,
            // Include other fields as needed
          });
        }

        console.log(loanAmountRequested)

        // Optionally, navigate to another screen or perform other actions
        Alert.alert('Updated the record Successfully.', '', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back after the alert is confirmed
              // navigation.goBack();
              navigation.navigate('HomeLoanDetailsScreen', { loanApplication: loanApplication });
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

  const validateEmail = (email) => {
    const trimmedEmail = email.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(trimmedEmail);
  };

  return (
    <> 
    <HeaderComponent titleText="Home Screen" onPress={handleGoBack}/>
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {/* <TextInput
          style={styles.input}
          value={firstname}
          placeholder="First Name"
          onChangeText={(text) => setFirstname(text)}
        />
        <TextInput
          style={styles.input}
          value={lastname}
          placeholder="Last Name"
          onChangeText={(text) => setLastname(text)}
        /> */}

<TextInput
        style={styles.input}
        value={firstname}
        placeholder="First Name"
        onChangeText={(text) => {
          setFirstname(text);
          setIsFirstNameValid(text.trim() !== '');
        }}
      />
      {!isFirstNameValid && <Text style={styles.errorText}>Please enter a valid first name.</Text>}

      <TextInput
        style={styles.input}
        value={lastname}
        placeholder="Last Name"
        onChangeText={(text) => {
          setLastname(text);
          setIsLastNameValid(text.trim() !== '');
        }}
      />
      {!isLastNameValid && <Text style={styles.errorText}>Please enter a valid last name.</Text>}
        {/* <TextInput
          style={styles.input}
          value={gender}
          placeholder="Gender"
          onChangeText={(text) => setGender(text)}
        /> */}

            {/* <LoanStatusPicker
              onOptionChange={handleGenderOptionset}
              title="Gender"
              options={['Male', 'Female']}
            // initialOption="Option1"
            /> */}
        {/* <TextInput
          style={styles.input}
          value={mobileNumber}
          placeholder="Mobile Number"
          onChangeText={(text) => setMobileNumber(text)}
        />
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        /> */}
        <TextInput
        style={styles.input}
        value={mobileNumber}
        placeholder="Mobile Number"
        onChangeText={(text) => {
          setMobileNumber(text);
          setIsMobileNumberValid(/^\d{10}$/.test(text));
        }}
        keyboardType="numeric"
      />
      {!isMobileNumberValid && (
        <Text style={styles.errorText}>Please enter a valid 10-digit mobile number.</Text>
      )}

      <TextInput
        style={styles.input}
        value={email}
        placeholder="Email"
        onChangeText={(text) => {
          setEmail(text);
          setIsEmailValid(text.trim() === '' || validateEmail(text));
        }}
      />
      {!isEmailValid && <Text style={styles.errorText}>Please enter a valid email address.</Text>}
        <TextInput
          style={styles.input}
          value={address1}
          placeholder="Address Line 1"
          onChangeText={(text) => setAddress1(text)}
        />
        <TextInput
          style={styles.input}
          value={address2}
          placeholder="Address Line 2"
          onChangeText={(text) => setAddress2(text)}
        />
        <TextInput
          style={styles.input}
          value={address3}
          placeholder="Address Line 3"
          onChangeText={(text) => setAddress3(text)}
        />
        <TextInput
          style={styles.input}
          value={city}
          placeholder="City"
          onChangeText={(text) => setCity(text)}
        />
        <TextInput
          style={styles.input}
          value={state}
          placeholder="State"
          onChangeText={(text) => setState(text)}
        />
       <TextInput
          style={styles.input}
          value={loanAmountRequested}
          placeholder="Loan Amount Requested"
          onChangeText={(text) => setLoanAmountRequested(text)}
        />

        {/* <TextInput
          style={styles.input}
          value={status}
          placeholder="Status"
          onChangeText={(text) => setStatus(text)}
        />
        <TextInput
          style={styles.input}
          value={statusReason}
          placeholder="Status Reason"
          onChangeText={(text) => setstatusReason(text)}
        />
        <TextInput
          style={styles.input}
          value={approvalDate}
          placeholder="Approval Date"
          onChangeText={(text) => setApprovalDate(text)}
        /> */}
        <TextInput
          style={styles.input}
          value={approver}
          placeholder="Approver"
          onChangeText={(text) => setApprover(text)}
        />
        {/* <TextInput
          style={styles.input}
          value={firstEMIDate}
          placeholder="First EMI Date"
          onChangeText={(text) => setfirstEMIDate(text)}
        /> */}
        <TextInput
          style={styles.input}
          value={aadharcardNumber}
          placeholder="Aadharcard Number"
          onChangeText={(text) => setAadharcardNumber(text)}
        />
        <TextInput
          style={styles.input}
          value={pancardNumber}
          placeholder="Pancard Number"
          onChangeText={(text) => setPancardNumber(text)}
        />

        <ButtonComponent title="Update" onPress={handleUpdateRecord} />
      </View>
    </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
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
  errorText: {
    color: 'red',
    fontSize: 15,
    marginBottom: 8,
  },
});

export default EditHomeLoan;

