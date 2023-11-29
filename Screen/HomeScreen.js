import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StatusBar
} from 'react-native';

const HomeScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const validateInputs = () => {
    // Add your validation logic here
    // For example, checking if fields are not empty
    if (!firstName || !lastName || !mobileNumber || !city || !state || !pincode) {
      alert('Please fill in all fields');
      return false;
    }

    // You can add more specific validation rules here

    return true;
  };

  const handleTextChange = (field, text) => {
    switch (field) {
      case 'firstName':
        setFirstName(text);
        break;
      case 'lastName':
        setLastName(text);
        break;
      case 'mobileNumber':
        setMobileNumber(text);
        break;
      case 'city':
        setCity(text);
        break;
      case 'state':
        setState(text);
        break;
      case 'pincode':
        setPincode(text);
        break;
      default:
        break;
    }
  };

  const renderTouchableInput = (placeholder, value, field) => (
    <TouchableOpacity
      onPress={() => console.log(`${placeholder} field pressed`)}
      style={[styles.inputContainer, {borderColor: "#A9A9A9", borderWidth: 1}]}
    >
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => handleTextChange(field, text)}
      />
    </TouchableOpacity>
  );

  const handleSubmit = () => {
    if (validateInputs()) {
      console.log('Form submitted:', {
        firstName,
        lastName,
        mobileNumber,
        city,
        state,
        pincode,
      });

    }
  };

  return (
    <>
    <StatusBar barStyle="default" />
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>User Information</Text>

      {renderTouchableInput('First Name', firstName, 'firstName')}
      {renderTouchableInput('Last Name', lastName, 'lastName')}
      {renderTouchableInput('Mobile Number', mobileNumber, 'mobileNumber')}
      {renderTouchableInput('City', city, 'city')}
      {renderTouchableInput('State', state, 'state')}
      {renderTouchableInput('Pincode', pincode, 'pincode')}

      <TouchableOpacity  style={styles.submit} onPress ={handleSubmit}>
        <Text style={styles.submitText}>SUBMIT</Text>
      </TouchableOpacity>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#EAECEE',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
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
  input: {
    height: 30,
    paddingHorizontal: 10,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  submit: {
    marginTop: 20,
    width: '40%',
    borderRadius: 25,
    backgroundColor: 'rgba(255, 28, 53, 255)',
    borderWidth: 2,
    borderColor: 'red',
    alignSelf: "center",
    padding: 8
  },

  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign:"center"
  },
});

export default HomeScreen;
