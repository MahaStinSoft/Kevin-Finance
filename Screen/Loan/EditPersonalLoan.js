import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ScrollView, Text,Image,TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

import HeaderComponent from '../../common/Header';
import ButtonComponent from '../../common/ButtonComponent';
// import ComponentDatePicker from '../common/ComponentDatePicker';
import ComponentDatePicker from '../../common/ComponentDatePicker';
// import TextInputComponent from '../common/TextInput'; 
import TextInputComponent from '../../common/TextInput';
import LoanStatusPicker from '../../common/LoanStatusPicker ';
import CardImage from '../../common/CardImage';
import CardImageSignature from '../../common/CardImageSignature';
import RenderAnnotation from '../Annotations/renderAnnotationItem';
import SendNotification from '../../common/SendNotification';
import CustomAlert from '../../common/CustomAlert';

const EditPersonalLoan = ({ route, navigation }) => {
  const { personalLoan, onUpdateSuccess } = route.params || {};
  const [applicationnumber, setapplicationnumber] = useState(personalLoan?.kf_applicationnumber || '');
  const [createdby, setcreatedby] = useState(personalLoan?.kf_createdby || '');
  const [firstname, setfirstname] = useState(personalLoan?.kf_firstname || '');
  const [lastname, setLastname] = useState(personalLoan?.kf_lastname || '');
  const [dateofbirth, setdateofbirth] = useState(personalLoan?.kf_dateofbirth ? new Date(personalLoan.kf_dateofbirth) : null);
  const [age, setage] = useState(personalLoan?.setkf_age || '');
  const [gender, setGender] = useState(personalLoan?.kf_gender || '');
  const [mobileNumber, setMobileNumber] = useState(personalLoan?.kf_mobile || '');
  const [email, setEmail] = useState(personalLoan?.kf_email || '');
  const [address1, setAddress1] = useState(personalLoan?.kf_address1 || '');
  const [address2, setAddress2] = useState(personalLoan?.kf_address2 || '');
  const [address3, setAddress3] = useState(personalLoan?.kf_address3 || '');
  const [city, setCity] = useState(personalLoan?.kf_city || '');
  const [state, setState] = useState(personalLoan?.kf_state || '');
  const [loanAmountRequested, setLoanAmountRequested] = useState(personalLoan?.kf_loanamountrequested || '');
  const [status, setStatus] = useState(personalLoan?.kf_status ? personalLoan.kf_status.toString() : '');
  const [statusReason, setstatusReason] = useState(personalLoan?.kf_statusreason ? personalLoan.kf_statusreason.toString() : '');
  const [approvalDate, setApprovalDate] = useState(personalLoan?.kf_approvaldate || '');
  const [approver, setApprover] = useState(personalLoan?.kf_approver || '');
  const [firstEMIDate, setfirstEMIDate] = useState(personalLoan?.kf_firstemidate || '');
  const [aadharcardNumber, setAadharcardNumber] = useState(personalLoan?.kf_aadharnumber || '');
  const [pancardNumber, setPancardNumber] = useState(personalLoan?.kf_pannumber || '');
  const [otherCharges, setOtherCharges] = useState(personalLoan?.kf_othercharges || '');
  const [emiCollectionDate, setEmiCollectionDate] = useState(new Date()); // Initialize with today's date
  const [interestRate, setInterestRate] = useState(personalLoan?.kf_interestrate || '');
  const [emiSchedule, setEmiSchedule] = useState(personalLoan?.kf_emischedule || '');
  const [numberOfEMI, setNumberOfEMI] = useState(personalLoan?.kf_numberofemi || '');
  const [eminAmount, setEmiAmount] = useState(personalLoan?.kf_emi || '');
  const [aadharcard, setAadharcard] = useState({ fileName: null, fileContent: null });
  const [pancard, setPancard] = useState({ fileName: null, fileContent: null });
  const [applicantImage, setapplicantImage] = useState({ fileName: null, fileContent: null });
  const [kf_applicantimage, setkf_applicantimage] = useState({ fileName: null, fileContent: null });
  const [signature, setSignature] = useState({ fileName: null });
  const [sendApproval, setSendApproval] = useState(personalLoan?.kf_sendapproval || '');
  const [reason, setReason] = useState(personalLoan?.kf_reason || '');

  const [isfirstnameValid, setIsfirstnameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [isaadharNumberValid, setIsaadharcardNumberValid] = useState(true);
  const [isPancardNumberValid, setIsPancardNumberValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isLoanAmountRequested, setIsLoanAmountRequested] = useState(true);
  const [ModalVisible, setModalVisible] = useState(true);
  const [annotations, setAnnotations] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const [item, setItem] = useState(null); // Assuming you have some state to store the current item
  const [imageContent, setImageContent] = useState(null);
  const [aadharImageContent, setAadharImageContent] = useState(null);
  const [showAlert, setShowAlert] = useState(false); 
  const [showAlertConfirmation, setShowAlertConfirmation] = useState(false); 

  const { signatureFile } = route.params;
  console.log('signature', signatureFile);
  const [recordId, setRecordId] = useState(personalLoan.kf_personalloanid);
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
    navigation.navigate("PersonalLoanDetailsScreen", { personalLoan });
  };

  useEffect(() => {
    // Update state and variables when the route parameters change
    setapplicationnumber(personalLoan.kf_applicationnumber);
    setcreatedby(personalLoan.kf_createdby);
    setfirstname(personalLoan.kf_firstname);
    setLastname(personalLoan.kf_lastname);
    setdateofbirth(personalLoan.kf_dateofbirth ? new Date(personalLoan.kf_dateofbirth) : null);
    setage(personalLoan.kf_age || ''); // Ensure that kf_age is set correctly
    setGender(personalLoan.kf_gender);
    setMobileNumber(personalLoan.kf_mobile);
    setEmail(personalLoan.kf_email);
    setAddress1(personalLoan.kf_address1);
    setAddress2(personalLoan.kf_address2);
    setAddress3(personalLoan.kf_address3);
    setCity(personalLoan.kf_city);
    setState(personalLoan.kf_state);
    setLoanAmountRequested(personalLoan.kf_loanamountrequested);
    setStatus(personalLoan.kf_status);
    setstatusReason(personalLoan.kf_statusreason);
    setApprovalDate(personalLoan.kf_approvaldate);
    setApprover(personalLoan.kf_approver);
    setfirstEMIDate(personalLoan.kf_firstemidate);
    setAadharcardNumber(personalLoan.kf_aadharnumber);
    setPancardNumber(personalLoan.kf_pannumber);
    setOtherCharges(personalLoan.kf_othercharges);
    setEmiCollectionDate(personalLoan.kf_emicollectiondate);
    setEmiSchedule(personalLoan.kf_emischedule);
    setEmiAmount(personalLoan.kf_emi);
    setInterestRate(personalLoan.kf_interestrate);
    setNumberOfEMI(personalLoan.kf_numberofemi);
    setReason(personalLoan.kf_reason);
    setRecordId(personalLoan.kf_personalloanid);
    setSendApproval(personalLoan.kf_sendapproval);
    setAadharcard({ fileName: null, fileContent: null });
    setPancard({ fileName: null, fileContent: null });
    setkf_applicantimage({ fileName: null, fileContent: null });
    setSignature({ fileName: null })
    console.log('State updated:', {
      applicationnumber,
      createdby,
      firstname,
      lastname,
      gender,
      status
    });
  }, [personalLoan]);

  console.log("send personal approval ", sendApproval);

  const handleUpdateRecord = async () => {

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

    // const minLoanAmount = 25000;
    // const maxLoanAmount = 1500000;

    // if (loanAmountRequested < minLoanAmount || loanAmountRequested > maxLoanAmount) {
    //   setErrorMessages({
    //     ...errorMessages,
    //     // loanAmountRequestedEdit: `Loan amount should be between ${minLoanAmount} and ${maxLoanAmount} INR.`,
    //   });
    //   return;
    // }

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
      emailEdit: !email ? 'Enter Email Address' : '',
      loanAmountRequestedEdit: /^\d{5,7}$/.test(loanAmountRequested) ? '' : 'Enter Loan Amount',
      aadharCardNumberEdit: /^\d{12}$/.test(aadharcardNumber) ? '' : 'Please Enter Valid Aadharcard Number',
      panCardNumberEdit: !pancardNumber ? 'Enter PAN Card Number' : '',
    };
    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some(message => message !== '')) {
      return;
    }

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
      const formattedDateOfBirth = dateofbirth ? dateofbirth.toISOString() : null;


      const updateRecordResponse = await axios.patch(
        `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${recordId})`,
        {
          kf_applicationnumber: applicationnumber,
          kf_createdby: createdby,
          kf_firstname: firstname,
          kf_lastname: lastname,
          kf_dateofbirth: formattedDateOfBirth,
          kf_age: age,
          kf_gender: gender,
          kf_mobile: mobileNumber,
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
          kf_sendapproval: sendApproval,
          kf_reason: reason,
          // kf_applicantimage: applicantImage.fileContent,
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

        if (onUpdateSuccess) {
          onUpdateSuccess({
            ...personalLoan,
            kf_applicationnumber: applicationnumber,
            kf_createdby: createdby,
            kf_firstname: firstname,
            kf_lastname: lastname,
            kf_dateofbirth: formattedDateOfBirth,
            kf_age: parseInt(age),
            kf_gender: gender,
            kf_mobile: mobileNumber,
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
            kf_sendapproval: sendApproval,
            kf_reason: reason,
            // kf_applicantimage: applicantImage.fileContent,
          });
        }
        // console.log(age);

        // Alert.alert('Personal Loan', 'Updated the record Successfully.', [
        //   {
        //     text: 'cancel'
        //   },
        //   {
        //     text: 'OK',
        //     onPress: () => {
        //       navigation.navigate('PersonalLoanDetailsScreen', { personalLoan: personalLoan });
        //     },
        //   },
        // ]);
        handleShowAlert();
      } else {
        console.log('Error updating record in CRM:', updateRecordResponse);
        Alert.alert('Error', 'Failed to update the record in CRM.');
      }
    } catch (error) {
      console.error('Error during update:', error);
    }
  };

  const handleUpdateField = async () => {

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

      const updateFieldResponse = await axios.patch(
        `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${recordId})`,
        {
          kf_applicantimage: kf_applicantimage.fileContent,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (updateFieldResponse.status === 204) {
        console.log('Field updated successfully in CRM');

        if (onUpdateSuccess) {
          onUpdateSuccess({
            ...personalLoan,
            kf_applicantimage: kf_applicantimage.fileContent,

          });
        }
        Alert.alert('Personal Loan', 'Applicant Image Updated Successfully.', [
          {
            text: 'OK',
          },
        ]);
      } else {
        console.log('Error updating field in CRM:', updateFieldResponse);
        Alert.alert('Error', 'Failed to update the field in CRM.');
      }
    } catch (error) {
      console.error('Error during field update:', error);
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
      case 'Rejected':
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
        return 'Rejected';
      default:
        return '';
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
    } else if (/^\d{5,7}$/.test(text) && amountRequested !== null && amountRequested >= minLoanAmount && amountRequested <= maxLoanAmount) {
      setErrorMessages({
        ...errorMessages,
        loanAmountRequestedEdit: '',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        loanAmountRequestedEdit: `Enter Loan Amount (${minLoanAmount} to ${maxLoanAmount} INR)`,
      });
    }
  };

  // const sendAnnotation = async () => {
  //   try {
  //     const tokenResponse = await axios.post(
  //       'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
  //       {
  //         grant_type: 'client_credentials',
  //         client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
  //         resource: 'https://org0f7e6203.crm5.dynamics.com',
  //         scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
  //         client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
  //       },
  //       { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  //     );

  //     const accessToken = tokenResponse.data.access_token;

  //     // Check if there is an existing Aadhar image annotation
  //     const existingAnnotationResponse = await axios.get(
  //       `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/annotations?$filter=_objectid_value eq ${recordId} and subject eq 'AadharCard Image'`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     if (existingAnnotationResponse.data.value.length > 0) {
  //       // If an existing annotation is found, delete it
  //       const existingAnnotationId = existingAnnotationResponse.data.value[0].annotationid;
  //       await deleteAnnotation(existingAnnotationId, accessToken);
  //     }

  //     // Create a new annotation
  //     const annotations = [
  //       {
  //         subject: 'AadharCard Image',
  //         filename: aadharcard.fileName || 'AadharCard.jpg',
  //         isdocument: true,
  //         'objectid_kf_personalloan@odata.bind': `/kf_personalloans(${recordId})`,
  //         documentbody: aadharcard.fileContent,
  //       },
  //     ];

  //     const createAnnotationResponse = await axios.post(
  //       'https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/annotations',
  //       annotations,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     if (createAnnotationResponse.status === 204) {
  //       console.log('Aadhar image annotation created successfully.');
  //       // Alert.alert('Sucess', '');

  //     } else {
  //       console.error('Failed to create Aadhar image annotation. Response:', createAnnotationResponse.data);
  //       Alert.alert('Error', 'Failed to create Aadhar image annotation.');
  //     }

  //     // Fetch and display the updated annotations
  //   } catch (error) {
  //     console.error('Error sending Aadhar image annotation:', error.response?.data || error.message);
  //     Alert.alert('Error', 'An error occurred while sending Aadhar image annotation.');
  //   }
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
          'objectid_kf_personalloan@odata.bind': `/kf_personalloans(${recordId})`,
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
          'objectid_kf_personalloan@odata.bind': `/kf_personalloans(${recordId})`,
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

  // const sendAnnotation2 = async () => {
  //   try {
  //     const tokenResponse = await axios.post(
  //       'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
  //       {
  //         grant_type: 'client_credentials',
  //         client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
  //         resource: 'https://org0f7e6203.crm5.dynamics.com',
  //         scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
  //         client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
  //       },
  //       { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  //     );

  //     const accessToken = tokenResponse.data.access_token;

  //     // Create a new annotation
  //     const annotations = [
  //       {
  //         subject: 'Applicant Image',
  //         filename: applicantImage.fileName || 'Applicant.jpg',
  //         isdocument: true,
  //         'objectid_kf_personalloan@odata.bind': `/kf_personalloans(${recordId})`,
  //         documentbody: applicantImage.fileContent,
  //       },
  //     ];

  //     const createAnnotationResponse = await axios.post(
  //       'https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/annotations',
  //       annotations,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     if (createAnnotationResponse.status === 204) {
  //       console.log('ApplicantImage image annotation created successfully.');
  //       // Alert.alert('Sucess', '');

  //     } else {
  //       console.error('Failed to create Applicant image annotation. Response:', createAnnotationResponse.data);
  //       Alert.alert('Error', 'Failed to create Aadhar image annotation.');
  //     }

  //   } catch (error) {
  //     console.error('Error sending Aadhar image annotation:', error.response?.data || error.message);
  //     Alert.alert('Error', 'An error occurred while sending Aadhar image annotation.');
  //   }
  // };


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
          filename: signatureFile.fileName || 'Signature.jpg',
          isdocument: true,
          'objectid_kf_personalloan@odata.bind': `/kf_personalloans(${recordId})`,
          documentbody: signatureFile,
        },
      ];

      console.log('documentbody', signatureFile);

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
      // console.error('Error sending Signature image annotation:', error.response?.data || error.message);
      // Alert.alert('Error', 'An error occurred while sending Aadhar image annotation.');
    }
  };

  const handleEmiCollectionDateChange = (date) => {
    setEmiCollectionDate(date);
    // Additional handling if needed
  };

  const handleUpdateRecordAndSendAnnotation = () => {
    sendAnnotation();
    sendAnnotation1();
    // sendAnnotation2();
    sendAnnotation3();
    handleUpdateRecord();

  };

  const handleViewImages = () => {
    setShowImage(!showImage);
  };

  const filteredAnnotations = annotations.filter(item => item.documentbody);

  const handleNavigateToSignatureScreen = async () => {
    navigation.navigate('PersonalSignatureScreen', { personalLoan: personalLoan });
  }

  const date = emiCollectionDate ? new Date(emiCollectionDate) : null;
  const formattedDate = date ? date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';


  // const renderImage = () => {
  //   if (personalLoan.kf_applicantimage) {
  //     return (
  //       <Image
  //         source={{ uri: `data:image/png;base64,${personalLoan.kf_applicantimage}` }}
  //         style={{width:100, height: 100, borderRadius: 50, objectFit:"fill", marginTop: 15, marginLeft: 15 }}
  //       />
  //     );
  //   } else {
  //     const initials = personalLoan ? `${personalLoan.kf_firstname[0]}${personalLoan.kf_lastname[0]}` : '';
  //     return (
  //       <View style={[styles.cardImage,{ backgroundColor:"gray",width: "100%", height: "100%" } ]}>
  //         <Text style={styles.placeholderText}>{initials}</Text>
  //       </View>
  //     );
  //   }
  // };

  const renderImage = () => {
    if (personalLoan.kf_applicantimage) {
      return (
        <Image
          source={{ uri: `data:image/png;base64,${personalLoan.kf_applicantimage}` }}
          style={{width:100, height: 100, borderRadius: 50, objectFit:"fill", marginTop: 15, marginLeft: 15 }}
        />
      );
    } else {
      const initials = personalLoan ? `${personalLoan.kf_firstname[0]}${personalLoan.kf_lastname[0]}` : '';
      return (
        <View style={[styles.cardImage,{ backgroundColor:"gray",width: "100%", height: "100%" } ]}>
          <Text style={styles.placeholderText}>{initials}</Text>
        </View>
      );
    }
  };
  

  const takePictureWithCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
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
  
      setkf_applicantimage({
        fileName: 'payslip.jpg', // You can set a default file name
        fileContent: byteArray,
      });
    } catch (error) {
      console.error('Error taking picture:', error);
    }
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
  
      setkf_applicantimage({
        fileName: 'payslip.jpg', // You can set a default file name
        fileContent: byteArray,
      });
    } catch (error) {
      console.error('Error picking or processing the image:', error);
      Alert.alert('Error', 'Failed to pick or process the image.');
    }
  };

  const isValidInput = (text) => {
    // Regular expression to allow only alphabets and spaces
    const onlyAlphabets = /^[a-zA-Z\s]*$/;
    return onlyAlphabets.test(text);
  };

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleCloseAlertConfirmation = () => {
    setShowAlertConfirmation(false);
    navigation.navigate('PersonalLoanDetailsScreen', { personalLoan: personalLoan });  
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        titleText="Edit Personal Loan"
        onPress={handleGoBack}
        onIconPress={handleUpdateRecordAndSendAnnotation}
        screenIcon="md-save"
        screenIconStyle={{ marginTop: 5 }}
      />

      <ScrollView>
     
        <View style={styles.Imagepart}>
          <View style={{ width: 100, height: 100, left: 0, bottom: 5 }}>{renderImage()}</View>
          <View style={{ right: 25, top: 30 }}>
            <View style={styles.touch}>
              <TouchableOpacity
                onPress={pickImage}
                style={[styles.button, getStatusStringFromNumericValue(status) === 'Approved' && styles.disabledButton]} // Apply disabled style if status is 'Approved'
                disabled={getStatusStringFromNumericValue(status) === 'Approved'} // Disable button if status is 'Approved'
              >
                <Text style={styles.buttonText}>Choose File</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={takePictureWithCamera}
                style={[styles.button, getStatusStringFromNumericValue(status) === 'Approved' && styles.disabledButton]} // Apply disabled style if status is 'Approved'
                disabled={getStatusStringFromNumericValue(status) === 'Approved'} // Disable button if status is 'Approved'
              >
                <Text style={styles.buttonText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdateField}
                style={[{ marginLeft: 10 },
                getStatusStringFromNumericValue(status) === 'Approved' && styles.disabledButton1
                ]}
                disabled={getStatusStringFromNumericValue(status) === 'Approved'} // Disable button if status is 'Approved'
              >
                <Ionicons name="save" size={26} color={getStatusStringFromNumericValue(status) === 'Approved' ? 'gray' : 'red'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      <View style={styles.detailContainer}>
          <View style={styles.wrapper}>
            <LoanStatusPicker
              onOptionChange={handleSendApproval}
              title="Send Approval"
              options={['No', 'Yes']}
              // initialOption={sendApproval ? getSendApproval(sendApproval) : ''}
              initialOption={sendApproval ? 'Yes' : 'No'}
              style={{ width: "100%", marginLeft: 0, marginTop: 5 }}
              disabled={sendApproval}
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
               style={[
                styles.textInputContainer,
                getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' }
              ]}
              value={firstname}
              placeholder="First Name"
              onChangeText={(text) => {
                if (isValidInput(text) || text === '') { // Call isValidInput function

                setfirstname(text);
                setIsfirstnameValid(text.trim() !== '');

                // Update error message
                setErrorMessages({
                  ...errorMessages,
                  firstNameEdit: text.trim() !== '' ? '' : 'Enter First Name',
                });
              }
              }}
              editable={getStatusStringFromNumericValue(status) !== 'Approved'} 
            />
            {errorMessages.firstNameEdit !== '' && <Text style={styles.errorText}>{errorMessages.firstNameEdit}</Text>}

            <TextInput
               style={[
                styles.textInputContainer,
                getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' }
              ]}
              value={lastname}
              placeholder="Last Name"
              onChangeText={(text) => {
                if (isValidInput(text) || text === '') { // Call isValidInput function

                setLastname(text);
                setIsLastNameValid(text.trim() !== '')

                setErrorMessages({
                  ...errorMessages,
                  lastNameEdit: text.trim() !== '' ? '' : 'Enter Last Name',
                });
              }
              }}
              editable={getStatusStringFromNumericValue(status) !== 'Approved'}
            />
            {errorMessages.lastNameEdit !== '' && <Text style={styles.errorText}>{errorMessages.lastNameEdit}</Text>}


            {/* <LoanStatusPicker
              onOptionChange={handleGenderOptionset}
              title="Gender"
              options={['Male', 'Female']}
              initialOption={gender === 123950000 ? 'Male' : 'Female'}
              style={{ width: "100%", marginLeft: 0, marginTop: 5 }}
            /> */}

<View style={{ position: 'relative' }}>
  <LoanStatusPicker
    onOptionChange={handleGenderOptionset}
    title="Gender"
    options={['Male', 'Female']}
    initialOption={gender === 123950000 ? 'Male' : 'Female'}
    style={[
      { width: "100%", marginLeft: 0, marginTop: 5 },
      getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' } // Change text color to gray based on loan status
    ]}
    disabled={getStatusStringFromNumericValue(status) === 'Approved'} // Disable the picker based on loan status
  />
  {getStatusStringFromNumericValue(status) === 'Approved' && (
    <View
      style={{
        position: 'absolute',
        backgroundColor: 'transparent',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    />
  )}
</View>


            {/* <ComponentDatePicker
              selectedDate={dateofbirth}
              onDateChange={handleDateOfBirth}
              placeholder="Date of Birth"
              style={{ width: "100%", height: 45, marginTop: 5, marginLeft: 0 }}
            />
            {errorMessages.dateOfBirthEdit !== '' && <Text style={styles.errorText}>{errorMessages.dateOfBirthEdit}</Text>} */}

<View style={{ position: 'relative' }}>
              <ComponentDatePicker
                selectedDate={dateofbirth}
                onDateChange={handleDateOfBirth}
                placeholder="Date of Birth"
                style={[
                  { width: "100%", height: 45, marginTop: 5, marginLeft: 0 },
                  getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' } // Change text color to gray based on loan status
                ]}
                onPress={() => getStatusStringFromNumericValue(status) === 'Approved' && handleDateOfBirth()} // Prevent opening date picker when disabled
              />
              {getStatusStringFromNumericValue(status) === 'Approved' && (
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                  }}
                />
              )}
            </View>
            {errorMessages.dateOfBirthEdit !== '' && <Text style={styles.errorText}>{errorMessages.dateOfBirthEdit}</Text>}

            <TextInput
              style={[styles.textInputContainer, {color:"gray"}]}
              value={age.toString()}
              placeholder="Age"
              onChangeText={(text) => setage(text)}
              editable={false}
            />

            <TextInput
               style={[
                styles.textInputContainer,
                getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' }
              ]}
              value={mobileNumber}
              placeholder="Mobile Number"
              onChangeText={handleMobileNumberChange}
              editable={getStatusStringFromNumericValue(status) !== 'Approved'}
            />
            {errorMessages.mobileNumberEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.mobileNumberEdit}</Text>
            )}

            <TextInput
               style={[
                styles.textInputContainer,
                getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' }
              ]}
              value={email}
              placeholder="Email"
              onChangeText={handleEmailChange}
              editable={getStatusStringFromNumericValue(status) !== 'Approved'}
            />
            {errorMessages.emailEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.emailEdit}</Text>
            )}

            <TextInput
               style={[
                styles.textInputContainer,
                getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' }
              ]}
              value={address1}
              placeholder="Address Line 1"
              onChangeText={(text) => setAddress1(text)}
              editable={getStatusStringFromNumericValue(status) !== 'Approved'}
            />
            <TextInput
               style={[
                styles.textInputContainer,
                getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' }
              ]}
              value={address2}
              placeholder="Address Line 2"
              onChangeText={(text) => setAddress2(text)}
              editable={getStatusStringFromNumericValue(status) !== 'Approved'}
            />
            <TextInput
              style={[
                styles.textInputContainer,
                getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' }
              ]}
              value={address3}
              placeholder="Address Line 3"
              onChangeText={(text) => setAddress3(text)}
              editable={getStatusStringFromNumericValue(status) !== 'Approved'}
            />
            <TextInput
              style={[
                styles.textInputContainer,
                getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' }
              ]}
              value={city}
              placeholder="City"
              onChangeText={(text) => setCity(text)}
              editable={getStatusStringFromNumericValue(status) !== 'Approved'}
            />
            <TextInput
               style={[
                styles.textInputContainer,
                getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' }
              ]}
              value={state}
              placeholder="State"
              onChangeText={(text) => setState(text)}
              editable={getStatusStringFromNumericValue(status) !== 'Approved'}
            />
            <TextInput
               style={[
                styles.textInputContainer,
                getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' }
              ]}
              value={aadharcardNumber}
              placeholder="Aadharcard Number"
              onChangeText={handleAadharCardNumberChange}
              editable={getStatusStringFromNumericValue(status) !== 'Approved'}
            />
            {errorMessages.aadharCardNumberEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.aadharCardNumberEdit}</Text>
            )}

            <TextInput
               style={[
                styles.textInputContainer,
                getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' }
              ]}
              value={pancardNumber}
              placeholder="PAN Card Number"
              onChangeText={handlePancardNumberValid}
              editable={getStatusStringFromNumericValue(status) !== 'Approved'}
            />
            {errorMessages.panCardNumberEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.panCardNumberEdit}</Text>
            )}

            <TextInput
              style={[
                styles.textInputContainer,
                getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' }
              ]}
              placeholder="Loan Amount Request"
              value={loanAmountRequested ? loanAmountRequested.toString() : ''}
              onChangeText={handleLoanAmountRequestedChange}
              editable={getStatusStringFromNumericValue(status) !== 'Approved'}
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
            {/* <TextInput
              style={[styles.textInputContainer, { color: "gray" }]}
              placeholder="EMI Collection Date"
              // value={emiCollectionDate}
              value={formattedDate}
              editable={false}
            /> */}
            <TextInput
              style={[styles.textInputContainer, { color: "gray" }]}
              placeholder="EMI Amount "
              value={eminAmount.toString()}
              editable={false}
            />
            <TextInput
              style={[
                styles.textInputContainer,
                getStatusStringFromNumericValue(status) === 'Approved' && { color: 'gray' }
              ]}
              placeholder="Other Charges"
              value={otherCharges ? otherCharges.toString() : ""}
              onChangeText={(text) => setOtherCharges(text)}
              editable={getStatusStringFromNumericValue(status) !== 'Approved'}
            />

            {/* <LoanStatusPicker
              onOptionChange={handleLoanStatusChange}
              title="Select Loan Status"
              options={['Approved', 'PendingApproval', 'Draft', 'Cancelled']}
              initialOption={getStatusStringFromNumericValue(status)}
              style={{ width: "100%", marginLeft: 0, marginTop: 5 , color: "gray"}}
              disabled={true}
            /> */}

            <TextInput
              style={[styles.textInputContainer, { color: "gray" }]}
              placeholder="Loan Status"
              value={getStatusStringFromNumericValue(status)}
              editable={false}
            />

            {status === 123950004 && ( // Display reason column only when status is 'Rejected'
              <TextInput
                style={[styles.textInputContainer, { color: "red" }]}
                placeholder="Reason"
                value={reason}
                editable={false}
              />
            )}

            <ComponentDatePicker
              selectedDate={date} // Pass the Date object directly
              onDateChange={handleEmiCollectionDateChange}
              placeholder="Select EMI Collection Date"
              style={{ width: "100%", height: 45, marginTop: 5, marginLeft: 0 }}
            />

            {/* {statusReason && (
              <LoanStatusPicker
                onOptionChange={handleAnotherOptionChange}
                title="Status Reason"
                options={['AadharNotMatching', 'InvalidDocuments']}
                initialOption={statusReason ? getAnotherOptionStringFromNumericValue(statusReason) : ''}
                style={{ width: "100%", marginLeft: 0, marginTop: 5 }}
              />
            )} */}
           <View style={styles.indentityImage}>
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
                {/* <CardImage
                  title="Applicant"
                  imageContent={applicantImage}
                  setImageContent={setapplicantImage}
                /> */}
              </View>
              <View style={{ marginBottom: 15 }}>
                {/* <CardImageSignature
                  title="Draw Signature"
                  imageContent={signatureFile}
                  pickImage={handleNavigateToSignatureScreen}
                /> */}

                <CardImageSignature
                  title="Signature"
                  imageContent={signatureFile}
                  pickImage={handleNavigateToSignatureScreen}
                  sendAnnotation={sendAnnotation3}
                  setImageContent={setSignature}
                />
              </View>           

              <View style={styles.imageView}>
                  <RenderAnnotation
                    annotations={annotations}
                    filteredAnnotations={filteredAnnotations}
                    showImage={showImage}
                    handleViewImages={handleViewImages}
                  />
             </View>
            </View>
          </View>
         
        </View>
      </ScrollView>
      <CustomAlert
          visible={showAlert}
          onClose={handleCloseAlert}
          onConfirm={handleCloseAlertConfirmation}
          headerMessage="Personal Loan"
          message="Record updated Successfully."
          Button1="Cancel"
          Button2="OK"
          style={styles.alertStyle}
          modalHeaderStyle={[styles.modalheaderStyle, {right: 70}]}
          textStyle={styles.textStyle}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    width: "100%",
    marginBottom: 20
  },
  imageContent: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
     elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  indentityImage:{
    backgroundColor:"white",
    marginTop:5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  wrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop:5
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
    backgroundColor:"white",
    marginTop:5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardImage: {
    // borderRadius: 40,
    width: 200,
    height: 200,
    marginTop: 20,
    marginLeft: 15,
    borderRadius: 50
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: "100%",
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  placeholderText:{
    fontSize: 25,
    color: "white",
    textAlign: "center",
    margin: 32,
    fontWeight:"bold"
  },
  Imagepart:{
    flexDirection:'row',
    marginRight:10,
    marginBottom: 20
  },
  touch:{
    flexDirection:'row',
    marginLeft:40,
    marginTop:15,
  },
  button:{
    marginLeft: 10, 
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'red',
    borderRadius: 50,
    width: "33%"
  },
  buttonText:{
    fontSize: 14,
    color: 'white',
    padding: 5,
    fontWeight: "bold"
  },
  disabledButton: {
    marginLeft: 10, 
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'red',
    borderRadius: 50,
    width: "33%",
    opacity: 0.5, 
  },
  disabledButton1: {
    marginLeft: 10, 
    // flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // backgroundColor: 'red',
    borderRadius: 50,
    width: "10%",
    opacity: 0.5, 
  },
  imageView:{
    marginBottom:-150,
    width: 85,
    top: -150,
    left:200
  }
});


export default EditPersonalLoan;