  import React, { useState, useEffect, useCallback  } from 'react';
  import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, LogBox } from 'react-native';
  import { useNavigation } from '@react-navigation/native';
  import HeaderComponent from '../../common/Header';

  const HomeLoanDetailsScreen = ({ route }) => {
    const navigation = useNavigation();
    const [loanApplication, setLoanApplication] = useState(route.params.loanApplication);
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
    ]);

    const fetchData = useCallback(async () => {
      console.log('Fetching data...');
      const simulatedUpdatedData = { ...loanApplication };
      setLoanApplication(simulatedUpdatedData);
    }, [loanApplication]);

    const fetchDataOnFocus = useCallback(async () => {
      console.log('Focus event triggered');

      const delayInMilliseconds = 100;
      setTimeout(async () => {
        await fetchData();
      }, delayInMilliseconds);
    }, [fetchData]);

    useEffect(() => {
      const unsubscribeFocus = navigation.addListener('focus', fetchDataOnFocus);

      return () => {
        console.log('Cleaning up focus listener');
        unsubscribeFocus();
      };
    }, [navigation, fetchDataOnFocus]);
    
    const getGenderLabel = () => {
      switch (loanApplication.kf_gender) {
        case 123950000:
          return 'Male';
        case 123950001:
          return 'Female';
        default:
          return '';
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
          return 'PendingApproval';
      }
      return numericValue;
    };

    const getStatusReason = () => {
      switch (loanApplication.kf_statusreason) {
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
        setLoanApplication(route.params.loanApplication);
      });
    
      return unsubscribe;
    }, [navigation, route.params.loanApplication]);

    const handleGoBack = () => {
      navigation.navigate("Dashboard");
    };

    const handleEdit = () => {
      navigation.navigate('EditHomeLoan', {
        loanApplication,
        onUpdateSuccess: updatedLoanApplication => setLoanApplication(updatedLoanApplication),
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
      <View style= {styles.container}>
        <HeaderComponent 
        titleText="HomeLoan Details" 
        onPress={handleGoBack} 
        onIconPress={handleEdit}
        screenIcon="create-outline"/>

        <View style={styles.contactImageContainer}>{renderImage()}</View>

        <View style={[styles.card, styles.cardElevated]}>
          <View>{renderImage()}</View>
          <Text style={styles.cardTitle}>Application Number: {loanApplication.kf_applicationnumber}</Text>
          <ScrollView>
          <Text style={styles.cardLabel}>Created: {loanApplication.kf_createdby}</Text>
          <Text style={styles.cardLabel}>Name: {`${loanApplication.kf_name} ${loanApplication.kf_lastname}`}</Text>
          <Text style={styles.cardLabel}>Gender: {getGenderLabel()}</Text>
          <Text style={styles.cardLabel}>Date of Birth: {loanApplication.kf_dateofbirth ? new Date(loanApplication.kf_dateofbirth).toLocaleDateString() : ''}</Text>         
          <Text style={styles.cardLabel}>Age: {loanApplication.kf_age}</Text>
          <Text style={styles.cardLabel}>Mobile Number: {loanApplication.kf_mobilenumber}</Text>
          <Text style={styles.cardLabel}>Email Address: {loanApplication.kf_email}</Text>
          <Text style={styles.cardLabel}>Address 1: {loanApplication.kf_address1}</Text>
          <Text style={styles.cardLabel}>Address 2: {loanApplication.kf_address2}</Text>
          <Text style={styles.cardLabel}>Address 3: {loanApplication.kf_address3}</Text>
          <Text style={styles.cardLabel}>City: {loanApplication.kf_city}</Text>
          <Text style={styles.cardLabel}>State: {loanApplication.kf_state}</Text>
          <Text style={styles.cardLabel}>Aadhar Number: {loanApplication.kf_aadharnumber}</Text>
          <Text style={styles.cardLabel}>PANcard Number: {loanApplication.kf_pannumber}</Text>
          <Text style={styles.cardLabel}>Loan Amount Requested: {loanApplication.kf_loanamountrequested}</Text>
          <Text style={styles.cardLabel}>Loan Status: {getLoanStatus()}</Text>
          {loanApplication.kf_statusreason && (<Text style={styles.cardLabel}>Loan Status: {getLoanStatus()}</Text>)}
          {loanApplication.kf_approver && (<Text style={styles.cardLabel}>Approver: {loanApplication.kf_approver}</Text>)}      
          {loanApplication.kf_approvaldate && (<Text style={styles.cardLabel}>Approval Date: {loanApplication.kf_approvaldate}</Text>)}
           {/* {loanApplication.kf_firstemidate && (<Text style={styles.cardLabel}>First EMI Date: {loanApplication.kf_firstemidate}</Text>)} */}
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
      height: 180,
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

  export default HomeLoanDetailsScreen;
