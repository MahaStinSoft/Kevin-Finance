import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, Text, TouchableOpacity, StatusBar, Dimensions, Modal, BackHandler, ImageBackground } from 'react-native';
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import HeaderComponent from '../../common/Header';
import TextInputComponent from '../../common/TextInput';
import ButtonComponent from '../../common/ButtonComponent';
import LoanStatusPicker from '../../common/LoanStatusPicker ';
import ComponentDatePicker from '../../common/ComponentDatePicker';
import CustomAlert from '../../common/CustomAlert';

export const UserRegisterScreen = ({ route }) => {

  const [kf_name, setkf_name] = useState(null);
  const [kf_lastname, setkf_lastname] = useState(null);
  const [kf_gender, setkf_gender] = useState(null);
  const [kf_dateofbirth, setkf_dateofbirth] = useState(null);
  const [kf_age, setkf_age] = useState(null);
  const [kf_mobilenumber, setkf_mobilenumber] = useState(null);
  const [kf_email, setkf_email] = useState(null);
  const [kf_otp, setkf_otp] = useState(null);
  const [resetFormKey, setResetFormKey] = useState(0);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
 
  const [formDisabled, setFormDisabled] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [errorMessages, setErrorMessages] = useState({
    UserName: '',
    dateOfBirth: '',
    age: '',
    mobileNumber: '',
    email: '',
  });

  useFocusEffect(
    React.useCallback(() => {
      getAuthenticatedUser();
      generateOtp(); // Generate OTP when the component is focused
    }, [])
  );

  const resetForm = () => {
    setkf_name('');
    setkf_gender(null);
    setkf_mobilenumber(null);
    setkf_email(null);  
    setResetFormKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.isFocused()) {
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
        return true; 
      }
    });

    return () => backHandler.remove();
  }, [navigation]);

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
            navigation.goBack(); // Navigate back without resetting state
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetForm();
      generateOtp(); // Generate OTP when the screen is focused
    });
    return unsubscribe;
  }, [navigation]);

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
    
    if (onlyAlphabets.test(text) || text === '') {
      setkf_name(text);
      setErrorMessages({ ...errorMessages, firstName: '' });
    } else {
      setErrorMessages({ ...errorMessages, firstName: 'Enter a valid First Name' });
    }
  };

  const handleDateOfBirth = (newDate) => {
    if (!newDate) {
      setkf_dateofbirth(null);
      setErrorMessages({
        ...errorMessages,
        dateOfBirth: 'Please enter date of birth',
      });
      return;
    }
  
    // Extracting date part from the newDate
    const selectedDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    
    setkf_dateofbirth(selectedDate);
    setErrorMessages({
      ...errorMessages,
      dateOfBirth: '', // Clearing the error message if date is selected
    });
  };
 
  const handleMobileNumberChange = (text) => {
    setkf_mobilenumber(text);

    if (text.trim() === '') {
      setIsMobileNumberValid(false);
      setErrorMessages({
        ...errorMessages,
        mobileNumber: 'Enter a Mobile Number',
      });
    } else if (/^[6-9]\d{9}$/.test(text)) {
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
        email: 'Enter a Valid Email Address',
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

  const handleSaveRecord = async () => {
    setIsFormSubmitted(true);
    if (handleMobileNumberChange(kf_mobilenumber) > 10) {
      setErrorMessages({
        ...errorMessages,
        mobileNumber: 'Enter a Valid 10-digit mobile number.',
      });
      return;
    }

    const newErrorMessages = {
      firstName: !kf_name ? ' Enter a First Name' : '',
      dateOfBirth: !kf_dateofbirth ? ' Enter a Date of Birth' : '',
      mobileNumber: /^[6-9]\d{9}$/.test(kf_mobilenumber) ? '' : 'Enter a Valid 10-digit mobile number.',
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kf_email) ? 'Enter a Valid Email Address' : '',
      
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

      const formattedDateOfBirth = kf_dateofbirth ? kf_dateofbirth : null;

      const createRecordResponse = await axios.post(
        "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_users",
        {
          kf_name: kf_name,
          kf_gender: kf_gender,
          kf_dateofbirth: formattedDateOfBirth,
          kf_mobilenumber: kf_mobilenumber,
          kf_email: kf_email,
          kf_otp: kf_otp
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
        Alert.alert(
          'User Registeration',
          ' Registeration successfully done.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('LoginUserForm', { resetState: true }),
            },
          ]
        );
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

const generateOtp = () => {
  const otp = Math.floor(1000 + Math.random() * 9000); // Generate a random number between 1000 and 9999
  setkf_otp(otp.toString());
};

  return (
    <View style={styles.container}>

        <ImageBackground source={require('../../assets/red.png')} style={styles.backgroundImage}>
     
      <Text style={styles.Heading}>Registeration</Text>
      <ScrollView key={resetFormKey} keyboardShouldPersistTaps="handled">
          <View style={styles.formContent}>
          <TextInputComponent
            placeholder="Name"
            autoCapitalize="none"
            value={kf_name}
            onChangeText={handleFirstNameChange}
          />
          {errorMessages.firstName !== '' && (
            <Text style={styles.errorText}>{errorMessages.firstName}</Text>
          )}

          <ComponentDatePicker
            style={{ height: 48, marginBottom: 10, marginTop: 15 }}
            selectedDate={kf_dateofbirth}
            onDateChange={handleDateOfBirth}
            placeholder="Date of Birth"
          />

          {errorMessages.dateOfBirth !== '' && (
            <Text style={[styles.errorText, { marginTop: -10, marginBottom: 15 }]}>
              {errorMessages.dateOfBirth}
            </Text>
          )}

          <LoanStatusPicker
            onOptionChange={handleGenderOptionset}
            title="Gender"
            options={['Male', 'Female']}
          // initialOption="Option1"
          Optiontitle= "Gender"
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

{/* <Text>Generated OTP: {kf_otp}</Text> */}

          <ButtonComponent
            title="SUBMIT"
            onPress={handleSaveRecord}
            disabled={formDisabled}
          />
</View>
      </ScrollView>
      </ImageBackground>
      </View>

  );
};

const styles = StyleSheet.create({
  container: {
    position:"absolute"
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    marginHorizontal: 25,
  },
  Heading:{
    fontWeight: 'bold',
    color: "white",
    fontSize: 30,
    textAlign: 'center',
    marginTop: 140
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position:"relative"
  },
  formContent:{
    marginTop: 80
  }
});
  
  export default UserRegisterScreen;
