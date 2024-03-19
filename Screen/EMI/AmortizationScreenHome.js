// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Dimensions, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ButtonComponent from '../../common/ButtonComponent';
// import TextInputComponent from '../../common/TextInput';
// import HeaderComponent from '../../common/Header';

// const AmortizationScreenHome = ({ route }) => {
//   const [recordId, setRecordId] = useState(route.params.recordId);
//   const navigation = useNavigation();
//   const [loanDetails, setLoanDetails] = useState({
//     principalLoanAmount: route.params.principalLoanAmount ? route.params.principalLoanAmount.toString() : '',
//     loanTermMonths: route.params.loanTermMonths ? route.params.loanTermMonths.toString() : '',
//     emiAmount: route.params.emiAmount ? route.params.emiAmount.toString() : '',
//     interestRate: route.params.interestRate ? route.params.interestRate.toString() : '', // Extract interest rate
//     applicationNumber: route.params.applicationNumber ? route.params.applicationNumber.toString() : '',
//     name: route.params.name ? route.params.name.toString() : '',
//     mobileNumber: route.params.mobileNumber ? route.params.mobileNumber.toString() : '',
//     aadharNumber: route.params.aadharNumber ? route.params.aadharNumber.toString() : '',
//     panCardNumber: route.params.panCardNumber ? route.params.panCardNumber.toString() : '',
//     emiSchedule: route.params.emiSchedule ? route.params.emiSchedule.toString() : '',
//     amortizationSchedule: [],
//   });

//   const { isPaid, NoOfEMIsPaid  } = route.params;
//   const [isAmortizationLoaded, setIsAmortizationLoaded] = useState(false);

//   const updatePaidStatus = () => {
//     const { amortizationSchedule } = loanDetails;
//     const updatedAmortizationSchedule = amortizationSchedule.map(item => {
//       if (item.month === route.params.month) {
//         return { ...item, paid: true }; 
//       }
//       return item;
//     });

//     setLoanDetails(prevLoanDetails => ({
//       ...prevLoanDetails,
//       amortizationSchedule: updatedAmortizationSchedule
//     }));

//     // Save updated amortization schedule to AsyncStorage
//     saveAmortizationSchedule(updatedAmortizationSchedule, loanDetails.applicationNumber);
//   };

//   // Function to load amortization schedule and paid status from AsyncStorage
//   const loadAmortizationSchedule = async () => {
//     try {
//       const schedule = await AsyncStorage.getItem(`amortizationSchedule_${loanDetails.applicationNumber}`);
//       if (schedule !== null) {
//         setLoanDetails(prevLoanDetails => ({
//           ...prevLoanDetails,
//           amortizationSchedule: JSON.parse(schedule)
//         }));
//       } else {
//         // If schedule is not found in AsyncStorage, generate and save a new one
//         calculateEMIAmount();
//       }
//     } catch (error) {
//       console.error('Error loading amortization schedule:', error);
//     }
//   };

//   // Function to save amortization schedule to AsyncStorage
//   const saveAmortizationSchedule = async (schedule) => {
//     try {
//       await AsyncStorage.setItem(`amortizationSchedule_${loanDetails.applicationNumber}`, JSON.stringify(schedule));
//     } catch (error) {
//       console.error('Error saving amortization schedule:', error);
//     }
//   };

//   useEffect(() => {
//     loadAmortizationSchedule();
//   }, []);

//   useEffect(() => {
//     if (route.params && route.params.isPaid && route.params.month) {
//       updatePaidStatus();
//     }
//   }, [route.params]);



// const calculateEMIAmount = () => {
//   const { principalLoanAmount, interestRate, loanTermMonths, emiSchedule, applicationNumber } = loanDetails;

//   const monthlyInterestRate = (interestRate / 100) / 12;
//   const weeklyInterestRate = (interestRate / 100) / 52;
//   const dailyInterestRate = (interestRate / 100) / 365;
//   const numberOfPayments = loanTermMonths;

//   let emi;
//   let intervalText;
//   let periodicInterestRate;

//   switch (emiSchedule) {
//       case '1': // Daily
//           periodicInterestRate = dailyInterestRate;
//           intervalText = 'Day';
//           break;
//       case '2': // Weekly
//           periodicInterestRate = weeklyInterestRate;
//           intervalText = 'Week';
//           break;
//       case '3': // Monthly
//       default: // Default to monthly if emiSchedule is not recognized
//           periodicInterestRate = monthlyInterestRate;
//           intervalText = 'Month';
//           break;
//   }

//   // Calculate the loan repayment amount per payment period (R)
//   const R = principalLoanAmount * periodicInterestRate / (1 - Math.pow(1 + periodicInterestRate, -numberOfPayments));

//   // Calculate the EMI amount using the formula
//   emi = R;

