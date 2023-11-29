import React, { useRef, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPress = () => {
    // Handle button press, navigate to the next screen, etc.
    console.log('Button Pressed');
    // Example: Navigate to the next screen
    navigation.navigate('ToggleForm');
  };

  useEffect(() => {
    fadeIn();

    // Set a timeout to navigate after 3000 milliseconds (3 seconds)
    const timeoutId = setTimeout(() => {
      navigation.navigate('ToggleFormScreen');
    }, 3000);

    // Clear the timeout when the component is unmounted
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/splash6.png')} style={styles.image} />
      <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
        {/* <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Animated.Text style={styles.buttonText}>Get Started</Animated.Text>
        </TouchableOpacity> */}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#009387',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
