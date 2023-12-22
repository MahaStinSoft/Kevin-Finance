import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
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
  const [kf_dateofapproval, setkf_dateofapproval] = useState(new Date());;
  const [kf_approver, setkf_approver] = useState(null);
  const [kf_firstemidate, setkf_firstemidate] = useState(new Date());;
  const [selectedValue, setSelectedValue] = useState('');
  const [image, setImage] = useState(null);
  const [kf_aadharcard, setkf_aadharcard] = useState(null);


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
    kf_loanamountrequested: kf_loanamountrequested,
    kf_status: kf_status,
    kf_statusreason: kf_statusreason,
    kf_dateofapproval: kf_dateofapproval,
    kf_approver: kf_approver,
    kf_firstemidate: kf_firstemidate,
    kf_aadharcard: kf_aadharcard
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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSaveRecord = async () => {
    // if (!kf_name || !kf_lastname) {
    //   Alert.alert("Error", "Please enter both email and password");
    //   return;
    // }
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
      console.log("tokenResponse", tokenResponse);
      const accessToken = tokenResponse.data.access_token;
      console.log("Access Token:", accessToken);

      // Ensure kf_dateofapproval and kf_firstemidate are formatted correctly
      const formattedDateOfApproval = kf_dateofapproval ? kf_dateofapproval.toISOString() : null;
      const formattedFirstEmiDate = kf_firstemidate ? kf_firstemidate.toISOString() : null;
      const loanAmount = parseFloat(kf_loanamountrequested);
      const imageUrl = await uploadImageToCRM(image, accessToken);

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
          kf_aadharcard: imageUrl
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (createRecordResponse.status === 204) {
        console.log("Record created successfully in CRM", createRecordResponse);
        // navigation.navigate("Dashboard");
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
  
  const uploadImageToCRM = async (imageUri, accessToken) => {
    try {
      // Replace 'YOUR_CRM_API_ENDPOINT' with the actual CRM API endpoint for uploading images
      const uploadApiUrl = 'https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications?$select=kf_aadharcard,kf_name';
      
      // Prepare the image data for upload
      const formData = new FormData();
      formData.append('aadharImage', {
        uri: imageUri,
        type: 'image/jpeg', // Adjust the content type based on your image type
        name: 'aadhar_image.jpg',
      });

      // Make a POST request to the CRM API endpoint for image upload
      const uploadResponse = await axios.post(uploadApiUrl, formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check if the image upload was successful
      if (uploadResponse.status === 200) {
        console.log('Image uploaded successfully to CRM');
        // Return the image URL from CRM for storage in the record
        return uploadResponse.data.imageUrl; // Adjust the property name based on your CRM response
      } else {
        console.error('Failed to upload image to CRM');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image to CRM:', error);
      return null;
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <HeaderComponent titleText="Home Screen" onPress={handleGoBack}/>
        {/* <TextInputComponent
          placeholder="First Name"
          autoCapitalize="none"
          value={kf_name}
          onChangeText={(text) => setkf_name(text)}
        />

        <TextInputComponent
          placeholder="Last Name"
          autoCapitalize="none"
          value={kf_lastname}
          onChangeText={(text) => setkf_lastname(text)}
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
          onChangeText={(text) => setkf_mobilenumber(text)}
        />
        <TextInputComponent
          placeholder="Email Address"
          autoCapitalize="none"
          value={kf_email}
          onChangeText={(text) => setkf_email(text)}
        />
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
          onChangeText={(text) => setkf_loanamountrequested(text)}
        />

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
        /> */}

<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ButtonComponent title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>

        <ButtonComponent
          title="SUBMIT"
          onPress={handleSaveRecord}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 10,
  },
});

export default HomeScreen;
