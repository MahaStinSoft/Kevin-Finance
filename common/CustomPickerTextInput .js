import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';

const CustomPicker = ({
    options,
    selectedValue,
    onValueChange,
    placeholder = 'Select an option',
    containerStyle,
    selectedStyle,
    modalStyle,
    optionStyle,
    closeTextStyle,
    // placeholderTextColor = 'red '
  }) => {
    const [modalVisible, setModalVisible] = useState(false);
  
    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={[styles.optionItem, optionStyle]}
        onPress={() => {
          onValueChange(item.value);
          setModalVisible(false);
        }}
      >
        <Text>{item.label}</Text>
      </TouchableOpacity>
    );
  
    return (
      <View style={[styles.container, containerStyle]}>
        <TouchableOpacity
          style={[styles.selectedOption, selectedStyle]}
          onPress={() => setModalVisible(true)}
            >
                <Text style={{ color: selectedValue ? 'black' : "gray" }}>
                    {selectedValue || placeholder}
                </Text>        
                </TouchableOpacity>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, modalStyle]}>
            <FlatList
              data={options}
              renderItem={renderItem}
              keyExtractor={(item) => item.value.toString()}
            />
            <TouchableOpacity
              style={[styles.closeButton, closeTextStyle]}
              onPress={() => setModalVisible(false)}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
          </View>
        </Modal>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        alignItems: 'center', 
        justifyContent: 'center', 
        marginHorizontal:  20,
      },
      selectedOption: {
        padding: 10,
        borderRadius: 5,
      },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        height: "35%"
      },
      optionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        height: 50,
        width: "100%"
      },
      closeButton: {
        backgroundColor: 'white',
        padding: 15,
        alignItems: 'center',
      },
    });
    
  export default CustomPicker;
