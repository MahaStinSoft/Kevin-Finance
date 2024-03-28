// // CardImageSignature.js

// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const CardImageSignature = ({ title, imageContent, setSignatureImage, pickImage }) => {
//   const [modalVisible, setModalVisible] = useState(false);

//   const onViewImage = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   return (
//     <View style={{ flexDirection: 'row', marginTop: 15, alignContent: 'space-around' }}>
//       <View style={{ marginHorizontal: 10, width: 140 }}>
//         <Text>{title}</Text>
//       </View>
//       <TouchableOpacity onPress={pickImage} style={{ backgroundColor: 'red', marginRight: 20, padding: 10, borderRadius: 25, width: 80, marginLeft: -10 }}>
//         <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Click</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={onViewImage} style={{ backgroundColor: imageContent ? 'red' : 'gray', padding: 10, borderRadius: 25, width: 80 }}>
//         <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>View</Text>
//       </TouchableOpacity>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <View style={styles.imageContainer}>
//               <Image
//                 style={{ width: 340, height: 340, objectFit: 'fill' }}
//                 source={{ uri: imageContent }}
//               />
//               <TouchableOpacity onPress={closeModal} style={styles.closeIconContainer}>
//                 <Ionicons name="close" size={28} color="white" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//   },
//   modalContent: {
//     padding: 20,
//     borderRadius: 10,
//     backgroundColor:'white'
//   },
//   imageContainer: {
//     position: 'relative',
//     objectFit: 'cover',
//   },
//   closeIconContainer: {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     borderRadius: 20,
//     padding: 5,
//     position: 'absolute',
//     top: '6%',
//     right: '-2%',
//   },
// });

// export default CardImageSignature;




// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const CardImageSignature = ({ title, imageContent, pickImage }) => {
//   const [modalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     const loadModalVisibility = async () => {
//       try {
//         const visibility = await AsyncStorage.getItem('modalVisibility');
//         if (visibility) {
//           setModalVisible(JSON.parse(visibility));
//         }
//       } catch (error) {
//         console.error('Error loading modal visibility:', error);
//       }
//     };

//     loadModalVisibility();
//   }, []);

//   useEffect(() => {
//     const saveModalVisibility = async () => {
//       try {
//         await AsyncStorage.setItem('modalVisibility', JSON.stringify(modalVisible));
//       } catch (error) {
//         console.error('Error saving modal visibility:', error);
//       }
//     };

//     saveModalVisibility();
//   }, [modalVisible]);

//   const onViewImage = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   return (
//     <View style={{ flexDirection: 'row', marginTop: 15, alignContent: 'space-around' }}>
//       <View style={{ marginHorizontal: 10, width: 140 }}>
//         <Text>{title}</Text>
//       </View>
//       <TouchableOpacity onPress={pickImage} style={{ backgroundColor: 'red', padding: 10, borderRadius: 25, width: 85, marginLeft: -10, height: 30, marginTop: -5 }}>
//         <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', marginVertical: -7 }}>Click</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={onViewImage} style={{ backgroundColor: 'red', padding: 10, borderRadius: 25, width: 85, marginLeft: 15, height: 30, marginTop: -5 }}>
//         <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', marginVertical: -7 }}>View</Text>
//       </TouchableOpacity>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <View style={styles.imageContainer}>
//               <Image
//                 style={{ width: 340, height: 340, objectFit: 'fill' }}
//                 source={{ uri: imageContent }}
//               />
//               <TouchableOpacity onPress={closeModal} style={styles.closeIconContainer}>
//                 <Ionicons name="close" size={28} color="white" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//   },
//   modalContent: {
//     padding: 20,
//     borderRadius: 10,
//     backgroundColor: 'white'
//   },
//   imageContainer: {
//     position: 'relative',
//     objectFit: 'cover',
//   },
//   closeIconContainer: {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     borderRadius: 20,
//     padding: 5,
//     position: 'absolute',
//     top: '6%',
//     right: '-2%',
//   },
// });

// export default CardImageSignature;






// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const CardImageSignature = ({ title, imageContent, pickImage, sendAnnotation }) => {
//   const [modalVisible, setModalVisible] = useState(false);

//   const onViewImage = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   const confirmAnnotation = () => {
//     sendAnnotation(); // Call the sendAnnotation function passed as a prop
//     closeModal(); // Close the modal after confirmation
//   };

//   const takePictureWithCamera = async () => {
//     try {
//       const result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//         base64: true,
//       });

//       if (!result.cancelled) {
//         setImageContent({ fileName: result.uri.split('/').pop(), fileContent: result.base64 });
//         await AsyncStorage.setItem('selectedImage', JSON.stringify({ fileName: result.uri.split('/').pop(), fileContent: result.base64 }));
//       }
//     } catch (error) {
//       console.error('Error taking picture:', error);
//     }
//   };

