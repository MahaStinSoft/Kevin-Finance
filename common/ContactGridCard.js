import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ContactGridCard = ({ contact, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(contact)}>
      {/* <Image
        source={{ uri: `data:image/png;base64,${contact.entityimage}` }}
        style={styles.cardImage}
        onError={(error) => console.error('Image load error:', error.nativeEvent.error)}
      /> */}
      <Image
  source={ { uri: `data:image/png;base64,${contact.entityimage}` }}
  style={styles.cardImage}
  // onError={(error) => console.error('Image load error:', error.nativeEvent.error)}
/>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{contact.fullname}</Text>
        <Text style={styles.cardLabel}>Mobile: {contact.mobilephone}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#ffffff',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  cardLabel: {
    fontSize: 14,
    color: '#707070',
  },
});

export default ContactGridCard;
