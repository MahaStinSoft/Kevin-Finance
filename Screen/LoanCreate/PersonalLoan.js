import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, Text, TouchableOpacity, StatusBar, TextInput, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import HeaderComponent from '../../common/Header';
import TextInputComponent from '../../common/TextInput';
import ButtonComponent from '../../common/ButtonComponent';
import LoanStatusPicker from '../../common/LoanStatusPicker ';
import ComponentDatePicker from '../../common/ComponentDatePicker';
import CardImage from '../../common/CardImage';
import CustomAlert from '../../common/CustomAlert';

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
  const [kf_createdby, setkf_createdby] = useState(true);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [resetFormKey, setResetFormKey] = useState(0);
  const [image, setImage] = useState(null);
  const [kf_applicantimage, setkf_applicantimage] = useState({ fileName: null, fileContent: null });
  const [kf_interestamount, setkf_interestamount] = useState(null);
  const [kf_totalamount, setkf_totalamount] = useState(null);
  const [kf_othercharges, setKf_othercharges] = useState(null);
  const [kf_emicollectiondate, setKf_emicollectiondate] = useState(null);
  // const [kf_loanamountrequested, setkf_loanamountrequested] = useState('');
  const [kf_interestrate, setKf_interestrate] = useState('');
  const [kf_emischedule, setKf_emischedule] = useState('');
  const [kf_numberofemi, setKf_numberofemi] = useState('');
  const [kf_emi, setKf_emi] = useState('');
  const [formDisabled, setFormDisabled] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [isfirstnameValid, setIsfirstnameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [isaadharNumberValid, setIsaadharcardNumberValid] = useState(true);
  const [isPancardNumberValid, setIsPancardNumberValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isLoanAmountRequested, setIsLoanAmountRequested] = useState(true);
  const [isEmiCollectionDateTouched, setIsEmiCollectionDateTouched] = useState(false);
  const [showAlert, setShowAlert] = useState(false); 
  const [showAlertConfirmation, setShowAlertConfirmation] = useState(false); 

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

useEffect(() => {
  // Function to calculate EMI
  const calculateEMI = () => {
    // Check if all required values are available
    if (kf_loanamountrequested && kf_interestrate && kf_emischedule && kf_numberofemi) {
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
    }
  };

  // Call the calculateEMI function whenever any of the dependent values change
  calculateEMI();
}, [kf_loanamountrequested, kf_interestrate, kf_emischedule, kf_numberofemi]);

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

const handleInterestRateChange = (text) => {
  // Check if the input is a valid decimal number
  const isValidDecimal = /^\d*\.?\d*$/.test(text);

  if (isValidDecimal || text === '') {
    // If the input is a valid decimal number or empty, update the state
    setKf_interestrate(text);
    setErrorMessages({ ...errorMessages, interestRate: '' });
  } else {
    // If the input is not a valid decimal number, show an error message
    setErrorMessages({ ...errorMessages, interestRate: 'Enter a valid decimal number' });
  }
};

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
    setKf_emischedule(null);
    setKf_emi(null);
    setkf_interestamount(null);
    setKf_emicollectiondate(null);
    setKf_emi(null);
    setKf_numberofemi(null);
    setKf_emischedule(null);
    setKf_interestrate(null);    
    setkf_applicantimage({ fileName: null, fileContent: null });
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
            navigation.goBack({ resetState: true }); 
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.isFocused()) {
        // If the user is on the login screen, show the exit confirmation alert
        Alert.alert(
          'Discard Changes',
          'Are you sure want to discard the changes?',
          [
            {
              text: 'cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Discard',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false }
        );
        return true; // Prevent default back button behavior
      }
    });

    return () => backHandler.remove();
  }, [navigation]);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetForm();
    });
    return unsubscribe;
  }, [navigation]);

  // console.log("Request Payload to CRM:", {
  //   kf_mobile: kf_mobile,
  //   kf_name: kf_name
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

  const handleFirstNameChange = (text) => {
    const onlyAlphabets = /^[^!-\/:-@\[-`{-~]+$/;

    if (onlyAlphabets.test(text) || text.trim() !== '') {
      setkf_firstname(text);
      setErrorMessages({ ...errorMessages, firstName: '' });
    } else {
      setkf_firstname('');
      setErrorMessages({ ...errorMessages, firstName: 'Enter First Name' });
    }
  };

  const handleLastNameChange = (text) => {
    const onlyAlphabets = /^[^!-\/:-@\[-`{-~]+$/;

    if (onlyAlphabets.test(text) || text.trim() !== '') {
      setkf_lastname(text);
      setErrorMessages({ ...errorMessages, lastName: '' });
    } else {
      setkf_lastname('');
      setErrorMessages({ ...errorMessages, lastName: 'Enter Last Name' });
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
    setkf_mobile(text);

    if (text.trim() === '') {
      setIsMobileNumberValid(false);
      setErrorMessages({
        ...errorMessages,
        mobileNumber: 'Enter Mobile Number',
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
        mobileNumber: 'Enter a Valid 10-digit mobile number.',
      });
    }
  };

  const handleEmailChange = (text) => {
    setkf_email(text);
  
    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        email: 'Enter Email Address',
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
        email: 'Enter a Valid Email Address',
      });
    }
  };

  const handleAadharCardNumberValidation = (text) => {
    setkf_aadharnumber(text);
    
    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        aadharCardNumber: 'Enter Aadhar Card Number',
      });
    } else if  (/^\d{12}$/.test(text)) {
      setErrorMessages({
        ...errorMessages,
        aadharCardNumber: '',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        aadharCardNumber: 'Enter Valid Aadharcard Number',
      });
    }
  };

  const handlePancardNumberValidation = (text) => {
    setkf_pannumber(text);

    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        panCardNumber: 'Enter PAN Card',
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
        panCardNumber: 'Enter Valid PAN Card Number',
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
        loanAmountRequested: 'Enter Loan Amount',
      });
    } 
    // else if (/^\d{5,7}$/.test(text) && amountRequested !== null && amountRequested >= minLoanAmount && amountRequested <= maxLoanAmount) {
    //   setErrorMessages({
    //     ...errorMessages,
    //     loanAmountRequested: '',
    //   });
    // } 
    else {
      setErrorMessages({
        ...errorMessages,
        loanAmountRequested: '',
      });
    }
  };

  // const handleInterestRate = (text) => {
  //   setKf_interestrate(text);

  //   if (text.trim() === '') {
  //     setErrorMessages({
  //       ...errorMessages,
  //       interestRate: 'Enter a Interest Amount',
  //     });
  //   } else if (/^\d+$/.test(text)) {
  //     setErrorMessages({
  //       ...errorMessages,
  //       interestRate: '',
  //     });
  //   } else {
  //     setErrorMessages({
  //       ...errorMessages,
  //       interestRate: `Enter a Valid Interest Rate`,
  //     });
  //   }
  // };

  const handleInterestRate = (text) => {
    // Update the state with the input text
    setKf_interestrate(text);
    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        interestRate: 'Enter an Interest Amount',
      });
    } else if (/^\d+(\.\d+)?%?$/.test(text)) {
      // Validate if the input contains digits, optionally followed by a decimal point and more digits, and optionally followed by a '%' sign
      setErrorMessages({
        ...errorMessages,
        interestRate: '',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        interestRate: 'Enter a valid Interest Rate',
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
        NoOfEMIs: `Enter a No of EMI payment`,
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
    handleEmiScheduleOptionset(emischedule); 
  
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

  const getAuthenticatedUser = async () => {
    try {
      const userString = await AsyncStorage.getItem('authenticatedUser');
      // console.log("getAuthenticatedUser:", userString);

      if (userString) {
        const user = JSON.parse(userString);
        setAuthenticatedUser(user);
      }
    } catch (error) {
      // console.error('Error getting authenticated user:', error);
    }
  };

  const handleSaveRecord = async () => {  
    setIsFormSubmitted(true);
    if (calculateAge(kf_dateofbirth) < 18) {
      setErrorMessages({
        ...errorMessages,
        dateOfBirth: 'You must be at least 18 years old.',
      });
      return; 
    }

    // const minLoanAmount = 25000;
    // const maxLoanAmount = 1500000;

    // if (kf_loanamountrequested < minLoanAmount || kf_loanamountrequested > maxLoanAmount) {
    //   setErrorMessages({
    //     ...errorMessages,
    //     // loanAmountRequested: `Loan amount should be between ${minLoanAmount} and ${maxLoanAmount} INR.`,
    //   });
    //   return;
    // }

    const newErrorMessages = {
      firstName: !kf_firstname ? ' Enter First Name' : '',
      lastName: !kf_lastname ? ' Enter Last Name' : '',
      dateOfBirth: !kf_dateofbirth ? ' Enter Date of Birth' : '',
      mobileNumber: /^[6-9]\d{9}$/.test(kf_mobile) ? '' : 'Enter a Valid 10-digit mobile number.',
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kf_email) ? 'Enter a Valid Email Address' : '',
      loanAmountRequested: !kf_loanamountrequested ? ' Enter Loan Amount Requested' : '',
      aadharCardNumber: !/^\d{12}$/.test(kf_aadharnumber) ? 'Enter Valid Aadharcard Number' : '',
      panCardNumber: !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(kf_pannumber) ? 'Enter Valid PAN Card Number' : '',
      interestRate: !/^\d+(\.\d+)?%?$/.test(kf_interestrate) ? 'Enter a Interest Rate' : '',
      emiSchedule: !kf_emischedule ? 'select a EMISchedule' : '',
      NoOfEMIs: !/^\d+$/.test(kf_numberofemi) ? 'Enter a No of EMI payment' : '',
      // emiCollectionDate: !kf_emicollectiondate ? 'select a EMI Collection Date' : ''
      applicantImage: !kf_applicantimage.fileContent ? 'Applicant image is required.' : '',  

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
      // console.log("created by", userAdminname);

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
          kf_createdby: userAdminname,
          kf_emischedule: kf_emischedule,
          kf_interestrate: kf_interestrate,
          kf_emi: kf_emi,
          kf_numberofemi: kf_numberofemi,
          kf_emicollectiondate: kf_emicollectiondate,
          kf_othercharges: kf_othercharges,
          kf_applicantimage:kf_applicantimage.fileContent,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (createRecordResponse.status === 204) {
        setFormDisabled(true);
        console.log("Record created successfully in CRM");
        // Alert.alert('Personal Loan', 'Created record Successfully.', [
        //   {
        //     text: 'Cancel',
        //     style: 'cancel',
        //   },
        //   {
        //     text: 'OK',
        //     onPress: () => {
        //       navigation.navigate('Dashboard');
        //     },
        //   },
        // ]);
        handleShowAlert();
      } else {
        console.log("Failed to create a record in CRM.");
        Alert.alert("Error", "Failed to create a record in CRM.");
      }
    } catch (error) {
      console.error("Error during record creation:", error);
      // console.log("Detailed Error Response:", error.response);
      Alert.alert("Error", "An unexpected error occurred.  try again later.");
    }
  };

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    // navigation.navigate('Dashboard');
  };

  const handleConfirmAlert = () => {
    setShowAlertConfirmation(false);
    navigation.navigate('Dashboard');
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
        
          {/* <Text style={[styles.textInputContainer, { marginTop: 15, marginBottom: 5  , color: "gray", height: 50 }]}>
            {(!kf_firstname && !kf_lastname) ? "Full Name" : `${kf_firstname} ${kf_lastname}`}
          </Text> */}

          <LoanStatusPicker
            onOptionChange={handleGenderOptionset}
            title="Gender"
            options={['Male', 'Female']}
          />

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

          <TextInput style={[styles.textInputContainer, { color: "gray", margin: 5 }]}
            placeholder="Age"
            value={kf_age}
            onChangeText={(text) => setkf_age(text)}
            editable={false}
          />

          {errorMessages.age !== '' && (
            <Text style={styles.errorText}>
              {errorMessages.age}
            </Text>
          )}

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
            onBlur={handleLoanChange}
            keyboardType="numeric"
          />

          {errorMessages.loanAmountRequested !== '' && (
            <Text style={styles.errorText}>{errorMessages.loanAmountRequested}</Text>
          )}

          {/* <TextInput
            style={[styles.textInputContainer, { marginVertical: 10 }]}
            placeholder="Interest Rate"
            // value={kf_interestrate}
            value={kf_interestrate ? `${kf_interestrate}${kf_interestrate.endsWith('%') ? '' : '%'}` : ''}
            onChangeText={handleInterestRate}
            onBlur={handleLoanChange}
            keyboardType="numeric"
          /> */}

          <TextInput
            style={[styles.textInputContainer, { marginVertical: 10 }]}
            placeholder="Interest Rate %"
            value={kf_interestrate}
            onChangeText={handleInterestRate}
            onBlur={handleLoanChange}
            keyboardType="numeric"
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
          keyboardType="numeric"
          />
          {errorMessages.NoOfEMIs !== '' && (
            <Text style={styles.errorText}>{errorMessages.NoOfEMIs}</Text>
          )}

          <Text style={[styles.textInputContainer, { marginVertical: 10, height: 48, color: "gray" }]}>EMI: {kf_emi}</Text>

          {/* <ComponentDatePicker
            style={{ height: 48, marginBottom: 15 }}
            selectedDate={kf_emicollectiondate}
            onDateChange={handleEmiCollectionDateChange}
            placeholder="EMI Collection Date"  
          />
          {errorMessages.emiCollectionDate !== '' && (
            <Text style={styles.errorText}>{errorMessages.emiCollectionDate}</Text>
          )} */}

          {/* <TextInputComponent
            placeholder="Other Charges"
            autoCapitalize="none"
            value={kf_othercharges}
            onChangeText={(text) => setKf_othercharges(parseFloat(text))}
          /> */}

          <View style={{ marginLeft: 20 }}>
            <CardImage
              title="Applicant"
              imageContent={kf_applicantimage}
              setImageContent={setkf_applicantimage}
            />
            {!kf_applicantimage.fileContent && errorMessages.applicantImage !== '' && (
              <Text style={styles.errorText}>{errorMessages.applicantImage}</Text>
            )}
          </View>

          <ButtonComponent
            title="SUBMIT"
            onPress={handleSaveRecord}
          disabled={formDisabled}
          />

<CustomAlert
          visible={showAlert}
          onClose={handleCloseAlert}
          onConfirm={handleConfirmAlert}
          headerMessage="Personal Loan"
          message="Record Created Successfully."
          Button1="Cancel"
          Button2="OK"
          style={styles.alertStyle}
          modalHeaderStyle={[styles.modalheaderStyle, {right: 80}]}
          textStyle={styles.textStyle}
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
  alertStyle:{
    // backgroundColor: "blue",
    width: "80%",
      },
      modalheaderStyle:{
        // backgroundColor: "green",
        right: 85
      },
      textStyle:{
        // backgroundColor: "yellow"
      }
});

export default PersonalLoan;