import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity,Alert, StyleSheet,StatusBar, BackHandler, ImageBackground, Dimensions } from 'react-native';
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
          'Alert',
          'Are you sure want to cancle?',
          [
            {
              text: 'No',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Yes',
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
    <ImageBackground source={require('../../assets/red.png')} style={styles.backgroundImage}>
    <View style={styles.container}>    
    <Text style={styles.title}>Kevin Small Finance</Text>
    </View>
    <View style={styles.contentContainer}>
      <Text style={styles.contenttitle}>Are you above 18 years old?</Text>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingHorizontal: 20,
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
  contenttitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    margin: 20,
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
    marginLeft: 85
  },
  rightButton: {
    marginLeft: 10
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});

export default UserConfrim;