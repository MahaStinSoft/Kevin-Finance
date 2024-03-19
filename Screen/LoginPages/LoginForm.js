import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet, ScrollView, Alert, ImageBackground, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";

import ButtonComponent from '../../common/ButtonComponent';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [kf_name, setName] = useState(null);
  const [kf_adminname, setkf_adminname] = useState(null);
  const [kf_password, setPassword] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogin = async () => {

    if (!isConnected) {
      Alert.alert("No Internet Connection", "Please check your internet connection and try again.");
      return;
    };

    if (!kf_name || !kf_password ) {
      Alert.alert("Error", "Please enter both firstname and password");
      return;
    };

    try {
      // Authenticate and get the access token from Dynamics CRM
      const tokenResponse = await axios.post(
        "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token",
        `grant_type=client_credentials&client_id=d9dcdf05-37f4-4bab-b428-323957ad2f86&client_secret=JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2&resource=https://org0f7e6203.crm5.dynamics.com&kf_name=${kf_name}||kf_adminname=${kf_adminname}&kf_password=${kf_password}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Use the access token to make requests to Dynamics CRM API
      const response = await axios.get(
        "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/contacts?$select=kf_name,kf_password,kf_adminname",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );

      if (response.status === 200) {
        const matchedUser = response.data.value.find(
          (user) => user.kf_name === kf_name && user.kf_password === kf_password
        );
  
        if (matchedUser) {
          // Authentication successful, save the authentication state and navigate to the Dashboard
          try {
            await AsyncStorage.setItem('isLoggedIn', 'true');
            await AsyncStorage.setItem('authenticatedUser', JSON.stringify(matchedUser));
          } catch (error) {
            console.error('Error storing authentication state:', error);
          }
  
          console.log("Authenticated user:", matchedUser);
          // console.log("response.data", response.data);
          navigation.navigate("Dashboard", { authenticatedUser: matchedUser });
        } else {
          // Authentication failed, display an error message
          console.log("Failed to authenticate. Invalid credentials.", response.data);
          Alert.alert("Error", "Invalid credentials. Please try again.");
        }
      } else {
        // Authentication failed, display an error message
        console.log("Failed to authenticate. Response status:", response.status);
        Alert.alert("Error", "Invalid credentials. Please try again.");
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

  const isSignInDisabled = !kf_name || !kf_password;

  return (
    <ImageBackground source={require('../../assets/red.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.backgroundContainer}>
            <View style={styles.modalText}>

              <Text style={{textAlign: "center", marginBottom: 40, fontSize: 18, fontWeight: "bold",color: "red"}}>ADMINISTRATOR LOGIN</Text>
            
              <View style={styles.passwordContainer}>
                <Ionicons name="person" size={20} color="#888" style={styles.icon} />
                <TextInput
                  placeholder="Enter Email"
                  autoCapitalize="none"
                  style={styles.input}
                  value={kf_name}
                  onChangeText={(text) => setName(text)}
                />
              </View>
              <View style={styles.passwordContainer}>
                <Ionicons name="lock-closed" size={20} color="#888" style={styles.icon} />
                <TextInput
                  placeholder="Enter Password"
                  autoCapitalize="none"
                  style={styles.passwordInput}
                  secureTextEntry={!showPassword}
                  value={kf_password}
                  onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#888" style={styles.eyeIcon} />
                </TouchableOpacity>
              </View>
              {/* <TouchableOpacity style={styles.Forgotpassword} onPress={() => console.log('Forgot password')}>
              <Text style={styles.ForgotText}>Forgot Password?</Text>
              </TouchableOpacity> */}
              <ButtonComponent
                title="SIGN IN"
                onPress={handleLogin}
                disabled={isSignInDisabled}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </View>
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
    paddingHorizontal: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginLeft: 30,
    marginTop: -15,
  },
  toggleButtons: {
    marginTop: 50,
    marginBottom: 30,
    width: '75%',
    borderRadius: 25,
    marginHorizontal: 100,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
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
});


export default LoginForm;