//   // Generate amortization schedule after calculating EMI
//   const amortizationSchedule = generateAmortizationSchedule(principalLoanAmount, periodicInterestRate, numberOfPayments, emi, applicationNumber, intervalText);

//   // Update state with calculated EMI and amortization schedule
//   setLoanDetails(prevLoanDetails => ({
//       ...prevLoanDetails,
//       emiAmount: emi.toFixed(2),
//       amortizationSchedule, // Update amortization schedule here
//   }));

//   // Save amortization schedule to AsyncStorage
//   saveAmortizationSchedule(amortizationSchedule);
// };


// const generateAmortizationSchedule = (principal, monthlyInterestRate, numberOfPayments, emi, applicationNumber, intervalText) => {
//   const schedule = [];
//   let remainingBalance = principal;

//   for (let i = 1; i <= numberOfPayments; i++) {
//       // Calculate interest payment
//       const interestPayment = remainingBalance * monthlyInterestRate;

//       let principalPayment;
//       if (i === numberOfPayments) {
//           // For the last month, ensure the remaining balance becomes zero
//           principalPayment = remainingBalance;
//           remainingBalance = 0;
//       } else {
//           // Calculate principal payment for other months
//           principalPayment = emi - interestPayment;
//           remainingBalance -= principalPayment;
//       }

//       // Format payment date
//       const paymentDate = new Date();
//       paymentDate.setDate(paymentDate.getDate() + (i * (intervalText === 'Day' ? 1 : (intervalText === 'Week' ? 7 : 30))));

//       // Format payment date as "DD/MM/YYYY"
//       const formattedDate = formatDate(paymentDate);

//       schedule.push({
//           month: i,
//           paymentDate: formattedDate,
//           emiAmount: emi.toFixed(2),
//           interestPayment: interestPayment.toFixed(2),
//           principalPayment: principalPayment.toFixed(2),
//           remainingBalance: remainingBalance.toFixed(2),
//           applicationNumber: applicationNumber,
//           paid: false // Initialize paid status
//       });
//   }

//   return schedule;
// };



// const handlePaid = (item) => {
//   // Mark the item as paid (update the item in the amortization schedule)
//   const updatedAmortizationSchedule = loanDetails.amortizationSchedule.map(scheduleItem => {
//     if (scheduleItem.month === item.month) {
//       return {
//         ...scheduleItem,
//         paid: true
//       };
//     }
//     return scheduleItem;
//   });

//   // Update amortization schedule in the state
//   setLoanDetails(prevLoanDetails => ({
//     ...prevLoanDetails,
//     amortizationSchedule: updatedAmortizationSchedule
//   }));

//   // Save updated amortization schedule to AsyncStorage for the current user
//   saveAmortizationSchedule(updatedAmortizationSchedule);
// };

// const formatDate = (date) => {
//   const day = date.getDate().toString().padStart(2, '0');
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const year = date.getFullYear().toString();
//   return `${day}/${month}/${year}`;
// };

//   const renderItem = ({ item }) => (
//     <View>
//       <View style={styles.amortizationTile}>
//         <TouchableOpacity onPress={() => navigateToDetails(item)}>
//           <View style={styles.column}>
//             <View style={styles.column1}>
//               {/* <Text>Month: </Text> */}
//               <Text> {item.month}</Text>
//             </View>

//             <View style={styles.column2}>
//               <Text>Date: </Text>
//               <Text>{item.paymentDate}</Text>
//             </View>
//             <View style={[styles.column3, { top: shouldAdjustTop() }]}>
//               <Text>EMI Amount: </Text>
//               <Text>{item.emiAmount}</Text>
//             </View>
//           </View>
//         </TouchableOpacity>
//         <View style={styles.column4}>
//           <View style={styles.column4}>
//           <TouchableOpacity 
//   // onPress={() => handlePaid(item)} // Pass item as parameter
//   style={[styles.paidButton, { backgroundColor: item.paid ? 'green' : 'red' }]}>
//   <Text style={styles.paidButtonText}>{item.paid ? 'Paid' : 'Unpaid'}</Text>
// </TouchableOpacity>

//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   const navigateToDetails = (scheduleItem) => {
//     navigation.navigate('ScheduleDetailsScreenHomeLoan', { 
//       scheduleItem: scheduleItem,
//       recordId: recordId,
//       loanDetails,
//       applicationNumber: loanDetails.applicationNumber
//     });
//   };

//   useEffect(() => {
//     if (route.params && route.params.isPaid && route.params.month) {
//       const updatedAmortizationSchedule = loanDetails.amortizationSchedule.map(item => {
//         if (item.month === route.params.month) {
//           return { ...item, paid: true }; 
//         }
//         return item;
//       });

