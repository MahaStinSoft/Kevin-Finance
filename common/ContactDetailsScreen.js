import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HeaderComponent from './Header';

const ContactDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [loanApplication, setLoanApplication] = useState(route.params.loanApplication);

  const getGenderLabel = () => {
    switch (loanApplication.kf_gender) {
      case 123950000:
        return 'Male';
      case 123950001:
        return 'Female';
      default:
        return 'Unknown';
    }
  };

  const getLoanStatus = () => {
    switch (loanApplication.kf_status) {
      case 123950000 :
        numericValue = 'Approved';
        break;
      case 123950001 :
        numericValue = 'PendingApproval';
        break;
      case 123950002 :
        numericValue = 'Draft';
        break;
      case 123950003 :
        numericValue = 'Cancelled';
        break;
      case 123950004 :
        numericValue = 'Expired';
        break;
      default:
        return 'Unknown';
    }
  };
  
  const getStatusReason = () => {
    switch (loanApplication.kf_statusreason) {
      case 'AadharNotMatching':
        numericValue = 123950000;
        break;
      case 'InvalidDocuments':
        numericValue = 123950001;
        break;
        default:
        return 'Unknown';
    }
  };
  

  useEffect(() => {
    // Update loanApplication state when the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      setLoanApplication(route.params.loanApplication);
    });

    return unsubscribe;
  }, [navigation, route.params.loanApplication]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate('EditScreen', {
      loanApplication,
      updateLoanApplicationDetails: updatedLoanApplication => setLoanApplication(updatedLoanApplication),
    });
  };

  const renderImage = () => {
    if (loanApplication.entityimage) {
      return (
        <Image
          source={{ uri: `data:image/png;base64,${loanApplication.entityimage}` }}
          style={styles.cardImage}
        />
      );
    } else {
      const initials = `${loanApplication.kf_name[0]}${loanApplication.kf_lastname[0]}`;
      return (
        <View style={[styles.cardImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>{initials}</Text>
        </View>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderComponent titleText="Loan Application Details" onPress={handleGoBack} />
      <TouchableOpacity onPress={handleEdit}>
        <Ionicons name="list-sharp" size={25} color="red" />
      </TouchableOpacity>

      <View style={styles.contactImageContainer}>{renderImage()}</View>

      <View style={[styles.card, styles.cardElevated]}>
        <View>{renderImage()}</View>
        <Text style={styles.cardTitle}>Name: {`${loanApplication.kf_name} ${loanApplication.kf_lastname}`}</Text>
        {/* <Text style={styles.cardLabel}>Loan Type: {loanApplication.loanType}</Text> */}
        <Text style={styles.cardLabel}>Gender: {getGenderLabel()}</Text>
        <Text style={styles.cardLabel}>Mobile Number: {loanApplication.kf_mobilenumber}</Text>
        <Text style={styles.cardLabel}>Email Address: {loanApplication.kf_email}</Text>
        <Text style={styles.cardLabel}>Address 1: {loanApplication.kf_address1}</Text>
        <Text style={styles.cardLabel}>Address 2: {loanApplication.kf_address2}</Text>
        <Text style={styles.cardLabel}>Address 3: {loanApplication.kf_address3}</Text>
        <Text style={styles.cardLabel}>City: {loanApplication.kf_city}</Text>
        <Text style={styles.cardLabel}>State: {loanApplication.kf_state}</Text>
        <Text style={styles.cardLabel}>Loan Amount Requested: {loanApplication.kf_loanamountrequested}</Text>
        {/* <Text style={styles.cardLabel}>Loan Status: {getLoanStatus()}</Text>
        <Text style={styles.cardLabel}>Status Reason: {getStatusReason()}</Text> */}
        {/* <Text style={styles.cardLabel}>{loanApplication.kf_dateofapproval}</Text> */}
        <Text style={styles.cardLabel}>Approver: {loanApplication.kf_approver}</Text>
        <Text style={styles.cardLabel}>AadharCard Number: {loanApplication.kf_aadharnumber}</Text>
        <Text style={styles.cardLabel}>Pancard Number: {loanApplication.kf_pannumber}</Text>
        <Text style={styles.cardLabel}>Created by: {loanApplication.createdby}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '90%',
  },
  contactImageContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -130,
    marginLeft: 10
  },
  card: {
    width: '90%',
    height: '77%',
    borderRadius: 6,
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  cardElevated: {
    marginTop: -150,
  },
  cardImage: {
    width: '100%',
    height: '55%',
    resizeMode: 'contain',
    borderRadius: 6,
  },
  cardLabel: {
    color: '#000000',
    fontSize: 14,
    // fontWeight: 'bold',
    marginBottom: 6,
    marginLeft: 10
  },
  placeholderText: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#707070',
    textAlign: 'center',
    backgroundColor: 'gray',
    height: '100%',
    color: 'white',
    paddingTop: 35,
  },
});

export default ContactDetailsScreen;
