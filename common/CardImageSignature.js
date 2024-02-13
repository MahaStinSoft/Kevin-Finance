// CardImageSignature.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CardImageSignature = ({ title, signatureImage, setSignatureImage, pickImage }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const onViewImage = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flexDirection: 'row', marginTop: 15, alignContent: 'space-around' }}>
      <View style={{ marginHorizontal: 25, width: 140 }}>
        <Text>{title} Image</Text>
      </View>
      <TouchableOpacity onPress={pickImage} style={{ backgroundColor: 'red', marginRight: 20, padding: 10, borderRadius: 25, width: 85, marginLeft: -10 }}>
        <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{title}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onViewImage} style={{ backgroundColor: signatureImage ? 'red' : 'gray', marginRight: 20, padding: 10, borderRadius: 25, width: 80 }}>
        <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>View</Text>
      </TouchableOpacity>
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
                style={{ width: 340, height: 340, objectFit: 'fill' }}
                source={{ uri: signatureImage }}
              />
              <TouchableOpacity onPress={closeModal} style={styles.closeIconContainer}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    backgroundColor:'white'
  },
  imageContainer: {
    position: 'relative',
    objectFit: 'cover',
  },
  closeIconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 5,
    position: 'absolute',
    top: '6%',
    right: '-2%',
  },
});

export default CardImageSignature;
