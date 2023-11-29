import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { authenticateUser } from './AuthService';

const LoginForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
  });
  const navigation = useNavigation();

  useEffect(() => {
    const clearFormOnFocus = () => {
      setFormData({
        username: '',
        password: '',
      });
      setFormErrors({
        username: '',
        password: '',
      });
    };

    const unsubscribeFocus = navigation.addListener('focus', clearFormOnFocus);

    return () => {
      unsubscribeFocus();
    };
  }, [navigation]);
  
  const handleLogin = () => {
    // Basic form validation
    let isValid = true;
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required.';
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required.';
      isValid = false;
    }

    setFormErrors(errors);

    if (isValid) {
      const isAuthenticated = authenticateUser(formData.username, formData.password);

      if (isAuthenticated) {
        navigation.navigate('Dashboard');
      } else {
        console.log('Authentication failed');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.passwordContainer}>
        <Ionicons name="person" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Enter email or Username"
          autoCapitalize="none"
          style={styles.input}
          value={formData.username}
          onChangeText={(text) => {
            setFormData((prevData) => ({ ...prevData, username: text }));
            setFormErrors((prevErrors) => ({ ...prevErrors, username: '' }));
          }}
        />
      </View>
      {formErrors.username ? <Text style={styles.errorText}>{formErrors.username}</Text> : null}

      <View style={styles.passwordContainer}>
        <Ionicons name="lock-closed" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          style={styles.passwordInput}
          secureTextEntry={!isPasswordVisible}
          value={formData.password}
          onChangeText={(text) => {
            setFormData((prevData) => ({ ...prevData, password: text }));
            setFormErrors((prevErrors) => ({ ...prevErrors, password: '' }));
          }}
        />

        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Ionicons
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={24}
            color="#888"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      {formErrors.password ? <Text style={styles.errorText}>{formErrors.password}</Text> : null}
      <TouchableOpacity style={styles.Forgotpassword} onPress={() => console.log("Forgot password")}>
           <Text style={styles.ForgotText}>Forgot Password?</Text>
         </TouchableOpacity>

         <TouchableOpacity style={styles.SignButton} onPress={handleLogin}>
           <Text style={styles.SignText}>Sign In</Text>
         </TouchableOpacity>       
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 240,
    height: 40,
    marginHorizontal: 20,
    marginBottom: 20,
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
    fontWeight: "bold"
  },
  ForgotText: {
    color: '#rgba(255,28,53,255)', // default text color
  },
  Forgotpassword: {
    marginLeft: 175,
    marginVertical: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#DAD7D7',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20,
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
  }
});

export default LoginForm;