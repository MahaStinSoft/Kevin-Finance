import React, { useState, useEffect } from 'react';
import { View, TextInput, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import the close icon from your icon library

const LoanStatusPicker = ({ onOptionChange, title, options, initialOption, style }) => {
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
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextInput
          placeholder={title || 'Select option'}
          value={selectedOption}
          editable={false}
          style={[styles.textInputContainer, style]} 
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeIconContainer}>
              <Ionicons name="close" size={24} color="red" />
            </TouchableOpacity>
            {options.map((option, index) => (
              <View key={option} style={styles.optionContainer}>
                <TouchableOpacity onPress={() => handleOptionSelect(option)}>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
                {index < options.length - 1 && <View style={styles.separator} />}
              </View>
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
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '70%', 
  },
  optionContainer: {
    marginBottom: 10,
  },
  optionText: {
    color: 'black',
    marginLeft: 10
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginVertical: 5,
  },
  closeIconContainer: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
});

export default LoanStatusPicker;
