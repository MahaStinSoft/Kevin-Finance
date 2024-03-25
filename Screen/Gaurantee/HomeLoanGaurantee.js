import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ScrollView, Text } from 'react-native';
import axios from 'axios';

import HeaderComponent from '../../common/Header';
import ComponentDatePicker from '../../common/ComponentDatePicker';
import LoanStatusPicker from '../../common/LoanStatusPicker ';
import CardImage from '../../common/CardImage';
import Gurantee1AnnotationHome from '../Annotations/Gurantee1Annotation';
import CardImageSignature from '../../common/CardImageSignature';

const HomeLoanGurantee = ({ route, navigation }) => {
  const { loanApplication, onUpdateSuccess } = route.params || {};
  const [applicationnumber, setapplicationnumber] = useState(loanApplication?.kf_applicationnumber || '');
  const [applicantFirstName, setapplicantFirstName] = useState(loanApplication?.kf_name || '');
  const [applicantLastName, setapplicantLastName] = useState(loanApplication?.kf_lastname || '');
  const [guarantoraadharnumber, setAadharcardNumber] = useState(loanApplication?.kf_guarantoraadharnumber || '');
  const [guarantorpannumber, setPancardNumber] = useState(loanApplication?.kf_guarantorpannumber || '');
  const [createdby, setcreatedby] = useState(loanApplication?.kf_createdby || '');
  const [guarantorfirstname, setfirstname] = useState(loanApplication?.kf_guarantorfirstname || '');
  const [guarantorlastname, setLastname] = useState(loanApplication?.kf_guarantorlastname || '');
  const [guarantordateofbirth, setdateofbirth] = useState(loanApplication?.kf_guarantordateofbirth ? new Date(loanApplication.kf_guarantordateofbirth) : null);
  const [guarantorage, setage] = useState(loanApplication?.kf_guarantorage || '');
  const [guarantorgender, setGender] = useState(loanApplication?.kf_guarantorgender || '');
  const [guarantormobilenumber, setMobileNumber] = useState(loanApplication?.kf_guarantormobilenumber || '');
  const [guarantoremail, setEmail] = useState(loanApplication?.kf_guarantoremail || '');
  const [guarantoraddress1, setAddress1] = useState(loanApplication?.kf_guarantoraddress1 || '');
  const [guarantoraddress2, setAddress2] = useState(loanApplication?.kf_guarantoraddress2 || '');
  const [guarantoraddress3, setAddress3] = useState(loanApplication?.kf_guarantoraddress3 || '');
  const [guarantorcity, setCity] = useState(loanApplication?.kf_guarantorcity || '');
  const [guarantorstate, setState] = useState(loanApplication?.kf_guarantorstate || '');
  const [aadharcard, setAadharcard] = useState({ fileName: null, fileContent: null });
  const [pancard, setPancard] = useState({ fileName: null, fileContent: null });
  const [applicantImage, setapplicantImage] = useState({ fileName: null, fileContent: null });
  const [showImageModal, setShowImageModal] = useState(false);
  const [signature, setSignature] = useState({ fileName: null });

  const [isfirstnameValid, setIsfirstnameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isaadharNumberValid, setIsaadharcardNumberValid] = useState(true);
  const [isPancardNumberValid, setIsPancardNumberValid] = useState(true);
  const [annotations, setAnnotations] = useState([]);
  const [aadharImageContent, setAadharImageContent] = useState(null);
  const [showImage, setShowImage] = useState(true);

  const [recordId, setRecordId] = useState(loanApplication.kf_loanapplicationid);

  const { signatureImage  } = route.params;
  const { loanStatus } = route.params;
  console.log('signature',loanStatus);

  const [errorMessages, setErrorMessages] = useState({
    guarantorFirstNameEdit: '',
    guarantorLastNameEdit: '',
    guarantorDateOfBirthEdit: '',
    guarantorMobileNumberEdit: '',
    guarantorEmailEdit: '',
    guarantorAadharCardNumberEdit: '',
    guarantorPanCardNumberEdit: '',
  });

  const handleGoBack = () => {
    navigation.navigate("HomeLoanDetailsScreen", { loanApplication });
  };

  useEffect(() => {
    setapplicationnumber(loanApplication.kf_applicationnumber);
    setapplicantFirstName(loanApplication.kf_name);
    setapplicantLastName(loanApplication.kf_lastname);
    setcreatedby(loanApplication.kf_createdby);
    setfirstname(loanApplication.kf_guarantorfirstname);
    setLastname(loanApplication.kf_guarantorlastname);
    setdateofbirth(loanApplication.kf_guarantordateofbirth ? new Date(loanApplication.kf_guarantordateofbirth) : null);
    setage(loanApplication.kf_guarantorage || '');
    setGender(loanApplication.kf_guarantorgender);
    setMobileNumber(loanApplication.kf_guarantormobilenumber);
    setEmail(loanApplication.kf_guarantoremail);
    setAddress1(loanApplication.kf_guarantoraddress1);
    setAddress2(loanApplication.kf_guarantoraddress2);
    setAddress3(loanApplication.kf_guarantoraddress3);
    setCity(loanApplication.kf_guarantorcity);
    setState(loanApplication.kf_guarantorstate);
    setAadharcardNumber(loanApplication.kf_guarantoraadharnumber);
    setPancardNumber(loanApplication.kf_guarantorpannumber);
    setAadharcard({ fileName: null, fileContent: null });
    setPancard({ fileName: null, fileContent: null });
    setapplicantImage({ fileName: null, fileContent: null });
    setSignature({ fileName: null})
    setRecordId(loanApplication.kf_loanapplicationid);

    console.log('State updated:', {
      applicationnumber,
      createdby,
      guarantorfirstname,
      guarantorlastname,
      guarantorgender,
      guarantorpannumber,
      guarantoraadharnumber,
      //   status,
      guarantormobilenumber
    });
  }, [loanApplication]);

  const handleUpdateRecord = async () => {
    // Check if the guarantorage is greater than 18
    if (calculateAge(guarantordateofbirth) < 18) {
      setErrorMessages({
        ...errorMessages,
        guarantorDateOfBirthEdit: 'You must be at least 18 years old to proceed.',
      });
      return; // Stop the update process
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guarantoremail)) {
      setErrorMessages({
        ...errorMessages,
        guarantorEmailEdit: 'Enter a Valid Email Address',
      });
      return; // Stop the update process if guarantoremail is invalid
    }

    if (!isPancardNumberValid) {
      setErrorMessages({
        ...errorMessages,
        guarantorPanCardNumberEdit: 'Enter Valid PAN Card',
      });
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

      const accessToken = tokenResponse.data.access_token;
      const formattedDateOfBirth = guarantordateofbirth ? guarantordateofbirth.toISOString() : null;

      const updateRecordResponse = await axios.patch(
        `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${recordId})`,
        {
          kf_applicationnumber: applicationnumber,
          kf_name: applicantFirstName,
          kf_lastname: applicantLastName,
          kf_createdby: createdby,
          kf_guarantorfirstname: guarantorfirstname,
          kf_guarantorlastname: guarantorlastname,
          kf_guarantordateofbirth: formattedDateOfBirth,
          kf_guarantorage: guarantorage,
          kf_guarantorgender: guarantorgender,
          kf_guarantormobilenumber: guarantormobilenumber,
          kf_guarantoremail: guarantoremail,
          kf_guarantoraddress1: guarantoraddress1,
          kf_guarantoraddress2: guarantoraddress2,
          kf_guarantoraddress3: guarantoraddress3,
          kf_guarantorcity: guarantorcity,
          kf_guarantorstate: guarantorstate,
          kf_guarantoraadharnumber: guarantoraadharnumber,
          kf_guarantorpannumber: guarantorpannumber
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
            kf_name: applicantFirstName,
            kf_lastname: applicantLastName,
            kf_createdby: createdby,
            kf_guarantorfirstname: guarantorfirstname,
            kf_guarantorlastname: guarantorlastname,
            kf_guarantordateofbirth: formattedDateOfBirth,
            kf_guarantorage: guarantorage,
            kf_guarantorgender: guarantorgender,
            kf_guarantormobilenumber: guarantormobilenumber,
            kf_guarantoremail: guarantoremail,
            kf_guarantoraddress1: guarantoraddress1,
            kf_guarantoraddress2: guarantoraddress2,
            kf_guarantoraddress3: guarantoraddress3,
            kf_guarantorcity: guarantorcity,
            kf_guarantorstate: guarantorstate,
            kf_guarantoraadharnumber: guarantoraadharnumber,
            kf_guarantorpannumber: guarantorpannumber,
          });
        }
        Alert.alert('Updated the record Successfully.', '', [
          // {
          //   text: 'cancel'
          // },
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ])
      } else {
        console.log('Error updating record in CRM:', updateRecordResponse);
        Alert.alert('Error', 'Failed to update the record in CRM.');
      }
    } catch (error) {
      console.error('Error during update:', error.response?.data || error.message);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    fetchAnnotations1();
  }, []);

  const sendAnnotation = async () => {
    const newErrorMessages = {
      aadharCardImage: !aadharcard.fileContent ? 'Aadharcard image is required.' : '',
      
    };
    setErrorMessages(newErrorMessages);
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
          subject: 'Guarantee1 AadharCard Image',
          filename: aadharcard.fileName || 'Guarantee1AadharCard.jpg',
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
        // Alert.alert('Error', 'Failed to create Aadhar image annotation.');
      }

    } catch (error) {
      console.error('Error sending Aadhar image annotation:', error.response?.data || error.message);
      // Alert.alert('Error', 'An error occurred while sending Aadhar image annotation.');
    }
  };

  const sendAnnotation1 = async () => {
    const newErrorMessages = {
      panCardImage: !pancard.fileContent ? 'Pancard image is required.' : '', 
    };
    setErrorMessages(newErrorMessages);
    
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
          subject: 'Guarantee1 PanCard Image',
          filename: pancard.fileName || 'Guarantee1PanCard.jpg',
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
      // Alert.alert('Error', 'An error occurred while sending Aadhar image annotation.');
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
      // Alert.alert('Error', 'An error occurred while fetching annotations.');
    }
  };

  const sendAnnotation2 = async () => {
    const newErrorMessages = {
      applicantImage: !applicantImage.fileContent ? 'Applicant Image is required.' : '', 
    };
    setErrorMessages(newErrorMessages);
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
          subject: 'Guarantee1 Applicant Image',
          filename: applicantImage.fileName || 'Guarantee1Applicant.jpg',
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
      // Alert.alert('Error', 'An error occurred while sending Aadhar image annotation.');
    }
  };

  const sendAnnotation3 = async () => {
    const newErrorMessages = {
      signatureImage: !signatureImage ? 'Applicant Image is required.' : '', 
    };
    setErrorMessages(newErrorMessages);
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
          subject: 'Gurantee1 Signature Image',
          filename: signatureImage.fileName || 'Gurantee1SignatureHome.jpg',
          isdocument: true,
          'objectid_kf_loanapplication@odata.bind': `/kf_loanapplications(${recordId})`,
          documentbody: signatureImage,
        },
      ];

   console.log('documentbody',signatureImage);

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

    } catch (error) {
      // console.error('Error sending Signature image annotation:', error.response?.data || error.message);
      // Alert.alert('Error', 'An error occurred while sending Aadhar image annotation.');
    }
  };

  const handleUpdateRecordAndSendAnnotation = () => {
    const newErrorMessages = {
      aadharCardImage: !aadharcard.fileContent ? 'Aadharcard image is required.' : '',
      panCardImage:!pancard.fileContent ? 'Pancard image is required.' : '',
      applicantCardImage: !applicantImage.fileContent ? 'Applicant Image is required.' : '', 
      signatureCardImage:!signatureImage ? 'Signature image is required.' : '',

      guarantorFirstNameEdit: !guarantorfirstname ? 'Enter First Name' : '',
      guarantorLastNameEdit: !guarantorlastname ? 'Enter Last Name' : '',
      guarantorDateOfBirthEdit: !guarantordateofbirth ? 'Enter Date of Birth' : '',
      guarantorMobileNumberEdit: /^\d{10}$/.test(guarantormobilenumber) ? '' : 'Please Enter a Valid 10-digit mobile number.',
      guarantorEmailEdit: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guarantoremail) ? 'Enter Email Address' : '',
      guarantorAadharCardNumberEdit: /^\d{12}$/.test(guarantoraadharnumber) ? '' : 'Please Enter Valid Aadharcard Number',
      guarantorPanCardNumberEdit: !guarantorpannumber ? 'Enter PAN Card Number' : '',
      
    };
    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some(message => message !== '')) {
      return;
    }
    sendAnnotation();
    sendAnnotation1();
    sendAnnotation2();
    sendAnnotation3();
    handleUpdateRecord();
  };

  const handleViewImages = () => {
    setShowImage(!showImage);
  };

  const filteredAnnotations = annotations.filter(item => item.documentbody);

  const handleEmailChange = (text) => {
    setEmail(text);

    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        guarantorEmailEdit: 'Enter Email Address',
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setErrorMessages({
        ...errorMessages,
        guarantorEmailEdit: 'Enter a Valid Email Address',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        guarantorEmailEdit: '',
      });
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let guarantorage = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      guarantorage--;
    }

    return guarantorage;
  };

  const handleDateOfBirth = (newDate) => {
    if (!newDate) {
      setdateofbirth(null);
      setage('');
      setErrorMessages({
        ...errorMessages,
        guarantorDateOfBirthEdit: '',
      });
      return;
    }

    const calculatedAge = calculateAge(newDate);
    setdateofbirth(newDate);
    setage(calculatedAge.toString());

    if (calculatedAge <= 18) {
      setErrorMessages({
        ...errorMessages,
        guarantorDateOfBirthEdit: 'You must be at least 18 years old.',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        guarantorDateOfBirthEdit: '',
      });
    }
  };

  const handlePancardNumberValid = (text) => {
    setPancardNumber(text);

    if (text.trim() === '') {
      setErrorMessages({
        ...errorMessages,
        guarantorPanCardNumberEdit: 'Enter PAN Card',
      });
      setIsPancardNumberValid(false);
    } else if (/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(text)) {
      setErrorMessages({
        ...errorMessages,
        guarantorPanCardNumberEdit: '',
      });
      setIsPancardNumberValid(true);
    } else {
      setErrorMessages({
        ...errorMessages,
        guarantorPanCardNumberEdit: 'Enter Valid PAN Card',
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

  const handleMobileNumberChange = (text) => {
    setMobileNumber(text);

    if (text.trim() === '') {
      setIsMobileNumberValid(false);
      setErrorMessages({
        ...errorMessages,
        guarantorMobileNumberEdit: 'Enter Mobile Number',
      });
    } else {
      setIsMobileNumberValid(/^\d{10}$/.test(text));
      setErrorMessages({
        ...errorMessages,
        guarantorMobileNumberEdit: /^\d{10}$/.test(text) ? '' : 'Please Enter a Valid 10-digit mobile number.',
      });
    }
  };

  const handleAadharCardNumberChange = (text) => {
    setAadharcardNumber(text);

    if (text.trim() === '') {
      setIsaadharcardNumberValid(false);
      setErrorMessages({
        ...errorMessages,
        guarantorAadharCardNumberEdit: 'Enter Aadhar Card Number',
      });
    } else {
      const aadharRegex = /^\d{12}$/;
      const isValid = aadharRegex.test(text);

      setIsaadharcardNumberValid(isValid);
      setErrorMessages({
        ...errorMessages,
        guarantorAadharCardNumberEdit: isValid ? '' : 'Aadhar Card Number must be exactly 12 digits',
      });
    }
  };

  const handleNavigateToSignatureScreen = () => {
    navigation.navigate('Gurantee1SignatureHome', { loanApplication });
  };
  
  const isValidInput = (text) => {
    // Regular expression to allow only alphabets and spaces
    const onlyAlphabets = /^[a-zA-Z\s]*$/;
    return onlyAlphabets.test(text);
  };

  const isEditable = loanStatus !== 'Approved';

  return (
    <>
      <HeaderComponent titleText="HomeLoan Gurantee1"
        onPress={handleGoBack}
        // onIconPress={handleUpdateRecord}
        onIconPress={handleUpdateRecordAndSendAnnotation}
        screenIcon="md-save"
        screenIconStyle={{ marginTop: 5 }}
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.wrapper}>
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
              onChangeText={(text) => {setcreatedby(text)}}
              editable={false}
            />
            <Text  style={[styles.textInputContainer, { color: "gray" , height: 45}]}>{applicantFirstName} {applicantLastName}</Text>
            <TextInput
              style={[styles.textInputContainer,  { color: isEditable ? "black" : "gray" }]}
              value={guarantorfirstname}
              placeholder="First Name"
              onChangeText={(text) => {
                if (isValidInput(text) || text === '') { // Call isValidInput function
                setfirstname(text);
                setIsfirstnameValid(text.trim() !== '');
                setErrorMessages({
                  ...errorMessages,
                  guarantorFirstNameEdit: text.trim() !== '' ? '' : 'Enter First Name',
                });
              }
              }}
              editable={isEditable}
            />
            {errorMessages.guarantorFirstNameEdit !== '' && <Text style={styles.errorText}>{errorMessages.guarantorFirstNameEdit}</Text>}
            <TextInput
              style={[styles.textInputContainer,  { color: isEditable ? "black" : "gray" }]}
              value={guarantorlastname}
              placeholder="Last Name"
              onChangeText={(text) => {
                if (isValidInput(text) || text === '') { // Call isValidInput function
                setLastname(text);
                setIsLastNameValid(text.trim() !== '')
                setErrorMessages({
                  ...errorMessages,
                  guarantorLastNameEdit: text.trim() !== '' ? '' : 'Enter Last Name',
                });
              }
              }}
              editable={isEditable}
            />
            {errorMessages.guarantorLastNameEdit !== '' && <Text style={styles.errorText}>{errorMessages.guarantorLastNameEdit}</Text>}
            {isEditable ? (
              <LoanStatusPicker
                onOptionChange={handleGenderOptionset}
                title="Gender"
                options={['Male', 'Female']}
                initialOption={guarantorgender ? getGenderOptionsetStringFromNumericValue(guarantorgender) : 'Gender'}
                style={{ width: "100%", marginLeft: 0, marginTop: 5 }}
              />
            ) : (
              <Text style={[styles.textInputContainer, { color: isEditable ? "black" : "gray", height: 45 }]}>
                {guarantorgender ? getGenderOptionsetStringFromNumericValue(guarantorgender) : 'Gender'}
              </Text>
            )}
            {/* <ComponentDatePicker
              selectedDate={guarantordateofbirth}
              onDateChange={handleDateOfBirth}
              placeholder="Date of Birth"
              style={{ width: "100%", height: 45, marginTop: 5, marginLeft: 0 }}
            /> */}
            {isEditable ? (
          <ComponentDatePicker
            selectedDate={guarantordateofbirth}
            onDateChange={handleDateOfBirth}
            placeholder="Date of Birth"
            style={{ width: "100%", height: 45, marginTop: 5, marginLeft: 0 }}
          />
        ) : (
              <Text style={[styles.textInputContainer, { color: isEditable ? "black" : "gray", height: 45 }]}>
                {guarantordateofbirth ? guarantordateofbirth.toLocaleDateString(): "Date of Birth"} 
              </Text>
        )}
            {errorMessages.guarantorDateOfBirthEdit !== '' && <Text style={styles.errorText}>{errorMessages.guarantorDateOfBirthEdit}</Text>}
            <TextInput
              style={[styles.textInputContainer, { color: "gray" }]}
              value={guarantorage.toString()}
              placeholder="Age"
              onChangeText={(text) => setage(text)}
              editable={false}
            />
            <TextInput
              style={[styles.textInputContainer,  { color: isEditable ? "black" : "gray" }]}
              value={guarantormobilenumber}
              placeholder="Mobile Number"
              onChangeText={handleMobileNumberChange}
              editable={isEditable}
            />
            {errorMessages.guarantorMobileNumberEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.guarantorMobileNumberEdit}</Text>
            )}
            <TextInput
              style={[styles.textInputContainer,  { color: isEditable ? "black" : "gray" }]}
              value={guarantoremail}
              placeholder="Email"
              onChangeText={handleEmailChange}
              editable={isEditable}
            />
            {errorMessages.guarantorEmailEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.guarantorEmailEdit}</Text>
            )}
            <TextInput
              style={[styles.textInputContainer,  { color: isEditable ? "black" : "gray" }]}
              value={guarantoraddress1}
              placeholder="Address Line 1"
              onChangeText={(text) => setAddress1(text)}
              editable={isEditable}
            />
            <TextInput
              style={[styles.textInputContainer,  { color: isEditable ? "black" : "gray" }]}
              value={guarantoraddress2}
              placeholder="Address Line 2"
              onChangeText={(text) => setAddress2(text)}
              editable={isEditable}
            />
            <TextInput
              style={[styles.textInputContainer,  { color: isEditable ? "black" : "gray" }]}
              value={guarantoraddress3}
              placeholder="Address Line 3"
              onChangeText={(text) => setAddress3(text)}
              editable={isEditable}
            />
            <TextInput
              style={[styles.textInputContainer,  { color: isEditable ? "black" : "gray" }]}
              value={guarantorcity}
              placeholder="City"
              onChangeText={(text) => setCity(text)}
              editable={isEditable}
            />
            <TextInput
              style={[styles.textInputContainer,  { color: isEditable ? "black" : "gray" }]}
              value={guarantorstate}
              placeholder="State"
              onChangeText={(text) => setState(text)}
              editable={isEditable}
            />
            <TextInput
              style={[styles.textInputContainer,  { color: isEditable ? "black" : "gray" }]}
              value={guarantoraadharnumber}
              placeholder="Aadharcard Number"
              onChangeText={handleAadharCardNumberChange}
              editable={isEditable}
            />
            {errorMessages.guarantorAadharCardNumberEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.guarantorAadharCardNumberEdit}</Text>
            )}
            <TextInput
              style={[styles.textInputContainer,  { color: isEditable ? "black" : "gray" }]}
              value={guarantorpannumber}
              placeholder="PAN Card Number"
              onChangeText={handlePancardNumberValid}
              editable={isEditable}
            />
            {errorMessages.guarantorPanCardNumberEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.guarantorPanCardNumberEdit}</Text>
            )}
            {isEditable && (
            <View style={{ backgroundColor: "white", marginTop: 15 }}>
             <View style={{ marginBottom: aadharcard.fileContent ? 15 : -10, marginTop: 10 }}>
                    <CardImage
                      title="AadharCard"
                      imageContent={aadharcard}
                      setImageContent={setAadharcard}
                      // disabled={isEditable} // Set disabled based on isEditable
                    />
                    {!aadharcard.fileContent && errorMessages.aadharCardImage !== '' && (
                      <Text style={[styles.errorText1, {}]}>{errorMessages.aadharCardImage}</Text>
                    )}
                  </View>
                  <View style={{ marginBottom: aadharcard.fileContent ? 15 : -10, marginTop: 5  }} >
                    <CardImage
                      title="PanCard"
                      imageContent={pancard}
                      setImageContent={setPancard}
                      disabled={isEditable} // Set disabled based on isEditable
                    />
                    {!pancard.fileContent && errorMessages.panCardImage !== '' && (
                      <Text style={styles.errorText1}>{errorMessages.panCardImage}</Text>
                    )}
                  </View>
                  <View style={{ marginBottom: aadharcard.fileContent ? 15 : -10, marginTop: 5  }}>
                    <CardImage
                      title="Applicant"
                      imageContent={applicantImage}
                      setImageContent={setapplicantImage}
                      disabled={isEditable} // Set disabled based on isEditable
                    />
                    {!applicantImage.fileContent && errorMessages.applicantCardImage !== '' && (
                      <Text style={styles.errorText1}>{errorMessages.applicantCardImage}</Text>
                    )}
                  </View>
                  <View style={{ marginBottom: aadharcard.fileContent ? 15 : 15, marginTop: 5  }} >
                    <CardImageSignature
                      title="Signature"
                      imageContent={signatureImage}
                      pickImage={handleNavigateToSignatureScreen}
                      sendAnnotation={sendAnnotation3}
                      disabled={isEditable} // Set disabled based on isEditable
                    />
                    {!signatureImage && errorMessages.signatureCardImage !== '' && (
                      <Text style={styles.errorText1}>{errorMessages.signatureCardImage}</Text>
                    )}
                  </View>

            </View>
            )}
            <Gurantee1AnnotationHome
              annotations={annotations}
              filteredAnnotations={filteredAnnotations}
              showImage={showImage}
              handleViewImages={handleViewImages}
            />
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
    marginVertical: 20
  },
  wrapper: {
    width: '90%',
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    marginBottom: 8,
    marginHorizontal:10
  },
  errorText1: {
    color: 'red',
    fontSize: 15,
    marginHorizontal:15

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

  annotation: {
    marginBottom: 15,
    padding: 10,
    // borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default HomeLoanGurantee;