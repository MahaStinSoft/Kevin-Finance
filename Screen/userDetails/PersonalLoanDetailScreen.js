import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, LogBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../../common/Header';
import ButtonComponent from '../../common/ButtonComponent';

const PersonalLoanDetailsScreen = ({ route }) => {  
  const navigation = useNavigation();
  const [personalLoan, setpersonalLoan] = useState(route.params.personalLoan);
  const [recordId, setRecordId] = useState(route.params.personalLoan.kf_personalloanid);
  const [showMore, setShowMore] = useState(false);
  const [showHomeLoanGuarantee1, setShowHomeLoanGuarantee1] = useState(false);
  const [showHomeLoanGuarantee2, setShowHomeLoanGuarantee2] = useState(false);

  
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

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
    // Update personalLoan and recordId when route params change
    setpersonalLoan(route.params.personalLoan);
    setRecordId(route.params.personalLoan.kf_personalloanid);
  }, [route.params.personalLoan]);

  const handleShowMoreToggle = () => {
    setShowMore(!showMore);
    // Toggle the visibility of HomeLoanGuarantee1 and HomeLoanGuarantee2
    setShowHomeLoanGuarantee1(!showMore);
    setShowHomeLoanGuarantee2(!showMore);
  };



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
        return 'Approved';
      case 123950001 :
        return 'PendingApproval';
      case 123950002 :
        return 'Draft';
      case 123950003 :
        return 'Cancelled';
      case 123950004 :
        return 'Expired';
      default:
        return 'PendingApproval';
    }
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
  
  const handleGoBack = () => {
    navigation.navigate("Dashboard");
  };

  const handleEdit = () => {
    navigation.navigate('EditPersonalLoan', {
      personalLoan,
      onUpdateSuccess: updatedpersonalLoan => setpersonalLoan(updatedpersonalLoan),
    });
  };

  const getEmiSchedule = () => {
    switch (personalLoan.kf_emischedule) {
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

const renderImage = () => {
  if (personalLoan && personalLoan.entityimage) {
    return (
      <Image
        source={{ uri: `data:image/png;base64,${personalLoan.entityimage}` }}
        style={styles.cardImage}
      />
    );
  } else {
    const initials = personalLoan ? `${personalLoan.kf_firstname[0]}${personalLoan.kf_lastname[0]}` : '';
    return (
      <View style={styles.cardImage}>
        <Text style={styles.placeholderText}>{initials}</Text>
      </View>
    );
  }
};

// const handleNavigateToGuaranteeScreen = () => {
//   // Example navigation code from the previous screen
// navigation.navigate('PersonalLoanGurantee', { personalLoan,
//   onUpdateSuccess: updatedpersonalLoan => setpersonalLoan(updatedpersonalLoan),
// });
// };

// const handleNavigateToGuaranteeScreen2 = () => {
//   // Example navigation code from the previous screen
// navigation.navigate('PersonalLoanGurantee2', { personalLoan,
//   onUpdateSuccess: updatedpersonalLoan => setpersonalLoan(updatedpersonalLoan),
// });
// };

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
    navigation.navigate('AmortizationScreen', {
      recordId: recordId, // Pass the recordId as a parameter
      principalLoanAmount: personalLoan.kf_loanamountrequested,
      loanTermMonths: personalLoan.kf_numberofemi,
      emiAmount: personalLoan.kf_emi,
      interestRate: personalLoan.kf_interestrate,
      name: `${personalLoan.kf_firstname} ${personalLoan.kf_lastname}`,
      mobileNumber: personalLoan.kf_mobile,
      aadharNumber: personalLoan.kf_aadharnumber,
      panCardNumber: personalLoan.kf_pannumber,
      emiSchedule: personalLoan.kf_emischedule,
      applicationNumber: personalLoan.kf_applicationnumber,
    });
  };

const date = personalLoan.kf_emicollectiondate ? new Date(personalLoan.kf_emicollectiondate) : null;
const formattedDate = date ? date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

  const emischeduleDate = personalLoan.kf_dateofbirth ? new Date(personalLoan.kf_dateofbirth): null;
  const emischeduleDateformatDate = emischeduleDate ? date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

  return (
    <View style={styles.container}>
      <HeaderComponent
        titleText="Personal Loan Details"
        onPress={handleGoBack}
        onIconPress={handleEdit}
        screenIcon="create-outline"
      />
      <ScrollView contentContainerStyle={{ width: 405, padding: 15 }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      >
      {/* <View style={styles.imageContainer}>
        <View style={{ marginLeft: -12 }}>{renderImage()}</View>
        <View style={{ marginLeft: 5, marginTop: 50}}>
          <Text style={styles.cardTitle}>{`${personalLoan.kf_firstname} ${personalLoan.kf_lastname}`}</Text>
          <Text style={styles.cardTitle}>Application No: {personalLoan.kf_applicationnumber}</Text>
          <TouchableOpacity onPress={handleNavigateToGuaranteeScreen} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Guarantee</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToGuaranteeScreen2} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Guarantee-2</Text>
          </TouchableOpacity>
        </View>
      </View> */}


          <View style={styles.imageContainer}>
          <View style={{ marginLeft: -12, position:"relative" }}>{renderImage()}</View>

          <View style={{ marginLeft: 12, marginTop: 0, width: 200, position:"relative" }}>
          <Text style={styles.cardTitle}>{personalLoan.kf_applicationnumber}</Text>
          <Text style={[styles.cardTitle]}>{`${personalLoan.kf_name} ${personalLoan.kf_lastname}`}</Text>
            <View style={{flexDirection: "row", marginTop: 30}}>
            <TouchableOpacity onPress={handleNavigateToGuaranteeScreen} style={[styles.buttonContainer, {width: "45%", marginLeft: 5}]}>
            <Text style={styles.buttonText}>Guarantee1</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToGuaranteeScreen2} style={[styles.buttonContainer, {width: "45%", marginLeft: 2}]}>
            <Text style={styles.buttonText}>Guarantee2</Text>
          </TouchableOpacity>
          </View>
          </View>

        </View>



      <View style={styles.personalDetailContainer} >
        <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10 }]}>Personal Details</Text>
        <Text style={styles.cardLabel}>Gender: {getGenderLabel()}</Text>
        {/* <Text style={styles.cardLabel}>Date of Birth: {personalLoan.kf_dateofbirth ? new Date(personalLoan.kf_dateofbirth).toLocaleDateString() : ''}</Text> */}
        <Text style={styles.cardLabel}>Date of Birth: {formattedDate}</Text>
        <Text style={styles.cardLabel}>Age: {personalLoan.kf_age}</Text>
        <Text style={styles.cardLabel}>Mobile Number: {personalLoan.kf_mobile}</Text>
        <Text style={styles.cardLabel}>Email Address: {personalLoan.kf_email}</Text>
        <Text style={styles.cardLabel}>Address 1: {personalLoan.kf_address1}</Text>
        <Text style={styles.cardLabel}>Address 2: {personalLoan.kf_address2}</Text>
        <Text style={styles.cardLabel}>Address 3: {personalLoan.kf_address3}</Text>
        <Text style={styles.cardLabel}>City: {personalLoan.kf_city}</Text>
        <Text style={styles.cardLabel}>State: {personalLoan.kf_state}</Text>
        <Text style={styles.cardLabel}>Loan Amount Requested: {personalLoan.kf_loanamountrequested}</Text>
        <Text style={styles.cardLabel}>Loan Status: {getLoanStatus()}</Text>
        {/* {personalLoan.kf_statusR && (<Text style={styles.cardLabel}>Status Reason: {getStatusReason()}</Text>)}
        {personalLoan.kf_approvaldate && (<Text style={styles.cardLabel}>Approver: {personalLoan.kf_approver}</Text>)}
        {personalLoan.kf_approvaldate && (<Text style={styles.cardLabel}>Approval Date: {personalLoan.kf_approvaldate}</Text>)} */}
        {/* {personalLoan.kf_firstemidate && (<Text style={styles.cardLabel}>First EMI Date: {personalLoan.kf_firstemidate}</Text>)} */}
      </View>

      <View style={styles.IndentityProofField}>
        <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10 }]}>Indentity Proof</Text>
        <Text style={styles.cardLabel}>Aadhar Number: {personalLoan.kf_aadharnumber}</Text>
        <Text style={styles.cardLabel}>PANcard Number: {personalLoan.kf_pannumber}</Text>
        <Text style={styles.cardLabel}>Aadhar Image: View</Text>
        <Text style={styles.cardLabel}>PANcard Image: View </Text>
      </View>

      <View style={styles.loanDetailContainer}>
        <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10 }]}>Loan Details</Text>
        <Text style={styles.cardLabel}>EMI Schedule: {getEmiSchedule()}</Text>
        <Text style={styles.cardLabel}>Number Of EMI: {personalLoan.kf_numberofemi}</Text>
        <Text style={styles.cardLabel}>Interest Rate: {personalLoan.kf_interestrate}</Text>
        <Text style={styles.cardLabel}>EMI: {personalLoan.kf_emi}</Text>
        <Text style={styles.cardLabel}>EMI Collection Date: {emischeduleDateformatDate}</Text>
        <Text style={styles.cardLabel}>Other Charges: {personalLoan.kf_othercharges}</Text>
      </View>


          {showHomeLoanGuarantee1 && (
          <View style={[styles.personalDetailContainer,{marginTop:5}]} >
          <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10 }]}>PersonaLoanGurantee 1</Text>
          <Text style={styles.cardLabel}>Guarantor Firstname : {personalLoan.kf_guarantorfirstname}</Text>
          <Text style={styles.cardLabel}>Guarantor Lastname : {personalLoan.kf_guarantorlastname}</Text>
          <Text style={styles.cardLabel}>Guarantor Gender : {getGenderLabel()}</Text>
          <Text style={styles.cardLabel}>Guarantor Dateofbirth : {formattedDate}</Text>
          <Text style={styles.cardLabel}>Guarantor Age : {personalLoan.kf_guarantorage}</Text>
          <Text style={styles.cardLabel}>Guarantor Mobilenumber : {personalLoan.kf_guarantormobilenumber}</Text>
          <Text style={styles.cardLabel}>Guarantor Email : {personalLoan.kf_guarantoremail}</Text>
          <Text style={styles.cardLabel}>Guarantor Address 1 : {personalLoan.kf_guarantoraddress1}</Text>
          <Text style={styles.cardLabel}>Guarantor Address 2 : {personalLoan.kf_guarantoraddress2}</Text>
          <Text style={styles.cardLabel}>Guarantor Address 3 : {personalLoan.kf_guarantoraddress3}</Text>
          <Text style={styles.cardLabel}>Guarantor City : {personalLoan.kf_guarantorcity}</Text> 
          <Text style={styles.cardLabel}>Guarantor State : {personalLoan.kf_guarantorstate}</Text> 
          <Text style={styles.cardLabel}>Guarantor Aadharnumber : {personalLoan.kf_guarantoraadharnumber}</Text>
          <Text style={styles.cardLabel}>Guarantor Pannumber : {personalLoan.kf_guarantorpannumber}</Text>
        </View>  
          )}  



          {showHomeLoanGuarantee1 && (
          <View style={[styles.personalDetailContainer,{marginTop:5}]} >
          <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10 }]}>PersonaLoanGurantee 2</Text>
          <Text style={styles.cardLabel}>Guarantor Firstname : {personalLoan.kf_guarantor2firstname}</Text>
          <Text style={styles.cardLabel}>Guarantor Lastname : {personalLoan.kf_guarantor2lastname}</Text>
          <Text style={styles.cardLabel}>Guarantor Gender : {getGenderLabel()}</Text>
          <Text style={styles.cardLabel}>Guarantor Dateofbirth : {formattedDate}</Text>
          <Text style={styles.cardLabel}>Guarantor Age : {personalLoan.kf_guarantor2age}</Text>
          <Text style={styles.cardLabel}>Guarantor Mobilenumber : {personalLoan.kf_guarantor2mobilenumber}</Text>
          <Text style={styles.cardLabel}>Guarantor Email : {personalLoan.kf_guarantor2email}</Text>
          <Text style={styles.cardLabel}>Guarantor Address 1 : {personalLoan.kf_guarantor2address1}</Text>
          <Text style={styles.cardLabel}>Guarantor Address 2 : {personalLoan.kf_guarantor2address2}</Text>
          <Text style={styles.cardLabel}>Guarantor Address 3 : {personalLoan.kf_guarantor2address3}</Text>
          <Text style={styles.cardLabel}>Guarantor City : {personalLoan.kf_guarantor2city}</Text>
          <Text style={styles.cardLabel}>Guarantor State : {personalLoan.kf_guarantor2state}</Text>
          <Text style={styles.cardLabel}>Guarantor Aadharnumber : {personalLoan.kf_guarantor2aadharnumber}</Text>
          <Text style={styles.cardLabel}>Guarantor Pannumber : {personalLoan.kf_guarantor2pannumber}</Text>
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

            


          {/* <ButtonComponent style={{ marginBottom: 60 }}
          title ="Calculate Amortization"
          onPress={handleGoToAmortizationScreen}
          /> */}

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
  },
  personalDetailContainer: {
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
  },
});

export default PersonalLoanDetailsScreen;

