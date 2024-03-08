import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';

const Gurantee1Annotation = ({ annotations, filteredAnnotations, showImage, handleViewImages }) => {
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

  // Function to get the latest annotation for a given subject
  const getLatestAnnotation = (subject) => {
    return filteredAnnotations
      .filter(annotation => annotation.subject === subject)
      .reduce((latest, current) => (latest && latest.createdon > current.createdon ? latest : current), null);
  };

  const latestHG1AadharAnnotation = getLatestAnnotation('Guarantee1 AadharCard Image');
  const latestHG1PanAnnotation = getLatestAnnotation('Guarantee1 PanCard Image');
  const latestHG1AppicantAnnotation = getLatestAnnotation('Guarantee1 Applicant Image');
  const latestHG1SignatureAnnotation = getLatestAnnotation('Gurantee1 Signature Image'); 

  return (
    <View style={{ backgroundColor: "white", flex: 1, width: "100%", marginTop: 10 }}>
      <Text style={styles.heading}>Images</Text>
      {latestHG1AadharAnnotation ? (
        <TouchableOpacity onPress={() => onViewImage(`data:image/png;base64,${latestHG1AadharAnnotation.documentbody}`)}>
          <View style={styles.annotation}>
            <Text>Subject: {latestHG1AadharAnnotation.subject}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <Text style={{ textAlign: "center", marginBottom: 15 }}>No AadharCard Image to display</Text>
      )}
      {latestHG1PanAnnotation ? (
        <TouchableOpacity onPress={() => onViewImage(`data:image/png;base64,${latestHG1PanAnnotation.documentbody}`)}>
          <View style={styles.annotation}>
            <Text>Subject: {latestHG1PanAnnotation.subject}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <Text style={{ textAlign: "center", marginBottom: 15 }}>No PanCard Image to display</Text>
      )}
      {latestHG1AppicantAnnotation ? (
        <TouchableOpacity onPress={() => onViewImage(`data:image/png;base64,${latestHG1AppicantAnnotation.documentbody}`)}>
          <View style={styles.annotation}>
            <Text>Subject: {latestHG1AppicantAnnotation.subject}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <Text style={{ textAlign: "center", marginBottom: 15 }}>No Applicant Image to display</Text>
      )}
      {latestHG1SignatureAnnotation ? (
        <TouchableOpacity onPress={() => onViewImage(`data:image/png;base64,${latestHG1SignatureAnnotation.documentbody}`)}>
          <View style={styles.annotation}>
            <Text>Subject: {latestHG1SignatureAnnotation.subject}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <Text style={{ textAlign: "center", marginBottom: 15 }}>No Signature Image to display</Text>
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

export default Gurantee1Annotation;

