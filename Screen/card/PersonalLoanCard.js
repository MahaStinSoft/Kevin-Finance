import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const PersonalLoanCard = ({ personalLoan, onPress }) => {
  // Check if personalLoan is defined and has required properties
  if (!personalLoan || !personalLoan.kf_firstname || !personalLoan.kf_lastname) {
    return null; // If not, return null or a default component
  }

  const renderImage = () => {
    if (personalLoan.entityimage) {
      return (
        <Image
          source={{ uri: `data:image/png;base64,${personalLoan.entityimage}` }}
          style={styles.cardImage}
          onError={(error) => console.error('Image load error:', error.nativeEvent.error)}
        />
      );
    } else {
      // If entityimage is not available, display the first and last name initials as an image
      const initials = `${personalLoan.kf_firstname[0]}${personalLoan.kf_lastname[0]}`;
      return (
        <View style={[styles.cardImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>{initials}</Text>
        </View>
      );
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(personalLoan)}>
      {renderImage()}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{`${personalLoan.kf_firstname} ${personalLoan.kf_lastname}`}</Text>
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
  placeholderImage: {
    backgroundColor: '#e0e0e0', // Placeholder background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#707070', // Placeholder text color
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

export default PersonalLoanCard;
