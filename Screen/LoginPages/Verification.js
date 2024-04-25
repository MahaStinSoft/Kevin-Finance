import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Alert, KeyboardAvoidingView, Platform, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import ButtonComponent from '../../common/ButtonComponent';
import CustomAlert from '../../common/CustomAlert';

export const VerificationScreen = ({ route }) => {
  const [kf_otp, setKf_otp] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertInvalidUser, setShowAlertInvalidUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setshowRePassword] = useState(false);
  const [reEnteredPassword, setReEnteredPassword] = useState('');
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const { recordid } = route.params;
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.isFocused()) {
        // If the user is on the login screen, show the exit confirmation alert
        Alert.alert(
          'Cancel verfication',
          'Are you want to cancel verification ?',
          [
            {
              text: 'No',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Yes',
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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Network state changed:', state.isConnected);
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        console.log('No Internet Connection');
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const checkAuthentication = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        const authenticatedUser = await AsyncStorage.getItem('authenticatedUser');
      }
    };
    checkAuthentication();
  }, []);

  const handleLogin = async () => {
    if (!kf_otp) {
      Alert.alert("Error", "Please enter OTP");
      return;
    };

    try {
      const tokenResponse = await axios.post(
        "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token",
        `grant_type=client_credentials&client_id=d9dcdf05-37f4-4bab-b428-323957ad2f86&client_secret=JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2&resource=https://org0f7e6203.crm5.dynamics.com&kf_otp=${kf_otp}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const accessToken = tokenResponse.data.access_token;
      // Make requests to both kf_personalloans and kf_loanapplications tables based on the entered email
      try {
        const personalLoansResponse = await axios.get(
          "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        );
        const userResponse = await axios.get(
          "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_users",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        );
        const loanApplicationsResponse = await axios.get(
          "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        );
        const matchedUser = userResponse.data.value.find(
          (user) => user.kf_otp === kf_otp
        );
        if (
          personalLoansResponse.status === 200 &&
          loanApplicationsResponse.status === 200 &&
          userResponse.status === 200 &&
          kf_otp.length > 0 &&
          matchedUser
        ) {
          try {
            await AsyncStorage.setItem('isLoggedIn', 'true');
            await AsyncStorage.setItem('authenticatedUser', JSON.stringify(matchedUser));
            // await savePasswordToCRM(matchedUser, password, accessToken);
            Alert.alert("Success", "Verification successful Completed");
            setIsOTPVerified(true);
          } catch (error) {
            console.error('Error storing authentication state:', error);
          }
          console.log("Authenticated user:", matchedUser);
          //   navigation.navigate("UserDashboard", { authenticatedUser: matchedUser });
        } else {
          console.log("Failed to authenticate. Invalid credentials.");
          setShowAlertInvalidUser(true);
        }
      } catch (error) {
        console.error("Error during login:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again later."
      );
    }
  };
  const handleUpdatePassword = async () => {
    setIsPasswordUpdating(true);

    // Validate password length and match
    if (password.length < 6 || reEnteredPassword.length < 6) {
      setErrorMessage("Password should be at least 6 characters long");
      setIsPasswordUpdating(false);
      return;
    }

    if (password !== reEnteredPassword) {
      setErrorMessage("Passwords do not match");
      setIsPasswordUpdating(false);
      return;
    } else {
      setErrorMessage("");
    }

    try {
      // Fetch access token
      const tokenResponse = await axios.post(
        "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token",
        `grant_type=client_credentials&client_id=d9dcdf05-37f4-4bab-b428-323957ad2f86&client_secret=JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2&resource=https://org0f7e6203.crm5.dynamics.com&kf_otp=${kf_otp}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const accessToken = tokenResponse.data.access_token;

      // Update password using PATCH request
      const patchResponse = await axios.patch(
        `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_users(${recordid})`,
        {
          kf_password: password,
          kf_confirmpassword: reEnteredPassword
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
      console.log("Password updated successfully:", patchResponse.data);
      Alert.alert(
        "Success",
        "Password updated successfully",
        [
          { text: "OK", onPress: () => navigation.navigate("LoginUserForm") }
        ]
      );
      setIsPasswordUpdating(false);
    } catch (error) {
      console.error("Error while updating password:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again later.");
      setIsPasswordUpdating(false);
    }
  };

  const handledShowInvalidAlert = () => {
    setShowAlertInvalidUser(true);
  };

  const handledCloseInvalidAlert = () => {
    setShowAlertInvalidUser(false);
  };

  const isSignInDisabled = !kf_otp;

  return (
    <ImageBackground source={require('../../assets/red.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.backgroundContainer}>
              <View style={styles.modalText}>
                {/* <Text style={{ textAlign: "center", marginBottom: 40, fontSize: 18, fontWeight: "bold", color: "red" }}>OTP Verification</Text> */}

                {isOTPVerified ? (
                  <View>
                    <Text style={{ textAlign: "center", marginBottom: 40, fontSize: 18, fontWeight: "bold", color: "red" }}>Password Verification</Text>
                    <View style={styles.passwordContainer}>
                      <Ionicons name="lock-closed" size={20} color="#888" style={styles.icon} />
                      <TextInput
                        placeholder="Password"
                        autoCapitalize="none"
                        style={styles.passwordInput}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#888" style={styles.eyeIcon} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.passwordContainer}>
                      <Ionicons name="lock-closed" size={20} color="#888" style={styles.icon} />
                      <TextInput
                        placeholder="Re-enter Password"
                        autoCapitalize="none"
                        style={styles.passwordInput}
                        secureTextEntry={!showRePassword}
                        value={reEnteredPassword}
                        onChangeText={(text) => setReEnteredPassword(text)}
                      />
                      <TouchableOpacity onPress={() => setshowRePassword(!showRePassword)}>
                        <Ionicons name={showRePassword ? 'eye' : 'eye-off'} size={24} color="#888" style={styles.eyeIcon} />
                      </TouchableOpacity>
                    </View>
                    {errorMessage !== '' && (
                      <Text style={styles.errorText}>{errorMessage}</Text>
                    )}
                    <ButtonComponent style={{ width: "70%", top: 30 }}
                      title="UPDATE PASSWORD"
                      onPress={handleUpdatePassword}
                      disabled={!password || !reEnteredPassword || isPasswordUpdating}
                    />
                  </View>
                ) : (
                  <>
                    <Text style={{ textAlign: "center", marginBottom: 40, fontSize: 18, fontWeight: "bold", color: "red" }}>OTP Verification</Text>
                    <View style={styles.passwordContainer}>
                      <Ionicons name="lock-closed" size={20} color="#888" style={styles.icon} />
                      <TextInput
                        placeholder="OTP"
                        autoCapitalize="none"
                        style={styles.passwordInput}
                        secureTextEntry={!showPassword}
                        value={kf_otp}
                        onChangeText={(text) => setKf_otp(text)}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#888" style={styles.eyeIcon} />
                      </TouchableOpacity>
                    </View>
                    <ButtonComponent style={{ top: 20 }}
                      title="VERIFY"
                      onPress={handleLogin}
                      disabled={isSignInDisabled}
                    />
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <CustomAlert
        visible={showAlertInvalidUser} // Corrected the prop value
        onClose={handledCloseInvalidAlert}
        onConfirm={handledCloseInvalidAlert}
        headerMessage="Invalid credentials"
        message="Please Enter Correct OTP."
        Button1="Cancel"
        Button2="OK"
        style={[styles.alertStyle, { height: "23%" }]}
        modalHeaderStyle={[styles.modalheaderStyle, { right: 65 }]}
        textStyle={styles.textStyle}
      />
    </ImageBackground>
  );

};

const styles = StyleSheet.create({
  container: {
    height: 800,
    width: "100%",
    top: 70,
    marginLeft: 20
  },
  modalText: {
    height: '100%',
    width: "100%",
    top: 80
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  SignButton: {
    backgroundColor: '#rgba(255,28,53,255)',
    width: '60%',
    alignSelf: 'center',
    borderRadius: 25,
    marginTop: 25,
    padding: 5,
  },
  SignText: {
    color: '#fff',
    padding: 12,
    textAlign: 'center',
    fontWeight: "bold"
  },
  ForgotText: {
    color: '#rgba(255,28,53,255)',
    marginTop: 10,
    left: 155
  },
  Forgotpassword: {
  },
  passwordContainer: {
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
  errorText: {
    color: 'red',
    marginLeft: 30,
    marginTop: -10,
  },
  toggleButtons: {
    marginTop: 50,
    marginBottom: 30,
    width: '75%',
    borderRadius: 25,
    marginHorizontal: 100,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    maxWidth: 900
  },
  backgroundContainer: {
    backgroundColor: 'white',
    padding: 10,
    width: '80%',
    height: '60%',
    borderRadius: 40,
    ...Platform.select({
      android: {
        elevation: 5,
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
      },
    }),
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    width: 110,
  },
  activeText: {
    color: 'rgba(255,28,53,255)',
    fontSize: 25,
    fontWeight: "bold"
  },
  alertStyle: {
    width: "80%",
  },
  modalheaderStyle: {
    right: 85
  },
  textStyle: {
  }
});

export default VerificationScreen;