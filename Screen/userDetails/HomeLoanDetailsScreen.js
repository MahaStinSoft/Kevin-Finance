// import React, { useState, useEffect, useCallback  } from 'react';
// import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, LogBox } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import HeaderComponent from '../../common/Header';
// import ButtonComponent from '../../common/ButtonComponent';

// const HomeLoanDetailsScreen = ({ route }) => {
//   const navigation = useNavigation();
//   // const [loanApplication, setLoanApplication] = useState(route.params.loanApplication);
//   const [recordId, setRecordId] = useState(route.params.loanApplication.kf_loanApplicationid);
//   const [loanApplication, setLoanApplication] = useState(route.params.loanApplication);

//   LogBox.ignoreLogs([
//     'Non-serializable values were found in the navigation state',
//   ]);

//   const fetchData = useCallback(async () => {
//     const simulatedUpdatedData = { ...loanApplication };
//     setLoanApplication(simulatedUpdatedData);
//   }, [loanApplication]);

//   const fetchDataOnFocus = useCallback(async () => {
//     const delayInMilliseconds = 100;
//     setTimeout(async () => {
//       await fetchData();
//     }, delayInMilliseconds);
//   }, [fetchData]);

//   // useEffect(() => {
//   //   const unsubscribeFocus = navigation.addListener('focus', fetchDataOnFocus);
//   //   return () => {
//   //     unsubscribeFocus();
//   //   };
//   // }, [navigation, fetchDataOnFocus]);

//   // Update recordId when route params change
//   useEffect(() => {
//     // Update recordId when route params change
//     setRecordId(route.params.loanApplication.kf_loanApplicationid);
//   }, [route.params.loanApplication.kf_loanApplicationid]);

//   const getGenderLabel = () => {
//     switch (loanApplication.kf_gender) {
//       case 123950000:
//         return 'Male';
//       case 123950001:
//         return 'Female';
//       default:
//         return '';
//     }
//   };

//   const getLoanStatus = () => {
//     switch (loanApplication.kf_status) {
//       case 123950000 :
//         return 'Approved';
//       case 123950001 :
//         return 'PendingApproval';
//       case 123950002 :
//         return 'Draft';
//       case 123950003 :
//         return 'Cancelled';
//       case 123950004 :
//         return 'Expired';
//       default:
//         return 'PendingApproval';
//     }
//   };
  
//   const getStatusReason = () => {
//     switch (loanApplication.kf_statusreason) {
//       case 123950000:
//         return 'AadharNotMatching';
//       case 123950001:
//         return 'InvalidDocuments';
//       default:
//         return '';
//     }
//   };

//   const getEmiSchedule = () => {
//     switch (loanApplication.kf_emischedule) {
//       case 1:
//         return 'Daily';
//       case 2:
//         return 'Weekly';
//       case 3:
//         return 'Monthly';
//       default:
//         return '';
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       setLoanApplication(route.params.loanApplication);
//     });
  
//     return unsubscribe;
//   }, [navigation, route.params.loanApplication]);

//   const handleGoBack = () => {
//     navigation.navigate("Dashboard");
//   };

//   const handleEdit = () => {
//     navigation.navigate('EditHomeLoan', {
//       loanApplication,
//       onUpdateSuccess: updatedLoanApplication => setLoanApplication(updatedLoanApplication),
//     });
//   }; 

//   const renderImage = () => {
//     if (loanApplication.entityimage) {
//       return (
//         <Image
//           source={{ uri: `data:image/png;base64,${loanApplication.entityimage}` }}
//           style={styles.cardImage}
//         />
//       );
//     } else {
//       const initials = loanApplication ? `${loanApplication.kf_name[0]}${loanApplication.kf_lastname[0]}` : '';
//       return (
//         <View style={styles.cardImage}>
//       <Text style={styles.placeholderText}>{initials}</Text>
//     </View>
//       );
//     }
//   };

//   const handleGoToAmortizationScreen = () => {
//     navigation.navigate('AmortizationScreenHome', {
//       recordId: recordId, // Pass the recordId as a parameter
//       principalLoanAmount: loanApplication.kf_loanamountrequested,
//       loanTermMonths: loanApplication.kf_numberofemi,
//       emiAmount: loanApplication.kf_emi,
//       interestRate: loanApplication.kf_interestrate,
//       name: `${loanApplication.kf_name} ${loanApplication.kf_lastname}`,
//       mobileNumber: loanApplication.kf_mobile,
//       aadharNumber: loanApplication.kf_aadharnumber,
//       panCardNumber: loanApplication.kf_pannumber,
//       emiSchedule: loanApplication.kf_emischedule,
//       applicationNumber: loanApplication.kf_applicationnumber,
//     });
//   };

