import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';

const RenderAnnotation = ({ annotations, filteredAnnotations, showImage, handleViewImages }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const onViewImage = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  const renderAnnotationItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => onViewImage(`data:image/png;base64,${item.documentbody}`)}>
        <View style={styles.annotation}>
          <Text>Subject: {item.subject}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{backgroundColor:"white", flex: 1, width: "90%", marginTop: 10}}>
      <Text style={styles.heading}>Images</Text>
      {annotations && annotations.length > 0 ? (
        <FlatList
          data={filteredAnnotations}
          renderItem={renderAnnotationItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={{textAlign: "center", marginBottom: 15}}>No annotations to display</Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image
                style={{ width: 250, height: 250, objectFit: 'fill' }}
                source={{ uri: selectedImage }}
              />
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeIconContainer}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: "center"
  },
  annotation: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeIconContainer: {
    marginTop: 20,
  },
  closeButtonText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default RenderAnnotation ;