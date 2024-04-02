import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity,Alert, StyleSheet,StatusBar, BackHandler} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../../common/Header';
import CustomAlert from '../../common/CustomAlert';

const UserConfrim = () => {
  const navigation = useNavigation();

  const handleYes = () => {
    navigation.navigate('UserRegisterScreen');
  };

  const handleNo = () => {
    navigation.navigate('Welcome');
  };

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
           
            navigation.goBack(); 

          },
        },
      ],
      { cancelable: false }
    );
  };


  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.isFocused()) {
        Alert.alert(
          'Discard Changes',
          'Are you sure want to discard the changes?',
          [
            {
              text: 'cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Discard',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false }
        );
        return true; 
      }
    });

    return () => backHandler.remove();
  }, [navigation]);

  

  return (

    <View style={styles.container}>
         <StatusBar />
      {/* <HeaderComponent titleText="Registration Screen" onPress={handleGoBack} /> */}
      <Text style={styles.title}>Are you above 18 years old?</Text>
      <Text style={styles.subTitle}>Click to proceed</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleYes} style={[styles.button, styles.leftButton]}>
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNo} style={[styles.button, styles.rightButton]}>
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#rgba(255,28,53,255)',
    borderRadius: 30,
    width: 85,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  leftButton: {
    marginLeft: 70
  },
  rightButton: {
    marginLeft: 10
  },
});

export default UserConfrim;