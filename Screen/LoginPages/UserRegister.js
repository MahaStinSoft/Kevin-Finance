import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, Text, TextInput, TouchableOpacity, StatusBar, Dimensions, Modal, BackHandler, ImageBackground } from 'react-native';
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import HeaderComponent from '../../common/Header';
import TextInputComponent from '../../common/TextInput';
import ButtonComponent from '../../common/ButtonComponent';
import LoanStatusPicker from '../../common/LoanStatusPicker ';
import ComponentDatePicker from '../../common/ComponentDatePicker';
import CustomAlert from '../../common/CustomAlert';
import { Ionicons } from '@expo/vector-icons';

// Import the generateOTP function
function generateOTP() {
    // Generate a random 6-digit OTP
    var otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

export const UserRegisterScreen = ({ route }) => {
    const [kf_name, setkf_name] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [kf_mobilenumber, setkf_mobilenumber] = useState(null);
    const [kf_email, setkf_email] = useState(null);
    const [kf_password, setkf_password] = useState(null);
    const [kf_confirmpassword, setKf_confirmpassword] = useState(null);
    const [resetFormKey, setResetFormKey] = useState(0);
    const [authenticatedUser, setAuthenticatedUser] = useState(null);
 
    const [formDisabled, setFormDisabled] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [otp, setOTP] = useState(null); // State variable to hold OTP

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [errorMessages, setErrorMessages] = useState({
        firstName: '',
        mobileNumber: '',
        email: '',
    });

    useFocusEffect(
        React.useCallback(() => {
            getAuthenticatedUser();
            setOTP(generateOTP()); // Generate OTP when the component is focused
        }, [])
    );


    const resetForm = () => {
      setkf_name(null);
      setkf_mobilenumber(null);
      setkf_email(null);  
      setResetFormKey((prevKey) => prevKey + 1);
    };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.isFocused()) {
        Alert.alert(
          'Cancel Register',
          'Are you sure want to cancel the Registration ?',
          [
            {
              text: 'No',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Yes',
              // onPress: () => BackHandler.exitApp(),
              onPress: () => navigation.navigate("Welcome"),
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
    });
    return unsubscribe;
  }, [navigation]);

  const handleFirstNameChange = (text) => {
    const onlyAlphabets = /^[^!-\/:-@\[-`{-~]+$/;
    
    if (onlyAlphabets.test(text) || text === '') {
      setkf_name(text);
      setErrorMessages({ ...errorMessages, firstName: 'Enter a valid First Name' });
    } else {
      setErrorMessages({ ...errorMessages, firstName: '' });
    }
  };
 
  const handleMobileNumberChange = (text) => {
    setkf_mobilenumber(text);

    if (text && text.trim() === '') {
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
        firstName:kf_name ? '' : ' Enter a First Name',
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
        const accessToken = tokenResponse.data.access_token;

        const createRecordResponse = await axios.post(
            "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_users",
            {
                kf_name: kf_name,
                kf_mobilenumber: kf_mobilenumber,
                kf_email: kf_email,
                kf_otp: otp, // Include OTP in request payload
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
            Alert.alert(
                'User Registration',
                'Registration successfully done.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('VerificationScreen', { resetState: true }),
                    },
                ]
            );
        } else {
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



  return (
    <View style={styles.container}>

        <ImageBackground source={require('../../assets/red.png')} style={styles.backgroundImage}>
     
      <Text style={styles.Heading}>Registration</Text>
      <ScrollView key={resetFormKey} keyboardShouldPersistTaps="handled">
          <View style={styles.formContent}>

          <View style={{marginVertical: -4}}>
          <TextInputComponent
            placeholder="Name"
            autoCapitalize="none"
            value={kf_name}
            onChangeText={handleFirstNameChange}
          />
           {errorMessages.firstName !== '' && (
                <Text style={styles.errorText}>{errorMessages.firstName}</Text>
              )}
        </View>

            <View style={{marginVertical: 6}}>
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
            </View>
          <TextInput style={styles.textInputContainer}
            placeholder="Email Address"
            autoCapitalize="none"
            value={kf_email}
            onChangeText={handleEmailChange}
          />
          {errorMessages.email !== '' && (
            <Text style={[styles.errorText, {top: 8}]}>{errorMessages.email}</Text>
          )}
 <ButtonComponent
            title="Verify OTP"
            onPress={handleSaveRecord}
            disabled={formDisabled}
          />
 {/* <View style={styles.passwordContainer}>
                  <Ionicons name="lock-closed" size={20} color="#888" style={styles.icon} /> */}
                  {/* <TextInput
                    placeholder="OTP "
                    autoCapitalize="none"
                    style={styles.passwordInput}
                    secureTextEntry={!showPassword}
                    value={kf_otp}
                    onChangeText={(text) => setkf_otp(text)}
                  /> */}
                  {/* <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#888" style={styles.eyeIcon} />
                  </TouchableOpacity>
                </View> */}
{/* <Text>Generated OTP: {kf_otp}</Text> */}
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
  }, passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#DAD7D7',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginVertical: 15,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 0
  },
  eyeIcon: {
    padding: 10,
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
  },
  input: {
    // marginBottom: -15, // Default marginBottom when no error message
},
errorInput: {
    marginBottom: 50, // MarginBottom when error message is displayed
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
  marginHorizontal: 20,
  top: 6
},
});
  
  export default UserRegisterScreen;