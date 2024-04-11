
import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ButtonComponent from '../../common/ButtonComponent';
import CardImageSignature from '../../common/CardImageSignature';
import CustomAlert from '../../common/CustomAlert';

const Gurantee1SignaturePersonal  = ({ route }) => {
    const { personalLoan } = route.params || {};
  const [path, setPath] = useState('');
  const [signatureFile, setSignatureFile] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showAlert, setShowAlertConfirmation] = useState(false); 
  const [base64Data, setBase64Data] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const svgRef = useRef(null);
  const navigation = useNavigation();

  const [recordId, setRecordId] = useState(personalLoan?.kf_personalloanid|| '');

  useEffect(() => {
    if (personalLoan) {
      setRecordId(personalLoan.kf_personalloanid);
    }
  }, [personalLoan]);
  

  useEffect(() => {
    loadStoredPath();
  }, []);

  useEffect(() => {
    return () => clearStoredPath();
  }, []);

  const loadStoredPath = async () => {
    try {
      const storedPath = await AsyncStorage.getItem('signaturePath');
      if (storedPath) {
        setPath(storedPath);
      }
    } catch (error) {
      console.error('Error loading stored path:', error);
    }
  };

  const storePath = async () => {
    try {
      await AsyncStorage.setItem('signaturePath', path);
    } catch (error) {
      console.error('Error storing path:', error);
    }
  };

  const clearStoredPath = async () => {
    try {
      await AsyncStorage.removeItem('signaturePath');
    } catch (error) {
      console.error('Error clearing stored path:', error);
    }
  };

  const handleTouchStart = (event) => {
    const { nativeEvent } = event;
    const { locationX, locationY } = nativeEvent;
    
    // If already drawing, don't reset the path, just set the drawing state
    if (!isDrawing) {
        setPath((prevPath) => `${prevPath} M${locationX},${locationY}`);
    }

    setIsDrawing(true);
  };

  const handleTouchMove = (event) => {
    if (!isDrawing) return;
    const { nativeEvent } = event;
    const { locationX, locationY } = nativeEvent;
    const newPath = `${path} L${locationX},${locationY}`;
    setPath(newPath);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    // Store the drawn path for future use
    storePath();
  };

  const clearSignature = () => {
    setPath('');
    setSignatureFile(null);
    // Clear stored path when signature is cleared
    clearStoredPath();
  };

  const captureSignature = async () => {
    try {
      setIsLoading(true); // Start loading indicator
      const capturedData = await captureRef(svgRef, {
        format: 'png',
        quality: 1,
        result: 'base64',
      });
  
      if (!capturedData) {
        console.error('Captured base64 data is undefined');
        return;
      }
  
      setSignatureFile(capturedData);
      await AsyncStorage.setItem('signaturefile', capturedData);
      setBase64Data(capturedData); // Store captured data in state
      handleShowAlert();
    } catch (error) {
      setIsLoading(false); // Stop loading indicator
      console.error('Error capturing signature:', error);
    }
  };
  
  useEffect(() => {
    const loadSignatureFile = async () => {
      try {
        const storedImage = await AsyncStorage.getItem('signatureFile');
        if (storedImage) {
          setSignatureFile(storedImage);
        }
      } catch (error) {
        console.error('Error loading signature image:', error);
      }
    };

    loadSignatureFile();
  }, []);

  const handleSignature = () => {
    navigation.goBack();
  };

  const handleShowAlert = () => {
    setShowAlertConfirmation(true);
  };

  const handleCloseAlert = () => {
    setShowAlertConfirmation(false);
  };

  const handleCloseAlertConfirmation = () => {
    setShowAlertConfirmation(false);
    navigation.navigate('PersonalLoanGurantee', { signatureFile: base64Data, personalLoan: personalLoan });
  };

  return (
    <View style={{ flex: 1, marginTop: 150 }}>
      <View style={{ height: '50%', backgroundColor: 'white', margin: 30, padding: 20, position: 'relative' }}>
        <TouchableOpacity onPress={handleSignature} style={{ position: 'absolute', top: 10, right: 10 }}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <Svg
          ref={svgRef}
          height="100%"
          width="100%"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Path d={path} stroke="black" strokeWidth={2} fill="none" />
        </Svg>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
        <ButtonComponent title="Clear" onPress={clearSignature} style={{ width: '25%', height: 50 }} />
        <ButtonComponent title="Done" onPress={captureSignature} style={{ width: '25%', height: 50 }} />
      </View>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="black" />
        </View>
      )}
      <CustomAlert
          visible={showAlert}
          onClose={handleCloseAlert}
          onConfirm={handleCloseAlertConfirmation}
          headerMessage="Signature"
          message="Signature Captutred Successfully"
          Button1="Cancel"
          Button2="OK"
          style={styles.alertStyle}
          modalHeaderStyle={[styles.modalheaderStyle, {right: 90}]}
          textStyle={styles.textStyle}
        />
    </View>
  );
};

const styles = StyleSheet.create({
 
});

export default Gurantee1SignaturePersonal ;