//       setLoanDetails(prevLoanDetails => ({
//         ...prevLoanDetails,
//         amortizationSchedule: updatedAmortizationSchedule
//       }));

//       // Save updated amortization schedule to AsyncStorage for the current user
//       saveAmortizationSchedule(updatedAmortizationSchedule, loanDetails.applicationNumber);
//     }
//   }, [route.params]);

//   const getEmiSchedule = (emiSchedule) => {
//     switch (emiSchedule) {
//       case '1':
//         return 'Daily';
//       case '2':
//         return 'Weekly';
//       case '3':
//         return 'Monthly';
//       default:
//         return '';
//     }
//   };

//   const shouldAdjustTop = () => {
//     return Dimensions.get('window').width > 600 ? -61 : -71;
//   };

//   const countPaidEMIs = () => {
//     return loanDetails.amortizationSchedule.filter(item => item.paid).length;
// };

//   const handleGoBackPersonaldetails = () => {
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       <HeaderComponent titleText="Home Schedule Details" onPress={handleGoBackPersonaldetails}/>
//       <Text style={[styles.amortizationTitle, {marginTop: 10}]}>EMI Details</Text>
//       <View style={{ paddingHorizontal: 15 }}>

//     <View style={{ flexDirection: "row"}}>
//           <Text style={styles.detailsLabel}>Name:</Text>
//           <TextInput
//             style={styles.textInputContainer}
//             value={loanDetails.name}
//             onChangeText={(text) => setLoanDetails({ ...loanDetails, principalLoanAmount: text })}
//             editable={false}
//           />
//         </View>

//         <View style={{ flexDirection: "row"}}>
//           <Text style={styles.detailsLabel}>Application Number:</Text>
//           <TextInput
//             style={styles.textInputContainer}
//             value={loanDetails.applicationNumber}
//             onChangeText={(text) => setLoanDetails({ ...loanDetails, principalLoanAmount: text })}
//             editable={false}
//           />
//         </View>

//         <View style={{ flexDirection: "row"}}>
//           <Text style={styles.detailsLabel}>Loan Amount:</Text>
//           <TextInput
//             style={styles.textInputContainer}
//             value={loanDetails.principalLoanAmount}
//             onChangeText={(text) => setLoanDetails({ ...loanDetails, principalLoanAmount: text })}
//             editable={false}
//           />
//         </View>
//         <View style={{ flexDirection: "row"}}>
//         <Text style={styles.detailsLabel}>Annual Interest Rate(%):</Text>
//         <TextInput
//           style={styles.textInputContainer}
//           value={loanDetails.interestRate}
//           onChangeText={(text) => setLoanDetails({ ...loanDetails, interestRate: text })}
//           editable={false}
//         />
//         </View>

//         <View style={{ flexDirection: "row"}}>
//           <Text style={styles.detailsLabel}>EMI schedule:</Text>
//           <TextInput
//             style={styles.textInputContainer}
//             value={getEmiSchedule(loanDetails.emiSchedule)}
//             onChangeText={(text) => setLoanDetails({ ...loanDetails, emiSchedule: text })}
//             editable={false}
//           />
//         </View>

//         <View style={{ flexDirection: "row" }}>
//         <Text style={styles.detailsLabel}>Loan Term:</Text>
//         <TextInput
//           style={styles.textInputContainer}
//           value={loanDetails.loanTermMonths}
//           onChangeText={(text) => setLoanDetails({ ...loanDetails, loanTermMonths: text })}
//           editable={false}
//         />
//         </View>
//         <View style={{ flexDirection: "row" }}>
//         <Text style={styles.detailsLabel}>EMI Amount (Months):</Text>
//         <TextInput
//           style={styles.textInputContainer}
//           value={loanDetails.emiAmount}
//           onChangeText={(text) => setLoanDetails({ ...loanDetails, emiAmount: text })}
//           editable={false}
//         />
//       </View>
//       </View>

//       <Text style={styles.amortizationTitle}>No of EMI Paid: {countPaidEMIs()}</Text>

//       <Text style={styles.amortizationTitle}>Amortization Schedule</Text>

//       {/* <FlatList
//         data={loanDetails.amortizationSchedule}
//         keyExtractor={(item) => item.month.toString()}
//         renderItem={renderItem}
//       /> */}

