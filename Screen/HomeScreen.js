import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, Text, TouchableOpacity, StatusBar, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

import HeaderComponent from '../common/Header';
import TextInputComponent from '../common/TextInput';
import ButtonComponent from '../common/ButtonComponent';
import LoanStatusPicker from '../common/LoanStatusPicker ';
import ComponentDatePicker from '../common/ComponentDatePicker';

export const HomeScreen = () => {
  const [kf_name, setkf_name] = useState(null);
  const [kf_lastname, setkf_lastname] = useState(null);
  const [kf_gender, setkf_gender] = useState(null);
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
  const [kf_aadharnumber,setkf_aadharnumber] = useState(null); 
  const [kf_aadharcard, setkf_aadharcard] = useState({ fileName: null, fileContent: null });
  const [selectedValue, setSelectedValue] = useState('');
  // const [image, setImage] = useState(null);

  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [isAadharnumberValidation,setIsAadharnumberValidation] = useState(true); 
  const [isLoanAmountRequestedValid, setIsLoanAmountRequestedValid] = useState(true);

  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleDateChange1 = (newDate) => {
    setkf_dateofapproval(newDate);
  };

  const handleDateChange2 = (newDate) => {
    setkf_firstemidate(newDate);
  };

  console.log("Request Payload to CRM:", {
    // kf_name: kf_name,
    // kf_lastname: kf_lastname,
    // kf_gender: kf_gender,
    // kf_mobilenumber: kf_mobilenumber,
    // kf_email: kf_email,
    // kf_address1: kf_address1,
    // kf_address2: kf_address2,
    // kf_address3: kf_address3,
    // kf_city: kf_city,
    // kf_state: kf_state,
    // kf_loanamountrequested: kf_loanamountrequested,
    // kf_status: kf_status,
    // kf_statusreason: kf_statusreason,
    // kf_dateofapproval: kf_dateofapproval,
    // kf_approver: kf_approver,
    // kf_firstemidate: kf_firstemidate,
    // kf_aadharnumber:kf_aadharnumber,
    // kf_aadharcard:  'base64 content'
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
        numericValue = null; // Handle the default case or set to null if needed
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
      console.log("result",result);

  
      setkf_aadharcard({
        fileName: fileName, // Extracting filename from URI
        fileContent: byteArray,
      });
    } catch (error) {
      console.error('Error picking or processing the image:', error);
      Alert.alert('Error', 'Failed to pick or process the image.');
    }
  };

  const handleSaveRecord = async () => {

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

      // Ensure kf_dateofapproval and kf_firstemidate are formatted correctly
      const formattedDateOfApproval = kf_dateofapproval ? kf_dateofapproval.toISOString() : null;
      const formattedFirstEmiDate = kf_firstemidate ? kf_firstemidate.toISOString() : null;
      const loanAmount = parseFloat(kf_loanamountrequested);

      const createRecordResponse = await axios.post(
        "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications",
        {
          kf_name: kf_name,
          kf_lastname: kf_lastname,
          kf_gender: kf_gender,
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
          kf_dateofapproval: formattedDateOfApproval,
          kf_approver: kf_approver,
          kf_firstemidate: formattedFirstEmiDate,
          kf_aadharnumber:kf_aadharnumber,
          kf_aadharcard: kf_aadharcard.fileContent
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (createRecordResponse.status === 204) {
        console.log("Record created successfully in CRM" ); //createRecordResponse
        // navigation.navigate("Dashboard");
        console.log("Created New Record Details:",createRecordResponse);
      } else {
        console.log("else part");
        Alert.alert("Error", "Failed to create a record in CRM.");
      }
    } catch (error) {
      console.error("Error during record creation:", error);
      console.log("Detailed Error Response:", error.response); // Log the detailed error response
      Alert.alert("Error", "An unexpected error occurred. Please try again later.");
    }
  };

  const validateEmail = (email) => {
    const trimmedEmail = email.trim(); // Remove leading and trailing whitespaces
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const isValid = regex.test(trimmedEmail);
    
    if (!isValid) {
      // console.log('Invalid email:', trimmedEmail);
    }
  
    return isValid;
  };
  

  const handleMobileNumberChange = (text) => {
    // Check if the entered value has exactly 10 digits
    if (/^\d{10}$/.test(text)) {
      setIsMobileNumberValid(true);
      setkf_mobilenumber(text);
    } else {
      setIsMobileNumberValid(false);
    }
  };

  const handleLoanAmountRequestedChange = (text) => {
    // Check if the entered value is a sequence of digits
    if (/^\d+$/.test(text)) {
      setIsLoanAmountRequestedValid(true);
      setkf_loanamountrequested(text);
    } else {
      setIsLoanAmountRequestedValid(false);
    }
  };

  const handleAadharCardNumberValidation = (text) => {
      // Check if the entered value has exactly 10 digits
      if (/^\d{12}$/.test(text)) {
        setIsAadharnumberValidation(true);
        setkf_aadharnumber(text);
      } else {
        setIsAadharnumberValidation(false);
      }
    };
  
  const isSignInDisabled = !kf_name || !kf_lastname || !kf_mobilenumber || !kf_email || !kf_loanamountrequested ;

  return (
    <>
    <StatusBar/>
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <HeaderComponent titleText="Home Screen" onPress={handleGoBack}/>
          <TextInputComponent
            placeholder="First Name"
            autoCapitalize="none"
            value={kf_name}
            onChangeText={(text) => {
              setkf_name(text); setIsFirstNameValid(text.trim() !== '');
            }}
          />

          {!isFirstNameValid && <Text style={styles.errorText}>Please Enter First Name</Text>}

          <TextInputComponent
            placeholder="Last Name"
            autoCapitalize="none"
            value={kf_lastname}
            onChangeText={(text) => {
              setkf_lastname(text);
              setIsLastNameValid(text.trim() !== ''); // Update the validity based on whether the field is empty
            }}
          />
          {!isLastNameValid && <Text style={styles.errorText}>Please Enter Last Name</Text>}


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
            onChangeText={(text) => handleMobileNumberChange(text)}
            keyboardType="numeric"
          />
          {!isMobileNumberValid && (
            <Text style={styles.errorText}>
              Please enter a valid 10-digit mobile number.
            </Text>
          )}

          <TextInputComponent
            placeholder="Email Address"
            autoCapitalize="none"
            value={kf_email}
            onChangeText={(text) => {
              setkf_email(text);
              setIsEmailValid(text.trim() === '' || validateEmail(text));
            }}
          />
          {!isEmailValid && <Text style={styles.errorText}>Please enter a valid email address.</Text>}

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
            placeholder="Loan Amount Request"
            autoCapitalize="none"
            value={kf_loanamountrequested}
            onChangeText={(text) => handleLoanAmountRequestedChange(text)}
          />

          {!isLoanAmountRequestedValid && (
            <Text style={styles.errorText}>
              Please enter a valid loan amount.
            </Text>
          )}

          <LoanStatusPicker onOptionChange={handleLoanStatusChange}
            title="Select Loan Status"
            options={['Approved', 'PendingApproval', 'Draft', 'Cancelled']}
          // initialOption="Approved" 
          />

          <LoanStatusPicker
            onOptionChange={handleAnotherOptionChange}
            title="Status Reason"
            options={['AadharNotMatching', 'InvalidDocuments']}
          // initialOption="Option1"
          />

          <ComponentDatePicker
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
          /> 

          <TextInputComponent
            placeholder="Aadharcard Number"
            autoCapitalize="none"
            value={kf_aadharnumber}
            onChangeText={(text) => handleAadharCardNumberValidation(text)}
          />

          {!isAadharnumberValidation && (
            <Text style={styles.errorText}>
              Please enter a valid 12-digit AadharCard number.
            </Text>
          )}


          <View style={{ flexDirection: "row", marginTop: 15 }}>
            <View style={{ marginHorizontal: 25, marginTop: 10 }}>
              <TouchableOpacity onPress={pickImage}>
                <Text>AadharCard</Text>
              </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: "gray", padding: 10, borderRadius: 20, width: 160, marginLeft: 30 }}>
              {kf_aadharcard.fileContent ? (
                <>
                  <Text style={{ marginTop: 10, textAlign: "center" }}>{kf_aadharcard.fileName}</Text>
                  {/* <Image
          style={{ width: 100, height: 100 }}
          source={{ uri: `data:image/jpeg;base64,${kf_aadharcard.fileContent}` }}
        /> */}
                </>
              ) : (
                <TouchableOpacity onPress={() => console.log()}>
                  <Text style={{ color: "white", textAlign: "center" }}>Upload</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ButtonComponent
            title="SUBMIT"
            onPress={handleSaveRecord}
          disabled={isSignInDisabled}
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
  errorText:{
    color:'red',
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
  disabledButton:{
    backgroundColor: 'gray',
    width: '60%',
    alignSelf: 'center',
    borderRadius: 25,
    marginTop: 25,
    padding: 5,
  }
});

export default HomeScreen;
