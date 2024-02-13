import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground, Platform, KeyboardAvoidingView } from 'react-native';
import RegisterForm from './RegisterScreen';
import LoginForm from './LoginPages/LoginForm';

const ToggleFormScreen = () => {
    const [activeTab, setActiveTab] = useState('login');

    const renderForm = () => {
      if (activeTab === 'login') {
        return (
          <LoginForm />
        );
      } else if (activeTab === 'register') {
        return <RegisterForm />;
      }
    };

  return (
    <ImageBackground source={require('../assets/red.png')} style={styles.backgroundImage}>
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} // Use 'padding' for iOS, undefined for Android
      >
      <View style={styles.container}>
        <View style={styles.backgroundContainer}>
          <View style={styles.toggleButtons}>
            {/* <TouchableOpacity onPress={() => setActiveTab('login')} style={[styles.tabButton, activeTab === 'login' && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === 'login' && styles.activeText]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('register')} style={[styles.tabButton, activeTab === 'register' && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === 'register' && styles.activeText]}>Sign Up</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
              <Text style={styles.activeText}>Log In</Text>
            </TouchableOpacity>
          </View>
          {renderForm()}
        </View>
      </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtons: {
    // flexDirection: 'row',
    marginTop: 50,
    marginBottom: 30,
    width:'75%',
    borderRadius: 25,
    marginHorizontal: 100,
  },
  // tabButton: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingTop:10,
  //   paddingBottom:10,
  //   borderRadius: 25,
  //   width: 110,
  //   // marginLeft:10
  // },
  // activeTab: {
  //   backgroundColor: '#rgba(255,28,53,255)', // active tab background color
  // },
  // tabText: {
  //   color: '#rgba(255,28,53,255)', // default text color
  //   fontSize: 15,
  // },
  // activeText: {
  //   color: 'white', // active text color
  // },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  backgroundContainer: {
    backgroundColor: 'white',
    padding: 10,
    width: '80%',
    height: '60%',
    borderRadius: 40,
    ...Platform.select({
      // ios: {
      //   shadowColor: 'black',
      //   shadowOffset: { width: 0, height: 2 },
      //   shadowOpacity: 0.5,
      //   shadowRadius: 3,
      // },
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
    paddingTop:10,
    paddingBottom:10,
    width: 110,
  },
  activeText: {
    color: 'rgba(255,28,53,255)', 
    fontSize: 25, 
    fontWeight: "bold"
  },
});

export default ToggleFormScreen;