// <FlatList
//   data={loanDetails.amortizationSchedule}
//   keyExtractor={(item, index) => `${loanDetails.applicationNumber}_${item.month}_${index}`}
//   renderItem={renderItem}
// />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   textInputContainer: {
//     color: "gray",
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     borderRadius: 8,
//     backgroundColor: '#FBFCFC',
//     padding: 10,
//     marginVertical: 2,
//     height: 37,
//     width: "50%",
//     marginTop: 6
//   },
//   amortizationTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 0,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   amortizationTile: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: 'gray',
//     marginHorizontal: 10
//   },
//   column: {
//     height: 25,
//     marginTop:15
//   },
//   column1: {
//     flexDirection: 'column',
//   },
//   column2: {
//     flexDirection: 'column',
//     marginLeft: 50,
//     top: -32,
//   },
//   column3: {
//     flexDirection: 'column',
//     marginLeft: 160,
//   },
//   column4: {
//     top: 0,
//   },
//   paidButton: {
//     backgroundColor: 'green',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   paidButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   detailsLabel:{
//     width: "50%",
//     marginVertical: 15
//   }
// });


// export default AmortizationScreenHome;








import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Dimensions, StyleSheet, FlatList, TouchableOpacity, scrollViewRef, ScrollView, Button, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonComponent from '../../common/ButtonComponent';
import TextInputComponent from '../../common/TextInput';
import HeaderComponent from '../../common/Header';
import axios from 'axios';

