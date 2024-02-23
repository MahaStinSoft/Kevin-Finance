import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ScrollView, Text } from 'react-native';
import axios from 'axios';

import HeaderComponent from '../../common/Header';
import ButtonComponent from '../../common/ButtonComponent';
import ComponentDatePicker from '../../common/ComponentDatePicker';
import TextInputComponent from '../../common/TextInput';
import LoanStatusPicker from '../../common/LoanStatusPicker ';

const PersonalLoanGurantee2 = ({ route, navigation }) => {
  const { personalLoan, onUpdateSuccess } = route.params || {};
  const [applicationnumber, setapplicationnumber] = useState(personalLoan?.kf_applicationnumber || '');
  const [createdby, setcreatedby] = useState(personalLoan?.kf_createdby || '');
  const [guarantorfirstname, setfirstname] = useState(personalLoan?.kf_guarantor2firstname || '');
  const [guarantorlastname, setLastname] = useState(personalLoan?.kf_guarantor2lastname || '');
  const [guarantordateofbirth, setdateofbirth] = useState(personalLoan?.kf_guarantor2dateofbirth ? new Date(personalLoan.kf_guarantor2dateofbirth) : null);
  const [guarantorage, setage] = useState(personalLoan?.setkf_guarantor2age || '');
  const [guarantorgender, setGender] = useState(personalLoan?.kf_guarantor2gender || '');
  const [guarantormobilenumber, setMobileNumber] = useState(personalLoan?.kf_guarantor2mobilenumber || '');
  const [guarantoremail, setEmail] = useState(personalLoan?.kf_guarantor2email || '');
  const [guarantoraddress1, setAddress1] = useState(personalLoan?.kf_guarantor2address1 || '');
  const [guarantoraddress2, setAddress2] = useState(personalLoan?.kf_guarantor2address2 || '');
  const [guarantoraddress3, setAddress3] = useState(personalLoan?.kf_guarantor2address3 || '');
  const [guarantorcity, setCity] = useState(personalLoan?.kf_guarantor2city || '');
  const [guarantorstate, setState] = useState(personalLoan?.kf_guarantor2state || '');

  const [firstEMIDate, setfirstEMIDate] = useState(personalLoan?.kf_firstemidate || '');
  const [guarantoraadharnumber, setAadharcardNumber] = useState(personalLoan?.kf_guarantor2aadharnumber || '');
  const [guarantorpannumber, setPancardNumber] = useState(personalLoan?.kf_guarantor2aadharnumber || '');

  const [isfirstnameValid, setIsfirstnameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [isaadharNumberValid, setIsaadharcardNumberValid] = useState(true);
  const [isPancardNumberValid, setIsPancardNumberValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isLoanAmountRequested, setIsLoanAmountRequested] = useState(true);

  const [recordId, setRecordId] = useState(personalLoan.kf_personalloanid);

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
    navigation.navigate("PersonalLoanDetailsScreen", { personalLoan });
  };

  useEffect(() => {
    // Update guarantorstate and variables when the route parameters change
    setapplicationnumber(personalLoan.kf_applicationnumber);
    setcreatedby(personalLoan.kf_createdby);
    setfirstname(personalLoan.kf_guarantor2firstname);
    setLastname(personalLoan.kf_guarantor2lastname);
    setdateofbirth(personalLoan.kf_guarantor2dateofbirth ? new Date(personalLoan.kf_guarantor2dateofbirth) : null);
    setage(personalLoan.kf_guarantor2age || ''); // Ensure that kf_guarantor2age is set correctly
    setGender(personalLoan.kf_guarantor2gender);
    setMobileNumber(personalLoan.kf_guarantor2mobilenumber);
    setEmail(personalLoan.kf_guarantor2email);
    setAddress1(personalLoan.kf_guarantor2address1);
    setAddress2(personalLoan.kf_guarantor2address2);
    setAddress3(personalLoan.kf_guarantor2address3);
    setCity(personalLoan.kf_guarantor2city);
    setState(personalLoan.kf_guarantor2state);
    setAadharcardNumber(personalLoan.kf_guarantor2aadharnumber);
    setPancardNumber(personalLoan.kf_guarantor2aadharnumber);
    setRecordId(personalLoan.kf_personalloanid);
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
  }, [personalLoan]);

  const handleUpdateRecord = async () => {

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


    const newErrorMessages = {
      guarantorFirstNameEdit: !guarantorfirstname ? 'Enter First Name' : '',
      guarantorLastNameEdit: !guarantorlastname ? 'Enter Last Name' : '',
      guarantorDateOfBirthEdit: !guarantordateofbirth ? 'Enter Date of Birth' : '',
      guarantorMobileNumberEdit: /^\d{10}$/.test(guarantormobilenumber) ? '' : 'Please Enter a Valid 10-digit mobile number.',
      guarantorEmailEdit: !guarantoremail ? 'Enter Email Address' : '',
      guarantorAadharCardNumberEdit: /^\d{12}$/.test(guarantoraadharnumber) ? '' : 'Please Enter Valid Aadharcard Number',
      guarantorPanCardNumberEdit: !guarantorpannumber ? 'Enter PAN Card Number' : '',
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
      const formattedDateOfBirth = guarantordateofbirth ? guarantordateofbirth.toISOString() : null;


      const updateRecordResponse = await axios.patch(
        `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${recordId})`,
        {
          kf_applicationnumber: applicationnumber,
            kf_createdby: createdby,
            kf_guarantor2firstname: guarantorfirstname,
            kf_guarantor2lastname: guarantorlastname,
            kf_guarantor2dateofbirth: formattedDateOfBirth,
            kf_guarantor2age: guarantorage,
            kf_guarantor2gender: guarantorgender,
            kf_guarantor2mobilenumber: guarantormobilenumber,
            kf_guarantor2email: guarantoremail,
            kf_guarantor2address1: guarantoraddress1,
            kf_guarantor2address2: guarantoraddress2,
            kf_guarantor2address3: guarantoraddress3,
            kf_guarantor2city: guarantorcity,
            kf_guarantor2state: guarantorstate,
            kf_guarantor2aadharnumber:guarantoraadharnumber,
            kf_guarantor2aadharnumber:guarantorpannumber
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
                          kf_guarantor2firstname: guarantorfirstname,
                          kf_guarantor2lastname: guarantorlastname,
                          kf_guarantor2dateofbirth: formattedDateOfBirth,
                          kf_guarantor2age: parseInt(guarantorage),
                          kf_guarantor2gender: guarantorgender,
                          kf_guarantor2mobilenumber: guarantormobilenumber,
                          kf_guarantor2email: guarantoremail,
                          kf_guarantor2address1: guarantoraddress1,
                          kf_guarantor2address2: guarantoraddress2,
                          kf_guarantor2address3: guarantoraddress3,
                          kf_guarantor2city: guarantorcity,
                          kf_guarantor2state: guarantorstate,
                          kf_guarantor2aadharnumber: guarantoraadharnumber,
                          kf_guarantor2aadharnumber: guarantorpannumber,
          
          });
        }
        console.log(guarantorage);

        Alert.alert('Updated the record Successfully.', '', [
          // {
          //   text: 'cancel'
          // },
          {
            text: 'OK',
            onPress: () => {
              //  navigation.navigate('PersonalLoanDetailsScreen', { personalLoan: personalLoan });
            },
          },
        ]);
      } else {
        console.log('Error updating record in CRM:', updateRecordResponse);
        Alert.alert('Error', 'Failed to update the record in CRM.');
      }
    } catch (error) {
      console.error('Error during update:', error);
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

  // const handleDateOfBirth = (newDate) => {
  //   if (!newDate) {
  //     setdateofbirth(null);
  //     setage('');
  //     setErrorMessages({
  //       ...errorMessages,
  //       guarantorDateOfBirthEdit: '',
  //     });
  //     return;
  //   }

  //   const calculatedAge = calculateAge(newDate);
  //   setdateofbirth(newDate);
  //   setage(calculatedAge.toString());

  //   if (calculatedAge <= 18) {
  //     setErrorMessages({
  //       ...errorMessages,
  //       guarantorDateOfBirthEdit: 'You must be at least 18 years old.',
  //     });
  //   } else {
  //     setErrorMessages({
  //       ...errorMessages,
  //       guarantorDateOfBirthEdit: '',
  //     });
  //   }
  // };
  const handleDateOfBirth = (newDate) => {
    console.log('New date selected:', newDate);
  
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
    console.log('Calculated age:', calculatedAge);
  
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


  return (
    <>
      <HeaderComponent
        titleText="PersonalLoan Gaurantee2"
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
  textInputContainer: {
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

export default PersonalLoanGurantee2;
