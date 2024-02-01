import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PersonalLoanCard = ({ personalLoan, onPress, onDelete }) => {
  
  const getLoanStatusLabel = () => {
    switch (personalLoan.kf_status) {
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
        return 'Pending Approval';
    }
  };

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
      const initials = `${personalLoan.kf_firstname[0]}${personalLoan.kf_lastname[0]}`;
      return (
        <View style={[styles.cardImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>{initials}</Text>
        </View>
      );
    }
  };

  return (
    <View style={{width: "100%"}}>
      <TouchableOpacity style={styles.card} onPress={() => onPress(personalLoan)}>
        {renderImage()}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{`${personalLoan.kf_firstname} ${personalLoan.kf_lastname}`}</Text>
          {/* <Text style={styles.cardLabel}>{`Loan Amount: ${personalLoan.kf_loanamountrequested}`}</Text> */}
          <Text style={styles.cardLabel}>{`Application Number: ${personalLoan.kf_applicationnumber || ''}`}</Text>
          <Text style={styles.cardLabel}>{`Status: ${getLoanStatusLabel()}`}</Text>
        </View>
      </TouchableOpacity>
      {/* <View style={styles.deleteIconContainer}>
        <TouchableOpacity onPress={() => onDelete(personalLoan)}>
          <Ionicons name="trash" size={25} color="red" />
        </TouchableOpacity>
      </View> */}
    </View>
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
    backgroundColor: '#e0e0e0',
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
  deleteIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default PersonalLoanCard;
