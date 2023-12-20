import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ButtonComponent = (props) => {
  const { onPress, title } = props;

  return (
    <TouchableOpacity onPress={onPress} style={styles.SignButton}>
      <Text style={styles.SignText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    SignButton: {
        backgroundColor: '#rgba(255,28,53,255)',
        width: '60%',
        alignSelf: 'center',
        borderRadius: 25,
        marginTop: 25,
        padding: 5,
        marginBottom: 30
      },
      SignText: {
        color: '#fff',
        padding: 12,
        textAlign: 'center',
        fontWeight: "bold"
      },
});

export default ButtonComponent;
