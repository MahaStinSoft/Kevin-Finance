// // CardImage.js
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const CardImage = ({ title, imageContent, pickImage, setModalVisible }) => {
//     const [modalVisible, setModalVisibleState] = useState(false);
  
//     const closeModal = () => {
//       setModalVisibleState(false);
//     };
  
//     const onViewImage = () => {
//       setModalVisibleState(true);
//       // Other logic for viewing the image
//     };
//   return (
//     <View style={{ flexDirection: 'row', marginTop: 15, alignContent: 'space-around' }}>
//       <View style={{ marginHorizontal: 10,width: 140 }}>
//         <Text>{title} Image</Text>
//       </View>
//       <View style={{}}>
//         {imageContent.fileContent && (
//           <>
//             <Modal
//               animationType="slide"
//               transparent={true}
//               visible={modalVisible}
//               onRequestClose={() => setModalVisible(false)}
//             >
//               <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                   <View style={styles.imageContainer}>
//                     <Image
//                       style={{ width: 340, height: 340, objectFit: 'fill' }}
//                       source={{
//                         uri: `data:image/jpeg;base64,${imageContent.fileContent}`,
//                       }}
//                     />
//                     <TouchableOpacity onPress={closeModal} style={styles.closeIconContainer}>
//                       <Ionicons name="close" size={28} color="white" />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             </Modal>
//           </>
//         )}
//       </View>
//       <>
//         <TouchableOpacity onPress={pickImage} style={{ backgroundColor: 'red', marginRight: 20, padding: 10, borderRadius: 25, width: 80, marginLeft: -10 }}>
//           <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Upload</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           disabled={!imageContent.fileContent}
//           onPress={() => {
//             setModalVisible(true);
//             onViewImage();
//           }}
//           style={{
//             backgroundColor: imageContent.fileContent ? 'red' : 'gray', // Change color based on file content
//             padding: 10,
//             borderRadius: 25,
//             width: 80,
//           }}
//         >
//           <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>View</Text>
//         </TouchableOpacity>
//       </>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: -1,
//     position: 'relative',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     height: '100%',
//   },
//   modalContent: {
//     padding: 20,
//     borderRadius: 10,
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
//     transform: [{ translateX: -12 }, { translateY: -12 }],
//   },
// });

// export default CardImage;





// CardImage.js
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const CardImage = ({ title, imageContent, pickImage,  takePictureWithCamera,setModalVisible }) => {
//     const [modalVisible, setModalVisibleState] = useState(false);
  
//     const closeModal = () => {
//       setModalVisibleState(false);
//     };
  
//     const onViewImage = () => {
//       setModalVisibleState(true);
//       // Other logic for viewing the image
//     };
//   return (
//     <View style={{ flexDirection: 'row', marginTop: 15, alignContent: 'space-around' }}>
//       <View style={{ marginHorizontal: 10,width: 140 }}>
//         <Text>{title} Image</Text>
//       </View>
//       <View style={{}}>
//         {imageContent.fileContent && (
//           <>
//             <Modal
//               animationType="slide"
//               transparent={true}
//               visible={modalVisible}
//               onRequestClose={() => setModalVisible(false)}
//             >
//               <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                   <View style={styles.imageContainer}>
//                     <Image
//                       style={{ width: 340, height: 340, objectFit: 'fill' }}
//                       source={{
//                         uri: `data:image/jpeg;base64,${imageContent.fileContent}`,
//                       }}
//                     />
//                     <TouchableOpacity onPress={closeModal} style={styles.closeIconContainer}>
//                       <Ionicons name="close" size={28} color="white" />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             </Modal>
//           </>
//         )}
//       </View>
//       <>
//         <TouchableOpacity onPress={pickImage} style={{ backgroundColor: 'red', marginRight: 20, padding: 10, borderRadius: 25, width: 80, marginLeft: -15 }}>
//           <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>gallery</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={takePictureWithCamera} style={{ backgroundColor: 'red', marginRight: 20, padding: 10, borderRadius: 25, width: 80, marginLeft: -15 }}>
//           <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Camera</Text>
//         </TouchableOpacity>
//       </>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: -1,
//     position: 'relative',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     height: '100%',
//   },
//   modalContent: {
//     padding: 20,
//     borderRadius: 10,
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
//     transform: [{ translateX: -12 }, { translateY: -12 }],
//   },
// });

// export default CardImage;



import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CardImage = ({ title, imageContent, setImageContent }) => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Load image content from AsyncStorage when component mounts
    const loadStoredImage = async () => {
      try {
        const storedImage = await AsyncStorage.getItem(`${title}_image`);
        if (storedImage) {
          setImageContent(JSON.parse(storedImage));
        }
      } catch (error) {
        console.error('Error loading image from storage:', error);
      }
    };
    loadStoredImage();
  }, [title, setImageContent]);

  const saveImageToStorage = async (image) => {
    try {
      await AsyncStorage.setItem(`${title}_image`, JSON.stringify(image));
    } catch (error) {
      console.error('Error saving image to storage:', error);
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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!result.cancelled) {
        setImageContent({ fileName: result.uri.split('/').pop(), fileContent: result.base64 });
        saveImageToStorage({ fileName: result.uri.split('/').pop(), fileContent: result.base64 });
      }
    } catch (error) {
      console.error('Error picking image:', error);
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
      <View style={{ marginHorizontal: 10, width: 140 }}>
        {/* <Text>{title} Image</Text> */}
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
        {/* <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePictureWithCamera} style={styles.button}>
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onViewImage} style={styles.button}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={pickImage} style={{ backgroundColor: 'red', padding: 10, borderRadius: 25, width: 85, marginLeft: -10, height: 30, marginTop: -5 }}>
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', marginVertical: -7 }}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePictureWithCamera} style={{ backgroundColor: 'red', padding: 10, borderRadius: 25, width: 85, marginLeft: 15, height: 30, marginTop: -5 }}>
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', marginVertical: -7 }}>Camera</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={onViewImage} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 25, width: 70, marginLeft: 5, height: 30 }}>
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', marginVertical: -7 }}>View</Text>
        </TouchableOpacity> */}

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
    padding: 20,
    borderRadius: 10,
    width: '85%',
    alignItems: 'center',
    height: 300
  },
  imageContainer: {
    position: 'relative',
    marginTop: 25
  },
  closeIconContainer: {
    position: 'absolute',
    top: -35,
    right: 20,
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 25,
    width: 70,
    height: 30,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    marginVertical: -7,
  },
});

export default CardImage;
