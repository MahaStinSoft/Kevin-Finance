import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ButtonComponent = (props) => {
  const { onPress, title, disabled, style } = props;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.SignButton, disabled && styles.disabledButton, style ]} disabled={disabled}>
      <Text style={styles.SignText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    SignButton: {
        backgroundColor: '#rgba(255,28,53,255)',
        width: '40%',
        alignSelf: 'center',
        borderRadius: 25,
        marginTop: 25,
        padding: 8,
        marginBottom: 30, 
      },
      SignText: {
        color: '#fff',
        padding: 5,
        textAlign: 'center',
        fontWeight: "bold",
      },
      disabledButton: {
        backgroundColor: '#d3d3d3', // Change the color for a disabled look
      },
});

export default ButtonComponent;
