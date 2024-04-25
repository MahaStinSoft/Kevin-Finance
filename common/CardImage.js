import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from './CustomAlert';

const CardImage = ({ title, imageContent, setImageContent, style }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertInvalidUser, setShowAlertInvalidUser] = useState(false);

  const saveImageToStorage = async (image) => {
    try {
      await AsyncStorage.setItem(`${title}_image`, JSON.stringify(image));
    } catch (error) {
      console.error('Error saving image to storage:', error);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert(
            'Permission required',
            'Please allow access to your photo library to pick an image.',
            [
              { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() }
            ]
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
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
        //   `${title}`, // Title message based on 'title' prop
        //   'The image has been successfully picked',
        //   [{ text: 'OK', onPress: closeModal }]
        // );
        handledShowInvalidAlert();
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
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

        Alert.alert(
          `${title}`, // Title message based on 'title' prop
          'The image has been successfully picked',
          [{ text: 'OK', onPress: closeModal }]
        );
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const handledShowInvalidAlert = () => {
    setShowAlertInvalidUser(true);
  }

  const handledCloseInvalidAlert = () => {
    setShowAlertInvalidUser(false);
  }

  const handledCloseModal = () => {
    setShowAlertInvalidUser(false); // Close the custom alert
    closeModal(); // Close the modal
  };

  const onViewImage = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flexDirection: 'row', marginTop: 15, alignContent: 'space-around', width: '26%' }}>
      <Text style={{ textAlign: 'center', width: 100 }}>{title}</Text>
      <TouchableOpacity onPress={onViewImage} style={{ backgroundColor: 'red', padding: 4, borderRadius: 25, width: 90, top: -4 }}>
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
            <TouchableOpacity onPress={pickImage} style={styles.optionButton}>
              <Text style={styles.optionButtonText}>Gallery</Text>
            </TouchableOpacity>
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
        visible={showAlertInvalidUser} 
        onClose={handledCloseInvalidAlert}
        onConfirm={handledCloseModal}
        headerMessage={title}
        message="Image Uploaded successfully"
        Button1="Cancel"
        Button2="OK"
        style={styles.alertStyle}
        modalHeaderStyle={[styles.modalheaderStyle, { right: 85 }]}
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
  alertStyle: {
    width: "80%",
  },
  modalheaderStyle: {
    right: 85
  },
});

export default CardImage;

