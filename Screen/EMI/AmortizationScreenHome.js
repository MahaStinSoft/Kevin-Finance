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

//   // const [isPaid, setIsPaid] = useState(false);
//   const { isPaid, NoOfEMIsPaid  } = route.params;
//   const [isEMICalculated, setIsEMICalculated] = useState(false); 
//   const [isAmortizationLoaded, setIsAmortizationLoaded] = useState(false); 

//   useEffect(() => {
//     // Load amortization schedule from AsyncStorage when the component mounts
//     setRecordId(route.params.recordId);
//     loadAmortizationSchedule();
//     setIsEMICalculated(loanDetails.amortizationSchedule.length > 0); 
//     calculateEMIAmount();
//   }, [route.params.recordId]);

//   useEffect(() => {
//     if (loanDetails.amortizationSchedule.length > 0 && !loanDetails.amortizationSchedule[0].paid) {
//       const updatedAmortizationSchedule = loanDetails.amortizationSchedule.map((item, index) => {
//         if (index === 0) {
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
//   }, [loanDetails.amortizationSchedule]);

// const loadAmortizationSchedule = async () => {
//   try {
//     // Load amortization schedule for the current user using their application number
//     const schedule = await AsyncStorage.getItem(`amortizationSchedule_${loanDetails.applicationNumber}`);
//     if (schedule !== null) {
//       setLoanDetails(prevLoanDetails => ({
//         ...prevLoanDetails,
//         amortizationSchedule: JSON.parse(schedule)
//       }));
//       setIsAmortizationLoaded(true);
//     }
//   } catch (error) {
//     console.error('Error loading amortization schedule:', error);
//   }
// };

// const saveAmortizationSchedule = async (schedule, applicationNumber) => {
//   try {
//     // Save the amortization schedule with a key that includes the application number
//     await AsyncStorage.setItem(`amortizationSchedule_${applicationNumber}`, JSON.stringify(schedule));
//   } catch (error) {
//     console.error('Error saving amortization schedule:', error);
//   }
// };

//   const calculateEMIAmount = () => {
//     const { principalLoanAmount, interestRate, loanTermMonths, applicationNumber } = loanDetails;

//     const monthlyInterestRate = (interestRate / 100) / 12;
//     const numberOfPayments = loanTermMonths;

//     const emi = principalLoanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
//       (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

//     // Generate amortization schedule after calculating EMI
//     const amortizationSchedule = generateAmortizationSchedule(principalLoanAmount, monthlyInterestRate, numberOfPayments, emi, applicationNumber);

//     // Update state with calculated EMI and amortization schedule
//     setLoanDetails((prevLoanDetails) => ({
//       ...prevLoanDetails,
//       emiAmount: emi.toFixed(2),
//       amortizationSchedule, // Update amortization schedule here
//     }));

//     // Save amortization schedule to AsyncStorage
//     saveAmortizationSchedule(amortizationSchedule);
//     setIsEMICalculated(true);
//   };

//   const generateAmortizationSchedule = (principal, monthlyInterestRate, numberOfPayments, emi, applicationNumber) => {
//     const schedule = [];
//     let remainingBalance = principal;

//     // Start from current month
//     const currentDate = new Date();

//     for (let i = 1; i <= numberOfPayments; i++) {
//       // Calculate interest and principal payments
//       const interestPayment = remainingBalance * monthlyInterestRate;
//       const principalPayment = emi - interestPayment;
//       remainingBalance -= principalPayment;

//       // Calculate payment date
//       const paymentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);

//       // Format payment date as "DD/MM/YYYY"
//       const formattedDate = formatDate(paymentDate);

//       schedule.push({
//         month: i,
//         paymentDate: formattedDate,
//         emiAmount: emi.toFixed(2),
//         interestPayment: interestPayment.toFixed(2),
//         principalPayment: principalPayment.toFixed(2),
//         remainingBalance: remainingBalance.toFixed(2),
//         applicationNumber: applicationNumber,
//         paid: false // Initialize paid status
//       });
//     }

//     return schedule;
//   };

