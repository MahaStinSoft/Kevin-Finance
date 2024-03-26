// import React, { useState, useEffect } from 'react';
// import { View, TextInput, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons'; // Import the close icon from your icon library

// const LoanStatusPicker = ({ onOptionChange, title, options, initialOption, style }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(initialOption || '');

//   const handleOptionSelect = (option) => {
//     setSelectedOption(option);
//     setModalVisible(false);
//     onOptionChange(option);
//   };

//   useEffect(() => {
//     setSelectedOption(initialOption || '');
//   }, [initialOption]);

//   return (
//     <View>
//       <TouchableOpacity onPress={() => setModalVisible(true)}>
//         <TextInput
//           placeholder={title || 'Select option'}
//           value={selectedOption}
//           editable={false}
//           style={[styles.textInputContainer, style]} 
//         />
//       </TouchableOpacity>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//           <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeIconContainer}>
//               <Ionicons name="close" size={24} color="red" />
//             </TouchableOpacity>
//             {options.map((option, index) => (
//               <View key={option} style={styles.optionContainer}>
//                 <TouchableOpacity onPress={() => handleOptionSelect(option)}>
//                   <Text style={styles.optionText}>{option}</Text>
//                 </TouchableOpacity>
//                 {index < options.length - 1 && <View style={styles.separator} />}
//               </View>
//             ))}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   textInputContainer: {
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     borderRadius: 8,
//     backgroundColor: '#FBFCFC',
//     padding: 10,
//     marginHorizontal: 20,
//     marginTop: 15,
//     marginBottom: 5,
//     color: 'black',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     elevation: 5,
//     width: '70%', 
//   },
//   optionContainer: {
//     marginBottom: 10,
//   },
//   optionText: {
//     color: 'black',
//     marginLeft: 10
//   },
//   separator: {
//     borderBottomWidth: 1,
//     borderBottomColor: 'gray',
//     marginVertical: 5,
//   },
//   closeIconContainer: {
//     alignSelf: 'flex-end',
//     marginTop: 10,
//   },
// });

// export default LoanStatusPicker;





import React, { useState, useEffect } from 'react';
import { View, TextInput, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import the close icon from your icon library

const LoanStatusPicker = ({ onOptionChange, title, options, initialOption, style, disabled, Optiontitle }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(initialOption || '');

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setModalVisible(false);
    onOptionChange(option);
  };

  useEffect(() => {
    setSelectedOption(initialOption || '');
  }, [initialOption]);

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(!disabled)}>
        <TextInput
          placeholder={title || 'Select option'}
          value={selectedOption}
          editable={false}
          style={[styles.textInputContainer, style, disabled && styles.disabled]} 
        />
      </TouchableOpacity>

      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible && !disabled}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeIconContainer}>
        <Ionicons name="close" size={24} color="red" />
      </TouchableOpacity>
      <Text style={[styles.modalHeading, {textAlign: "center"}]}>{Optiontitle}</Text>
      {options.map((option, index) => (
        <TouchableOpacity key={option} onPress={() => handleOptionSelect(option)} style={styles.optionButton}>
          <Text style={styles.optionText}>{option}</Text>
          {index < options.length - 1 && <View style={styles.separator} />}
        </TouchableOpacity>
      ))}
    </View>
  </View>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 8,
    backgroundColor: '#FBFCFC',
    padding: 10,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 5,
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 40
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '70%', 
    // height: "30%"
  },
  optionButton: {
    backgroundColor: '#ffb3b3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: "70%", 
    borderColor: "red",
    borderWidth: 1,
    alignSelf: "center"
  },
  optionText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    // borderBottomWidth: 1,
    // borderBottomColor: 'gray',
    // marginVertical: 5,
  },
  closeIconContainer: {
    alignSelf: 'flex-end',
    top: -5,
    right: -2
  },
  disabled: {
    backgroundColor: '#ccc',
    // Additional styles for disabled state if needed
  },
});

export default LoanStatusPicker;

