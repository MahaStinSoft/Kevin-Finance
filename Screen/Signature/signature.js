// import React, { useState, useEffect, useRef } from 'react';
// import { View, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import Svg, { Path } from 'react-native-svg';
// import { captureRef } from 'react-native-view-shot';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CardImageSignature from '../../common/CardImageSignature';
// import ButtonComponent from '../../common/ButtonComponent';

// const SignatureScreen = ({ route, navigation }) => {
//   const { loanApplication } = route.params || {};
//   const [path, setPath] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [signatureImage, setSignatureImage] = useState(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const svgRef = useRef(null);

//   useEffect(() => {
//     loadStoredPath();
//   }, []);

//   useEffect(() => {
//     return () => clearStoredPath();
//   }, []);

//   const loadStoredPath = async () => {
//     try {
//       const storedPath = await AsyncStorage.getItem('signaturePath');
//       if (storedPath) {
//         setPath(storedPath);
//       }
//     } catch (error) {
//       console.error('Error loading stored path:', error);
//     }
//   };

//   const storePath = async () => {
//     try {
//       await AsyncStorage.setItem('signaturePath', path);
//     } catch (error) {
//       console.error('Error storing path:', error);
//     }
//   };

//   const clearStoredPath = async () => {
//     try {
//       await AsyncStorage.removeItem('signaturePath');
//     } catch (error) {
//       console.error('Error clearing stored path:', error);
//     }
//   };

//   const handleTouchStart = (event) => {
//     const { nativeEvent } = event;
//     const { locationX, locationY } = nativeEvent;

//     if (!isDrawing) {
//       setPath((prevPath) => `${prevPath} M${locationX},${locationY}`);
//     }

//     setIsDrawing(true);
//   };

//   const handleTouchMove = (event) => {
//     if (!isDrawing) return;
//     const { nativeEvent } = event;
//     const { locationX, locationY } = nativeEvent;
//     const newPath = `${path} L${locationX},${locationY}`;
//     setPath(newPath);
//   };

//   const handleTouchEnd = () => {
//     setIsDrawing(false);
//     storePath();
//   };

//   const clearSignature = () => {
//     setPath('');
//     setSignatureImage(null);
//     clearStoredPath();
//   };

//   const captureSignature = async () => {
//     try {
//       const base64Data = await captureRef(svgRef, {
//         format: 'png',
//         quality: 1,
//         result: 'base64',
//       });

//       if (!base64Data) {
//         console.error('Captured base64 data is undefined');
//         return;
//       }

//       setSignatureImage(base64Data);
//       await AsyncStorage.setItem('signaturefile', base64Data);
//       Alert.alert(
//         'Image Picked Successfully',
//         'The image has been successfully picked',
//         [
//           { text: 'OK'}
//         ]
//       );
//       navigation.navigate('EditHomeLoan', { signatureImage: base64Data, loanApplication: loanApplication });
//     } catch (error) {
//       console.error('Error capturing signature:', error);
//     }
//   };

//   const handleModalClose = () => {
//     setModalVisible(false);
//   };

//   return (
//     <View style={{ flex: 1, marginTop: 150 }}>
//       <View style={{ height: '50%', backgroundColor: 'white', margin: 30, padding: 20, position: 'relative' }}>
//         <TouchableOpacity onPress={() => setModalVisible(true)} style={{ position: 'absolute', top: 10, right: 10 }}>
//           <Ionicons name="close" size={24} color="black" />
//         </TouchableOpacity>
//         <Svg
//           ref={svgRef}
//           height="100%"
//           width="100%"
//           onTouchStart={handleTouchStart}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//         >
//           <Path d={path} stroke="black" strokeWidth={2} fill="none" />
//         </Svg>
//       </View>
//       <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
//         <ButtonComponent title="Clear" onPress={clearSignature} style={{ width: '25%', height: 50 }} />
//         <ButtonComponent title="Done" onPress={captureSignature} style={{ width: '25%', height: 50 }} />
//       </View>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={handleModalClose}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <CardImageSignature
//               title="Upload Signature"
//               setImageContent={() => {}} // Placeholder function, as setImageContent is not needed in this modal
//               navigation={navigation}
//               closeModal={handleModalClose} // Pass a function to close the modal
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardImageSignature from '../../common/CardImageSignature';
import ButtonComponent from '../../common/ButtonComponent';

const SignatureScreen = ({ route, navigation }) => {
  const { loanApplication } = route.params || {};
  const [path, setPath] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const svgRef = useRef(null);

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
    storePath();
  };

  const clearSignature = () => {
    setPath('');
    setSignatureImage(null);
    clearStoredPath();
  };

  const captureSignature = async () => {
    try {
      setIsLoading(true); // Start loading indicator
      const base64Data = await captureRef(svgRef, {
        format: 'png',
        quality: 1,
        result: 'base64',
      });

      if (!base64Data) {
        console.error('Captured base64 data is undefined');
        return;
      }

      setSignatureImage(base64Data);
      await AsyncStorage.setItem('signaturefile', base64Data);
      // setIsLoading(false); // Stop loading indicator
      // Alert.alert(
      //   'Image Picked Successfully',
      //   'The image has been successfully picked',
      //   [
      //     { text: 'OK'}
      //   ]
      // );
      // navigation.navigate('EditHomeLoan', { signatureImage: base64Data, loanApplication: loanApplication });
      setTimeout(() => {
        setIsLoading(false); // Stop loading indicator
        Alert.alert(
          'Image Picked Successfully',
          'The image has been successfully picked',
          [
            { text: 'OK'}
          ]
        );
        navigation.navigate('EditHomeLoan', { signatureImage: base64Data, loanApplication: loanApplication });
      }, 6000);
    } catch (error) {
      setIsLoading(false); // Stop loading indicator
      console.error('Error capturing signature:', error);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, marginTop: 150 }}>
      <View style={{ height: '50%', backgroundColor: 'white', margin: 30, padding: 20, position: 'relative' }}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ position: 'absolute', top: 10, right: 10 }}>
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
        <ButtonComponent title="Save" onPress={captureSignature} style={{ width: '25%', height: 50 }} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <CardImageSignature
              title="Upload Signature"
              setImageContent={() => {}} // Placeholder function, as setImageContent is not needed in this modal
              navigation={navigation}
              closeModal={handleModalClose} // Pass a function to close the modal
            />
          </View>
        </View>
      </Modal>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="black" />
        </View>
      )}
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
});

export default SignatureScreen;