//   // Helper function to format date as "DD/MM/YYYY"
//   const formatDate = (date) => {
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear().toString();
//     return `${day}/${month}/${year}`;
//   };

//   const renderItem = ({ item }) => (
//     <View>
//       <View style={styles.amortizationTile}>
//         <TouchableOpacity onPress={() => navigateToDetails(item)}>
//           <View style={styles.column}>
//             <View style={styles.column1}>
//               <Text>Month: </Text>
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
//             <View 
//             style={[styles.paidButton, { backgroundColor: item.paid ? 'green' : 'red' }]}>
//               <Text style={styles.paidButtonText}>{item.paid ? 'Paid' : 'Unpaid'}</Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   const navigateToDetails = (scheduleItem) => {
//     navigation.navigate('ScheduleDetailsScreenHomeLoan', { 
//       scheduleItem,
//       loanDetails,
//       applicationNumber: loanDetails.applicationNumber  
//     });
//   };
  
//   useEffect(() => {
//     if (route.params && route.params.isPaid && route.params.month) {
//       const updatedAmortizationSchedule = loanDetails.amortizationSchedule.map(item => {
//         if (item.month === route.params.month) {
//           return { ...item, paid: true }; // Mark the item as paid
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

//   const deviceWidth = Dimensions.get('window').width;
//   console.log("Device width:", deviceWidth);

//   const shouldAdjustTop = () => {
//     return Dimensions.get('window').width > 600 ? -61 : -71;
//   };

//   const countPaidEMIs = () => {
//     return loanDetails.amortizationSchedule.filter(item => item.paid).length;
// };

//   const handleGoBackPersonaldetails = () => {
//     navigation.goBack();
//   };

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

//   return (
//     <View style={styles.container}>
//       <HeaderComponent titleText="Schedule Details(Home)" onPress={handleGoBackPersonaldetails}/>
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
//         <Text style={styles.detailsLabel}>Loan Term (Months):</Text>
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

//       <FlatList
//         data={loanDetails.amortizationSchedule}
//         keyExtractor={(item, index) => `${loanDetails.applicationNumber}_${item.month}_${index}`}
//         renderItem={renderItem}
//       />

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
//     height: 40,
//   },
//   column1: {
//     flexDirection: 'column',
//   },
//   column2: {
//     flexDirection: 'column',
//     marginLeft: 70,
//     top: -32,
//   },
//   column3: {
//     flexDirection: 'column',
//     marginLeft: 180,
//   },
//   column4: {
//     top: -5,
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







import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Dimensions, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonComponent from '../../common/ButtonComponent';
import TextInputComponent from '../../common/TextInput';
import HeaderComponent from '../../common/Header';

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

  // const [isPaid, setIsPaid] = useState(false);
  const { isPaid, NoOfEMIsPaid  } = route.params;
  const [isEMICalculated, setIsEMICalculated] = useState(false); 
  const [isAmortizationLoaded, setIsAmortizationLoaded] = useState(false); 

  useEffect(() => {
    loadAmortizationSchedule();
    calculateEMIAmount();
  }, [route.params.recordId]);

  useEffect(() => {
    fetchPaidStatus(); // Fetch paid status when the component mounts
  }, [loanDetails.applicationNumber]);

  const fetchPaidStatus = async () => {
    try {
      const updatedAmortizationSchedule = await loadAmortizationScheduleFromStorage();
      setLoanDetails(prevLoanDetails => ({
        ...prevLoanDetails,
        amortizationSchedule: updatedAmortizationSchedule
      }));
    } catch (error) {
      console.error('Error fetching paid status:', error);
    }
  };

  const loadAmortizationScheduleFromStorage = async () => {
    try {
      const schedule = await AsyncStorage.getItem(`amortizationSchedule_${loanDetails.applicationNumber}`);
      if (schedule !== null) {
        return JSON.parse(schedule);
      }
    } catch (error) {
      console.error('Error loading amortization schedule:', error);
    }
    return [];
  };

  useEffect(() => {
    if (loanDetails.amortizationSchedule.length > 0 && !loanDetails.amortizationSchedule[0].paid) {
      const updatedAmortizationSchedule = loanDetails.amortizationSchedule.map((item, index) => {
        if (index === 0) {
          return { ...item, paid: true };
        }
        return item;
      });
  
      setLoanDetails(prevLoanDetails => ({
        ...prevLoanDetails,
        amortizationSchedule: updatedAmortizationSchedule
      }));
  
      // Save updated amortization schedule to AsyncStorage for the current user
      saveAmortizationSchedule(updatedAmortizationSchedule, loanDetails.applicationNumber);
    }
  }, [loanDetails.amortizationSchedule]);

