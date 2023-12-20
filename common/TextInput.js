import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { secondaryColor } from '../Screen/constant/color';

const TextInputComponent = (props) => {
  const { textInput, onChangeText, placeholder } = props;

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.textInputContainer}>
          <TextInput
            placeholder={placeholder}
            value={textInput}
            onChangeText={onChangeText}
            style={styles.textInput}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  userInfo: {
    backgroundColor: secondaryColor,
    marginHorizontal: 20,
    marginTop: 15
  },
  textInputContainer: {
    marginBottom: 5,
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
  },
  textInput: {

  },
});

export default TextInputComponent;