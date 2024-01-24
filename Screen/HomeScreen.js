import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, Text, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

import HeaderComponent from '../common/Header';
import TextInputComponent from '../common/TextInput';
import ButtonComponent from '../common/ButtonComponent';
import LoanStatusPicker from '../common/LoanStatusPicker ';
import ComponentDatePicker from '../common/ComponentDatePicker';

export const HomeScreen = ({ route }) => {
  const [kf_name, setkf_name] = useState(null);
  const [kf_lastname, setkf_lastname] = useState(null);
  const [kf_gender, setkf_gender] = useState(null);
  const [kf_dateofbirth, setkf_dateofbirth] = useState(null);
  const [kf_age, setkf_age] = useState(null);
  const [kf_mobilenumber, setkf_mobilenumber] = useState(null);
  const [kf_email, setkf_email] = useState(null);
  const [kf_address1, setkf_address1] = useState(null);
  const [kf_address2, setkf_address2] = useState(null);
  const [kf_address3, setkf_address3] = useState(null);
  const [kf_city, setkf_city] = useState(null);
  const [kf_state, setkf_state] = useState(null);
  const [kf_loanamountrequested, setkf_loanamountrequested] = useState(null);
  const [kf_status, setkf_status] = useState(null);
  const [kf_statusreason, setkf_statusreason] = useState(null);
  const [kf_dateofapproval, setkf_dateofapproval] = useState(new Date());
  const [kf_approver, setkf_approver] = useState(null);
  const [kf_firstemidate, setkf_firstemidate] = useState(new Date());
  const [kf_aadharnumber, setkf_aadharnumber] = useState(null);
  const [kf_aadharcard, setkf_aadharcard] = useState({ fileName: null, fileContent: null });
  const [kf_pannumber, setkf_pannumber] = useState(null);
  const [kf_createdby, setkf_createdby] = useState(null);
  const [kf_adminname, setkf_adminname] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  // const [image, setImage] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [resetFormKey, setResetFormKey] = useState(0);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

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

  useFocusEffect(
    React.useCallback(() => {
      getAuthenticatedUser();
    }, [])
  );

  const resetForm = () => {
    setkf_name('');
    setkf_lastname('');
    setkf_gender(null);
    setkf_mobilenumber(null);
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
    setkf_approver(null);
    setkf_firstemidate(new Date());
    setkf_aadharnumber(null);
    setkf_aadharcard({ fileName: null, fileContent: null });
    setSelectedValue('');
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
            navigation.navigate('Dashboard', { resetState: true }); // Pass the parameter
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

  const handleDateChange1 = (newDate) => {
    setkf_dateofapproval(newDate);
  };

  const handleDateChange2 = (newDate) => {
    setkf_firstemidate(newDate);
  };

  // console.log("Request Payload to CRM:", {
  //   kf_name: kf_name,
  //   kf_lastname: kf_lastname,
  //   kf_gender: kf_gender,
  //   kf_dateofbirth:kf_dateofbirth,
  //   kf_age: kf_age,
  //   kf_mobilenumber: kf_mobilenumber,
  //   kf_email: kf_email,
  //   kf_address1: kf_address1,
  //   kf_address2: kf_address2,
  //   kf_address3: kf_address3,
  //   kf_city: kf_city,
  //   kf_state: kf_state,
  //   kf_loanamountrequested: kf_loanamountrequested,
  //   kf_status: kf_status,
  //   kf_statusreason: kf_statusreason,
  //   kf_dateofapproval: kf_dateofapproval,
  //   kf_approver: kf_approver,
  //   kf_firstemidate: kf_firstemidate,
  //   kf_aadharnumber:kf_aadharnumber,
  //   kf_aadharcard:  'base64 content',
  //   kf_adminname:kf_adminname,
  //   kf_pannumber:kf_pannumber,
  // });

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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (result.canceled) {
        return;
      }
      const byteArray = result.base64; // Use result.base64 directly
      const fileName = result.uri.split('/').pop(); // Extracting filename from URI
      console.log("result", result);


      setkf_aadharcard({
        fileName: fileName, // Extracting filename from URI
        fileContent: byteArray,
      });
    } catch (error) {
      console.error('Error picking or processing the image:', error);
      Alert.alert('Error', 'Failed to pick or process the image.');
    }
  };

  const handleFirstNameChange = (text) => {
    if (text.trim() !== '') {
      setkf_name(text);
      setErrorMessages({ ...errorMessages, firstName: '' });
    } else {
      setkf_name('');
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
      setkf_mobilenumber(text);
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
      firstName: !kf_name ? ' Enter First Name' : '',
      lastName: !kf_lastname ? ' Enter Last Name' : '',
      dateOfBirth: !kf_dateofbirth ? ' Enter Date of Birth' : '',
      mobileNumber: !kf_mobilenumber ? ' Enter Mobile Number' : '',
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
      // console.log("tokenResponse", tokenResponse);
      const accessToken = tokenResponse.data.access_token;
      // console.log("Access Token:", accessToken);

      const formattedDateOfApproval = kf_dateofapproval ? kf_dateofapproval.toISOString() : null;
      const formattedFirstEmiDate = kf_firstemidate ? kf_firstemidate.toISOString() : null;
      const formattedDateOfBirth = kf_dateofbirth ? kf_dateofbirth.toISOString() : null;
      const loanAmount = parseFloat(kf_loanamountrequested);
      const userAdminName = authenticatedUser ? authenticatedUser.kf_adminname : '';
      console.log("Detailed Error Response:", userAdminName);
      const createRecordResponse = await axios.post(
        "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications",
        {
          kf_name: kf_name,
          kf_lastname: kf_lastname,
          kf_gender: kf_gender,
          kf_dateofbirth: formattedDateOfBirth,
          kf_age: kf_age,
          kf_mobilenumber: kf_mobilenumber,
          kf_email: kf_email,
          kf_address1: kf_address1,
          kf_address2: kf_address2,
          kf_address3: kf_address3,
          kf_city: kf_city,
          kf_state: kf_state,
          kf_loanamountrequested: loanAmount,
          kf_status: kf_status,
          kf_statusreason: kf_statusreason,
          // kf_dateofapproval: formattedDateOfApproval,
          // kf_approver: kf_approver,
          // kf_firstemidate: formattedFirstEmiDate,
          kf_aadharnumber: kf_aadharnumber,
          kf_pannumber: kf_pannumber,
          // kf_aadharcard: kf_aadharcard.fileContent,
          kf_createdby: userAdminName
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (createRecordResponse.status === 204) {
        console.log("Record created successfully in CRM"); //createRecordResponse
        Alert.alert('Created record Successfully.', '', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Dashboard', { resetState: true });
            },
          },
        ]);
      } else {
        console.log("else part");
        Alert.alert("Error", "Failed to create a record in CRM.");
      }
    } catch (error) {
      console.error("Error during record creation:", error);
      console.log("Detailed Error Response:", error.response); // Log the detailed error response
      Alert.alert("Error", "An unexpected error occurred.  try again later.");
    }
  };

  return (
    <>
      <StatusBar />
      <HeaderComponent titleText="Home Screen" onPress={handleGoBack} />

      <ScrollView key={resetFormKey} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>

          {/* <View>
              {authenticatedUser && (
                <Text style={{ color: 'rgba(255, 28, 53, 255)', fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Created by: {authenticatedUser.kf_adminname}</Text>
              )}
            </View> */}

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
            value={kf_name}
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

          <LoanStatusPicker
            onOptionChange={handleGenderOptionset}
            title="Gender"
            options={['Male', 'Female']}
          // initialOption="Option1"
          />

          <TextInputComponent
            placeholder="Mobile Number"
            autoCapitalize="none"
            value={kf_mobilenumber}
            onChangeText={handleMobileNumberChange}
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
            placeholder="Aadharcard Number"
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
            onChangeText={handlePancardNumberValidation}
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
          // initialOption="Option1"
          />

          {/* <ComponentDatePicker
            selectedDate={kf_dateofapproval}
            onDateChange={handleDateChange1}
            placeholder="Date of Approval"
          />

          <ComponentDatePicker
            selectedDate={kf_firstemidate}
            onDateChange={handleDateChange2}
            placeholder="First EMI Date"
          />
          
          <TextInputComponent
            placeholder="Loan Approver"
            autoCapitalize="none"
            value={kf_approver}
            onChangeText={(text) => setkf_approver(text)}
          />  */}


          {/* <View style={{ flexDirection: "row", marginTop: 15 }}>
            <View style={{ marginHorizontal: 25, marginTop: 10 }}>
              <TouchableOpacity onPress={pickImage}>
                <Text>AadharCard</Text>
              </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: "gray", padding: 10, borderRadius: 20, width: 160, marginLeft: 30 }}>
              {kf_aadharcard.fileContent ? (
                <>
                  <Text style={{ marginTop: 10, textAlign: "center" }}>{kf_aadharcard.fileName}</Text>
                  <Image
          style={{ width: 100, height: 100 }}
          source={{ uri: `data:image/jpeg;base64,${kf_aadharcard.fileContent}` }}
        /> 
                </>
              ) : (
                <TouchableOpacity onPress={() => console.log()}>
                  <Text style={{ color: "white", textAlign: "center" }}>Upload</Text>
                </TouchableOpacity>
              )}
            </View>
          </View> */}

          <ButtonComponent
            title="SUBMIT"
            onPress={handleSaveRecord}
          />

        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    marginHorizontal: 25,
  },
  SignButton: {
    backgroundColor: '#rgba(255,28,53,255)',
    width: '60%',
    alignSelf: 'center',
    borderRadius: 25,
    marginTop: 25,
    padding: 5,
    marginBottom: 25
  },
  SignText: {
    color: '#fff',
    padding: 12,
    textAlign: 'center',
    fontWeight: "bold"
  },
  disabledButton: {
    backgroundColor: 'gray',
    width: '60%',
    alignSelf: 'center',
    borderRadius: 25,
    marginTop: 25,
    padding: 5,
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
  },
});

export default HomeScreen;
