import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from './CustomAlert';

const CardImageSignature = ({ title, setImageContent, navigation, pickImage }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [signatureDrawn, setSignatureDrawn] = useState(false);
  const [showAlert, setShowAlertConfirmation] = useState(false);

  useEffect(() => {
    setModalVisible(false);
  }, [title]);

  const onViewImage = () => {
    setModalVisible(!modalVisible); // Toggle modal visibility
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const takePictureWithCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!result.cancelled) {
        setImageContent({ fileName: result.uri.split('/').pop(), fileContent: result.base64 });
        await AsyncStorage.setItem('selectedImage', JSON.stringify({ fileName: result.uri.split('/').pop(), fileContent: result.base64 }));
        // Alert.alert(
        //   'Signature Captured Successfully',
        //   'The image has been successfully picked',
        //   [
        //     { text: 'OK', onPress: closeModal }
        //   ]
        // );
        handleShowAlert();
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const handleShowAlert = () => {
    setShowAlertConfirmation(true);
  };

  const handleCloseAlert = () => {
    setShowAlertConfirmation(false);
  };

  const handleCloseAlertConfirmation = () => {
    setShowAlertConfirmation(false);
    closeModal();
  };

  return (
    <View style={{ flexDirection: 'row', marginTop: 15, alignContent: 'space-around', width: '26%' }}>
      <Text style={{ textAlign: 'center', width: 100 }}>{title}</Text>
      <TouchableOpacity onPress={onViewImage} style={{ backgroundColor: 'red', padding: 5, borderRadius: 25, width: 90, top: -12 }}>
        <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Upload</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View>
              <TouchableOpacity onPress={(pickImage)} style={styles.optionButton}>
                <Text style={styles.optionButtonText}>Capture</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={takePictureWithCamera} style={styles.optionButton}>
              <Text style={styles.optionButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={[styles.optionButton, { backgroundColor: 'gray' }]}>
              <Text style={styles.optionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <CustomAlert
        visible={showAlert}
        onClose={handleCloseAlert}
        onConfirm={handleCloseAlertConfirmation}
        headerMessage="Signature"
        message="Signature Captutred Successfully"
        Button1="Cancel"
        Button2="OK"
        style={styles.alertStyle}
        modalHeaderStyle={[styles.modalheaderStyle, { right: 90 }]}
        textStyle={styles.textStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  optionButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 25,
    width: 200,
    marginBottom: 10,
  },
  optionButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CardImageSignature;
