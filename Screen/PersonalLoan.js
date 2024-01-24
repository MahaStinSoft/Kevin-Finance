import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, Text, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import HeaderComponent from '../common/Header';
import TextInputComponent from '../common/TextInput';
import ButtonComponent from '../common/ButtonComponent';
import LoanStatusPicker from '../common/LoanStatusPicker ';
import ComponentDatePicker from '../common/ComponentDatePicker';

export const PersonalLoan = () => {
  const [kf_firstname, setkf_firstname] = useState('');
  const [kf_lastname, setkf_lastname] = useState('');
  const [kf_name, setkf_name] = useState(null);
  const [kf_gender, setkf_gender] = useState(null);
  const [kf_dateofbirth, setkf_dateofbirth] = useState(null);
  const [kf_age, setkf_age] = useState(null);
  const [kf_mobile, setkf_mobile] = useState(null);
  const [kf_email, setkf_email] = useState(null);
  const [kf_address1, setkf_address1] = useState(null);
  const [kf_address2, setkf_address2] = useState(null);
  const [kf_address3, setkf_address3] = useState(null);
  const [kf_city, setkf_city] = useState(null);
  const [kf_state, setkf_state] = useState(null);
  const [kf_aadharnumber, setkf_aadharnumber] = useState(null);
  const [kf_pannumber, setkf_pannumber] = useState(null);
  const [kf_loanamountrequested, setkf_loanamountrequested] = useState(null);
  const [kf_status, setkf_status] = useState(null);
  const [kf_statusreason, setkf_statusreason] = useState(null);
  const [createdon, setkf_dateofapproval] = useState(new Date());
  const [kf_createdby, setkf_createdby] = useState(true);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [resetFormKey, setResetFormKey] = useState(0);
  // const [kf_approver, setkf_approver] = useState(null);
  // const [kf_firstemidate, setkf_firstemidate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [placeholderName, setPlaceholderName] = useState('Full Name');

  const [errorMessages, setErrorMessages] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    mobileNumber: '',
    email: '',
    loanAmountRequested: '',
    aadharCardNumber: '',
    panCardNumber: '',
  });

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      getAuthenticatedUser();
    }, [])
  );

  const resetForm = () => {
    setkf_firstname('');
    setkf_lastname('');
    setkf_name('');
    setkf_gender(null);
    setkf_mobile(null);
    setkf_email(null);
    setkf_address1(null);
    setkf_address2(null);
    setkf_address3(null);
    setkf_city(null);
    setkf_state(null);
    setkf_loanamountrequested(null);
    setkf_status(null);
    setkf_statusreason(null);
    setkf_dateofapproval(new Date());
    // setkf_approver(null);
    // setkf_aadharnumber(null);
    // setkf_aadharcard({ fileName: null, fileContent: null });    
    setResetFormKey((prevKey) => prevKey + 1);
  };

  const handleGoBack = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard the changes?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Discard',
          onPress: () => {
            key = { resetFormKey }
            navigation.navigate('Dashboard', { resetState: true }); 
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetForm();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const fullName = `${kf_firstname} ${kf_lastname}`;
    setkf_name(fullName);
  }, [kf_firstname, kf_lastname]);

  useEffect(() => {
    if (kf_name) {
      setPlaceholderName(kf_name);
    }
  }, [kf_name]);

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
    setkf_status(numericValue);
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

  const handleFirstNameChange = (text) => {
    if (text.trim() !== '') {
      setkf_firstname(text);
      setErrorMessages({ ...errorMessages, firstName: '' });
    } else {
      setkf_firstname('');
      setErrorMessages({ ...errorMessages, firstName: 'Enter First Name' });
    }
  };

  const handleLastNameChange = (text) => {
    if (text.trim() !== '') {
      setkf_lastname(text);
      setErrorMessages({ ...errorMessages, lastName: '' });
    } else {
      setkf_lastname('');
      setErrorMessages({ ...errorMessages, lastName: 'Enter Last Name' });
    }
  }

  const handleDateOfBirth = (newDate) => {
    if (!newDate) {
      setErrorMessages({
        ...errorMessages,
        dateOfBirth: 'Enter Date of Birth.',
      });
    } else {
      const birthDate = new Date(newDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const hasBirthdayOccurred =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
      if (!hasBirthdayOccurred) {
        age--;
      }
      setErrorMessages({
        ...errorMessages,
        dateOfBirth: '',
      });
      setkf_age(age.toString());
      setkf_dateofbirth(newDate);
    }
  };

  const handleMobileNumberChange = (text) => {
    if (!text.trim()) {
      setErrorMessages({
        ...errorMessages,
        mobileNumber: 'Enter Mobile Number.',
      });
    } else if (/^\d{10}$/.test(text)) {
      setkf_mobile(text);
      setErrorMessages({
        ...errorMessages,
        mobileNumber: '',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        mobileNumber: 'Enter a valid 10-digit mobile number.',
      });
    }
  };

  const handleEmailChange = (email) => {
    const trimmedEmail = email.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      setErrorMessages({
        ...errorMessages,
        email: 'Enter Email Address.',
      });
    } else if (!regex.test(trimmedEmail)) {
      setkf_email(email);
      setErrorMessages({
        ...errorMessages,
        email: 'Enter a valid email address.',
      });
    } else {
      setkf_email(email);
      setErrorMessages({
        ...errorMessages,
        email: '',
      });
    }
  };

  const handleAadharCardNumberValidation = (text) => {
    if (!text.trim()) {
      setErrorMessages({
        ...errorMessages,
        aadharCardNumber: 'Enter Aadhar number.',
      });
    } else if (/^\d{12}$/.test(text)) {
      setErrorMessages({
        ...errorMessages,
        aadharCardNumber: '',
      });
      setkf_aadharnumber(text);
    } else {
      setErrorMessages({
        ...errorMessages,
        aadharCardNumber: 'Enter a valid 12-digit Aadhar number.',
      });
    }
  };

  const handlePancardNumberValidation = (text) => {
    if (!text.trim()) {
      setErrorMessages({
        ...errorMessages,
        panCardNumber: 'Enter PAN card number.',
      });
    } else {
      const panRegex = /^[A-Za-z]{5}[0-9]{4}[A-Z]{1}/;
      if (panRegex.test(text)) {
        setErrorMessages({
          ...errorMessages,
          panCardNumber: '',
        });
        setkf_pannumber(text);
      } else {
        setErrorMessages({
          ...errorMessages,
          panCardNumber: 'Enter a valid PAN card number.',
        });
      }
    }
  };

  const handleLoanAmountRequestedChange = (text) => {
    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        loanAmountRequested: 'Enter loan amount.',
      });
    } else if (!/^\d+$/.test(text)) {
      setErrorMessages({
        ...errorMessages,
        loanAmountRequested: 'Enter a valid loan amount.',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        loanAmountRequested: '',
      });
      setkf_loanamountrequested(text);
    }
  };

  const getAuthenticatedUser = async () => {
    try {
      const userString = await AsyncStorage.getItem('authenticatedUser');
      console.log("getAuthenticatedUser:", userString);

      if (userString) {
        const user = JSON.parse(userString);
        setAuthenticatedUser(user);
      }
    } catch (error) {
      console.error('Error getting authenticated user:', error);
    }
  };

  const handleSaveRecord = async () => {
    const newErrorMessages = {
      firstName: !kf_firstname ? ' Enter First Name' : '',
      lastName: !kf_lastname ? ' Enter Last Name' : '',
      dateOfBirth: !kf_dateofbirth ? ' Enter Date of Birth' : '',
      mobileNumber: !kf_mobile ? ' Enter Mobile Number' : '',
      email: !kf_email ? ' Enter Email Address' : '',
      loanAmountRequested: !kf_loanamountrequested ? ' Enter Loan Amount Requested' : '',
      aadharCardNumber: !kf_aadharnumber ? ' Enter Aadhar Card Number' : '',
      panCardNumber: !kf_pannumber ? ' Enter PAN Card Number' : '',
    };
    setErrorMessages(newErrorMessages);
    if (Object.values(newErrorMessages).some(message => message !== '')) {
      return;
    }
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
      const formattedDateOfBirth = kf_dateofbirth ? kf_dateofbirth.toISOString() : null;
      const loanAmount = parseFloat(kf_loanamountrequested);

      const userAdminname = authenticatedUser ? authenticatedUser.kf_adminname : '';
      console.log("Detailed Error Response:", userAdminname);

      const createRecordResponse = await axios.post(
        "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans",  // Updated entity name
        {
          kf_firstname: kf_firstname,
          kf_lastname: kf_lastname,
          kf_name: kf_name,
          kf_gender: kf_gender,
          kf_dateofbirth: formattedDateOfBirth,
          kf_age: kf_age,
          kf_mobile: kf_mobile,
          kf_email: kf_email,
          kf_address1: kf_address1,
          kf_address2: kf_address2,
          kf_address3: kf_address3,
          kf_city: kf_city,
          kf_state: kf_state,
          kf_aadharnumber: kf_aadharnumber,
          kf_pannumber: kf_pannumber,
          kf_loanamountrequested: loanAmount,
          kf_status: kf_status,
          kf_statusreason: kf_statusreason,
          // kf_dateofapproval: formattedDateOfApproval,
          // kf_approver: kf_approver,
          // kf_firstemidate: formattedFirstEmiDate,
          kf_createdby: userAdminname,
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
        Alert.alert('Created record Successfully.', '', [
          {
            text: 'OK',
            onPress: () => {
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
      Alert.alert("Error", "An unexpected error occurred.  try again later.");
    }
  };

  return (
    <>
      <StatusBar />
      <HeaderComponent titleText="Personal Loan" onPress={handleGoBack} />
      <ScrollView key={resetFormKey} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>

          <TextInput style={[styles.textInputContainer, { marginTop: 20, color: "gray" }]}
            placeholder="Created by"
            autoCapitalize="none"
            value={authenticatedUser ? authenticatedUser.kf_adminname : ''}
            onChangeText={(text) => {
              setkf_createdby(text)
            }}
            editable={false}
          />

          <TextInputComponent
            placeholder="First Name"
            autoCapitalize="none"
            value={kf_firstname}
            onChangeText={handleFirstNameChange}
          />
          {errorMessages.firstName !== '' && (
            <Text style={styles.errorText}>{errorMessages.firstName}</Text>
          )}

          <TextInputComponent
            placeholder="Last Name"
            autoCapitalize="none"
            value={kf_lastname}
            onChangeText={handleLastNameChange}
          />
          {errorMessages.lastName !== '' && (
            <Text style={styles.errorText}>{errorMessages.lastName}</Text>
          )}

          <TextInput
            style={[styles.textInputContainer, { marginTop: 20, color: "gray" }]}
            placeholder={placeholderName ? placeholderName : "Full Name"}
            value={kf_name}
            onChangeText={(text) => setkf_name(text)}
            editable={false}
          />

          <LoanStatusPicker
            onOptionChange={handleGenderOptionset}
            title="Gender"
            options={['Male', 'Female']}
          />

          <ComponentDatePicker
            style={{ height: 48, marginBottom: 20 }}
            selectedDate={kf_dateofbirth}
            onDateChange={handleDateOfBirth}
            placeholder="Date of Birth"
          />
          {errorMessages.dateOfBirth !== '' && (
            <Text style={[styles.errorText, { marginTop: -10, marginBottom: 15 }]}>
              {errorMessages.dateOfBirth}
            </Text>
          )}

          <TextInput style={[styles.textInputContainer, { color: "gray" }]}
            placeholder="Age"
            value={kf_age}
            onChangeText={(text) => setkf_age(text)}
            editable={false}
          />

          <TextInputComponent
            placeholder="Mobile Number"
            autoCapitalize="none"
            value={kf_mobile}
            onChangeText={(text) => handleMobileNumberChange(text)}
            keyboardType="numeric"
          />
          {errorMessages.mobileNumber !== '' && (
            <Text style={styles.errorText}>{errorMessages.mobileNumber}</Text>
          )}

          <TextInputComponent
            placeholder="Email Address"
            autoCapitalize="none"
            value={kf_email}
            onChangeText={handleEmailChange}
          />
          {errorMessages.email !== '' && (
            <Text style={styles.errorText}>{errorMessages.email}</Text>
          )}

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
            placeholder="AadharCard Number"
            autoCapitalize="none"
            value={kf_aadharnumber}
            onChangeText={handleAadharCardNumberValidation}
          />

          {errorMessages.aadharCardNumber !== '' && (
            <Text style={styles.errorText}>{errorMessages.aadharCardNumber}</Text>
          )}

          <TextInputComponent
            placeholder="PAN Card Number"
            autoCapitalize="none"
            value={kf_pannumber}
            onChangeText={(text) => handlePancardNumberValidation(text)}
          />
          {errorMessages.panCardNumber !== '' && (
            <Text style={styles.errorText}>{errorMessages.panCardNumber}</Text>
          )}

          <TextInputComponent
            placeholder="Loan Amount Request"
            autoCapitalize="none"
            value={kf_loanamountrequested}
            onChangeText={handleLoanAmountRequestedChange}
          />

          {errorMessages.loanAmountRequested !== '' && (
            <Text style={styles.errorText}>{errorMessages.loanAmountRequested}</Text>
          )}

          <LoanStatusPicker onOptionChange={handleLoanStatusChange}
            title="Select Loan Status"
            options={['Approved', 'PendingApproval', 'Draft', 'Cancelled']}
            initialOption="PendingApproval" 
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
          // disabled={isSignInDisabled}
          />

        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  errorText: {
    color: 'red',
    fontSize: 15,
    marginHorizontal: 25,
  },
  textInputContainer: {
    // marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 8,
    backgroundColor: '#FBFCFC',
    padding: 10,
    marginHorizontal: 20,
    color: "black",
  },
});

export default PersonalLoan;