import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ScrollView, Text } from 'react-native';
import axios from 'axios';

import HeaderComponent from '../../common/Header';
import ButtonComponent from '../../common/ButtonComponent';
// import ComponentDatePicker from '../common/ComponentDatePicker';
import ComponentDatePicker from '../../common/ComponentDatePicker';
import LoanStatusPicker from '../../common/LoanStatusPicker ';
// import TextInputComponent from '../common/TextInput'; 
import TextInputComponents from '../../common/TextInput';

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
  const [approvalDate, setApprovalDate] = useState(loanApplication?.kf_dateofapproval || '');
  const [approver, setApprover] = useState(loanApplication?.kf_dateofapproval || '');
  const [firstEMIDate, setfirstEMIDate] = useState(loanApplication?.kf_firstemidate || '');
  const [aadharcardNumber, setAadharcardNumber] = useState(loanApplication?.kf_aadharnumber || '');
  const [pancardNumber, setPancardNumber] = useState(loanApplication?.kf_pannumber || '');

  const [isfirstnameValid, setIsfirstnameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isaadharNumberValid, setIsaadharcardNumberValid] = useState(true);
  const [isPancardNumberValid, setIsPancardNumberValid] = useState(true);


  const [recordId, setRecordId] = useState(loanApplication.kf_loanapplicationid);

  const handleGoBack = () => {
    navigation.goBack();
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
    setApprovalDate(loanApplication.kf_dateofapproval);
    setApprover(loanApplication.kf_approver);
    setfirstEMIDate(loanApplication.kf_firstemidate);
    setAadharcardNumber(loanApplication.kf_aadharnumber);
    setPancardNumber(loanApplication.kf_pannumber);
    setRecordId(loanApplication.kf_loanapplicationid);
    console.log('State updated:', {
      applicationnumber,
      createdby,
      firstname,
      lastname,
      gender,
      status
    });
  }, [loanApplication]);

  const handleUpdateRecord = async () => {
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
          kf_dateofapproval: approvalDate,
          kf_approver: approver,
          kf_firstemidate: firstEMIDate,
          kf_aadharnumber: aadharcardNumber,
          kf_pannumber: pancardNumber,
          // Include other fields as needed
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
            kf_dateofapproval: approvalDate,
            kf_approver: approver,
            kf_firstemidate: firstEMIDate,
            kf_aadharnumber: aadharcardNumber,
            kf_pannumber: pancardNumber,
          });
        }
        console.log(loanAmountRequested)
        Alert.alert('Updated the record Successfully.', '', [
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

  const validateEmail = (email) => {
    const trimmedEmail = email.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(trimmedEmail);
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
      return;
    }
    setdateofbirth(newDate);
    setage(calculateAge(newDate).toString());
  };

  const handleaadharcardNumberValid = (text) => {
    setAadharcardNumber(text);
    const aadharRegex = /^\d{12}$/;
    setIsaadharcardNumberValid(aadharRegex.test(text));
  };

  const handlePancardNumberValid = (text) => {
    setPancardNumber(text);
    const panRegex = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;
    setIsPancardNumberValid(panRegex.test(text));
  };

  const handleLoanAmountRequestedChange = (text) => {
    const amountRequested = text.trim() !== '' ? parseFloat(text) : null;
    setLoanAmountRequested(amountRequested);
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
        return 'PendingApproval';
      case 123950002:
        return 'Draft';
      case 123950003:
        return 'Cancelled';
      case 123950004:
        return 'Expired';
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

  return (
    <>
      <HeaderComponent titleText="Edit Home Screen" onPress={handleGoBack} />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.wrapper}>
          <TextInput
              style={[styles.textInputContainer, {color: "gray"}]}
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
              }}
            />
            {!isfirstnameValid && <Text style={styles.errorText}>Please enter a valid first name.</Text>}

            <TextInput
              style={styles.textInputContainer}
              value={lastname}
              placeholder="Last Name"
              onChangeText={(text) => setLastname(text)}
            />
            
            <LoanStatusPicker
              onOptionChange={handleGenderOptionset}
              title="Gender"
              options={['Male', 'Female']}
              initialOption={gender ? getGenderOptionsetStringFromNumericValue(gender) : ''}
              style={{width: "100%", marginLeft: 0, marginTop: 5}}
            />

            <ComponentDatePicker
              selectedDate={dateofbirth}
              onDateChange={handleDateOfBirth}
              placeholder="Date of Birth"
              style={{ width: "100%", height: 45, marginTop: 5, marginLeft: 0 }}
            />

            <TextInput
              style={[styles.textInputContainer, {color: "gray"}]}
              value={age.toString()}
              placeholder="Age"
              onChangeText={(text) => setage(text)}
              editable={false}
            />

            <TextInput
              style={styles.textInputContainer}
              value={mobileNumber}
              placeholder="Mobile Number"
              onChangeText={(text) => {
                setMobileNumber(text);
                setIsMobileNumberValid(/^\d{10}$/.test(text));
              }}
              keyboardType="numeric"
            />
            {!isMobileNumberValid && (
              <Text style={styles.errorText}>Please enter a valid 10-digit mobile number.</Text>
            )}

            <TextInput
              style={styles.textInputContainer}
              value={email}
              placeholder="Email"
              onChangeText={(text) => {
                setEmail(text);
                setIsEmailValid(text.trim() === '' || validateEmail(text));
              }}
            />
            {!isEmailValid && <Text style={styles.errorText}>Please enter a valid email address.</Text>}
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

         {/*<TextInput
          style={styles.textInputContainer}
          value={approvalDate}
          placeholder="Approval Date"
          onChangeText={(text) => setApprovalDate(text)}
        /> */}

            {/* <TextInput
          style={styles.textInputContainer}
          value={firstEMIDate}
          placeholder="First EMI Date"
          onChangeText={(text) => setfirstEMIDate(text)}
        /> */}

            <TextInput
              style={styles.textInputContainer}
              value={aadharcardNumber}
              placeholder="Aadharcard Number"
              onChangeText={(text) => handleaadharcardNumberValid(text)}
            />
            {!isaadharNumberValid && (
              <Text style={styles.errorText}>
                Please enter a valid Aadhar card number.
              </Text>
            )}

            <TextInput
              style={styles.textInputContainer}
              value={pancardNumber}
              placeholder="PAN Card Number"
              onChangeText={(text) => handlePancardNumberValid(text)}
            />
            {!isPancardNumberValid && (
              <Text style={styles.errorText}>
                Please enter a valid PAN card number.
              </Text>
            )}

            <TextInput
              style={styles.textInputContainer}
              placeholder="Loan Amount Request"
              value={loanAmountRequested ? loanAmountRequested.toString() : ''}
              onChangeText={(text) => handleLoanAmountRequestedChange(text)}
            />

            <LoanStatusPicker
              onOptionChange={handleLoanStatusChange}
              title="Select Loan Status"
              options={['Approved', 'PendingApproval', 'Draft', 'Cancelled']}
              initialOption={status ? getStatusStringFromNumericValue(status) : ''}
              style={{width: "100%", marginLeft: 0, marginTop: 5}}
            />

            <LoanStatusPicker
              onOptionChange={handleAnotherOptionChange}
              title="Status Reason"
              options={['AadharNotMatching', 'InvalidDocuments']}
              initialOption={statusReason ? getAnotherOptionStringFromNumericValue(statusReason) : ''}
              style={{width: "100%", marginLeft: 0, marginTop: 5}}
            />

            <ButtonComponent title="Update" onPress={handleUpdateRecord} />
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
    marginTop: 20
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

export default EditHomeLoan;

