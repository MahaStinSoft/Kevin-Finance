import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Text, FlatList, Linking, Platform, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import HeaderComponent from '../../common/Header';
import ButtonComponent from '../../common/ButtonComponent';
import ComponentDatePicker from '../../common/ComponentDatePicker';
import LoanStatusPicker from '../../common/LoanStatusPicker ';
import CardImage from '../../common/CardImage';
import SignatureScreen from '../../signature';
import CardImageSignature from '../../common/CardImageSignature';
import RenderAnnotation from '../../common/renderAnnotationItem';

const EditHomeLoan = ({ route, navigation }) => {
  const { loanApplication, onUpdateSuccess } = route.params || {};
  const [applicationnumber, setapplicationnumber] = useState(loanApplication?.kf_applicationnumber || '');
  const [createdby, setcreatedby] = useState(loanApplication?.kf_createdby || '');
  const [firstname, setfirstname] = useState(loanApplication?.kf_name || '');
  const [lastname, setLastname] = useState(loanApplication?.kf_lastname || '');
  const [dateofbirth, setdateofbirth] = useState(loanApplication?.kf_dateofbirth ? new Date(loanApplication.kf_dateofbirth) : null);
  const [age, setage] = useState(loanApplication?.kf_age || '');
  const [gender, setGender] = useState(loanApplication?.kf_gender || '');
  const [mobileNumber, setMobileNumber] = useState(loanApplication?.kf_mobilenumber || '');
  const [email, setEmail] = useState(loanApplication?.kf_email || '');
  const [address1, setAddress1] = useState(loanApplication?.kf_address1 || '');
  const [address2, setAddress2] = useState(loanApplication?.kf_address2 || '');
  const [address3, setAddress3] = useState(loanApplication?.kf_address3 || '');
  const [city, setCity] = useState(loanApplication?.kf_city || '');
  const [state, setState] = useState(loanApplication?.kf_state || '');
  const [loanAmountRequested, setLoanAmountRequested] = useState(loanApplication?.kf_loanamountrequested || '');
  const [status, setStatus] = useState(loanApplication?.kf_status ? loanApplication.kf_status.toString() : '');
  const [statusReason, setstatusReason] = useState(loanApplication?.kf_statusreason ? loanApplication.kf_statusreason.toString() : '');
  const [approvalDate, setApprovalDate] = useState(loanApplication?.kf_approvaldate || '');
  const [approver, setApprover] = useState(loanApplication?.kf_approvaldate || '');
  const [firstEMIDate, setfirstEMIDate] = useState(loanApplication?.kf_firstemidate || '');
  const [aadharcardNumber, setAadharcardNumber] = useState(loanApplication?.kf_aadharnumber || '');
  const [pancardNumber, setPancardNumber] = useState(loanApplication?.kf_pannumber || '');
  const [otherCharges, setOtherCharges] = useState(loanApplication?.kf_othercharges || '');
  const [emiCollectionDate, setEmiCollectionDate] = useState(loanApplication?.kf_emicollectiondate || '');
  const [interestRate, setInterestRate] = useState(loanApplication?.kf_interestrate || '');
  const [emiSchedule, setEmiSchedule] = useState(loanApplication?.kf_emischedule || '');
  const [numberOfEMI, setNumberOfEMI] = useState(loanApplication?.kf_numberofemi || '');
  const [eminAmount, setEmiAmount] = useState(loanApplication?.kf_emi || '');
  const [aadharcard, setAadharcard] = useState({ fileName: null, fileContent: null });
  const [pancard, setPancard] = useState({ fileName: null, fileContent: null });
  const [applicantImage, setapplicantImage] = useState({ fileName: null, fileContent: null });
  const [signature, setSignature] = useState({ fileName: null, fileContent: null });
  const [sendApproval, setSendApproval] = useState(loanApplication?.kf_sendapproval || '');

  const [isfirstnameValid, setIsfirstnameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isaadharNumberValid, setIsaadharcardNumberValid] = useState(true);
  const [isPancardNumberValid, setIsPancardNumberValid] = useState(true);
  const [isLoanAmountValid, setIsLoanAmountValid] = useState(true);
  const [ModalVisible, setModalVisible] = useState(true);
  const [annotations, setAnnotations] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const [item, setItem] = useState(null); // Assuming you have some state to store the current item
  const [imageContent, setImageContent] = useState(null);
  const [aadharImageContent, setAadharImageContent] = useState(null);

  const { signatureImage } = route.params;
  // const [signatureImage, setSignatureImage] = useState(null);
  const [recordId, setRecordId] = useState(loanApplication.kf_loanapplicationid);
  const [imageSource, setImageSource] = useState(null);

  const [errorMessages, setErrorMessages] = useState({
    firstNameEdit: '',
    lastNameEdit: '',
    dateOfBirthEdit: '',
    mobileNumberEdit: '',
    emailEdit: '',
    loanAmountRequestedEdit: '',
    aadharCardNumberEdit: '',
    panCardNumberEdit: '',
  });

  const handleGoBack = () => {
    navigation.navigate("HomeLoanDetailsScreen", { loanApplication });
  };

  useEffect(() => {
    setapplicationnumber(loanApplication.kf_applicationnumber);
    setcreatedby(loanApplication.kf_createdby);
    setfirstname(loanApplication.kf_name);
    setLastname(loanApplication.kf_lastname);
    setdateofbirth(loanApplication.kf_dateofbirth ? new Date(loanApplication.kf_dateofbirth) : null);
    setage(loanApplication.kf_age || '');
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
    setApprovalDate(loanApplication.kf_approvaldate);
    setApprover(loanApplication.kf_approver);
    setfirstEMIDate(loanApplication.kf_firstemidate);
    setAadharcardNumber(loanApplication.kf_aadharnumber);
    setPancardNumber(loanApplication.kf_pannumber);
    setOtherCharges(loanApplication.kf_othercharges);
    setEmiCollectionDate(loanApplication.kf_emicollectiondate);
    setEmiSchedule(loanApplication.kf_emischedule);
    setEmiAmount(loanApplication.kf_emi);
    setInterestRate(loanApplication.kf_interestrate);
    setNumberOfEMI(loanApplication.kf_numberofemi);
    setSendApproval(loanApplication.kf_sendapproval);
    setRecordId(loanApplication.kf_loanapplicationid);
    setAadharcard({ fileName: null, fileContent: null });
    setPancard({ fileName: null, fileContent: null });
    setapplicantImage({ fileName: null, fileContent: null });
    setSignature({ fileName: null, fileContent: null })
    console.log('State updated:', {
      applicationnumber,
      createdby,
      firstname,
      lastname,
      gender,
      status,
      mobileNumber
    });
  }, [loanApplication]);

  const handleUpdateRecord = async () => {

    // Check if the age is greater than 18
    if (calculateAge(dateofbirth) < 18) {
      setErrorMessages({
        ...errorMessages,
        dateOfBirthEdit: 'You must be at least 18 years old to proceed.',
      });
      return; // Stop the update process
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessages({
        ...errorMessages,
        emailEdit: 'Enter a Valid Email Address',
      });
      return; // Stop the update process if email is invalid
    }

    const minLoanAmount = 25000;
    const maxLoanAmount = 1500000;

    if (!loanAmountRequested) {
      setErrorMessages({
        ...errorMessages,
        loanAmountRequestedEdit: `Enter Loan Amount`,
      });
      return;
    }

    if (!isPancardNumberValid) {
      setErrorMessages({
        ...errorMessages,
        panCardNumberEdit: 'Enter Valid PAN Card',
      });
      return;
    }

    const newErrorMessages = {
      firstNameEdit: !firstname ? 'Enter First Name' : '',
      lastNameEdit: !lastname ? 'Enter Last Name' : '',
      dateOfBirthEdit: !dateofbirth ? 'Enter Date of Birth' : '',
      mobileNumberEdit: /^\d{10}$/.test(mobileNumber) ? '' : 'Please Enter a Valid 10-digit mobile number.',
      emailEdit: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter Email Address' : '',
      // loanAmountRequestedEdit: !loanAmountRequested ? '' : 'Enter Loan Amount',
      aadharCardNumberEdit: /^\d{12}$/.test(aadharcardNumber) ? '' : 'Please Enter Valid Aadharcard Number',
      panCardNumberEdit: !pancardNumber ? 'Enter PAN Card Number' : '',
    };
    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some(message => message !== '')) {
      return;
    }
    try {
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
      // const formattedDateOfBirth = dateofbirth ? dateofbirth.toISOString() : null;

      const accessToken = tokenResponse.data.access_token;
      const formattedDateOfBirth = dateofbirth ? dateofbirth.toISOString() : null;

      const updateRecordResponse = await axios.patch(
        `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${recordId})`,
        {
          kf_applicationnumber: applicationnumber,
          kf_createdby: createdby,
          kf_name: firstname,
          kf_lastname: lastname,
          kf_dateofbirth: formattedDateOfBirth,
          kf_age: age,
          kf_gender: gender,
          kf_mobilenumber: mobileNumber,
          kf_email: email,
          kf_address1: address1,
          kf_address2: address2,
          kf_address3: address3,
          kf_city: city,
          kf_state: state,
          kf_loanamountrequested: parseInt(loanAmountRequested),
          kf_status: status,
          kf_statusreason: statusReason,
          kf_approvaldate: approvalDate,
          kf_approver: approver,
          kf_firstemidate: firstEMIDate,
          kf_aadharnumber: aadharcardNumber,
          kf_pannumber: pancardNumber,
          kf_interestrate: interestRate,
          kf_emi: eminAmount,
          kf_emicollectiondate: emiCollectionDate,
          kf_emischedule: emiSchedule,
          kf_othercharges: otherCharges,
          kf_numberofemi: numberOfEMI,
          kf_sendapproval: sendApproval
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
            kf_applicationnumber: applicationnumber,
            kf_createdby: createdby,
            kf_name: firstname,
            kf_lastname: lastname,
            kf_dateofbirth: formattedDateOfBirth,
            kf_age: parseInt(age),
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
            kf_approvaldate: approvalDate,
            kf_approver: approver,
            kf_firstemidate: firstEMIDate,
            kf_aadharnumber: aadharcardNumber,
            kf_pannumber: pancardNumber,
            kf_interestrate: interestRate,
            kf_emi: eminAmount,
            kf_emicollectiondate: emiCollectionDate,
            kf_emischedule: emiSchedule,
            kf_othercharges: otherCharges,
            kf_numberofemi: numberOfEMI,
            kf_sendapproval: sendApproval
          });
        }
        console.log(loanAmountRequested)
        Alert.alert('Updated the record Successfully.', '', [
          {
            text: 'cancel'
          },
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('HomeLoanDetailsScreen', { loanApplication: loanApplication });
            },
          },
        ]);
      } else {
        console.log('Error updating record in CRM:', updateRecordResponse);
        Alert.alert('Error', 'Failed to update the record in CRM.');
      }
    } catch (error) {
      console.error('Error during update:', error.response?.data || error.message);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);

    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        emailEdit: 'Enter Email Address',
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setErrorMessages({
        ...errorMessages,
        emailEdit: 'Enter a Valid Email Address',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        emailEdit: '',
      });
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
      setdateofbirth(null);
      setage('');
      setErrorMessages({
        ...errorMessages,
        dateOfBirthEdit: '',
      });
      return;
    }

    const calculatedAge = calculateAge(newDate);
    setdateofbirth(newDate);
    setage(calculatedAge.toString());

    if (calculatedAge <= 18) {
      setErrorMessages({
        ...errorMessages,
        dateOfBirthEdit: 'You must be at least 18 years old.',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        dateOfBirthEdit: '',
      });
    }
  };

  const handlePancardNumberValid = (text) => {
    setPancardNumber(text);

    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        panCardNumberEdit: 'Enter PAN Card',
      });
      setIsPancardNumberValid(false);
    } else if (/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(text)) {
      setErrorMessages({
        ...errorMessages,
        panCardNumberEdit: '',
      });
      setIsPancardNumberValid(true);
    } else {
      setErrorMessages({
        ...errorMessages,
        panCardNumberEdit: 'Enter Valid PAN Card',
      });
      setIsPancardNumberValid(false);
    }
  };

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
    setGender(numericValue);
  };

  const getGenderOptionsetStringFromNumericValue = (numericValue) => {
    switch (numericValue) {
      case 123950000:
        return 'Male';
      case 123950001:
        return 'Female';
      default:
        return '';
    }
  };

  const handleSendApproval = (selectedOptionGender) => {
    let booleanValue;
    switch (selectedOptionGender) {
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
  
  const getSendApproval = (booleanValue) => {
    switch (booleanValue) {
      case false:
        return 'No';
      case true:
        return 'Yes';
      default:
        return '';
    }
  };

  const handleEMISchedule = (selectedOptionSchedule) => {
    let numericValue;
    switch (selectedOptionSchedule) {
      case 'Daily':
        numericValue = 1;
        break;
      case 'Weekly':
        numericValue = 2;
        break;
      case 'Monthly':
        numericValue = 3
      default:
        numericValue = null;
    }
    setEmiSchedule(numericValue);
  };

  const getEmiSchedule = (numericValue) => {
    switch (numericValue) {
      case 1:
        return 'Daily';
      case 2:
        return 'Weekly';
      case 3:
        return 'Monthly';
      default:
        return '';
    }
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
    setStatus(numericValue);
  };

  const getStatusStringFromNumericValue = (numericValue) => {
    switch (numericValue) {
      case 123950000:
        return 'Approved';
      case 123950001:
        return 'Pending Approval';
      case 123950002:
        return 'Draft';
      case 123950003:
        return 'Cancelled';
      case 123950004:
        return 'Expired';
      default:
        return 'Pending Approval';
    }
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
    setstatusReason(numericValue);
  };

  const getAnotherOptionStringFromNumericValue = (numericValue) => {
    switch (numericValue) {
      case 123950000:
        return 'AadharNotMatching';
      case 123950001:
        return 'InvalidDocuments';
      default:
        return '';
    }
  };

  const handleMobileNumberChange = (text) => {
    setMobileNumber(text);

    if (text.trim() === '') {
      setIsMobileNumberValid(false);
      setErrorMessages({
        ...errorMessages,
        mobileNumberEdit: 'Enter Mobile Number',
      });
    } else {
      setIsMobileNumberValid(/^\d{10}$/.test(text));
      setErrorMessages({
        ...errorMessages,
        mobileNumberEdit: /^\d{10}$/.test(text) ? '' : 'Please Enter a Valid 10-digit mobile number.',
      });
    }
  };

  const handleAadharCardNumberChange = (text) => {
    setAadharcardNumber(text);

    if (text.trim() === '') {
      setIsaadharcardNumberValid(false);
      setErrorMessages({
        ...errorMessages,
        aadharCardNumberEdit: 'Enter Aadhar Card Number',
      });
    } else {
      const aadharRegex = /^\d{12}$/;
      const isValid = aadharRegex.test(text);

      setIsaadharcardNumberValid(isValid);
      setErrorMessages({
        ...errorMessages,
        aadharCardNumberEdit: isValid ? '' : 'Aadhar Card Number must be exactly 12 digits',
      });
    }
  };

  const handleLoanAmountRequestedChange = (text) => {
    const amountRequested = text.trim() !== '' ? parseFloat(text) : null;
    setLoanAmountRequested(amountRequested);

    const minLoanAmount = 25000;
    const maxLoanAmount = 1500000;

    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        loanAmountRequestedEdit: 'Enter Loan Amount',
      });
    }
    // else if (/^\d{5,7}$/.test(text) && amountRequested !== null && amountRequested >= minLoanAmount && amountRequested <= maxLoanAmount) {
    //   setErrorMessages({
    //     ...errorMessages,
    //     loanAmountRequestedEdit: '',
    //   });
    // } 
    else {
      setErrorMessages({
        ...errorMessages,
        // loanAmountRequestedEdit: `Enter Loan Amount (${minLoanAmount} to ${maxLoanAmount} INR)`,
      });
    }
  };
 
  // view button(if need view then add)
  // const onViewImage = async () => {
  //   if (!imageContent) {
  //     // Fetch the image data if it's not available
  //     await fetchAnnotationImage();
  //   }
  //   setModalVisible(true);
  // };

  useEffect(() => {
    fetchAnnotations1();
  }, []);

  const sendAnnotation = async () => {
    try {
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

      // Create a new annotation
      const annotations = [
        {
          subject: 'AadharCard Image',
          filename: aadharcard.fileName || 'AadharCard.jpg',
          isdocument: true,
          'objectid_kf_loanapplication@odata.bind': `/kf_loanapplications(${recordId})`,
          documentbody: aadharcard.fileContent,
        },
      ];

      const createAnnotationResponse = await axios.post(
        'https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/annotations',
        annotations,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (createAnnotationResponse.status === 204) {
        console.log('Aadhar image annotation created successfully.');
      } else {
        console.error('Failed to create Aadhar image annotation. Response:', createAnnotationResponse.data);
        Alert.alert('Error', 'Failed to create Aadhar image annotation.');
      }

    } catch (error) {
      console.error('Error sending Aadhar image annotation:', error.response?.data || error.message);
      Alert.alert('Error', 'An error occurred while sending Aadhar image annotation.');
    }
  };

  const sendAnnotation1 = async () => {
    try {
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

      // Create a new annotation
      const annotations = [
        {
          subject: 'PanCard Image',
          filename: pancard.fileName || 'PanCard.jpg',
          isdocument: true,
          'objectid_kf_loanapplication@odata.bind': `/kf_loanapplications(${recordId})`,
          documentbody: pancard.fileContent,
        },
      ];

      const createAnnotationResponse = await axios.post(
        'https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/annotations',
        annotations,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (createAnnotationResponse.status === 204) {
        console.log('PanCard image annotation created successfully.');
      } else {
        console.error('Failed to create Aadhar image annotation. Response:', createAnnotationResponse.data);
        Alert.alert('Error', 'Failed to create Aadhar image annotation.');
      }

    } catch (error) {
      console.error('Error sending Aadhar image annotation:', error.response?.data || error.message);
      Alert.alert('Error', 'An error occurred while sending Aadhar image annotation.');
    }
  };

  const fetchAnnotations1 = async () => {
    try {
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

      const fetchAnnotationsResponse = await axios.get(
        'https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/annotations?$filter=_objectid_value eq ' + recordId,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const fetchedAnnotations = fetchAnnotationsResponse.data.value;
      // console.log('Annotations:', fetchedAnnotations);
      setAnnotations(fetchedAnnotations);

    } catch (error) {
      console.error('Error fetching annotations:', error.response?.data || error.message);
      Alert.alert('Error', 'An error occurred while fetching annotations.');
    }
  };

  const sendAnnotation2 = async () => {
    try {
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

      // Create a new annotation
      const annotations = [
        {
          subject: 'Applicant Image',
          filename: applicantImage.fileName || 'Applicant.jpg',
          isdocument: true,
          'objectid_kf_loanapplication@odata.bind': `/kf_loanapplications(${recordId})`,
          documentbody: applicantImage.fileContent,
        },
      ];

      const createAnnotationResponse = await axios.post(
        'https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/annotations',
        annotations,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (createAnnotationResponse.status === 204) {
        console.log('ApplicantImage image annotation created successfully.');
        // Alert.alert('Sucess', '');

      } else {
        console.error('Failed to create Applicant image annotation. Response:', createAnnotationResponse.data);
        Alert.alert('Error', 'Failed to create Aadhar image annotation.');
      }

    } catch (error) {
      console.error('Error sending Aadhar image annotation:', error.response?.data || error.message);
      Alert.alert('Error', 'An error occurred while sending Aadhar image annotation.');
    }
  };

  const sendAnnotation3 = async () => {
    try {
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

      // Create a new annotation
      const annotations = [
        {
          subject: 'Signature Image',
          filename: signatureImage.fileName || 'Signature.jpg',
          isdocument: true,
          'objectid_kf_loanapplication@odata.bind': `/kf_loanapplications(${recordId})`,
          documentbody: signatureImage.fileContent,
        },
      ];

      const createAnnotationResponse = await axios.post(
        'https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/annotations',
        annotations,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (createAnnotationResponse.status === 204) {
        console.log('Signature image annotation created successfully.');
        // Alert.alert('Sucess', '');

      } else {
        console.error('Failed to create Signature image annotation. Response:', createAnnotationResponse.data);
        Alert.alert('Error', 'Failed to create Aadhar image annotation.');
      }

      // Fetch and display the updated annotations
    } catch (error) {
      console.error('Error sending Signature image annotation:', error.response?.data || error.message);
      Alert.alert('Error', 'An error occurred while sending Aadhar image annotation.');
    }
  };


  const handleUpdateRecordAndSendAnnotation = () => {
    sendAnnotation();
    sendAnnotation1();
    sendAnnotation2();
    // sendAnnotation3();
    handleUpdateRecord();
  };

  const handleViewImages = () => {
    setShowImage(!showImage); 
  };

  const filteredAnnotations = annotations.filter(item => item.documentbody);
  
  const handleNavigateToSignatureScreen = () => {
    navigation.navigate('SignatureScreen', { loanApplication });
  };

  const date = emiCollectionDate ? new Date(emiCollectionDate) : null;
  const formattedDate = date ? date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

  return (
    <View>
      <HeaderComponent titleText="Edit Home Screen"
        onPress={handleGoBack}
        onIconPress={handleUpdateRecordAndSendAnnotation}
        screenIcon="md-save"
        screenIconStyle={{ marginTop: 5 }}
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <LoanStatusPicker
              onOptionChange={handleSendApproval}
              title="Send Approval"
              options={['No', 'Yes']}
              initialOption={sendApproval ? getSendApproval(sendApproval) : ''}
              style={{ width: "100%", marginLeft: 0, marginTop: 5 }}
            />
            <TextInput
              style={[styles.textInputContainer, { color: "gray" }]}
              value={applicationnumber}
              placeholder="Application No"
              onChangeText={(text) => {
                setapplicationnumber(text);
              }}
              editable={false}
            />

            <TextInput
              style={[styles.textInputContainer, { color: "gray" }]}
              value={createdby}
              placeholder="Created By"
              onChangeText={(text) => {
                setcreatedby(text);
              }}
              editable={false}
            />

            <TextInput
              style={styles.textInputContainer}
              value={firstname}
              placeholder="First Name"
              onChangeText={(text) => {
                setfirstname(text);
                setIsfirstnameValid(text.trim() !== '');

                // Update error message
                setErrorMessages({
                  ...errorMessages,
                  firstNameEdit: text.trim() !== '' ? '' : 'Enter First Name',
                });
              }}
            />
            {errorMessages.firstNameEdit !== '' && <Text style={styles.errorText}>{errorMessages.firstNameEdit}</Text>}

            <TextInput
              style={styles.textInputContainer}
              value={lastname}
              placeholder="Last Name"
              onChangeText={(text) => {
                setLastname(text);
                setIsLastNameValid(text.trim() !== '')

                setErrorMessages({
                  ...errorMessages,
                  lastNameEdit: text.trim() !== '' ? '' : 'Enter Last Name',
                });
              }}
            />
            {errorMessages.lastNameEdit !== '' && <Text style={styles.errorText}>{errorMessages.lastNameEdit}</Text>}

            <LoanStatusPicker
              onOptionChange={handleGenderOptionset}
              title="Gender"
              options={['Male', 'Female']}
              initialOption={gender ? getGenderOptionsetStringFromNumericValue(gender) : ''}
              style={{ width: "100%", marginLeft: 0, marginTop: 5 }}
            />

            <ComponentDatePicker
              selectedDate={dateofbirth}
              onDateChange={handleDateOfBirth}
              placeholder="Date of Birth"
              style={{ width: "100%", height: 45, marginTop: 5, marginLeft: 0 }}
            />
            {errorMessages.dateOfBirthEdit !== '' && <Text style={styles.errorText}>{errorMessages.dateOfBirthEdit}</Text>}


            <TextInput
              style={[styles.textInputContainer, { color: "gray" }]}
              value={age.toString()}
              placeholder="Age"
              onChangeText={(text) => setage(text)}
              editable={false}
            />

            <TextInput
              style={styles.textInputContainer}
              value={mobileNumber}
              placeholder="Mobile Number"
              onChangeText={handleMobileNumberChange}
            />
            {errorMessages.mobileNumberEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.mobileNumberEdit}</Text>
            )}

            <TextInput
              style={styles.textInputContainer}
              value={email}
              placeholder="Email"
              onChangeText={handleEmailChange}
            />
            {errorMessages.emailEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.emailEdit}</Text>
            )}

            <TextInput
              style={styles.textInputContainer}
              value={address1}
              placeholder="Address Line 1"
              onChangeText={(text) => setAddress1(text)}
            />
            <TextInput
              style={styles.textInputContainer}
              value={address2}
              placeholder="Address Line 2"
              onChangeText={(text) => setAddress2(text)}
            />
            <TextInput
              style={styles.textInputContainer}
              value={address3}
              placeholder="Address Line 3"
              onChangeText={(text) => setAddress3(text)}
            />
            <TextInput
              style={styles.textInputContainer}
              value={city}
              placeholder="City"
              onChangeText={(text) => setCity(text)}
            />
            <TextInput
              style={styles.textInputContainer}
              value={state}
              placeholder="State"
              onChangeText={(text) => setState(text)}
            />

            <TextInput
              style={styles.textInputContainer}
              value={aadharcardNumber}
              placeholder="Aadharcard Number"
              onChangeText={handleAadharCardNumberChange}
            />
            {errorMessages.aadharCardNumberEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.aadharCardNumberEdit}</Text>
            )}


            <TextInput
              style={styles.textInputContainer}
              value={pancardNumber}
              placeholder="PAN Card Number"
              onChangeText={handlePancardNumberValid}
            />
            {errorMessages.panCardNumberEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.panCardNumberEdit}</Text>
            )}

            <TextInput
              style={styles.textInputContainer}
              placeholder="Loan Amount Request"
              value={loanAmountRequested ? loanAmountRequested.toString() : ''}
              onChangeText={handleLoanAmountRequestedChange}
            />
            {errorMessages.loanAmountRequestedEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.loanAmountRequestedEdit}</Text>
            )}

            <Text style={[styles.textInputContainer, { color: "gray", height: 45 }]}>{getEmiSchedule(emiSchedule)}</Text>

            <TextInput
              style={[styles.textInputContainer, { color: "gray" }]}
              placeholder="No of EMIs"
              value={numberOfEMI.toString()}
              // onChangeText={(text) => setEmiSchedule(text)}
              editable={false}
            />

            <TextInput
              style={[styles.textInputContainer, { color: "gray" }]}
              placeholder="Interest Rate%"
              value={interestRate}
              editable={false}
            />

            <TextInput
              style={[styles.textInputContainer, { color: "gray" }]}
              placeholder="EMI Collection Date"
              // value={emiCollectionDate}
              value={formattedDate}
              editable={false}
            />

            <TextInput
              style={[styles.textInputContainer, { color: "gray" }]}
              placeholder="EMI Amount "
              value={eminAmount.toString()}
              editable={false}
            />

            <TextInput
              style={styles.textInputContainer}
              placeholder="Other Charges"
              value={otherCharges ? otherCharges.toString() : ""}
              onChangeText={(text) => setOtherCharges(text)}
            />

            <LoanStatusPicker
              onOptionChange={handleLoanStatusChange}
              title="Select Loan Status"
              options={['Approved', 'PendingApproval', 'Draft', 'Cancelled']}
              initialOption={getStatusStringFromNumericValue(status)}
              style={{ width: "100%", marginLeft: 0, marginTop: 5 }}
            />

            <View style={{ backgroundColor: "white", marginTop: 15 }}>
              <View style={{ marginVertical: 3 }}>
                <CardImage
                  title="AadharCard"
                  imageContent={aadharcard}
                  setImageContent={setAadharcard}
                  // onViewImage={onViewImage}
                />
              </View>
              <View style={{ marginVertical: 3 }}>
                <CardImage
                  title="PanCard"
                  imageContent={pancard}
                  setImageContent={setPancard}
                />
              </View>
              <View style={{ marginVertical: 3 }}>
                <CardImage
                  title="Applicant"
                  imageContent={applicantImage}
                  setImageContent={setapplicantImage}
                />
              </View>
              <View style={{ marginBottom: 15 }}>
                {/* <CardImageSignature
                  title="Draw Signature"
                  imageContent={signatureImage}
                  pickImage={handleNavigateToSignatureScreen}
                /> */}

                <CardImageSignature
                  title="Signature"
                  imageContent={signatureImage}
                  pickImage={handleNavigateToSignatureScreen}
                  sendAnnotation={sendAnnotation3}
                />

              </View>
            </View>
          </View>

          <RenderAnnotation
            annotations={annotations}
            filteredAnnotations={filteredAnnotations}
            showImage={showImage}
            handleViewImages={handleViewImages}
          />
          {/* <Text> annotation</Text> */}
        </View>
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40
  },
  wrapper: {
    width: '90%',
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    marginBottom: 8,
  },
  textInputContainer: {
    marginVertical: 5,
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
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  annotation: {
    marginBottom: 15,
    padding: 10,
    // borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default EditHomeLoan;