import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const RegisterForm = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSignUp = () => {
    // Basic form validation
    let isValid = true;

    if (!username) {
      setUsernameError('Username is required.');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (!email) {
      setEmailError('Email is required.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      // If the form is valid, show an alert
      Alert.alert(
        'Success!',
      'You have successfully signed up!\nPlease do Sign In.',
        [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View>
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#a9a9a9" style={styles.icon} />
            <TextInput
              placeholder="Username"
              autoCapitalize="none"
              style={styles.input}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setUsernameError('');
              }}
            />
          </View>
          {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#a9a9a9" style={styles.icon} />
            <TextInput
              placeholder="Email"
              autoCapitalize="none"
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#a9a9a9" style={styles.icon} />
            <TextInput
              placeholder="Password"
              autoCapitalize="none"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
            />
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <TouchableOpacity style={styles.SignButton} onPress={handleSignUp}>
            <Text style={styles.SignText}>Sign up</Text>
          </TouchableOpacity>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 240,
    height: 40,
    marginHorizontal: 20,
    marginBottom: 25,
    borderBottomColor: '#DAD7D7',
    borderBottomWidth: 1,
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
    width: 150,
  },
  errorText: {
    color: 'red',
    marginLeft: 30,
    marginTop: -15,
  },
});

export default RegisterForm;
