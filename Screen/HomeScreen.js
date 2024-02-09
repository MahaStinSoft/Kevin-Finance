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
// import CardImage from '../common/CardImage';
import { setLocale } from 'yup';

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
  const [kf_aadharnumber, setkf_aadharnumber] = useState(null);
  const [kf_aadharcard, setkf_aadharcard] = useState({ fileName: null, fileContent: null });
  const [kf_pancard, setkf_pancard] = useState({ fileName: null, fileContent: null });
  const [kf_pannumber, setkf_pannumber] = useState(null);
  const [kf_createdby, setkf_createdby] = useState(null);
  const [ModalVisible, setModalVisible] = useState(null);  
  const [kf_applicantimage, setkf_applicantimage] = useState({ fileName: null, fileContent: null });
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [resetFormKey, setResetFormKey] = useState(0);
  const [kf_othercharges, setKf_othercharges] = useState(null);
  const [kf_emicollectiondate, setKf_emicollectiondate] = useState(null);
  // const [kf_loanamountrequested, setkf_loanamountrequested] = useState('');
  const [kf_interestrate, setKf_interestrate] = useState('');
  const [kf_emischedule, setKf_emischedule] = useState('');
  const [kf_numberofemi, setKf_numberofemi] = useState('');
  const [kf_emi, setKf_emi] = useState('');


  const [isfirstnameValid, setIsfirstnameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isaadharNumberValid, setIsaadharcardNumberValid] = useState(true);
  const [isPancardNumberValid, setIsPancardNumberValid] = useState(true);
  const [isLoanAmountValid, setIsLoanAmountValid] = useState(true);
  const [isEmiCollectionDateTouched, setIsEmiCollectionDateTouched] = useState(false);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  console.log("pan", kf_pannumber);

  const [errorMessages, setErrorMessages] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    age: '',
    mobileNumber: '',
    email: '',
    loanAmountRequested: '',
    aadharCardNumber: '',
    panCardNumber: '',
    interestRate: '',
    emiSchedule: '',
    NoOfEMIs: '',
    emiCollectionDate: ''
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
    setkf_aadharnumber(null);
    setkf_aadharcard({ fileName: null, fileContent: null });
    setkf_pancard({ fileName: null, fileContent: null });
    setkf_applicantimage({ fileName: null, fileContent: null });
    setKf_emicollectiondate(null);
    setKf_emi(null);
    setKf_numberofemi(null);
    setKf_emischedule(null);
    setKf_interestrate(null);
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

  // const pickImage = async () => {
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //       base64: true,
  //     });

  //     if (result.canceled) {
  //       return;
  //     }
  //     const byteArray = result.base64; // Use result.base64 directly
  //     const fileName = result.uri.split('/').pop(); // Extracting filename from URI
  //     console.log("result", result);


  //     setkf_aadharcard({
  //       fileName: fileName, // Extracting filename from URI
  //       fileContent: byteArray,
  //     });
  //     setkf_pancard({
  //       fileName: fileName, // Extracting filename from URI
  //       fileContent: byteArray,
  //     });
  //   } catch (error) {
  //     console.error('Error picking or processing the image:', error);
  //     Alert.alert('Error', 'Failed to pick or process the image.');
  //   }
  // };


  const pickImage = async (cardType) => {
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
      
      const byteArray = result.base64;
      const fileName = result.uri.split('/').pop();
  
      if (cardType === 'aadhar') {
        setkf_aadharcard({
          fileName: fileName,
          fileContent: byteArray,
        });
      } else if (cardType === 'pan') {
        setkf_pancard({
          fileName: fileName,
          fileContent: byteArray,
        });
      } else if (cardType === 'applicantimage') {
        setkf_applicantimage({
          fileName:  fileName,
          fileContent:  byteArray
        })
      }
  
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
      setErrorMessages({ ...errorMessages, firstName: 'Enter a First Name' });
    }
  };

  const handleLastNameChange = (text) => {
    if (text.trim() !== '') {
      setkf_lastname(text);
      setErrorMessages({ ...errorMessages, lastName: '' });
    } else {
      setkf_lastname('');
      setErrorMessages({ ...errorMessages, lastName: 'Enter a Last Name' });
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const handleDateOfBirth = (newDate) => {
    if (!newDate) {
      setkf_dateofbirth(null);
      setkf_age('');
      setErrorMessages({
        ...errorMessages,
        dateOfBirth: '',
      });
      return;
    }

    const calculatedAge = calculateAge(newDate);
    setkf_dateofbirth(newDate);
    setkf_age(calculatedAge.toString());

    if (calculatedAge < 18) {
      setErrorMessages({
        ...errorMessages,
        dateOfBirth: 'You must be at least 18 years old.',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        dateOfBirth: '',
      });
    }
  };

  const handleMobileNumberChange = (text) => {
    setkf_mobilenumber(text);

    if (text.trim() === '') {
      setIsMobileNumberValid(false);
      setErrorMessages({
        ...errorMessages,
        mobileNumber: 'Enter a Mobile Number',
      });
    } else if (/^[6-9]\d{9}$/.test(text)){
      setIsMobileNumberValid();
      setErrorMessages({
        ...errorMessages,
        mobileNumber: '',
      });
    } else {
      setIsMobileNumberValid();
      setErrorMessages({
        ...errorMessages,
        mobileNumber: 'Enter a a Valid 10-digit mobile number.',
      });
    }
  };

  const handleEmailChange = (text) => {
    setkf_email(text);
  
    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        email: 'Enter a Email Address',
      });
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setErrorMessages({
        ...errorMessages,
        email: '',
      });
      setIsEmailValid(true)
    } else {
      setErrorMessages({
        ...errorMessages,
        email: 'Enter a a Valid Email Address',
      });
    }
  };

  const handleAadharCardNumberValidation = (text) => {
    setkf_aadharnumber(text);
    
    if (text.trim() === '') {
      setIsaadharcardNumberValid(false);
      setErrorMessages({
        ...errorMessages,
        aadharCardNumber: 'Enter a Aadhar Card Number',
      });
    } else if  (/^\d{12}$/.test(text)) {
      setErrorMessages({
        ...errorMessages,
        aadharCardNumber: '',
      });
      setIsaadharcardNumberValid(false);
    } else {
      setErrorMessages({
        ...errorMessages,
        aadharCardNumber: 'Enter a Valid Aadharcard Number',
      });
      setIsaadharcardNumberValid(true);
    }
  };

  const handlePancardNumberValidation = (text) => {
    setkf_pannumber(text);

    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        panCardNumber: 'Enter a PAN Card',
      });
      setIsPancardNumberValid(false);
    } else if (/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(text)) {
      setErrorMessages({
        ...errorMessages,
        panCardNumber: '',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        panCardNumber: 'Enter a Valid PAN Card Number',
      });
    }
  };

  const handleLoanAmountRequestedChange = (text) => {
    const amountRequested = text.trim() !== '' ? parseFloat(text) : null;
    setkf_loanamountrequested(amountRequested);

    const minLoanAmount = 25000;
    const maxLoanAmount = 1500000;

    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        loanAmountRequested: 'Enter a Loan Amount',
      });
    } else if (/^\d{5,7}$/.test(text) && amountRequested !== null && amountRequested >= minLoanAmount && amountRequested <= maxLoanAmount) {
      setErrorMessages({
        ...errorMessages,
        loanAmountRequested: '',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        loanAmountRequested: `Loan amount should be between ${minLoanAmount} and ${maxLoanAmount} INR.`,
      });
    }
  };

  const handleInterestRate = (text) => {
    setKf_interestrate(text);

    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        interestRate: 'Enter a Interest Amount',
      });
    } else if (/^\d+$/.test(text)) {
      setErrorMessages({
        ...errorMessages,
        interestRate: '',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        interestRate: `Enter a Valid Interest Rate`,
      });
    }
  };

  const handleNoOfEMIs = (text) => {
    setKf_numberofemi(text);

    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        NoOfEMIs: 'Enter a No of EMI payment',
      });
    } else if (/^\d+$/.test(text)) {
      setErrorMessages({
        ...errorMessages,
        NoOfEMIs: '',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        NoOfEMIs: `Enter a Valid No of EMI payment`,
      });
    }
  };

  const handleEmiCollectionDateChange = (date) => {
    setKf_emicollectiondate(date);
    setIsEmiCollectionDateTouched(true); // Mark the field as touched when a date is selected

    if (!date) {
      setErrorMessages({
        ...errorMessages,
        emiCollectionDate: 'Select an EMI Collection Date',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        emiCollectionDate: '',
      });
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

  const onViewImage = () => {
    setModalVisible(true);
  };


  const calculateEMI = () => {
    const P = parseFloat(kf_loanamountrequested); // Principal loan amount
    const r = parseFloat(kf_interestrate) / 100; // Annual interest rate (expressed as a decimal)
    let n = null; // Number of payments per year
    let N = null; // Total number of payments over the loan tenure
    let t = null; // Loan tenure in years

    // Determine the number of payments per year based on the selected EMI schedule
    switch (kf_emischedule) {
      case 1: // Daily
        n = 365;
        break;
      case 2: // Weekly
        n = 52;
        break;
      case 3: // Monthly
        n = 12;
        break;
      default:
        n = 12; // Default to monthly
    }

    // Total number of payments over the loan tenure
    N = parseInt(kf_numberofemi);

    // Loan tenure in years
    t = N / n;

    // Calculate EMI
    const R = r / n; // Monthly interest rate
    const EMI = (P * R * Math.pow((1 + R), N)) / (Math.pow((1 + R), N) - 1);

    // Update state with calculated EMI
    setKf_emi(EMI.toFixed(2));
  };

  // Function to handle changes in loan amount requested or interest rate
  const handleLoanChange = () => {
    // Check if loan amount and interest rate are provided
    if (kf_loanamountrequested && kf_interestrate) {
      calculateEMI(); // Calculate EMI
    }
  };

  // Function to handle changes in EMI schedule or number of EMIs
  const handleEMIScheduleChange = () => {
    // Check if EMI schedule and number of EMIs are provided
    if (kf_emischedule && kf_numberofemi) {
      calculateEMI(); // Calculate EMI
    }
  };

  const handleEmiScheduleOptionset = (EMIschedule) => {
    let numericValue;
    switch (EMIschedule) {
      case 'Daily':
        numericValue = 1;
        break;
      case 'Weekly':
        numericValue = 2;
        break;
      case 'Monthly':
        numericValue = 3;
        break;
      default:
        numericValue = null;
    }
    setKf_emischedule(numericValue);
  };

  const handleEmiSchedule = (emischedule) => {
    setKf_emischedule(emischedule);
    handleEmiScheduleOptionset(emischedule); // Call handleEmiScheduleOptionset here
  
    if (emischedule.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        emiSchedule: 'Select an EMI Schedule',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        emiSchedule: '',
      });
    }
  }  

  const handleInterestRateChange = (text) => {
    // Check if the input is a Valid decimal number
    const isValidDecimal = /^\d*\.?\d*$/.test(text);
  
    if (isValidDecimal || text === '') {
      // If the input is a Valid decimal number or empty, update the state
      setKf_interestrate(text);
      setErrorMessages({ ...errorMessages, interestRate: '' });
    } else {
      // If the input is not a Valid decimal number, show an error message
      // setErrorMessages({ ...errorMessages, interestRate: 'Enter a a Valid decimal number' });
    }
  };

  const handleSaveRecord = async () => {

     if (calculateAge(kf_dateofbirth) < 18) {
      setErrorMessages({
        ...errorMessages,
        dateOfBirth: 'You must be at least 18 years old.',
      });
      return; 
    }

    const minLoanAmount = 25000;
    const maxLoanAmount = 1500000;

    if (kf_loanamountrequested < minLoanAmount || kf_loanamountrequested > maxLoanAmount) {
      setErrorMessages({
        ...errorMessages,
        loanAmountRequested: `Loan amount should be between ${minLoanAmount} and ${maxLoanAmount} INR.`,
      });
      return;
    }

    const newErrorMessages = {
      firstName: !kf_name ? ' Enter a First Name' : '',
      lastName: !kf_lastname ? ' Enter a Last Name' : '',
      dateOfBirth: !kf_dateofbirth ? ' Enter a Date of Birth' : '',
      mobileNumber: /^[6-9]\d{9}$/.test(kf_mobilenumber) ? '' : 'Enter a a Valid 10-digit mobile number.',
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kf_email) ? 'Enter a a Valid Email Address' : '',
      loanAmountRequested: !kf_loanamountrequested ? ' Enter a Loan Amount Requested' : '',
      aadharCardNumber: !/^\d{12}$/.test(kf_aadharnumber) ? 'Enter a Valid Aadharcard Number' : '',
      panCardNumber: !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(kf_pannumber) ? 'Enter a Valid PAN Card Number' : '',
      interestRate: !/^\d+$/.test(kf_interestrate) ? 'Enter a Valid Interest Rate' : '',
      emiSchedule: !kf_emischedule ? 'select a EMISchedule' : '',
      NoOfEMIs: !/^\d+$/.test(kf_numberofemi) ? 'Enter a Valid No of EMI payment' : '',
      emiCollectionDate: !kf_emicollectiondate ? 'select a EMI Collection Date' : ''  
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

      const formattedDateOfBirth = kf_dateofbirth ? kf_dateofbirth.toISOString() : null;
      const loanAmount = parseFloat(kf_loanamountrequested);
      const userAdminName = authenticatedUser ? authenticatedUser.kf_adminname : '';
    //   const aadharcardImageData = await prepareImageData(kf_aadharcard);
    // const pancardImageData = await prepareImageData(kf_pancard);
    // const applicantImageData = await prepareImageData(kf_applicantimage);

      console.log("userAdminName", userAdminName);

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
          kf_aadharnumber: kf_aadharnumber,
          kf_pannumber: kf_pannumber,
          // kf_aadharcard: aadharcardImageData,
          // kf_pancard: pancardImageData,
          // kf_applicantimage: applicantImageData,
          kf_emischedule: kf_emischedule,
          kf_interestrate: kf_interestrate,
          kf_emi: kf_emi,
          kf_numberofemi: kf_numberofemi,
          kf_emicollectiondate: kf_emicollectiondate,
          kf_othercharges: kf_othercharges,
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
          text: 'Cancel',
          style: 'cancel',
        },
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
      if (error.response) {
        console.log("Detailed Error Response:", error.response.data);
      }
      Alert.alert("Error", "An unexpected error occurred. Try again later.");
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
            style={{ height: 48, marginBottom: 15 }}
            selectedDate={kf_dateofbirth}
            onDateChange={handleDateOfBirth}
            placeholder="Date of Birth"
          />

          {errorMessages.dateOfBirth !== '' && (
            <Text style={[styles.errorText, { marginTop: -10, marginBottom: 15 }]}>
              {errorMessages.dateOfBirth}
            </Text>
          )}

          <TextInput style={[styles.textInputContainer, { color: "gray" ,margin: 5}]}
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

          {/* <CardImage
            title="AadharCard"
            imageContent={kf_aadharcard}
            onViewImage={onViewImage}
            pickImage={() => pickImage('aadhar')}
            setModalVisible={setModalVisible}
          />

          <CardImage
            title="PANCard"
            imageContent={kf_pancard}
            onViewImage={onViewImage}
            pickImage={() => pickImage('pan')}
            setModalVisible={setModalVisible}
          />

          <CardImage
            title="Applicant"
            imageContent={kf_applicantimage}
            onViewImage={onViewImage}
            pickImage={() => pickImage('applicantimage')}
            setModalVisible={setModalVisible}
          />  */}

