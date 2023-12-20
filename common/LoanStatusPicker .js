import React, { useState, useEffect } from 'react';
import { View, TextInput, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';

const LoanStatusPicker = ({ onOptionChange, title, options, initialOption }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(initialOption || '');

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setModalVisible(false);
    onOptionChange(option);
  };

  // Update selected option when initialOption prop changes
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
          style={ styles.textInputContainer}
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
            {options.map((option) => (
              <TouchableOpacity key={option} onPress={() => handleOptionSelect(option)}>
                <Text style={{ color: 'black' }}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'red', marginTop: 10 }}>Cancel</Text>
            </TouchableOpacity>
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
      color: "black"
    },
  });

export default LoanStatusPicker;

