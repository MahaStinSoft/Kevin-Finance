import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ScrollView, Text } from 'react-native';
import axios from 'axios';

import HeaderComponent from '../../common/Header';
import ButtonComponent from '../../common/ButtonComponent';
import LoanStatusPicker from '../../common/LoanStatusPicker ';

const EditpersonalLoan = ({ route, navigation }) => {
  const { personalLoan, onUpdateSuccess } = route.params || {};
  const [firstname, setfirstname] = useState(personalLoan?.kf_firstname || ''); 
  const [lastname, setLastname] = useState(personalLoan?.kf_lastname || ''); 
  // const [gender, setGender] = useState(personalLoan?.kf_gender || '');
  const [mobileNumber, setMobileNumber] = useState(personalLoan?.kf_mobilenumber || '');
  const [email, setEmail] = useState(personalLoan?.kf_email || '');
  const [address1, setAddress1] = useState(personalLoan?.kf_address1 || '');
  const [address2, setAddress2] = useState(personalLoan?.kf_address2 || '');
  const [address3, setAddress3] = useState(personalLoan?.kf_address3 || '');
  const [city, setCity] = useState(personalLoan?.kf_city || '');
  const [state, setState] = useState(personalLoan?.kf_state || '');
  // const [loanAmountRequested, setLoanAmountRequested] = useState(personalLoan?.kf_loanamountrequested || '');
  // const [status, setStatus] = useState(personalLoan?.kf_status || '');
  // const [statusReason, setstatusReason] = useState(personalLoan?.kf_statusreason || '');
  // const [approvalDate, setApprovalDate] = useState(personalLoan?.kf_dateofapproval || '');
  // const [approver, setApprover] = useState(personalLoan?.kf_dateofapproval || '');
  // const [firstEMIDate, setfirstEMIDate] = useState(personalLoan?.kf_firstemidate || '');
  // const [aadharcardNumber, setAadharcardNumber] = useState(personalLoan?.kf_aadharnumber || '');
  // const [pancardNumber, setPancardNumber] = useState(personalLoan?.kf_pannumber || '');

  const [isfirstnameValid, setIsfirstnameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const [recordId, setRecordId] = useState(personalLoan.kf_personalloanid);

  const handleGoBack = () => {
    navigation.goBack();
  };


  useEffect(() => {
    // Update state and variables when the route parameters change
    setfirstname(personalLoan.kf_firstname);
    setLastname(personalLoan.kf_lastname);
    // setGender(personalLoan.kf_gender);
    setMobileNumber(personalLoan.kf_mobilenumber);
    setEmail(personalLoan.kf_email);
    setAddress1(personalLoan.kf_address1);
    setAddress2(personalLoan.kf_address2);
    setAddress3(personalLoan.kf_address3);
    setCity(personalLoan.kf_city);
    setState(personalLoan.kf_state);
    // setLoanAmountRequested(personalLoan.kf_loanamountrequested);
    // setStatus(personalLoan.kf_status);
    // setstatusReason(personalLoan.kf_statusreason);
    // setApprovalDate(personalLoan.kf_dateofapproval);
    // setApprover(personalLoan.kf_approver);
    // setfirstEMIDate(personalLoan.kf_firstemidate);
    // setAadharcardNumber(personalLoan.kf_aadharnumber);
    // setPancardNumber(personalLoan.kf_pannumber);
    setRecordId(personalLoan.kf_personalloanid);
  }, [personalLoan]);

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
        `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${recordId})`,
        {
          kf_firstname: firstname,
          kf_lastname: lastname,
          // kf_gender: gender,
          kf_mobilenumber: mobileNumber,
          kf_email: email,
          kf_address1: address1,
          kf_address2: address2,
          kf_address3: address3,
          kf_city: city,
          kf_state: state,
          // kf_loanamountrequested: loanAmountRequested,
          // kf_status: status,
          // kf_statusreason: statusReason,
          // kf_dateofapproval: approvalDate,
          // kf_approver: approver,
          // kf_firstemidate: firstEMIDate,
          // kf_aadharnumber: aadharcardNumber,
          // kf_pannumber: pancardNumber,
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
            ...personalLoan,
            kf_firstname: firstname,
            kf_lastname: lastname,
            // kf_gender: gender,
            kf_mobilenumber: mobileNumber,
            kf_email: email,
            kf_address1: address1,
            kf_address2: address2,
            kf_address3: address3,
            kf_city: city,
            kf_state: state,
            // kf_loanamountrequested: loanAmountRequested,
            // kf_status: status,
            // kf_statusreason: statusReason,
            // kf_dateofapproval: approvalDate,
            // kf_approver: approver,
            // kf_firstemidate: firstEMIDate,
            // kf_aadharnumber: aadharcardNumber,
            // kf_pannumber: pancardNumber,
          });
        }
        // console.log(loanAmountRequested)

        // Optionally, navigate to another screen or perform other actions
        Alert.alert('Updated the record Successfully.', '', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back after the alert is confirmed
              // navigation.goBack();
              navigation.navigate('PersonalLoanDetailsScreen', { personalLoan: personalLoan });

            },
          },
        ]);
      } else {
        console.log('Error updating record in CRM:', updateRecordResponse);
        // Handle the error appropriately, e.g., show an alert
        Alert.alert('Error', 'Failed to update the record in CRM.');
      }
    } catch (error) {
      // Handle errors, show alert, etc.
      console.error('Error during update:', error);
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
          onChangeText={(text) => setfirstname(text)}
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
          setfirstname(text);
          setIsfirstnameValid(text.trim() !== '');
        }}
      />
      {!isfirstnameValid && <Text style={styles.errorText}>Please enter a valid first name.</Text>}

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
       {/* <TextInput
          style={styles.input}
          value={loanAmountRequested}
          placeholder="Loan Amount Requested"
          onChangeText={(text) => setLoanAmountRequested(text)}
        /> */}

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
        {/* <TextInput
          style={styles.input}
          value={approver}
          placeholder="Approver"
          onChangeText={(text) => setApprover(text)}
        /> */}
        {/* <TextInput
          style={styles.input}
          value={firstEMIDate}
          placeholder="First EMI Date"
          onChangeText={(text) => setfirstEMIDate(text)}
        /> */}
        {/* <TextInput
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
        /> */}

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

export default EditpersonalLoan;

