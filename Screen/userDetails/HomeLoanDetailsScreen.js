import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, LogBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../../common/Header';
import ButtonComponent from '../../common/ButtonComponent';

const HomeLoanDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [loanApplication, setLoanApplication] = useState(route.params.loanApplication);
  const [recordId, setRecordId] = useState(route.params.loanApplication.kf_loanApplicationid);
  const [showMore, setShowMore] = useState(false);
  const [showHomeLoanGuarantee1, setShowHomeLoanGuarantee1] = useState(false);
  const [showHomeLoanGuarantee2, setShowHomeLoanGuarantee2] = useState(false);

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);
  
  const onUpdateSuccess = useCallback((updatedLoanApplication) => {
    setLoanApplication(updatedLoanApplication);
  }, []);

  useEffect(() => {
    // Update loanApplication and recordId when route params change
    setLoanApplication(route.params.loanApplication);
    setRecordId(route.params.loanApplication.kf_loanApplicationid);
  }, [route.params.loanApplication]);

  const handleShowMoreToggle = () => {
    setShowMore(!showMore);
    // Toggle the visibility of HomeLoanGuarantee1 and HomeLoanGuarantee2
    setShowHomeLoanGuarantee1(!showMore);
    setShowHomeLoanGuarantee2(!showMore);
  };

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
      case 123950000:
        return 'Approved';
      case 123950001:
        return 'PendingApproval';
      case 123950002:
        return 'Draft';
      case 123950003:
        return 'Cancelled';
      case 123950004:
        return 'Expired';
      default:
        return 'PendingApproval';
    }
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

  const getEmiSchedule = () => {
    switch (loanApplication.kf_emischedule) {
      case 1:
        return 'Daily';
      case 2:
        return 'Weekly';
      case 3:
        return 'Monthly';
      default:
        return '';
    }
  };

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
      const initials = loanApplication ? `${loanApplication.kf_name[0]}${loanApplication.kf_lastname[0]}` : '';
      return (
        <View style={styles.cardImage}>
          <Text style={styles.placeholderText}>{initials}</Text>
          {/* <TouchableOpacity onPress={handleNavigateToGuaranteeScreen} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Guarantee</Text>
          </TouchableOpacity> */}
        </View>
      );
    }
  };

  const handleNavigateToGuaranteeScreen = () => {
    // Example navigation code from the previous screen
navigation.navigate('HomeLoanGurantee', { loanApplication,
  onUpdateSuccess: updatedLoanApplication => setLoanApplication(updatedLoanApplication),
});
      // Pass any necessary parameters if needed
  };

  const handleNavigateToGuaranteeScreen2 = () => {
    // Example navigation code from the previous screen
navigation.navigate('HomeLoanGurantee2', { loanApplication,
  onUpdateSuccess: updatedLoanApplication => setLoanApplication(updatedLoanApplication),
});
      // Pass any necessary parameters if needed
  };



  const handleGoToAmortizationScreen = () => {
    navigation.navigate('AmortizationScreenHome', {
      recordId: recordId, // Pass the recordId as a parameter
      principalLoanAmount: loanApplication.kf_loanamountrequested,
      loanTermMonths: loanApplication.kf_numberofemi,
      emiAmount: loanApplication.kf_emi,
      interestRate: loanApplication.kf_interestrate,
      name: `${loanApplication.kf_name} ${loanApplication.kf_lastname}`,
      mobileNumber: loanApplication.kf_mobile,
      aadharNumber: loanApplication.kf_aadharnumber,
      panCardNumber: loanApplication.kf_pannumber,
      emiSchedule: loanApplication.kf_emischedule,
      applicationNumber: loanApplication.kf_applicationnumber,
    });
  };

  // const formatDate = (timestamp) => {
  //   const date = new Date(timestamp);
  //   // Get the day, month, and year
  //   const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if necessary
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
  //   const year = date.getFullYear();
  //   // Return formatted date
  //   return `${day}/${month}/${year}`;
  // };

  const formatDate = (timestamp) => {
    // Check if timestamp is not provided or is not a valid date
    if (!timestamp || isNaN(new Date(timestamp))) {
      return ''; // Return empty string
    }
  
    const date = new Date(timestamp);
    // Get the day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if necessary
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
    const year = date.getFullYear();
    // Return formatted date
    return `${day}/${month}/${year}`;
  };
  

  return (
    <View style={styles.container}>
      <HeaderComponent
        titleText="HomeLoan Details"
        onPress={handleGoBack}
        onIconPress={handleEdit}
        screenIcon="create-outline"
      />

      <ScrollView contentContainerStyle={{ width: 405, padding: 15 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >

        <View style={styles.imageContainer}>
          <View style={{ marginLeft: -12, position:"relative" }}>{renderImage()}</View>

          <View style={{ marginLeft: 12, marginTop: 0, width: 200, position:"relative" }}>
          <Text style={styles.cardTitle}>{loanApplication.kf_applicationnumber}</Text>
          <Text style={[styles.cardTitle]}>{`${loanApplication.kf_name} ${loanApplication.kf_lastname}`}</Text>
            <View style={{flexDirection: "row", marginTop: 50}}>
            <TouchableOpacity onPress={handleNavigateToGuaranteeScreen} style={[styles.buttonContainer, {width: "45%", marginLeft: -5}]}>
            <Text style={styles.buttonText}>Guarantee1</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToGuaranteeScreen2} style={[styles.buttonContainer, {width: "45%", marginLeft: 2}]}>
            <Text style={styles.buttonText}>Guarantee2</Text>
          </TouchableOpacity>
          </View>
          </View>

        </View>

        <View style={[styles.personalDetailContainer]} >
          <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10 }]}>Personal Details</Text>
          <Text style={styles.cardLabel}>Gender: {getGenderLabel()}</Text>
          <Text style={styles.cardLabel}>Date of Birth: {formatDate(loanApplication.kf_dateofbirth)}</Text>
          <Text style={styles.cardLabel}>Age: {loanApplication.kf_age}</Text>
          <Text style={styles.cardLabel}>Mobile Number: {loanApplication.kf_mobilenumber}</Text>
          <Text style={styles.cardLabel}>Email Address: {loanApplication.kf_email}</Text>
          <Text style={styles.cardLabel}>Address 1: {loanApplication.kf_address1}</Text>
          <Text style={styles.cardLabel}>Address 2: {loanApplication.kf_address2}</Text>
          <Text style={styles.cardLabel}>Address 3: {loanApplication.kf_address3}</Text>
          <Text style={styles.cardLabel}>City: {loanApplication.kf_city}</Text>
          <Text style={styles.cardLabel}>State: {loanApplication.kf_state}</Text>
          <Text style={styles.cardLabel}>Loan Amount Requested: {loanApplication.kf_loanamountrequested}</Text>
          <Text style={styles.cardLabel}>Loan Status: {getLoanStatus()}</Text>
        </View>

        <View style={styles.IndentityProofField}>
          <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10 }]}>Indentity Proof</Text>
          <Text style={styles.cardLabel}>Aadhar Number: {loanApplication.kf_aadharnumber}</Text>
          <Text style={styles.cardLabel}>PANcard Number: {loanApplication.kf_pannumber}</Text>
          <Text style={styles.cardLabel}>Aadhar Image: View</Text>
          <Text style={styles.cardLabel}>PANcard Image: View </Text>
        </View>

        <View style={styles.loanDetailContainer}>
          <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10 }]}>Loan Details</Text>
          <Text style={styles.cardLabel}>EMI Schedule: {getEmiSchedule()}</Text>
          <Text style={styles.cardLabel}>Number Of EMI: {loanApplication.kf_numberofemi}</Text>
          <Text style={styles.cardLabel}>Interest Rate: {loanApplication.kf_interestrate}</Text>
          <Text style={styles.cardLabel}>EMI: {loanApplication.kf_emi}</Text>
          <Text style={styles.cardLabel}>EMI Collection Date: {formatDate(loanApplication.kf_emicollectiondate)}</Text>
          <Text style={styles.cardLabel}>Other Charges: {loanApplication.kf_othercharges}</Text>
        </View>

        {showHomeLoanGuarantee1 && (
          <View style={[styles.personalDetailContainer, {marginTop: 5}]}>
          <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10 }]}>HomeLoanGurantee 1</Text>
          <Text style={styles.cardLabel}>Guarantor Firstname : {loanApplication.kf_guarantorfirstname}</Text>
          <Text style={styles.cardLabel}>Guarantor Lastname : {loanApplication.kf_guarantorlastname}</Text>
           <Text style={styles.cardLabel}>Guarantor Gender : {getGenderLabel()}</Text> 
           <Text style={styles.cardLabel}>Guarantor Dateofbirth : {formatDate(loanApplication.kf_guarantordateofbirth)}</Text> 
          <Text style={styles.cardLabel}>Guarantor Age : {loanApplication.kf_guarantorage}</Text>
          <Text style={styles.cardLabel}>Guarantor Mobilenumber : {loanApplication.kf_guarantormobilenumber}</Text>
          <Text style={styles.cardLabel}>Guarantor Email : {loanApplication.kf_guarantoremail}</Text>
          <Text style={styles.cardLabel}>Guarantor Address 1 : {loanApplication.kf_guarantoraddress1}</Text>
          <Text style={styles.cardLabel}>Guarantor Address 2 : {loanApplication.kf_guarantoraddress2}</Text>
          <Text style={styles.cardLabel}>Guarantor Address 3 : {loanApplication.kf_guarantoraddress3}</Text>
          <Text style={styles.cardLabel}>Guarantor City : {loanApplication.kf_guarantorcity}</Text> 
          <Text style={styles.cardLabel}>Guarantor State : {loanApplication.kf_guarantorstate}</Text> 
          <Text style={styles.cardLabel}>Guarantor Aadharnumber : {loanApplication.kf_guarantoraadharnumber}</Text>
          <Text style={styles.cardLabel}>Guarantor Pannumber : {loanApplication.kf_guarantorpannumber}</Text>
        </View> 
        )}


          {showHomeLoanGuarantee2 && (
        <View style={[styles.personalDetailContainer, {marginTop: 5}]}>
          <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10 }]}>HomeLoanGurantee 2</Text>
          <Text style={styles.cardLabel}>Guarantor Firstname : {loanApplication.kf_guarantor2firstname}</Text>
          <Text style={styles.cardLabel}>Guarantor Lastname : {loanApplication.kf_guarantor2lastname}</Text>
          <Text style={styles.cardLabel}>Guarantor Gender : {getGenderLabel()}</Text>
          <Text style={styles.cardLabel}>Guarantor Dateofbirth : {formatDate(loanApplication.kf_guarantor2dateofbirth)}</Text>
          <Text style={styles.cardLabel}>Guarantor Age : {loanApplication.kf_guarantor2age}</Text>
          <Text style={styles.cardLabel}>Guarantor Mobilenumber : {loanApplication.kf_guarantor2mobilenumber}</Text>
          <Text style={styles.cardLabel}>Guarantor Email : {loanApplication.kf_guarantor2email}</Text>
          <Text style={styles.cardLabel}>Guarantor Address 1 : {loanApplication.kf_guarantor2address1}</Text>
          <Text style={styles.cardLabel}>Guarantor Address 2 : {loanApplication.kf_guarantor2address2}</Text>
          <Text style={styles.cardLabel}>Guarantor Address 3 : {loanApplication.kf_guarantor2address3}</Text>
          <Text style={styles.cardLabel}>Guarantor City : {loanApplication.kf_guarantor2city}</Text>
          <Text style={styles.cardLabel}>Guarantor State : {loanApplication.kf_guarantor2state}</Text>
          <Text style={styles.cardLabel}>Guarantor Aadharnumber : {loanApplication.kf_guarantor2aadharnumber}</Text>
          <Text style={styles.cardLabel}>Guarantor Pannumber : {loanApplication.kf_guarantor2pannumber}</Text>
        </View> 
        )} 

        <View style={{flexDirection:"row"}}>
        <View  style={{alignContent:"flex-start",width:"60%", left: -35}}>
        <ButtonComponent  style={{height: 50}}
          title={showMore ? "View less" : "View more"}
          onPress={handleShowMoreToggle}
        />  
        </View>

        <View style={{ width:"60%"}}>
        <ButtonComponent style={{ marginBottom: 60,height: 50, marginLeft: -120}}
        title="CalculateEMI"
        onPress={handleGoToAmortizationScreen}
        />
</View>
</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: "white",
    width: "95%",
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position:"absolute",
    top: 0,
    zIndex: 1000, 
    marginLeft: 15, 
    height: 180
  },
  personalDetailContainer: {
    marginTop: 180,
    width: "95%",
    paddingVertical: 10,
    backgroundColor: "white",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // position: "absolute",
  },
  IndentityProofField: {
    marginTop: 5,
    width: "95%",
    paddingVertical: 10,
    backgroundColor: "white",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loanDetailContainer: {
    marginTop: 5,
    width: "95%",
    paddingVertical: 10,
    backgroundColor: "white",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  cardImage: {
    borderRadius: 40
  },
  cardTitle: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    
  },
  cardLabel: {
    color: '#000000',
    fontSize: 14,
    marginLeft: 10
  },
  placeholderText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#707070',
    textAlign: 'center',
    backgroundColor: 'gray',
    color: 'white',
    // borderRadius: 100,
    padding: 15
  },
  buttonContainer: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    marginLeft:20,
    width: "55%",
    height: 30
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
    marginVertical:-5 
  },
});

export default HomeLoanDetailsScreen;
