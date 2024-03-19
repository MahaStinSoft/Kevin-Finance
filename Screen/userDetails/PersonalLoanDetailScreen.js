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
      case 123950000:
        return 'Approved';
      case 123950001:
        return 'PendingApproval';
      case 123950002:
        return 'Draft';
      case 123950003:
        return 'Cancelled';
      case 123950004:
        return 'Rejected';
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
    // navigation.navigate("Dashboard");
    navigation.goBack();
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
    if (personalLoan && personalLoan.kf_applicantimage) {
      return (
        <Image
          source={{ uri: `data:image/png;base64,${personalLoan.kf_applicantimage}` }}
          style={styles.cardImage}
        />
      );
    } else {
      const initials = personalLoan ? `${personalLoan.kf_firstname[0]}${personalLoan.kf_lastname[0]}` : '';
      return (
        <View style={[styles.cardImage, { backgroundColor: "gray", width: "100%", height: "100%" }]}>
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
    navigation.navigate('PersonalLoanGurantee', {
      personalLoan,
      onUpdateSuccess: updatedpersonalLoan => setpersonalLoan(updatedpersonalLoan),
    });
    // Pass any necessary parameters if needed
  };

  const handleNavigateToGuaranteeScreen2 = () => {
    // Example navigation code from the previous screen
    navigation.navigate('PersonalLoanGurantee2', {
      personalLoan,
      onUpdateSuccess: updatedpersonalLoan => setpersonalLoan(updatedpersonalLoan),
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
        titleText="Personal Loan Details"
        onPress={handleGoBack}
        onIconPress={handleEdit}
        screenIcon="create-outline"
      />
      <ScrollView contentContainerStyle={{ width: "100%", padding: 15 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >

        <View style={styles.imageContainer}>
          <View style={{ marginLeft: -12, position: "relative", width: "32%", height: "100%" }}>{renderImage()}</View>

          <View style={{ marginLeft: 20, marginTop: 0, width: 200, position: "relative" }}>
            <Text style={styles.cardTitle}>{personalLoan.kf_applicationnumber}</Text>
            <Text style={[styles.cardTitle]}>{`${personalLoan.kf_firstname} ${personalLoan.kf_lastname}`}</Text>
            <View style={{ flexDirection: "row", marginTop: 30 }}>
              <TouchableOpacity onPress={handleNavigateToGuaranteeScreen} style={[styles.buttonContainer, { width: "42%", marginLeft: -5 }]}>
                <Text style={styles.buttonText}>Guarantor1</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={handleNavigateToGuaranteeScreen2} style={[styles.buttonContainer, {width: "42%", marginLeft: 10}]}>
            <Text style={styles.buttonText}>Guarantee2</Text>
          </TouchableOpacity> */}

              <TouchableOpacity
                onPress={handleNavigateToGuaranteeScreen2}
                style={[
                  styles.buttonContainer,
                  { width: "42%", marginLeft: 10 },
                  !personalLoan.kf_guarantorfirstname && { backgroundColor: 'gray' } // Disable button if HomeGuarantee 1 doesn't contain any values
                ]}
                disabled={!personalLoan.kf_guarantorfirstname} // Disable button if HomeGuarantee 1 doesn't contain any values
              >
                <Text style={styles.buttonText}>Guarantor2</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.personalDetailContainer} >
      <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10, color: "red" }]}>Personal Details</Text>
      <View style={styles.detailItem}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{getGenderLabel()}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>DOB :</Text>
            <Text style={styles.value}>{formatDate(personalLoan.kf_dateofbirth)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{personalLoan.kf_age}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Mobile Number:</Text>
            <Text style={styles.value}>{personalLoan.kf_mobile}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Email Address:</Text>
            <Text style={styles.value}>{personalLoan.kf_email}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Address 1:</Text>
            <Text style={styles.value}>{personalLoan.kf_address1}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Address 2:</Text>
            <Text style={styles.value}>{personalLoan.kf_address2}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Address 3:</Text>
            <Text style={styles.value}>{personalLoan.kf_address3}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>City:</Text>
            <Text style={styles.value}>{personalLoan.kf_city}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>State:</Text>
            <Text style={styles.value}>{personalLoan.kf_state}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.label}>Loan Amount Requested</Text>
            <Text style={styles.value}>{personalLoan.kf_loanamountrequested}</Text>
          </View>
    
      </View>

      <View style={styles.IndentityProofField}>
        <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10,  color: "red" }]}>Indentity Proof</Text>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Aadhar Number:</Text>
          <Text style={styles.value}>{personalLoan.kf_aadharnumber}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>PAN Number:</Text>
            <Text style={styles.value}>{personalLoan.kf_pannumber}</Text>
          </View>
      </View>

      <View style={styles.loanDetailContainer}>
      <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10, color: "red" }]}>Loan Details</Text>
      <View style={styles.detailItem}>
            <Text style={styles.label}>EMI Schedule:</Text>
            <Text style={styles.value}>{getEmiSchedule()}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Number Of EMI:</Text>
            <Text style={styles.value}>{personalLoan.kf_numberofemi}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Interest Rate:</Text>
            <Text style={styles.value}>{personalLoan.kf_interestrate}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>EMI:</Text>
            <Text style={styles.value}>{personalLoan.kf_emi}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>EMI Collection Date:</Text>
            <Text style={styles.value}> {formatDate(personalLoan.kf_emicollectiondate)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Other Charges:</Text>
            <Text style={styles.value}>{personalLoan.kf_othercharges}</Text>
          </View>     
         </View>


          {showHomeLoanGuarantee1 && (
          <View style={[styles.personalDetailContainer,{marginTop:5}]} >
          <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10,  color: "red" }]}>Guarantor 1</Text>
          <View style={styles.detailItem}>
            <Text style={styles.label}> Firstname:</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantorfirstname}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.label}> Lastname:</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantorlastname}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Gender:</Text>
            <Text style={styles.value}>{getGenderLabel()}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Age :</Text>
            <Text style={styles.value}> {personalLoan.kf_guarantorage}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Mobilenumber :</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantormobilenumber}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Email :</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantoremail}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Address 1:</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantoraddress1}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Address 2:</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantoraddress2}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Address 3:</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantoraddress3}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>City:</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantorcity}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> State :</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantorstate}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Aadharnumber:</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantoraadharnumber}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Pannumber :</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantorpannumber}</Text>
          </View>
        </View>  
          )}  

        {showHomeLoanGuarantee2 && personalLoan.kf_guarantor2firstname && (
          <View style={[styles.personalDetailContainer,{marginTop:5}]} >
          <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10,  color: "red" }]}>Guarantor 2</Text>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Firstname :</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantor2firstname}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Lastname :</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantor2lastname}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Gender :</Text>
            <Text style={styles.value}>{getGenderLabel()}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Dateofbirth :</Text>
            <Text style={styles.value}>{formatDate(personalLoan.kf_guarantor2dateofbirth)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Age :</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantor2age}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Mobilenumber :</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantor2mobilenumber}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Email  :</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantor2email}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Address 1 :</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantor2address1}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Address 2:</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantor2address1}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Address 3:</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantor2address1}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> City :</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantor2city}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Aadharnumber :</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantor2aadharnumber}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}> Pannumber :</Text>
            <Text style={styles.value}>{personalLoan.kf_guarantor2pannumber}</Text>
          </View>  
        </View> 
          )}




        <View style={{ flexDirection: "row" }}>
          <View style={{ alignContent: "flex-start", width: "60%", left: -35 }}>
            <ButtonComponent style={{ height: 50 }}
              title={showMore ? "View less" : "View more"}
              onPress={handleShowMoreToggle}
            />
          </View>

          <View style={{ width: "60%" }}>
            
            <ButtonComponent
              style={[
                styles.calculateButton,
                getLoanStatus() !== 'Approved' && styles.disabledButton,
              ]}
              title="Calculate EMI"
              onPress={handleGoToAmortizationScreen}
              disabled={getLoanStatus() !== 'Approved'}
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
    width: "100%",
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "absolute",
    top: 0,
    zIndex: 1000,
    marginLeft: 15,
    // height: 180
  },
  personalDetailContainer: {
    marginTop: 154,
    width: "100%",
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
    width: "100%",
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
    width: "100%",
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
    // borderRadius: 40
    width: "100%",
    height: "100%",
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
    fontSize: 40,
    fontWeight: 'bold',
    color: '#707070',
    textAlign: 'center',
    justifyContent: "center",
    color: 'white',
    marginVertical: 25
  },
  buttonContainer: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    marginLeft: 20,
    width: "55%",
    height: 30
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: -3,
    fontSize: 12
  },
  calculateButton: {
    marginBottom: 60,
    height: 50,
    marginLeft: -120,
    backgroundColor: 'red',
  },
  disabledButton: {
    backgroundColor: 'gray', 
  },
  detailItem: {
    flexDirection: 'row',
    paddingVertical: 2,
    // alignItems: 'center',
    // justifyContent: "space-evenly",
    // marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    left: 15,
    width: "30%"
  },
  value: {
    fontSize: 14,
    marginLeft: 50,
    width: "60%",
    right: 20
  },
});

export default PersonalLoanDetailsScreen;