<TextInputComponent
            placeholder="Loan Amount Request"
            autoCapitalize="none"
            value={kf_loanamountrequested}
            onChangeText={handleLoanAmountRequestedChange}
          />

          {errorMessages.loanAmountRequested !== '' && (
            <Text style={styles.errorText}>{errorMessages.loanAmountRequested}</Text>
          )}

<TextInput
            style={[styles.textInputContainer, { marginVertical: 10 }]}
            placeholder="Interest Rate"
            value={kf_interestrate}
            onChangeText={handleInterestRate}
            onBlur={handleLoanChange}
          // keyboardType="numeric" 
          />
          {errorMessages.interestRate !== '' && (
            <Text style={styles.errorText}>{errorMessages.interestRate}</Text>
          )}

          <LoanStatusPicker
            onOptionChange={handleEmiSchedule}
            title="EMI Schedule"
            options={['Daily', 'Weekly', 'Monthly']}
          />
          {errorMessages.emiSchedule !== '' && (
            <Text style={styles.errorText}>{errorMessages.emiSchedule}</Text>
          )}

          <TextInput
            style={[styles.textInputContainer, { marginVertical: 10 }]}
            placeholder="Number of EMIs"
            value={kf_numberofemi}
            onChangeText={handleNoOfEMIs}
            onBlur={handleEMIScheduleChange}
          // keyboardType="numeric"
          />
          {errorMessages.NoOfEMIs !== '' && (
            <Text style={styles.errorText}>{errorMessages.NoOfEMIs}</Text>
          )}

          <Text style={[styles.textInputContainer, { marginVertical: 10, height: 48, color: "gray" }]}>EMI: {kf_emi}</Text>

          <ComponentDatePicker
            style={{ height: 48, marginBottom: 15 }}
            selectedDate={kf_emicollectiondate}
            onDateChange={handleEmiCollectionDateChange}
            placeholder="EMI Collection Date"  
          />
          {errorMessages.emiCollectionDate !== '' && (
            <Text style={styles.errorText}>{errorMessages.emiCollectionDate}</Text>
          )}

          {/* <TextInputComponent
            placeholder="Other Charges"
            autoCapitalize="none"
            value={kf_othercharges}
            onChangeText={(text) => setKf_othercharges(parseFloat(text))}
          /> */}

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
