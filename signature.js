import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import ButtonComponent from './common/ButtonComponent';

const SignatureScreen = () => {
  const [path, setPath] = useState('');
  const [signatureImage, setSignatureImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const svgRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Load previously stored path if available
    loadStoredPath();
  }, []);

  useEffect(() => {
    // Clear path when component unmounts
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
    const newPath = `M${locationX},${locationY}`;
    setPath(newPath);
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
    setSignatureImage(null);
    // Clear stored path when signature is cleared
    clearStoredPath();
  };

  const captureSignature = async () => {
    try {
      const uri = await captureRef(svgRef, {
        format: 'png',
        quality: 1,
      });
      setSignatureImage(uri);
      navigation.navigate('HomeLoan', { signatureImage: uri });
    } catch (error) {
      console.error('Error capturing signature:', error);
    }
  };

  const handleSignature = () => {
    navigation.goBack();
  }

  return (
    <View style={{ flex: 1, marginTop: 150 }}>
      <View style={{ height: '50%', backgroundColor: 'white', margin: 30, padding: 20, position: 'relative'  }}>
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
        <ButtonComponent title="Clear" onPress={clearSignature} style={{width: "25%", height: 50}} />
        <ButtonComponent title="Done" onPress={captureSignature} style={{width: "25%", height: 50}} />
      </View>
      {signatureImage && (
        <View style={{ alignSelf: 'center', backgroundColor: 'white', width: '50%' }}>

          <Image
            source={{ uri: signatureImage }}
            style={{ width: 50, height: 50, objectFit: 'fill', alignSelf: 'center' }}
          />
        </View>
      )}
    </View>
  );
};

export default SignatureScreen;
