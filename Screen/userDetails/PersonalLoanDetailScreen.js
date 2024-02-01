import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../../common/Header';

const PersonalLoanDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [personalLoan, setpersonalLoan] = useState(route.params.personalLoan);

  const fetchData = useCallback(async () => {
    const simulatedUpdatedData = { ...personalLoan };
    setpersonalLoan(simulatedUpdatedData);
  }, [personalLoan]);


  const fetchDataOnFocus = useCallback(async () => {
    const delayInMilliseconds = 100;
    setTimeout(async () => {
      await fetchData();
    }, delayInMilliseconds);
  }, [fetchData]);

  useEffect(() => {

    const unsubscribeFocus = navigation.addListener('focus', fetchDataOnFocus);

    return () => {
      unsubscribeFocus();
    };
  }, [navigation, fetchDataOnFocus]);


  const getGenderLabel = () => {
    switch (personalLoan.kf_gender) {
      case 123950000:
        return 'Male';
      case 123950001:
        return 'Female';
      default:
        return '';
    }
  };

  const getLoanStatus = () => {
    switch (personalLoan.kf_status) {
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
        return 'PendingApproval';
    }
    return numericValue;
  };
  
  const getStatusReason = () => {
    switch (personalLoan.kf_statusreason) {
      case 123950000:
        return 'AadharNotMatching';
      case 123950001:
        return 'InvalidDocuments';
      default:
        return '';
    }
  };
  

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setpersonalLoan(route.params.personalLoan);
    });
  
    return unsubscribe;
  }, [navigation, route.params.personalLoan]);

  const handleGoBack = () => {
    navigation.navigate("Dashboard");
  };

  const handleEdit = () => {
    navigation.navigate('EditPersonalLoan', {
      personalLoan,
      onUpdateSuccess: updatedpersonalLoan => setpersonalLoan(updatedpersonalLoan),
    });
  }; 

  const renderImage = () => {
    if (personalLoan.entityimage) {
      return (
        <Image
          source={{ uri: `data:image/png;base64,${personalLoan.entityimage}` }}
          style={styles.cardImage}
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
    <View style={styles.container}>
      <HeaderComponent
        titleText="Personal Loan Details"
        onPress={handleGoBack}
        onIconPress={handleEdit}
        screenIcon="create-outline"
      />  

      <View style={styles.contactImageContainer}>{renderImage()}</View>

      <View style={[styles.card, styles.cardElevated]}>
        <View>{renderImage()}</View>
        <Text style={styles.cardTitle}>Application Number: {personalLoan.kf_applicationnumber}</Text>
        <ScrollView>
        <Text style={styles.cardLabel}>Created By: {personalLoan.kf_createdby}</Text>
        <Text style={styles.cardLabel}>Name: {`${personalLoan.kf_firstname} ${personalLoan.kf_lastname}`}</Text>
        <Text style={styles.cardLabel}>Gender: {getGenderLabel()}</Text>
        <Text style={styles.cardLabel}>Date of Birth: {personalLoan.kf_dateofbirth ? new Date(personalLoan.kf_dateofbirth).toLocaleDateString() : ''}</Text>
        <Text style={styles.cardLabel}>Age: {personalLoan.kf_age}</Text>
        <Text style={styles.cardLabel}>Mobile Number: {personalLoan.kf_mobile}</Text>
        <Text style={styles.cardLabel}>Email Address: {personalLoan.kf_email}</Text>
        <Text style={styles.cardLabel}>Address 1: {personalLoan.kf_address1}</Text>
        <Text style={styles.cardLabel}>Address 2: {personalLoan.kf_address2}</Text>
        <Text style={styles.cardLabel}>Address 3: {personalLoan.kf_address3}</Text>
        <Text style={styles.cardLabel}>City: {personalLoan.kf_city}</Text>
        <Text style={styles.cardLabel}>State: {personalLoan.kf_state}</Text>
        <Text style={styles.cardLabel}>Aadhar Number: {personalLoan.kf_aadharnumber}</Text>
        <Text style={styles.cardLabel}>PANcard Number: {personalLoan.kf_pannumber}</Text>
        <Text style={styles.cardLabel}>Loan Amount Requested: {personalLoan.kf_loanamountrequested}</Text>
         <Text style={styles.cardLabel}>Loan Status: {getLoanStatus()}</Text>
        {personalLoan.kf_statusR && (<Text style={styles.cardLabel}>Status Reason: {getStatusReason()}</Text>)}
        {personalLoan.kf_approvaldate && (<Text style={styles.cardLabel}>Approver: {personalLoan.kf_approver}</Text>)}
        {personalLoan.kf_approvaldate && (<Text style={styles.cardLabel}>Approval Date: {personalLoan.kf_approvaldate}</Text>)}
        {/* {personalLoan.kf_firstemidate && (<Text style={styles.cardLabel}>First EMI Date: {personalLoan.kf_firstemidate}</Text>)} */}
        </ScrollView>
      </View>
    </View>
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
    height: 170,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -150,
    marginLeft: 10, 
    marginBottom: 5
  },
  card: {
    width: '90%',
    // height: '90%',
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
    height:"87%"
  },
  cardImage: {
    width: '100%',
    height: '50%',
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

export default PersonalLoanDetailsScreen;