const loadAmortizationSchedule = async () => {
  try {
    // Load amortization schedule for the current user using their application number
    const schedule = await AsyncStorage.getItem(`amortizationSchedule_${loanDetails.applicationNumber}`);
    if (schedule !== null) {
      setLoanDetails(prevLoanDetails => ({
        ...prevLoanDetails,
        amortizationSchedule: JSON.parse(schedule)
      }));
      setIsAmortizationLoaded(true);
    }
  } catch (error) {
    console.error('Error loading amortization schedule:', error);
  }
};

const saveAmortizationSchedule = async (schedule, applicationNumber) => {
  try {
    // Save the amortization schedule with a key that includes the application number
    await AsyncStorage.setItem(`amortizationSchedule_${applicationNumber}`, JSON.stringify(schedule));
  } catch (error) {
    console.error('Error saving amortization schedule:', error);
  }
};

  const calculateEMIAmount = () => {
    const { principalLoanAmount, interestRate, loanTermMonths, applicationNumber } = loanDetails;

    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTermMonths;

    const emi = principalLoanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Generate amortization schedule after calculating EMI
    const amortizationSchedule = generateAmortizationSchedule(principalLoanAmount, monthlyInterestRate, numberOfPayments, emi, applicationNumber);

    // Update state with calculated EMI and amortization schedule
    setLoanDetails((prevLoanDetails) => ({
      ...prevLoanDetails,
      emiAmount: emi.toFixed(2),
      amortizationSchedule, // Update amortization schedule here
    }));

    // Save amortization schedule to AsyncStorage
    saveAmortizationSchedule(amortizationSchedule);
    setIsEMICalculated(true);
  };

  const generateAmortizationSchedule = (principal, monthlyInterestRate, numberOfPayments, emi, applicationNumber) => {
    const schedule = [];
    let remainingBalance = principal;

    // Start from current month
    const currentDate = new Date();

    for (let i = 1; i <= numberOfPayments; i++) {
      // Calculate interest and principal payments
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = emi - interestPayment;
      remainingBalance -= principalPayment;

      // Calculate payment date
      const paymentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);

      // Format payment date as "DD/MM/YYYY"
      const formattedDate = formatDate(paymentDate);

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

  // Helper function to format date as "DD/MM/YYYY"
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  const renderItem = ({ item }) => (
    <View>
      <View style={styles.amortizationTile}>
        <TouchableOpacity onPress={() => navigateToDetails(item)}>
          <View style={styles.column}>
            <View style={styles.column1}>
              <Text>Month: </Text>
              <Text> {item.month}</Text>
            </View>

            <View style={styles.column2}>
              <Text>Date: </Text>
              <Text>{item.paymentDate}</Text>
            </View>
            <View style={[styles.column3, { top: shouldAdjustTop() }]}>
              <Text>EMI Amount: </Text>
              <Text>{item.emiAmount}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.column4}>
          <View style={styles.column4}>
            <View 
            style={[styles.paidButton, { backgroundColor: item.paid ? 'green' : 'red' }]}>
              <Text style={styles.paidButtonText}>{item.paid ? 'Paid' : 'Unpaid'}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const navigateToDetails = (scheduleItem) => {
    navigation.navigate('ScheduleDetailsScreenHomeLoan', { 
      scheduleItem,
      loanDetails,
      applicationNumber: loanDetails.applicationNumber  
    });
  };
  
  useEffect(() => {
    if (route.params && route.params.isPaid && route.params.month) {
      const updatedAmortizationSchedule = loanDetails.amortizationSchedule.map(item => {
        if (item.month === route.params.month) {
          return { ...item, paid: true }; // Mark the item as paid
        }
        return item;
      });
  
      setLoanDetails(prevLoanDetails => ({
        ...prevLoanDetails,
        amortizationSchedule: updatedAmortizationSchedule
      }));
  
      // Save updated amortization schedule to AsyncStorage for the current user
      saveAmortizationSchedule(updatedAmortizationSchedule, loanDetails.applicationNumber);
    }
  }, [route.params]);

  const deviceWidth = Dimensions.get('window').width;
  console.log("Device width:", deviceWidth);

  const shouldAdjustTop = () => {
    return Dimensions.get('window').width > 600 ? -61 : -71;
  };

  const countPaidEMIs = () => {
    return loanDetails.amortizationSchedule.filter(item => item.paid).length;
};

  const handleGoBackPersonaldetails = () => {
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
      <HeaderComponent titleText="Schedule Details(Home)" onPress={handleGoBackPersonaldetails}/>
      <Text style={[styles.amortizationTitle, {marginTop: 10}]}>EMI Details</Text>
      <View style={{ paddingHorizontal: 15 }}>
        
    <View style={{ flexDirection: "row"}}>
          <Text style={styles.detailsLabel}>Name:</Text>
          <TextInput
            style={styles.textInputContainer}
            value={loanDetails.name}
            onChangeText={(text) => setLoanDetails({ ...loanDetails, principalLoanAmount: text })}
            editable={false}
          />
        </View>
        
        <View style={{ flexDirection: "row"}}>
          <Text style={styles.detailsLabel}>Application Number:</Text>
          <TextInput
            style={styles.textInputContainer}
            value={loanDetails.applicationNumber}
            onChangeText={(text) => setLoanDetails({ ...loanDetails, principalLoanAmount: text })}
            editable={false}
          />
        </View>

        <View style={{ flexDirection: "row"}}>
          <Text style={styles.detailsLabel}>Loan Amount:</Text>
          <TextInput
            style={styles.textInputContainer}
            value={loanDetails.principalLoanAmount}
            onChangeText={(text) => setLoanDetails({ ...loanDetails, principalLoanAmount: text })}
            editable={false}
          />
        </View>
        <View style={{ flexDirection: "row"}}>
        <Text style={styles.detailsLabel}>Annual Interest Rate(%):</Text>
        <TextInput
          style={styles.textInputContainer}
          value={loanDetails.interestRate}
          onChangeText={(text) => setLoanDetails({ ...loanDetails, interestRate: text })}
          editable={false}
        />
        </View>
        <View style={{ flexDirection: "row"}}>
          <Text style={styles.detailsLabel}>EMI schedule:</Text>
          <TextInput
            style={styles.textInputContainer}
            value={getEmiSchedule(loanDetails.emiSchedule)}
            onChangeText={(text) => setLoanDetails({ ...loanDetails, emiSchedule: text })}
            editable={false}
          />
        </View>
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

      <Text style={styles.amortizationTitle}>No of EMI Paid: {countPaidEMIs()}</Text>

      <Text style={styles.amortizationTitle}>Amortization Schedule</Text>

      <FlatList
        data={loanDetails.amortizationSchedule}
        keyExtractor={(item, index) => `${loanDetails.applicationNumber}_${item.month}_${index}`}
        renderItem={renderItem}
      />

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
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  amortizationTile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginHorizontal: 10
  },
  column: {
    height: 40,
  },
  column1: {
    flexDirection: 'column',
  },
  column2: {
    flexDirection: 'column',
    marginLeft: 70,
    top: -32,
  },
  column3: {
    flexDirection: 'column',
    marginLeft: 180,
  },
  column4: {
    top: -5,
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
  detailsLabel:{
    width: "50%",
    marginVertical: 15
  }
});

export default AmortizationScreenHome;

