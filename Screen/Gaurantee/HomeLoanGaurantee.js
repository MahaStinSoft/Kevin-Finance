import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ScrollView, Text } from 'react-native';
import axios from 'axios';

import HeaderComponent from '../../common/Header';
import ButtonComponent from '../../common/ButtonComponent';
import ComponentDatePicker from '../../common/ComponentDatePicker';
import LoanStatusPicker from '../../common/LoanStatusPicker ';


const HomeLoanGurantee = ({ route, navigation }) => {
    const { loanApplication } = route.params || {};
  const [applicationnumber, setapplicationnumber] = useState(loanApplication?.kf_applicationnumber || '');
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

  const [isfirstnameValid, setIsfirstnameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isaadharNumberValid, setIsaadharcardNumberValid] = useState(true);
  const [isPancardNumberValid, setIsPancardNumberValid] = useState(true);

  const [recordId, setRecordId] = useState(loanApplication.kf_loanapplicationid);

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

    const newErrorMessages = {
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
            kf_guarantoraadharnumber:guarantoraadharnumber,
            kf_guarantorpannumber:guarantorpannumber
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
              kf_guarantorfirstname: guarantorfirstname,
              kf_guarantorlastname: guarantorlastname,
              kf_guarantordateofbirth: formattedDateOfBirth,
              kf_guarantorage: parseInt(guarantorage),
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


  // Define onUpdateSuccess function in your component
const onUpdateSuccess = (updatedData) => {
    // Handle the updated data here, such as updating the state or performing any other action
    console.log('Record updated successfully:', updatedData);
  };
  

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


  return (
    <>
      <HeaderComponent titleText="HomeLoan Gurantee"
        onPress={handleGoBack}
        onIconPress={handleUpdateRecord}
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
              onChangeText={(text) => {
                setcreatedby(text);
              }}
              editable={false}
            />

            <TextInput
              style={styles.textInputContainer}
              value={guarantorfirstname}
              placeholder="First Name"
              onChangeText={(text) => {
                setfirstname(text);
                setIsfirstnameValid(text.trim() !== '');

                // Update error message
                setErrorMessages({
                  ...errorMessages,
                  guarantorFirstNameEdit: text.trim() !== '' ? '' : 'Enter First Name',
                });
              }}
            />
            {errorMessages.guarantorFirstNameEdit !== '' && <Text style={styles.errorText}>{errorMessages.guarantorFirstNameEdit}</Text>}

            <TextInput
              style={styles.textInputContainer}
              value={guarantorlastname}
              placeholder="Last Name"
              onChangeText={(text) => {
                setLastname(text);
                setIsLastNameValid(text.trim() !== '')

                setErrorMessages({
                  ...errorMessages,
                  guarantorLastNameEdit: text.trim() !== '' ? '' : 'Enter Last Name',
                });
              }}
            />
            {errorMessages.guarantorLastNameEdit !== '' && <Text style={styles.errorText}>{errorMessages.guarantorLastNameEdit}</Text>}

            <LoanStatusPicker
              onOptionChange={handleGenderOptionset}
              title="Gender"
              options={['Male', 'Female']}
              initialOption={guarantorgender ? getGenderOptionsetStringFromNumericValue(guarantorgender) : ''}
              style={{ width: "100%", marginLeft: 0, marginTop: 5 }}
            />

            <ComponentDatePicker
              selectedDate={guarantordateofbirth}
              onDateChange={handleDateOfBirth}
              placeholder="Date of Birth"
              style={{ width: "100%", height: 45, marginTop: 5, marginLeft: 0 }}
            />
            {errorMessages.guarantorDateOfBirthEdit !== '' && <Text style={styles.errorText}>{errorMessages.guarantorDateOfBirthEdit}</Text>}


            <TextInput
              style={[styles.textInputContainer, { color: "gray" }]}
              value={guarantorage.toString()}
              placeholder="Age"
              onChangeText={(text) => setage(text)}
              editable={false}
            />

            <TextInput
              style={styles.textInputContainer}
              value={guarantormobilenumber}
              placeholder="Mobile Number"
              onChangeText={handleMobileNumberChange}
              keyboardType="numeric"
            />
            {errorMessages.guarantorMobileNumberEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.guarantorMobileNumberEdit}</Text>
            )}

            <TextInput
              style={styles.textInputContainer}
              value={guarantoremail}
              placeholder="Email"
              onChangeText={handleEmailChange}
            />
            {errorMessages.guarantorEmailEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.guarantorEmailEdit}</Text>
            )}

            <TextInput
              style={styles.textInputContainer}
              value={guarantoraddress1}
              placeholder="Address Line 1"
              onChangeText={(text) => setAddress1(text)}
            />
            <TextInput
              style={styles.textInputContainer}
              value={guarantoraddress2}
              placeholder="Address Line 2"
              onChangeText={(text) => setAddress2(text)}
            />
            <TextInput
              style={styles.textInputContainer}
              value={guarantoraddress3}
              placeholder="Address Line 3"
              onChangeText={(text) => setAddress3(text)}
            />
            <TextInput
              style={styles.textInputContainer}
              value={guarantorcity}
              placeholder="City"
              onChangeText={(text) => setCity(text)}
            />
            <TextInput
              style={styles.textInputContainer}
              value={guarantorstate}
              placeholder="State"
              onChangeText={(text) => setState(text)}
            />

            <TextInput
              style={styles.textInputContainer}
              value={guarantoraadharnumber}
              placeholder="Aadharcard Number"
              onChangeText={handleAadharCardNumberChange}
            />
            {errorMessages.guarantorAadharCardNumberEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.guarantorAadharCardNumberEdit}</Text>
            )}


            <TextInput
              style={styles.textInputContainer}
              value={guarantorpannumber}
              placeholder="PAN Card Number"
              onChangeText={handlePancardNumberValid}
            />
            {errorMessages.guarantorPanCardNumberEdit !== '' && (
              <Text style={styles.errorText}>{errorMessages.guarantorPanCardNumberEdit}</Text>
            )}



            {/* <ButtonComponent title="Update" onPress={handleUpdateRecord} /> */}
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
});

export default HomeLoanGurantee;

