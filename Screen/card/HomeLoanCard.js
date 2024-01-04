import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const HomeLoanCard = ({ loanApplication, onPress }) => {

  const getLoanStatusLabel = () => {
    switch (loanApplication.kf_status) {
      case 123950000:
        return 'Approved';
      case 123950001:
        return 'Pending Approval';
      case 123950002:
        return 'Draft';
      case 123950003:
        return 'Cancelled';
      case 123950004:
        return 'Expired';
      default:
        return 'Unknown'; 
    }
  };

  const renderImage = () => {
    if (loanApplication.entityimage) {
      return (
        <Image
          source={{ uri: `data:image/png;base64,${loanApplication.entityimage}` }}
          style={styles.cardImage}
          onError={(error) => console.error('Image load error:', error.nativeEvent.error)}
        />
      );
    } else {
      // If entityimage is not available, display the first and last name initials as an image
      const initials = loanApplication.kf_name && loanApplication.kf_lastname
        ? `${loanApplication.kf_name[0]}${loanApplication.kf_lastname[0]}`
        : '';
      return (
        <View style={[styles.cardImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>{initials}</Text>
        </View>
      );
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(loanApplication)}>
      {renderImage()}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{`${loanApplication.kf_name} ${loanApplication.kf_lastname}`}</Text>
        <Text style={styles.cardLabel}>{`Loan Amount: ${loanApplication.kf_loanamountrequested}`}</Text>
        <Text style={styles.cardLabel}>{`Status: ${getLoanStatusLabel()}`}</Text>
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
    color: '#707070', 
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

export default HomeLoanCard;
