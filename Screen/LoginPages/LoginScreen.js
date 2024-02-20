import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleAdminLogin = () => {
    navigation.navigate('ToggleFormScreen');
  };
  const handleUserLogin = () => {
    navigation.navigate('LoginManagerScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose login option:</Text>
      <TouchableOpacity style={styles.button} onPress={handleAdminLogin}>
        <Text style={styles.buttonText}>Login as Administrator</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.button} onPress={handleUserLogin}>
        <Text style={styles.buttonText}>Login as Manager</Text>
      </TouchableOpacity> */}
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#rgba(255,28,53,255)',
    width: '80%',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoginScreen;