const AmortizationScreenHome = ({ route }) => {
  const [recordId, setRecordId] = useState(route.params.recordId);
  const navigation = useNavigation();
  const [loanDetails, setLoanDetails] = useState({
    principalLoanAmount: route.params.principalLoanAmount ? route.params.principalLoanAmount.toString() : '',
    loanTermMonths: route.params.loanTermMonths ? route.params.loanTermMonths.toString() : '',
    emiAmount: route.params.emiAmount ? route.params.emiAmount.toString() : '',
    interestRate: route.params.interestRate ? route.params.interestRate.toString() : '', // Extract interest rate
    applicationNumber: route.params.applicationNumber ? route.params.applicationNumber.toString() : '',
    name: route.params.name ? route.params.name.toString() : '',
    mobileNumber: route.params.mobileNumber ? route.params.mobileNumber.toString() : '',
    aadharNumber: route.params.aadharNumber ? route.params.aadharNumber.toString() : '',
    panCardNumber: route.params.panCardNumber ? route.params.panCardNumber.toString() : '',
    emiSchedule: route.params.emiSchedule ? route.params.emiSchedule.toString() : '',
    amortizationSchedule: [],
  });

  const { isPaid, NoOfEMIsPaid } = route.params;
  const [isAmortizationLoaded, setIsAmortizationLoaded] = useState(false);

  const [kf_emicollectiondate, setkf_emicollectiondate] = useState(route.params.kf_emicollectiondate);
  const [kf_paidstatus, setkf_paidstatus] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [createdRecords, setCreatedRecords] = useState([]);
  const [fetchedRecords, setFetchedRecords] = useState([]);
  const [fetchedSavedRecords, setfetchedSavedRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef(null);
  const [recordsFetched, setRecordsFetched] = useState(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

  useEffect(() => {
    if (fetchedRecords.length >= 0) {
      setIsSaving(false); // Ensure saving is disabled if there are fetched records
    }
  }, [fetchedRecords]);

  useEffect(() => {
    if (fetchedSavedRecords.length >= 0) {
      setIsSaving(false); // Ensure saving is disabled if there are fetched records
    }
  }, [fetchedSavedRecords]);

  useEffect(() => {

    if (scrollViewRef.current && scrollViewRef.current.scrollToEnd) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [createdRecords]);

  const fetchData = async () => {
    try {
      const tokenResponse = await axios.post(
        "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token", {
        grant_type: "client_credentials",
        client_id: "d9dcdf05-37f4-4bab-b428-323957ad2f86",
        resource: "https://org0f7e6203.crm5.dynamics.com",
        client_secret: "JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2",
      }, {
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        }
      }
      );
      const accessToken = tokenResponse.data.access_token;
      // Fetch kf_loan records from CRM
      const response = await axios.get(
        "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loans", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
      );
      const fetchedRecords = response.data.value
        .map(record => {
          let formattedDate;
          if (record.kf_receiveddate) {
            formattedDate = format(record.kf_receiveddate); // Assuming format is your date formatting function
          } else {
            formattedDate = record.kf_receiveddate;
          }
          return {
            ...record,
            kf_receiveddate: formattedDate
          };
        })
        .filter(record => {
          // console.log("Record:", record); // Log each record to see if they match the filter condition
          return record.kf_applicationnumber === loanDetails.applicationNumber && record.kf_paidstatus === false;
        })
        .slice(0, 2); // Limit to two records

      setFetchedRecords(fetchedRecords);
      setIsLoading(false);
      setSaveButtonDisabled(true);
    } catch (error) {
      console.error("Error fetching loan records:", error);
    }
  };

  const fetchValues = async () => {
    try {
      const tokenResponse = await axios.post(
        "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token", {
        grant_type: "client_credentials",
        client_id: "d9dcdf05-37f4-4bab-b428-323957ad2f86",
        resource: "https://org0f7e6203.crm5.dynamics.com",
        client_secret: "JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2",
      }, {
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        }
      }
      );

      const accessToken = tokenResponse.data.access_token;
      // Fetch kf_loan records from CRM
      const responses = await axios.get(
        "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loans", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
      );
      const fetchedSavedRecords = responses.data.value
        .map(record => {
          let formattedDate;
          if (record.kf_receiveddate) {
            formattedDate = format(record.kf_receiveddate); // Assuming format is your date formatting function
          } else {
            formattedDate = record.kf_receiveddate;
          }
          return {
            ...record,
            kf_receiveddate: formattedDate
          };
        })
        .filter(record => {
          // console.log("Record:", record); // Log each record to see if they match the filter condition
          return record.kf_applicationnumber === loanDetails.applicationNumber && record.kf_paidstatus === true;
        })
      // Limit to two records
      setfetchedSavedRecords(fetchedSavedRecords);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching loan records:", error);
    }
  };

  const format = (dateString) => {
    if (!dateString) return "N/A"; // Handling null or undefined date
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      // If it's a valid date string in ISO format (e.g., "2024-03-13T00:00:00Z")
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      return `${day}/${month}/${year}`;
    } else {
      // If it's already in dd/mm/yyyy format
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${day}/${month}/${year}`;
      } else {
        return "Invalid Date";
      }
    }
  };

  const handlePaidStatus = (selectedPaidStatus) => {
    let numericValue;
    switch (selectedPaidStatus) {
      case 'Unpaid':
        numericValue = 0;
        break;
      case 'Paid':
        numericValue = 1;
        break;
      default:
        numericValue = 0;
    }
    setkf_paidstatus(numericValue);
  };

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      const delayInMilliseconds = 1;
      setTimeout(async () => {
        await fetchData();
      }, delayInMilliseconds);
    });
    return () => {
      unsubscribeFocus();
    };
  }, [navigation, fetchData]);


  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      const delayInMilliseconds = 1;
      setTimeout(async () => {
        await fetchValues();
      }, delayInMilliseconds);
    });
    return () => {
      unsubscribeFocus();
    };
  }, [navigation, fetchValues]);

  const updatePaidStatus = () => {
    const { amortizationSchedule } = loanDetails;
    const updatedAmortizationSchedule = amortizationSchedule.map(item => {
      if (item.month === route.params.month) {
        return { ...item, paid: true };
      }
      return item;
    });

    setLoanDetails(prevLoanDetails => ({
      ...prevLoanDetails,
      amortizationSchedule: updatedAmortizationSchedule
    }));

    // Save updated amortization schedule to AsyncStorage
    saveAmortizationSchedule(updatedAmortizationSchedule, loanDetails.applicationNumber);
  };

  // Function to load amortization schedule and paid status from AsyncStorage
  const loadAmortizationSchedule = async () => {
    try {
      const schedule = await AsyncStorage.getItem(`amortizationSchedule_${loanDetails.applicationNumber}`);
      if (schedule !== null) {
        setLoanDetails(prevLoanDetails => ({
          ...prevLoanDetails,
          amortizationSchedule: JSON.parse(schedule)
        }));
      } else {
        // If schedule is not found in AsyncStorage, generate and save a new one
        calculateEMIAmount();
      }
    } catch (error) {
      console.error('Error loading amortization schedule:', error);
    }
  };

  // Function to save amortization schedule to AsyncStorage
  const saveAmortizationSchedule = async (schedule) => {
    try {
      await AsyncStorage.setItem(`amortizationSchedule_${loanDetails.applicationNumber}`, JSON.stringify(schedule));
    } catch (error) {
      console.error('Error saving amortization schedule:', error);
    }
  };

  useEffect(() => {
    loadAmortizationSchedule();
  }, []);

  useEffect(() => {
    if (route.params && route.params.isPaid && route.params.month) {
      updatePaidStatus();
    }
  }, [route.params]);

  const calculateEMIAmount = () => {
    const { principalLoanAmount, interestRate, loanTermMonths, emiSchedule, applicationNumber } = loanDetails;

    const monthlyInterestRate = (interestRate / 100) / 12;
    const weeklyInterestRate = (interestRate / 100) / 52;
    const dailyInterestRate = (interestRate / 100) / 365;
    const numberOfPayments = loanTermMonths;

    let emi;
    let intervalText;
    let periodicInterestRate;

    switch (emiSchedule) {
      case '1': // Daily
        periodicInterestRate = dailyInterestRate;
        intervalText = 'Day';
        break;
      case '2': // Weekly
        periodicInterestRate = weeklyInterestRate;
        intervalText = 'Week';
        break;
      case '3': // Monthly
      default: // Default to monthly if emiSchedule is not recognized
        periodicInterestRate = monthlyInterestRate;
        intervalText = 'Month';
        break;
    }

    // Calculate the loan repayment amount per payment period (R)
    const R = principalLoanAmount * periodicInterestRate / (1 - Math.pow(1 + periodicInterestRate, -numberOfPayments));

    // Calculate the EMI amount using the formula
    emi = R;

    // Generate amortization schedule after calculating EMI
    const amortizationSchedule = generateAmortizationSchedule(principalLoanAmount, periodicInterestRate, numberOfPayments, emi, applicationNumber, intervalText);

    // Update state with calculated EMI and amortization schedule
    setLoanDetails(prevLoanDetails => ({
      ...prevLoanDetails,
      emiAmount: emi.toFixed(2),
      amortizationSchedule, // Update amortization schedule here
    }));

    // Save amortization schedule to AsyncStorage
    saveAmortizationSchedule(amortizationSchedule);
  };

  const generateAmortizationSchedule = (principal, periodicInterestRate, numberOfPayments, emi, applicationNumber, intervalText) => {
    const schedule = [];
    let remainingBalance = principal;

    for (let i = 1; i <= numberOfPayments; i++) {
      // Calculate interest payment
      const interestPayment = remainingBalance * periodicInterestRate;

      let principalPayment;
      if (i === numberOfPayments) {
        // For the last month, ensure the remaining balance becomes zero
        principalPayment = remainingBalance;
        remainingBalance = 0;
      } else {
        // Calculate principal payment for other months
        principalPayment = emi - interestPayment;
        remainingBalance -= principalPayment;
      }


      // const paymentDate = new Date();
      // paymentDate.setDate(paymentDate.getDate() + (i * (intervalText === 'Day' ? 1 : (intervalText === 'Week' ? 7 : 30))));

      const paymentDate = new Date();
      if (intervalText === 'Day') {
        paymentDate.setDate(paymentDate.getDate() + (i * 1));
      } else if (intervalText === 'Week') {
        paymentDate.setDate(paymentDate.getDate() + (i * 7));
      } else if (intervalText === 'Month') {
        paymentDate.setMonth(paymentDate.getMonth() + i);
      }


      // Format payment date
      const formattedDate = formatDate(paymentDate);

      // Function to format date
      function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
      }

      schedule.push({
        month: i,
        paymentDate: formattedDate,
        emiAmount: emi.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        principalPayment: principalPayment.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
        applicationNumber: applicationNumber,
        paid: false // Initialize paid status
      });
    }

    return schedule;
  };

  const sendRecordsToCRM = async () => {
    setIsSaving(true);
    try {
      const tokenResponse = await axios.post(
        "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token",
        {
          grant_type: "client_credentials",
          client_id: "d9dcdf05-37f4-4bab-b428-323957ad2f86",
          resource: "https://org0f7e6203.crm5.dynamics.com",
          client_secret: "JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2",
        },
        { headers: { "content-type": "application/x-www-form-urlencoded" } }
      );

      const accessToken = tokenResponse.data.access_token;

      const createdRecordsArray = [];

      for (const item of loanDetails.amortizationSchedule) {
        const payload = {
          kf_applicationnumber: loanDetails.applicationNumber,
          kf_principalloanamount: item.principalPayment,
          kf_annualinterest: item.interestPayment,
          kf_emiamount: item.emiAmount,
          kf_totalmonths: item.month.toString(),
          kf_receiveddate: item.paymentDate,
          kf_remainingbalance: item.remainingBalance,
          kf_paidstatus: !!kf_paidstatus,
        };

        console.log('payload', payload);


        const createRecordResponse = await axios.post(
          "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loans",
          payload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (createRecordResponse.status === 204) {
          const createdRecordId = createRecordResponse.headers["odata-entityid"];
          const match = createdRecordId.match(/\(([^)]+)\)/);
          const idWithoutParenthesis = match ? match[1] : null;
          if (idWithoutParenthesis) {
            createdRecordsArray.push({ ...payload, id: idWithoutParenthesis });
          } else {
            console.error("Failed to extract ID from odata-entityid:", createdRecordId);
          }
        } else {
          console.log("Failed to create a record in CRM.");
          Alert.alert("Error", "Failed to create a record in CRM.");
          setIsSaving(false);
          return;
        }
      }

      setCreatedRecords(createdRecordsArray);
      Alert.alert('All records created successfully in CRM');
      console.log('All records created successfully in CRM')
      // navigation.navigate('Dashboard');
    } catch (error) {
      console.error("Error during record creation:", error);
      if (error.response) {
        console.log("Detailed Error Response:", error.response.data);
      }
      Alert.alert("Error", "An unexpected error occurred. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    await sendRecordsToCRM();
    await fetchData();
    await fetchValues();
    setRecordsFetched(true); // Set recordsFetched to true when saving is initiated
    setSaveButtonDisabled(true);

  };

  const handlePress = (item) => {
    navigation.navigate('EditLoanDetail', {
      record: item,
      recordId: recordId,
      principalLoanAmount: item.kf_principalloanamount,
      kf_paidstatus: item.kf_paidstatus,
      receivedDate: item.kf_receiveddate,
      isPaid: item.kf_paidstatus, // Assuming this is the same as kf_paidstatus
      remainingBalance: item.kf_remainingbalance,
      emiAmount: item.kf_emiamount,
      applicationNumber: item.kf_applicationnumber,
      kf_totalmonths: item.month,
      kf_annualinterest: item.interestPayment
    });
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };


  const handleGoBackHomedetails = () => {
    navigation.goBack();
  };

  const getEmiSchedule = (emiSchedule) => {
    switch (emiSchedule) {
      case '1':
        return 'Daily';
      case '2':
        return 'Weekly';
      case '3':
        return 'Monthly';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <HeaderComponent titleText="HomeLoan EMI Summary" onPress={handleGoBackHomedetails} />
      <ScrollView>
        <Text style={[styles.amortizationTitle, { marginTop: 10 }]}>EMI Details</Text>
        <View style={{ paddingHorizontal: 15, marginBottom: 20 }}>

          <View style={{ flexDirection: "row" }}>
            <Text style={styles.detailsLabel}>Name:</Text>
            <TextInput
              style={styles.textInputContainer}
              value={loanDetails.name}
              onChangeText={(text) => setLoanDetails({ ...loanDetails, principalLoanAmount: text })}
              editable={false}
            />
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={styles.detailsLabel}>Application Number:</Text>
            <TextInput
              style={styles.textInputContainer}
              value={loanDetails.applicationNumber}
              onChangeText={(text) => setLoanDetails({ ...loanDetails, principalLoanAmount: text })}
              editable={false}
            />
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={styles.detailsLabel}>Loan Amount:</Text>
            <TextInput
              style={styles.textInputContainer}
              value={loanDetails.principalLoanAmount}
              onChangeText={(text) => setLoanDetails({ ...loanDetails, principalLoanAmount: text })}
              editable={false}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.detailsLabel}>Annual Interest Rate(%):</Text>
            <TextInput
              style={styles.textInputContainer}
              value={loanDetails.interestRate}
              onChangeText={(text) => setLoanDetails({ ...loanDetails, interestRate: text })}
              editable={false}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.detailsLabel}>EMI schedule:</Text>
            <TextInput
              style={styles.textInputContainer}
              value={getEmiSchedule(loanDetails.emiSchedule)}
              onChangeText={(text) => setLoanDetails({ ...loanDetails, emiSchedule: text })}
              editable={false}
            />
          </View>

          {/* <View style={{ flexDirection: "row"}}>
        <Text style={styles.detailsLabel}>EMI Collection date:</Text>
        <TextInput
          style={styles.textInputContainer}
          value={format(kf_emicollectiondate)}
          onChangeText={(text) => setkf_emicollectiondate()}
          editable={false}
        />
      </View> */}

          <View style={{ flexDirection: "row" }}>
            <Text style={styles.detailsLabel}>Loan Term (Months):</Text>
            <TextInput
              style={styles.textInputContainer}
              value={loanDetails.loanTermMonths}
              onChangeText={(text) => setLoanDetails({ ...loanDetails, loanTermMonths: text })}
              editable={false}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.detailsLabel}>EMI Amount (Months):</Text>
            <TextInput
              style={styles.textInputContainer}
              value={loanDetails.emiAmount}
              onChangeText={(text) => setLoanDetails({ ...loanDetails, emiAmount: text })}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.createdRecordsList}>
          <Text style={styles.amortizationTitle}>EMI Unpaid Records:</Text>
          {fetchedRecords.filter(record => record.kf_applicationnumber === loanDetails.applicationNumber && record.kf_paidstatus === false).length === 0 ? (
            <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
              <Text>No unpaid records found.</Text>
            </View>
          ) : (
            <View style={[styles.scrollViewContent, { marginBottom: 20 }]}>
              {/* <ScrollView contentContainerStyle={styles.scrollViewContent} ref={scrollViewRef}> */}
              {fetchedRecords
                .filter(record => record.kf_applicationnumber === loanDetails.applicationNumber && record.kf_paidstatus === false)
                .map((item) => (
                  <View key={item.kf_loanId}>
                    <View style={styles.amortizationTile}>
                      <TouchableOpacity onPress={() => handlePress(item)}>
                        <View style={styles.column}>
                          <View style={styles.column1}>
                            <Text>Term</Text>
                            <Text>{parseInt(item.kf_totalmonths)}</Text>
                          </View>
                          <View style={styles.column2}>
                            <Text>EMI Amount</Text>
                            <Text>{item.kf_emiamount}</Text>
                          </View>
                          <View style={styles.column3}>
                            <Text>Payment Date</Text>
                            <Text>{(item.kf_receiveddate)}</Text>
                          </View>
                          <View style={[styles.column4, { backgroundColor: item.kf_paidstatus ? 'green' : 'red' }]}>
                            <Text style={{ color: "white", fontWeight: "bold", textAlign: "center", marginVertical: -5 }}>
                              {item.kf_paidstatus ? 'Paid' : 'Unpaid'}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              {/* </ScrollView> */}
            </View>
          )}
        </View>

        <View style={styles.createdRecordsContainer}>
          <Text style={styles.amortizationTitle}>EMI Paid Records:</Text>
          {fetchedSavedRecords.filter(record => record.kf_applicationnumber === loanDetails.applicationNumber).length === 0 ? (
            <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
              <Text>No paid records found.</Text>
            </View>
          ) : (
            <View style={styles.scrollViewContent}>
              {/* <ScrollView contentContainerStyle={styles.scrollViewContent} ref={scrollViewRef}> */}
              {fetchedSavedRecords
                .filter(record => record.kf_applicationnumber === loanDetails.applicationNumber)
                .map((item) => (
                  <View key={item.kf_loanId}>
                    <View style={styles.amortizationTile}>
                      <TouchableOpacity onPress={() => handlePress(item)}>
                        <View style={styles.column}>
                          <View style={styles.column1}>
                            <Text>Term</Text>
                            <Text>{parseInt(item.kf_totalmonths)}</Text>
                          </View>
                          <View style={styles.column2}>
                            <Text>EMI Amount</Text>
                            <Text>{item.kf_emiamount}</Text>
                          </View>
                          <View style={styles.column3}>
                            <Text>Payment Date</Text>
                            <Text>{(item.kf_receiveddate)}</Text>
                          </View>
                          <View style={[styles.column4, { backgroundColor: item.kf_paidstatus ? 'green' : 'red' }]}>
                            <Text style={{ color: "white", fontWeight: "bold", textAlign: "center", marginVertical: -5 }}>
                              {item.kf_paidstatus ? 'Paid' : 'Unpaid'}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              {/* </ScrollView> */}
            </View>
          )}
        </View>

        {/* {!recordsFetched && !saveButtonDisabled && (
  <Button
    title="Save Records to CRM"
    onPress={() => {
      handleSave();
      setRecordsFetched(true); // Set recordsFetched to true when saving is initiated
    }}
    disabled={isSaving}
  />
)} */}

        {/* {fetchedRecords.filter(record => record.kf_applicationnumber === loanDetails.applicationNumber && record.kf_paidstatus === false).length === 0 && (
        <ButtonComponent
          title="Create EMI Schedule"
          onPress={() => {
            handleSave();
            setRecordsFetched(true); // Set recordsFetched to true when saving is initiated
          }}
          disabled={isSaving}
        />
      )} */}
        {fetchedRecords.filter(record => record.kf_applicationnumber === loanDetails.applicationNumber && record.kf_paidstatus === false).length === 0 && (
          <View>
            {fetchedSavedRecords.filter(record => record.kf_applicationnumber === loanDetails.applicationNumber).length === 0 && (
              <ButtonComponent
                title="Create EMI Schedule"
                onPress={() => {
                  handleSave();
                  setRecordsFetched(true); // Set recordsFetched to true when saving is initiated
                }}
                disabled={isSaving}
              />
            )}
          </View>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputContainer: {
    color: "gray",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 8,
    backgroundColor: '#FBFCFC',
    padding: 10,
    marginVertical: 2,
    height: 37,
    width: "50%",
    marginTop: 6
  },
  amortizationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "red"
  },
  amortizationTile: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginHorizontal: 5,
    maxHeight: 100
  },
  column: {
    flexDirection: 'row',
    alignSelf: "center"
  },
  column1: {
    marginLeft: 5
  },
  column2: {
    marginLeft: 25,
  },
  column3: {
    marginLeft: 20
  },
  column4: {
    marginLeft: 35,
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 10,
    color: 'white',
    width: "20%",
    height: 28,
    alignSelf: "center"
  },
  paidButton: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  paidButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  detailsLabel: {
    width: "50%",
    marginVertical: 15,
    fontSize: 14,
    fontWeight: "bold"
  },
  createdRecordsContainer: {
    flex: 1,
    marginVertical: 10,
    marginTop: -10,
  },
  createdRecordsList: {
    flex: 1,
    marginVertical: 10,
    marginTop: -10,
  },
  createdRecordsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  gridItem: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  gridItemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    marginLeft: 30
  },
});


export default AmortizationScreenHome;