// const date = loanApplication.kf_emicollectiondate ? new Date(loanApplication.kf_emicollectiondate) : null;
// const formattedDate = date ? date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

// const emischeduleDate = loanApplication.kf_dateofbirth ? new Date(loanApplication.kf_dateofbirth): null;
// const emischeduleDateformatDate = emischeduleDate ? date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

//   return ( 
//     <View style= {styles.container}>
//       <HeaderComponent 
//       titleText="HomeLoan Details" 
//       onPress={handleGoBack} 
//       onIconPress={handleEdit}
//       screenIcon="create-outline"
//       />

// <ScrollView contentContainerStyle={{ width: 405, padding: 15 }}
//     showsVerticalScrollIndicator={false}
//     showsHorizontalScrollIndicator={false}
//     >

//     <View style={styles.imageContainer}>
//       <View style={{ marginLeft: -12 }}>{renderImage()}</View>
//       <View style={{ marginLeft: 5, marginTop: 50 }}>
//         <Text style={styles.cardTitle}>Application No: {loanApplication.kf_applicationnumber}</Text>
//         <Text style={styles.cardTitle}>{`${loanApplication.kf_name}\n ${loanApplication.kf_lastname}`}</Text>
//       </View>
//     </View>

//     <View style={styles.personalDetailContainer} >
//       <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10 }]}>Personal Details</Text>
//       <Text style={styles.cardLabel}>Gender: {getGenderLabel()}</Text>
//       {/* <Text style={styles.cardLabel}>Date of Birth: {loanApplication.kf_dateofbirth ? new Date(loanApplication.kf_dateofbirth).toLocaleDateString('en-US') : ''}</Text> */}
//       <Text style={styles.cardLabel}>Date of Birth: {formattedDate}</Text>
//       <Text style={styles.cardLabel}>Age: {loanApplication.kf_age}</Text>
//       <Text style={styles.cardLabel}>Mobile Number: {loanApplication.kf_mobilenumber}</Text>
//       <Text style={styles.cardLabel}>Email Address: {loanApplication.kf_email}</Text>
//       <Text style={styles.cardLabel}>Address 1: {loanApplication.kf_address1}</Text>
//       <Text style={styles.cardLabel}>Address 2: {loanApplication.kf_address2}</Text>
//       <Text style={styles.cardLabel}>Address 3: {loanApplication.kf_address3}</Text>
//       <Text style={styles.cardLabel}>City: {loanApplication.kf_city}</Text>
//       <Text style={styles.cardLabel}>State: {loanApplication.kf_state}</Text>
//       <Text style={styles.cardLabel}>Loan Amount Requested: {loanApplication.kf_loanamountrequested}</Text>
//       <Text style={styles.cardLabel}>Loan Status: {getLoanStatus()}</Text>
//       {/* {loanApplication.kf_statusR && (<Text style={styles.cardLabel}>Status Reason: {getStatusReason()}</Text>)}
//       {loanApplication.kf_approvaldate && (<Text style={styles.cardLabel}>Approver: {loanApplication.kf_approver}</Text>)}
//       {loanApplication.kf_approvaldate && (<Text style={styles.cardLabel}>Approval Date: {loanApplication.kf_approvaldate}</Text>)} */}
//       {/* {loanApplication.kf_firstemidate && (<Text style={styles.cardLabel}>First EMI Date: {loanApplication.kf_firstemidate}</Text>)} */}
//     </View>

//     <View style={styles.IndentityProofField}>
//       <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10 }]}>Indentity Proof</Text>
//       <Text style={styles.cardLabel}>Aadhar Number: {loanApplication.kf_aadharnumber}</Text>
//       <Text style={styles.cardLabel}>PANcard Number: {loanApplication.kf_pannumber}</Text>
//       <Text style={styles.cardLabel}>Aadhar Image: View</Text>
//       <Text style={styles.cardLabel}>PANcard Image: View </Text>
//     </View>

//     <View style={styles.loanDetailContainer}>
//       <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10 }]}>Loan Details</Text>
//       <Text style={styles.cardLabel}>EMI Schedule: {getEmiSchedule()}</Text>
//       <Text style={styles.cardLabel}>Number Of EMI: {loanApplication.kf_numberofemi}</Text>
//       <Text style={styles.cardLabel}>Interest Rate: {loanApplication.kf_interestrate}</Text>
//       <Text style={styles.cardLabel}>EMI: {loanApplication.kf_emi}</Text>
//       <Text style={styles.cardLabel}>EMI Collection Date: {emischeduleDateformatDate}</Text>
//       <Text style={styles.cardLabel}>Other Charges: {loanApplication.kf_othercharges}</Text>
//     </View>

//     <ButtonComponent style={{ marginBottom: 60 }}
//       title ="Calculate Amortization"
//       onPress={handleGoToAmortizationScreen}
//     />