//   return (
//     <View style={{ flexDirection: 'row', marginTop: 15, alignContent: 'space-around' }}>
//       <View style={{ marginHorizontal: 15, width: 140 }}>
//         {/* <Text>{title}</Text> */}
//         <View style={styles.noRecordsContainer}>
//           <Text style={styles.noRecordsText}>{title}</Text>
//         </View>
//       </View>
//       <TouchableOpacity onPress={pickImage} style={{ backgroundColor: 'red', padding: 10, borderRadius: 25, width: 85, marginLeft: -25, height: 30, marginTop: -5 }}>
//         <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', marginVertical: -7 }}>Capture</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={takePictureWithCamera} style={{ backgroundColor: 'red', padding: 10, borderRadius: 25, width: 85, marginLeft: 15, height: 30, marginTop: -5 }}>
//           <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', marginVertical: -7 }}>Camera</Text>
//         </TouchableOpacity>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <View style={styles.imageContainer}>
//               <Image
//                 style={{ width: 340, height: 340, objectFit: 'fill' }}
//                 source={{ uri: imageContent }}
//               />
//               <TouchableOpacity onPress={closeModal} style={styles.closeIconContainer}>
//                 <Ionicons name="close" size={28} color="white" />
//               </TouchableOpacity>
//               <TouchableOpacity onPress={confirmAnnotation} style={styles.confirmButton}>
//                 <Text style={styles.confirmButtonText}>Confirm</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//   },
//   modalContent: {
//     padding: 20,
//     borderRadius: 10,
//     backgroundColor: 'white'
//   },
//   imageContainer: {
//     position: 'relative',
//     objectFit: 'cover',
//   },
//   closeIconContainer: {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     borderRadius: 20,
//     padding: 5,
//     position: 'absolute',
//     top: '6%',
//     right: '-2%',
//   },
//   confirmButton: {
//     position: 'absolute',
//     bottom: 10,
//     alignSelf: 'center',
//     backgroundColor: 'green',
//     padding: 10,
//     borderRadius: 10,
//   },
//   confirmButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   noRecordsContainer: {
//     paddingVertical: 10,
//     marginRight: 35, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//   },
//   noRecordsText: {
//     color: '#0000cc', 
//     fontSize: 14,
//     fontWeight: 'bold',
//     textAlign: 'center', 
//   },
// });

// export default CardImageSignature;







// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Alert, Linking } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const CardImageSignature = ({ title, imageContent, pickImage, sendAnnotation,setImageContent }) => {
//   const [modalVisible, setModalVisible] = useState(false);

//   const onViewImage = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   const confirmAnnotation = () => {
//     sendAnnotation(); // Call the sendAnnotation function passed as a prop
//     closeModal(); // Close the modal after confirmation
//   };

//   const takePictureWithCamera = async () => {
//     try {
//       const result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//         base64: true,
//       });

//       if (!result.cancelled) {
//         setImageContent({ fileName: result.uri.split('/').pop(), fileContent: result.base64 });
//         await AsyncStorage.setItem('selectedImage', JSON.stringify({ fileName: result.uri.split('/').pop(), fileContent: result.base64 }));
//         Alert.alert(
//           'Imaged Picked Successfully',
//           'The image has been successfully picked',
//           [
//             { text: 'OK', onPress :(closeModal) }
//           ]
//         );
//       }
//     } catch (error) {
//       console.error('Error taking picture:', error);
//     }
//   };

//   return (
//     <View style={{ flexDirection: 'row', marginTop: 15, alignContent: 'space-around',width: '26%'}}>
//     <Text style={{ textAlign: 'center',width: 100}}>{title}</Text>
//     <TouchableOpacity onPress={onViewImage} style={{ backgroundColor: 'red', padding: 5, borderRadius: 25, width: 90,top: -7}}>
//       <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Upload</Text>
//     </TouchableOpacity>
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={modalVisible}
//       onRequestClose={closeModal}
//     >
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <View>
//           <TouchableOpacity onPress={pickImage} style={styles.optionButton}>
//             <Text style={styles.optionButtonText}>capture</Text>
//           </TouchableOpacity>
//           </View>
//           <TouchableOpacity onPress={takePictureWithCamera} style={styles.optionButton}>
//             <Text style={styles.optionButtonText}>Camera</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={closeModal} style={[styles.optionButton, { backgroundColor: 'gray' }]}>
//             <Text style={styles.optionButtonText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 20,
//     alignItems: 'center',
//     elevation: 5,
//   },
//   optionButton: {
//     backgroundColor: 'red',
//     padding: 10,
//     borderRadius: 25,
//     width: 200,
//     marginBottom: 10,
//   },
//   optionButtonText: {
//     textAlign: 'center',
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default CardImageSignature;



import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CardImageSignature = ({ title, setImageContent, navigation, pickImage }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [signatureDrawn, setSignatureDrawn] = useState(false);

  useEffect(() => {
    // Reset modal state when the component re-renders
    setModalVisible(false);
  }, [title]); // Assuming title is a prop that changes when the component should reset

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
        Alert.alert(
          'Signature Captured Successfully',
          'The image has been successfully picked',
          [
            { text: 'OK', onPress: closeModal }
          ]
        );
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
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
