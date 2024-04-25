import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
  const navigation = useNavigation();
  const handleRegister = () => {
    navigation.navigate('UserConfrim');
  };
  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };
  return (
    <ImageBackground source={require('../../assets/red.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Kevin Small Finance</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>Welcome to Kevin Finance</Text>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    // marginHorizontal: 50,/
    textAlign: 'center',
    top: 50,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  button: {
    backgroundColor: '#rgba(255, 28, 53, 255)',
    width: '80%',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default Welcome;