//     </ScrollView>
//   </View>
// );
// };

// const styles = StyleSheet.create({
// container: {
//   // alignItems: 'center',
// },
// imageContainer: {
//   flexDirection: 'row',
//   marginTop: 10,
//   backgroundColor: "white",
//   width: "95%",
//   padding: 20,
//   shadowColor: '#000',
//   shadowOffset: {
//     width: 0,
//     height: 2,
//   },
//   shadowOpacity: 0.25,
//   shadowRadius: 3.84,
//   elevation: 5,
// },
// personalDetailContainer: {
//   marginTop: 5,
//   width: "95%",
//   paddingVertical: 10, 
//   backgroundColor: "white",
//   shadowColor: '#000',
//   shadowOffset: {
//     width: 0,
//     height: 2,
//   },
//   shadowOpacity: 0.25,
//   shadowRadius: 3.84,
//   elevation: 5,
// },
// IndentityProofField: {
//   marginTop: 5,
//   width: "95%",
//   paddingVertical: 10,
//   backgroundColor: "white",
//   shadowColor: '#000',
//   shadowOffset: {
//     width: 0,
//     height: 2,
//   },
//   shadowOpacity: 0.25,
//   shadowRadius: 3.84,
//   elevation: 5,
// },
// loanDetailContainer: {
//   marginTop: 5,
//   width: "95%",
//   paddingVertical: 10,
//   backgroundColor: "white",
//   shadowColor: '#000',
//   shadowOffset: {
//     width: 0,
//     height: 2,
//   },
//   shadowOpacity: 0.25,
//   shadowRadius: 3.84,
//   elevation: 5
// },
// cardImage: {
//   borderRadius: 40
// },
// cardTitle: {
//   color: "red",
//   fontSize: 16,
//   fontWeight: "bold",
// },
// cardLabel: {
//   color: '#000000',
//   fontSize: 14,
//   marginLeft: 10
// },
// placeholderText: {
//   fontSize: 80,
//   fontWeight: 'bold',
//   color: '#707070',
//   textAlign: 'center',
//   backgroundColor: 'gray',
//   color: 'white',
//   // borderRadius: 100,
//   padding: 15
// },
// });

// export default HomeLoanDetailsScreen;


import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, LogBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../../common/Header';
import ButtonComponent from '../../common/ButtonComponent';

const HomeLoanDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [loanApplication, setLoanApplication] = useState(route.params.loanApplication);
  const [recordId, setRecordId] = useState(route.params.loanApplication.kf_loanApplicationid);

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  const fetchData = useCallback(async () => {
    const simulatedUpdatedData = { ...loanApplication };
    setLoanApplication(simulatedUpdatedData);
  }, [loanApplication]);

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

  // Update recordId when route params change
  useEffect(() => {
    // Update recordId when route params change
    setRecordId(route.params.loanApplication.kf_loanApplicationid);
  }, [route.params.loanApplication.kf_loanApplicationid]);

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

  const date = loanApplication.kf_emicollectiondate ? new Date(loanApplication.kf_emicollectiondate) : null;
  const formattedDate = date ? date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

  const emischeduleDate = loanApplication.kf_dateofbirth ? new Date(loanApplication.kf_dateofbirth) : null;
  const emischeduleDateformatDate = emischeduleDate ? date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

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
          <View style={{ marginLeft: -12 }}>{renderImage()}</View>
          <View style={{ marginLeft: 5, marginTop: 50 }}>
          <Text style={styles.cardTitle}>{`${loanApplication.kf_name} ${loanApplication.kf_lastname}`}</Text>
            <Text style={styles.cardTitle}>Application No: {loanApplication.kf_applicationnumber}</Text>
            <TouchableOpacity onPress={handleNavigateToGuaranteeScreen} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Guarantee</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToGuaranteeScreen2} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Guarantee-2</Text>
          </TouchableOpacity>
          </View>
        </View>

        <View style={styles.personalDetailContainer} >
          <Text style={[styles.cardLabel, { fontSize: 15, fontWeight: "bold", marginBottom: 10 }]}>Personal Details</Text>
          <Text style={styles.cardLabel}>Gender: {getGenderLabel()}</Text>
          <Text style={styles.cardLabel}>Date of Birth: {formattedDate}</Text>
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
          <Text style={styles.cardLabel}>EMI Collection Date: {emischeduleDateformatDate}</Text>
          <Text style={styles.cardLabel}>Other Charges: {loanApplication.kf_othercharges}</Text>
        </View>

        <ButtonComponent style={{ marginBottom: 60 }}
          title="Calculate Amortization"
          onPress={handleGoToAmortizationScreen}
        />

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
    borderRadius: 5,
    marginLeft:20,
    width: "55%"
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeLoanDetailsScreen;
