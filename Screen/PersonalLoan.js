import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

import HeaderComponent from '../common/Header';
import TextInputComponent from '../common/TextInput';
import ButtonComponent from '../common/ButtonComponent';
import LoanStatusPicker from '../common/LoanStatusPicker ';
import ComponentDatePicker from '../common/ComponentDatePicker';

export const PersonalLoan = () => {
  const [kf_firstname, setkf_firstname] = useState(null);
  const [kf_lastname, setkf_lastname] = useState(null);
  const [kf_name, setkf_name] = useState(null);
  const [kf_gender, setkf_gender] = useState(null);
  const [kf_mobile, setkf_mobile] = useState(null);
  const [kf_email, setkf_email] = useState(null);
  const [kf_address1, setkf_address1] = useState(null);
  const [kf_address2, setkf_address2] = useState(null);
  const [kf_address3, setkf_address3] = useState(null);
  const [kf_city, setkf_city] = useState(null);
  const [kf_state, setkf_state] = useState(null);
  const [kf_loanamountrequested, setkf_loanamountrequested] = useState(null);
  const [kf_loanstatus, setkf_loanstatus] = useState(null);
  const [kf_statusreason, setkf_statusreason] = useState(null);
  const [createdon, setkf_dateofapproval] = useState(new Date());
  // const [kf_approver, setkf_approver] = useState(null);
  // const [kf_firstemidate, setkf_firstemidate] = useState(new Date());
  // const [selectedValue, setSelectedValue] = useState('');
  const [image, setImage] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);

  const navigation = useNavigation();

  const handleGoBack = () => {
    console.log("Navigating back to CardViewScreen");
    navigation.goBack();
  };
  
  // const handleDateChange1 = (newDate) => {
  //   setkf_dateofapproval(newDate);
  // };

  // const handleDateChange2 = (newDate) => {
  //   setkf_firstemidate(newDate);
  // };

  console.log("Request Payload to CRM:", {
    kf_mobile: kf_mobile,
  });

  const handleGenderOptionset = (selectedOptionGender) => {
    let numericValue;
    switch (selectedOptionGender) {
      case 'Male':
        numericValue = 123950000;
        break;
      case 'Female':
        numericValue = 123950001;
        break;
      default:
        numericValue = null;
    }
    setkf_gender(numericValue);
  };

  const handleLoanStatusChange = (selectedOptionLoan) => {
    let numericValue;
    switch (selectedOptionLoan) {
      case 'Approved':
        numericValue = 123950000;
        break;
      case 'PendingApproval':
        numericValue = 123950001;
        break;
      case 'Draft':
        numericValue = 123950002;
        break;
      case 'Cancelled':
        numericValue = 123950003;
        break;
      case 'Expired':
        numericValue = 123950004;
        break;
      default:
        numericValue = null;
    }
    setkf_loanstatus(numericValue);
  };

  const handleAnotherOptionChange = (selectedOptionStatusReason) => {
    let numericValue;
    switch (selectedOptionStatusReason) {
      case 'AadharNotMatching':
        numericValue = 123950000;
        break;
      case 'InvalidDocuments':
        numericValue = 123950001;
        break;
      default:
        numericValue = null;
    }
    setkf_statusreason(numericValue);
  };

  const handleSaveRecord = async () => {
    try {
      var data = {
        grant_type: "client_credentials",
        client_id: "d9dcdf05-37f4-4bab-b428-323957ad2f86",
        resource: "https://org0f7e6203.crm5.dynamics.com",
        client_secret: "JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2",
      };
      const tokenResponse = await axios.post(
        "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token",
        data,
        { headers: { "content-type": "application/x-www-form-urlencoded" } }
      );
      const accessToken = tokenResponse.data.access_token;

      // const formattedDateOfApproval = kf_dateofapproval ? kf_dateofapproval.toISOString() : null;
      // const formattedFirstEmiDate = kf_firstemidate ? kf_firstemidate.toISOString() : null;
      const loanAmount = parseFloat(kf_loanamountrequested);

      const createRecordResponse = await axios.post(
        "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans",  // Updated entity name
        {
          kf_firstname: kf_firstname,
          kf_lastname: kf_lastname,
          kf_name: kf_name,
          kf_gender: kf_gender,
          kf_mobile: kf_mobile,
          kf_email: kf_email,
          kf_address1: kf_address1,
          kf_address2: kf_address2,
          kf_address3: kf_address3,
          kf_city: kf_city,
          kf_state: kf_state,
          kf_loanamountrequested: loanAmount,
          kf_loanstatus: kf_loanstatus,
          kf_statusreason: kf_statusreason,
          // kf_dateofapproval: formattedDateOfApproval,
          // kf_approver: kf_approver,
          // kf_firstemidate: formattedFirstEmiDate,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (createRecordResponse.status === 204) {
        console.log("Record created successfully in CRM");
         // Optionally, navigate to another screen or perform other actions
         Alert.alert('Created record Successfully.', '', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back after the alert is confirmed
              // navigation.goBack();
              navigation.navigate('Dashboard');
            },
          },
        ]);
      } else {
        console.log("Failed to create a record in CRM.");
        Alert.alert("Error", "Failed to create a record in CRM.");
      }
    } catch (error) {
      console.error("Error during record creation:", error);
      console.log("Detailed Error Response:", error.response);
      Alert.alert("Error", "An unexpected error occurred. Please try again later.");
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email)
;
  };

  const handleMobileNumberChange = (text) => {
    if (/^\d{10}$/.test(text)) {
      setIsMobileNumberValid(true);
      setkf_mobile(text);
    } else {
      setIsMobileNumberValid(false);
    }
  };

  const isSignInDisabled = !kf_name || !kf_lastname || !kf_mobile || !kf_email || !kf_loanamountrequested ;
  
  return (
    <>
    <StatusBar/>
    <ScrollView keyboardShouldPersistTaps="handled">
    <View style={styles.container}>
          <HeaderComponent titleText="Personal Loan" onPress={handleGoBack} />
         <TextInputComponent
          placeholder="First Name"
          autoCapitalize="none"
          value={kf_firstname}
          onChangeText={(text) => setkf_firstname(text)}
        />

        <TextInputComponent
          placeholder="Last Name"
          autoCapitalize="none"
          value={kf_lastname}
          onChangeText={(text) => setkf_lastname(text)}
        /> 

 <TextInputComponent
          placeholder="Full Name"
          autoCapitalize="none"
          value={kf_name}
          onChangeText={(text) => setkf_name(text)}
        />

        <LoanStatusPicker
          onOptionChange={handleGenderOptionset}
          title="Gender"
          options={['Male', 'Female']}
        />

          <TextInputComponent
            placeholder="Mobile Number"
            autoCapitalize="none"
            value={kf_mobile}
            onChangeText={(text) => handleMobileNumberChange(text)}
            keyboardType="numeric"
          />
          {!isMobileNumberValid && (
            <Text style={styles.errorText}>
              Please enter a valid 10-digit mobile number.
            </Text>
          )}
       
        <TextInputComponent
          placeholder="Email Address"
          autoCapitalize="none"
          value={kf_email}
          onChangeText={(text) => {
            setkf_email(text);
            setIsEmailValid(text.trim() === '' || validateEmail(text));
          }}
          keyboardType="email-address"
        />
        {!isEmailValid && <Text style={styles.errorText}>Please enter a valid email address.</Text>}

        <TextInputComponent
          placeholder="Address 1"
          autoCapitalize="none"
          value={kf_address1}
          onChangeText={(text) => setkf_address1(text)}
        />
        <TextInputComponent
          placeholder="Address 2"
          autoCapitalize="none"
          value={kf_address2}
          onChangeText={(text) => setkf_address2(text)}
        />

        <TextInputComponent
          placeholder="Address 3"
          autoCapitalize="none"
          value={kf_address3}
          onChangeText={(text) => setkf_address3(text)}
        />

        <TextInputComponent
          placeholder="City"
          autoCapitalize="none"
          value={kf_city}
          onChangeText={(text) => setkf_city(text)}
        />

        <TextInputComponent
          placeholder="State"
          autoCapitalize="none"
          value={kf_state}
          onChangeText={(text) => setkf_state(text)}
        />
        <TextInputComponent
          placeholder="Loan Amount Request"
          autoCapitalize="none"
          value={kf_loanamountrequested}
          onChangeText={(text) => setkf_loanamountrequested(text)}
        />

        <LoanStatusPicker onOptionChange={handleLoanStatusChange}
          title="Select Loan Status"
          options={['Approved', 'PendingApproval', 'Draft', 'Cancelled']}
        />

        <LoanStatusPicker
          onOptionChange={handleAnotherOptionChange}
          title="Status Reason"
          options={['AadharNotMatching', 'InvalidDocuments']}
        />

        {/* <ComponentDatePicker
          selectedDate={kf_dateofapproval}
          onDateChange={handleDateChange1}
          placeholder="Date of Approval"
        /> */}

        {/* <ComponentDatePicker
          selectedDate={kf_firstemidate}
          onDateChange={handleDateChange2}
          placeholder="First EMI Date"
        /> */}
         {/* <TextInputComponent
          placeholder="Loan Approver"
          autoCapitalize="none"
          value={kf_approver}
          onChangeText={(text) => setkf_approver(text)}
        />  */}

          <ButtonComponent
            title="SUBMIT"
            onPress={handleSaveRecord}
            disabled={isSignInDisabled}
          />

      </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  errorText:{
    color:'red',
    fontSize: 15,
    marginHorizontal: 25,
  },
});

export default PersonalLoan;