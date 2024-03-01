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
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CardImage = ({ title, imageContent, pickImage,  takePictureWithCamera,setModalVisible }) => {
    const [modalVisible, setModalVisibleState] = useState(false);
  
    const closeModal = () => {
      setModalVisibleState(false);
    };
  
    const onViewImage = () => {
      setModalVisibleState(true);
      // Other logic for viewing the image
    };
  return (
    <View style={{ flexDirection: 'row', marginTop: 15, alignContent: 'space-around' }}>
      <View style={{ marginHorizontal: 10,width: 140 }}>
        <Text>{title} Image</Text>
      </View>
      <View style={{}}>
        {imageContent.fileContent && (
          <>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.imageContainer}>
                    <Image
                      style={{ width: 340, height: 340, objectFit: 'fill' }}
                      source={{
                        uri: `data:image/jpeg;base64,${imageContent.fileContent}`,
                      }}
                    />
                    <TouchableOpacity onPress={closeModal} style={styles.closeIconContainer}>
                      <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>
      <>
        <TouchableOpacity onPress={pickImage} style={{ backgroundColor: 'red', marginRight: 20, padding: 10, borderRadius: 25, width: 80, marginLeft: -15 }}>
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePictureWithCamera} style={{ backgroundColor: 'red', marginRight: 20, padding: 10, borderRadius: 25, width: 80, marginLeft: -15 }}>
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Camera</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          disabled={!imageContent.fileContent}
          onPress={() => {
            setModalVisible(true);
            onViewImage();
          }}
          style={{
            backgroundColor: imageContent.fileContent ? 'red' : 'gray', // Change color based on file content
            padding: 10,
            borderRadius: 25,
            marginLeft: -15 ,
            width: 80,
          }}
        >
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>View</Text>
        </TouchableOpacity> */}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: -1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    height: '100%',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
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
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
});

export default CardImage;
