import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CardImage = ({ title, imageContent, setImageContent }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== 'granted') {
  //       Alert.alert(
  //         'Permission required',
  //         'Please allow access to your photo library to pick an image.',
  //         [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
  //       );
  //     }
  //   })();
  // }, []);

  const saveImageToStorage = async (image) => {
    try {
      await AsyncStorage.setItem(`${title}_image`, JSON.stringify(image));
    } catch (error) {
      console.error('Error saving image to storage:', error);
    }
  };

  // const pickImage = async () => {
  //   try {
  //     const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
  //     if (status !== 'granted') {
  //       const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //       if (newStatus !== 'granted') {
  //         Alert.alert(
  //           'Permission required',
  //           'Please allow access to your photo library to pick an image.',
  //           [
  //             { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
  //             { text: 'Open Settings', onPress: () => Linking.openSettings() } // Redirects user to app settings
  //           ]
  //         );
  //         return;
  //       }
  //     }

  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });

  //     if (!result.cancelled) {
  //       setImageContent({ fileName: result.uri.split('/').pop(), fileContent: result.base64 });
  //       saveImageToStorage({ fileName: result.uri.split('/').pop(), fileContent: result.base64 });
  //     }
  //   } catch (error) {
  //     console.error('Error picking image:', error);
  //   }
  // };


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
          }
        } catch (error) {
          console.error('Error taking picture:', error);
        }
      };

  const onViewImage = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flexDirection: 'row', marginTop: 15, alignContent: 'space-around' }}>
      <View style={{ marginHorizontal: 15, width: 140 }}>
        {/* <Text style={styles.titleText}>{title}</Text> */}
        <View style={styles.noRecordsContainer}>
          <Text style={styles.noRecordsText}>{title}</Text>
        </View>
      </View>
      <View style={{}}>
        {imageContent.fileContent && (
          <>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={closeModal}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.imageContainer}>
                    <Image
                      style={{ width: 340, height: 240, resizeMode: 'contain' }}
                      source={{ uri: `data:image/jpeg;base64,${imageContent.fileContent}` }}
                    />
                    <TouchableOpacity onPress={closeModal} style={styles.closeIconContainer}>
                      <Ionicons name="close" size={28} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <TouchableOpacity onPress={pickImage} style={{ backgroundColor: 'red', padding: 10, borderRadius: 25, width: 85, marginLeft: -25, height: 30, marginTop: 5 }}>
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', marginVertical: -7 }}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePictureWithCamera} style={{ backgroundColor: 'red', padding: 10, borderRadius: 25, width: 85, marginLeft: 15, height: 30, marginTop: 5 }}>
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', marginVertical: -7 }}>Camera</Text>
        </TouchableOpacity>
      </View>
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
  imageContainer: {
    position: 'relative',
  },
  closeIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  noRecordsContainer: {
    backgroundColor: '#FBFCFC', 
    borderRadius: 8,
    paddingVertical: 10,
    marginRight: 35, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  noRecordsText: {
    color: '#0000cc', 
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center', 
  },
});

export default CardImage;
