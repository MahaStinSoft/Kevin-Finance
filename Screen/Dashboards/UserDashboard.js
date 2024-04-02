// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, KeyboardAvoidingView, StatusBar, FlatList, ScrollView, BackHandler, Image } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import HeaderComponent from '../../common/Header';
// import { Ionicons } from '@expo/vector-icons';
// import NetInfo from '@react-native-community/netinfo';
// import CustomAlert from '../../common/CustomAlert';
// import ButtonComponent from '../../common/ButtonComponent';

// const UserDashboard = ({ navigation }) => {
//     const [loading, setLoading] = useState(true);
//     const [loanRecords, setLoanRecords] = useState([]);
//     const [loanApplication, setLoanApplication] = useState(null);
//     const [authenticatedUser, setAuthenticatedUser] = useState(null);
//     const [showAlertInvalidUser, setShowAlertInvalidUser] = useState(false);

//     useEffect(() => {
//         const unsubscribe = NetInfo.addEventListener(state => {
//           console.log('Network state changed:', state.isConnected);
//           if (!state.isConnected) {
//             console.log('No Internet Connection');
//             Alert.alert('No Internet Connection', 'Please check your internet connection and try again.');
//           }
    
//         });
    
//         return () => {
//           unsubscribe();
//         };
//       }, []);

//     useEffect(() => {
//         const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//             // Check if the user is on the dashboard screen
//             if (navigation.isFocused()) {
//                 // Show the exit confirmation alert
//                 Alert.alert(
//                     'Exit App',
//                     'Are you sure you want to exit the app?',
//                     [
//                         {
//                             text: 'Cancel',
//                             onPress: () => null,
//                             style: 'cancel',
//                         },
//                         {
//                             text: 'Exit',
//                             onPress: () => BackHandler.exitApp(),
//                         },
//                     ],
//                     { cancelable: false }
//                 );
//                 return true; // Prevent default back button behavior
//             }
//         });

//         return () => backHandler.remove();
//     }, [navigation]);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const userString = await AsyncStorage.getItem('authenticatedUser');
//                 if (userString) {
//                     const user = JSON.parse(userString);
//                     setAuthenticatedUser(user);
//                 }
//             } catch (error) {
//                 console.error('Error getting authenticated user:', error);
//             }
//         };

//         fetchUserData();
//     }, []);

//     useEffect(() => {
//         const fetchLoanRecords = async () => {
//             if (!authenticatedUser) return;

//             try {
//                 const tokenResponse = await axios.post(
//                     "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token", {
//                     grant_type: "client_credentials",
//                     client_id: "d9dcdf05-37f4-4bab-b428-323957ad2f86",
//                     resource: "https://org0f7e6203.crm5.dynamics.com",
//                     client_secret: "JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2",
//                 }, {
//                     headers: {
//                         "content-type": "application/x-www-form-urlencoded"
//                     }
//                 }
//                 );

//                 const accessToken = tokenResponse.data.access_token;

//                 const response = await axios.get(
//                     `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loans`, {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`,
//                         "Content-Type": "application/json",
//                     },
//                 }
//                 );

//                 setLoanRecords(response.data.value);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching loan records:", error);
//                 if (error.response) {
//                     console.error("Error response data:", error.response.data);
//                     console.error("Error response status:", error.response.status);
//                 }
//                 Alert.alert("Error", "Failed to fetch loan records. Please try again.");
//                 setLoading(false);
//             }
//         };

//         fetchLoanRecords();
//     }, [authenticatedUser]);

//     useEffect(() => {
//         const fetchLoanApplication = async () => {
//             if (!authenticatedUser) return;

//             try {
//                 const tokenResponse = await axios.post(
//                     "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token", {
//                     grant_type: "client_credentials",
//                     client_id: "d9dcdf05-37f4-4bab-b428-323957ad2f86",
//                     resource: "https://org0f7e6203.crm5.dynamics.com",
//                     client_secret: "JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2",
//                 }, {
//                     headers: {
//                         "content-type": "application/x-www-form-urlencoded"
//                     }
//                 }
//                 );

//                 const accessToken = tokenResponse.data.access_token;
//                 let response;

//                 // Check if kf_personalloanid or kf_loanapplicationid exists
//                 if (authenticatedUser.kf_personalloanid) {
//                     response = await axios.get(
//                         `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${authenticatedUser.kf_personalloanid})`, {
//                         headers: {
//                             Authorization: `Bearer ${accessToken}`,
//                             "Content-Type": "application/json",
//                         },
//                     }
//                     );
//                 } else if (authenticatedUser.kf_loanapplicationid) {
//                     response = await axios.get(
//                         `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${authenticatedUser.kf_loanapplicationid})`, {
//                         headers: {
//                             Authorization: `Bearer ${accessToken}`,
//                             "Content-Type": "application/json",
//                         },
//                     }
//                     );
//                 } else {
//                     // No loan application data found for the user
//                     setLoading(false);
//                     return;
//                 }

//                 setLoanApplication(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching loan application:", error);
//                 if (error.response) {
//                     console.error("Error response data:", error.response.data);
//                     console.error("Error response status:", error.response.status);
//                 }
//                 Alert.alert("Error", "Failed to fetch loan application details. Please try again.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchLoanApplication();
//     }, [authenticatedUser]);

//     const handleLogout = async () => {
//         // Display confirmation alert
//         // Alert.alert(
//         //   'Logout',
//         //   'Are you sure you want to log out?',
//         //   [
//         //     {
//         //       text: 'No',
//         //       style: 'cancel',
//         //     },
//         //     {
//         //       text: 'Yes',
//         //       onPress: async () => {
//         //         try {
//         //           // Clear authentication state
//         //           await AsyncStorage.setItem('isLoggedIn', 'false');
//         //           // Reset the navigation stack and navigate to the login screen
//         //           navigation.reset({
//         //             index: 0,
//         //             routes: [{ name: 'LoginScreen' }],
//         //           });
//         //         } catch (error) {
//         //           console.error('Error clearing authentication state:', error);
//         //         }
//         //       },
//         //     },
//         //   ],
//         //   { cancelable: false }
//         // );
//         handledShowInvalidAlert();
//       };

//       const handledShowInvalidAlert = () => {
//         setShowAlertInvalidUser(true);
//       }
    
//       const handledCloseInvalidAlert = () => {
//         setShowAlertInvalidUser(false);
//       }
    
//       const handleConfirmLogout = async () => {
//         try {
//           // Clear authentication state
//           await AsyncStorage.setItem('isLoggedIn', 'false');
//           // Reset the navigation stack and navigate to the login screen
//           navigation.reset({
//             index: 0,
//             routes: [{ name: 'Welcome' }],
//           });
//         } catch (error) {
//           console.error('Error clearing authentication state:', error);
//         }
//       };
    

//     const handleNavigation = () => {
//         // navigation.navigate("Notification", { kf_adminname });
//         console.log("icon Pressed");
//     };


//     const handlePress = (item) => {
//         navigation.navigate('UserLoanDetails', {
//             record: item,
//             principalLoanAmount: item.kf_principalloanamount,
//             kf_paidstatus: item.kf_paidstatus,
//             receivedDate: item.kf_receiveddate,
//             remainingBalance: item.kf_remainingbalance,
//             emiAmount: item.kf_emiamount,
//             applicationNumber: item.kf_applicationnumber,
//             totalMonths: item.kf_totalmonths,
//             interestRate: item.kf_annualinterest
//         });
//     };


//     const getGenderLabel = (gender) => {
//         switch (gender) {
//             case 123950000:
//                 return 'Male';
//             case 123950001:
//                 return 'Female';
//             default:
//                 return '';
//         }
//     };


//     const formatDate = (dateString) => {
//         if (!dateString) return "";

//         const date = new Date(dateString);
//         const day = date.getDate().toString().padStart(2, '0');
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const year = date.getFullYear();

//         return `${day}/${month}/${year}`;
//     };

//     const handleHomeLoan = () => {
//         navigation.navigate('HomeLoan');
//       };
    
//       const handlePersonalLoan = () => {
//         navigation.navigate("PersonalLoan");
//       };

//     return (
//         <>
//             <StatusBar />
//             <KeyboardAvoidingView
//                 style={{ flex: 1 }}
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             >
//                 <View style={styles.container}>
//                     <View style={styles.navBar}>
//                         <Text style={styles.text}>Kevin Small Finance</Text>
//                         <TouchableOpacity style={styles.iconButtonLogout} onPress={handleLogout}>
//                             <Ionicons name="md-log-out" size={28} color="#fff" />
//                         </TouchableOpacity>
//                     </View>

//                     <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//                         <View style={styles.detailsContainer}>
//                             <View style={styles.rowContainer}>
//                                 <View style={styles.imageContainer}>
//                                     <Image
//                                         source={require('../../assets/red.png')}
//                                         style={styles.image}
//                                         resizeMode="cover"
//                                     />
//                                 </View>
//                                 <View style={styles.textContainer}>
//                                     <Text style={styles.detailText}>Name</Text>
//                                     <Text style={styles.detailText}>Mobile no</Text>
//                                 </View>
//                             </View>
//                         </View>
//                         <View>
//                             <View style={[styles.loanButton, {marginTop: 30}]}>
//                                 <TouchableOpacity onPress={handleHomeLoan} style={{ backgroundColor: "red", padding: 15, borderRadius: 30, width: "60%", flexDirection: "row" }}>
//                                     <Text style={{ fontSize: 16, fontWeight: "bold", color: "white", textAlign: "center", marginLeft: 15 }}>Apply Home Loan</Text>
//                                     <Ionicons name="chevron-forward" size={25} color="white" style={[styles.icon, {marginLeft: 37}]} />
//                                 </TouchableOpacity>
//                             </View>
//                             <View style={styles.loanButton}>
//                                 <TouchableOpacity onPress={handlePersonalLoan} style={{ backgroundColor: "red", padding: 15, borderRadius: 30, width: "60%", flexDirection: "row" }}>
//                                     <Text style={{ fontSize: 16, fontWeight: "bold", color: "white", textAlign: "center", marginLeft: 15 }}>Apply Personal Loan</Text>
//                                     <Ionicons name="chevron-forward" size={25} color="white" style={styles.icon} />
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
                     
//                     </ScrollView>
//                 </View>
//                 <CustomAlert
//         visible={showAlertInvalidUser} 
//         onClose={handledCloseInvalidAlert}
//         onConfirm={handleConfirmLogout}
//         headerMessage="Logout"
//         message="Are you sure you want to logout?"
//         Button1="Cancel"
//         Button2="OK"
//         // style={styles.alertStyle}
//         // modalHeaderStyle={[styles.modalheaderStyle, { right: 100 }]}
//         // textStyle={styles.textStyle}
//       />
//             </KeyboardAvoidingView>

//         </>
//     );

// };

// const styles = StyleSheet.create({

//     container: {
//         flex: 1,
//         // backgroundColor: '#f0f0f0',

//     },
//     detailsContainer: {
//         backgroundColor: '#fff',
//         paddingHorizontal: 20,
//         borderRadius: 10,
//         elevation: 3,
//         marginTop: 70,
//         marginHorizontal: 10,
//         paddingVertical: 14,
//     },
//     row: {
//         flexDirection: 'row',
//         marginBottom: 15,
//         alignItems: 'center',
//     },
//     label: {
//         flex: 1,
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
//     value: {
//         flex: 2,
//         fontSize: 14,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginVertical: 5
//     },
//     navBar: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         width: '100%',
//         padding: 10,
//         backgroundColor: 'rgba(255, 28, 53, 255)',
//         position: 'absolute',
//         top: 0,
//         zIndex: 10,
//     },
//     text: {
//         color: "#fff",
//         fontSize: 20,
//         fontWeight: "bold",
//     },
//     iconButton: {
//         marginHorizontal: 10,
//         marginLeft: 120,
//     },
//     iconButtonLogout: {
//         marginHorizontal: 10,
//     },
//     amortizationTile: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: 'gray',
//         // marginHorizontal: 10
//     },
//     column: {
//         flexDirection: 'row',
//     },
//     column1: {

//     },
//     column2: {
//         marginLeft: 18
//     },
//     column3: {
//         marginLeft: 20,
//         height: 30,
//         width: "18%",
//         borderRadius: 10
//     },
//     createdRecordsTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginTop: 10,
//         marginBottom: 10,
//         backgroundColor: 'rgba(255, 28, 53, 255)',
//         textAlign: 'center',
//         padding: 5,
//         color: 'white'
//     },
//     list: {
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
//     emiRecords:{
//         padding: 10
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 10,
//         objectFit: "fill"
//       },
//       detailText:{
//         fontSize: 16,
//         marginBottom: 5,
//         fontWeight: 'bold',
//         color: "red", 
//       },
//       rowContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 5
//       },
//       textContainer: {
//         flex: 1,
//         marginLeft: 10,
//       },
//       imageContainer: {
//         width: 120,
//         height: 120,
//         marginRight: 10,
//       },
//       icon: {
//         marginLeft: 15,
//       },
//     loanButton: {
//         marginTop: 20,
//         alignItems: "center"
//     }
// });

// export default UserDashboard;




// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';
// import NetInfo from '@react-native-community/netinfo';
// import CustomAlert from '../../common/CustomAlert';

// const UserDashboard = ({ navigation }) => {
//     const [authenticatedUser, setAuthenticatedUser] = useState(null);
//     const [showAlertInvalidUser, setShowAlertInvalidUser] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [loanRecords, setLoanRecords] = useState([]);
//     const [loanApplication, setLoanApplication] = useState(null);

//     useEffect(() => {
//         const unsubscribe = NetInfo.addEventListener(state => {
//             console.log('Network state changed:', state.isConnected);
//             if (!state.isConnected) {
//                 console.log('No Internet Connection');
//                 Alert.alert('No Internet Connection', 'Please check your internet connection and try again.');
//             }
//         });

//         return () => {
//             unsubscribe();
//         };
//     }, []);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const userString = await AsyncStorage.getItem('authenticatedUser');
//                 if (userString) {
//                     const user = JSON.parse(userString);
//                     setAuthenticatedUser(user);
//                 }
//             } catch (error) {
//                 console.error('Error getting authenticated user:', error);
//             }
//         };

//         fetchUserData();
//     }, []);

//     const handleLogout = () => {
//         setShowAlertInvalidUser(true);
//     };

//     const handleCloseAlert = () => {
//         setShowAlertInvalidUser(false);
//     };

//     const handleConfirmLogout = async () => {
//         try {
//             await AsyncStorage.setItem('isLoggedIn', 'false');
//             navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'Welcome' }],
//             });
//         } catch (error) {
//             console.error('Error clearing authentication state:', error);
//         }
//     };

//     const handleNavigation = () => {
//         // navigation.navigate("Notification", { kf_adminname });
//         console.log("icon Pressed");
//     };

//     const handleHomeLoan = () => {
//         navigation.navigate('HomeLoan');
//       };
    
//       const handlePersonalLoan = () => {
//         navigation.navigate("PersonalLoan");
//       };

//           useEffect(() => {
//         const fetchLoanRecords = async () => {
//             if (!authenticatedUser) return;

//             try {
//                 const tokenResponse = await axios.post(
//                     "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token", {
//                     grant_type: "client_credentials",
//                     client_id: "d9dcdf05-37f4-4bab-b428-323957ad2f86",
//                     resource: "https://org0f7e6203.crm5.dynamics.com",
//                     client_secret: "JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2",
//                 }, {
//                     headers: {
//                         "content-type": "application/x-www-form-urlencoded"
//                     }
//                 }
//                 );

//                 const accessToken = tokenResponse.data.access_token;

//                 const response = await axios.get(
//                     `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loans`, {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`,
//                         "Content-Type": "application/json",
//                     },
//                 }
//                 );

//                 setLoanRecords(response.data.value);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching loan records:", error);
//                 if (error.response) {
//                     console.error("Error response data:", error.response.data);
//                     console.error("Error response status:", error.response.status);
//                 }
//                 Alert.alert("Error", "Failed to fetch loan records. Please try again.");
//                 setLoading(false);
//             }
//         };

//         fetchLoanRecords();
//     }, [authenticatedUser]);



//     return (
//         <>
//             <StatusBar />
//             <View style={styles.container}>
//                 <View style={styles.navBar}>
//                     <Text style={styles.text}>Kevin Small Finance</Text>
//                     <TouchableOpacity style={styles.iconButtonLogout} onPress={handleLogout}>
//                         <Ionicons name="md-log-out" size={28} color="#fff" />
//                     </TouchableOpacity>
//                 </View>

//                 <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//                     <View style={styles.detailsContainer}>
//                         <View style={styles.rowContainer}>
//                             <View style={styles.imageContainer}>
//                                 <Image
//                                     source={require('../../assets/red.png')}
//                                     style={styles.image}
//                                     resizeMode="cover"
//                                 />
//                             </View>
//                             <View style={styles.textContainer}>
//                                 <Text style={styles.detailText}>Name: {authenticatedUser?.kf_name}</Text>
//                                 <Text style={styles.detailText}>Mobile: {authenticatedUser?.kf_mobilenumber}</Text>
//                             </View>
//                         </View>
//                     </View>
//                     <View>
//                         <View style={[styles.loanButton, { marginTop: 30 }]}>
//                             <TouchableOpacity onPress={handleHomeLoan} style={styles.button}>
//                                 <Text style={styles.buttonText}>Apply Home Loan</Text>
//                                 <Ionicons name="chevron-forward" size={25} color="white" style={styles.icon} />
//                             </TouchableOpacity>
//                         </View>
//                         <View style={[styles.loanButton, { marginTop: 30 }]}>
//                             <TouchableOpacity onPress={handlePersonalLoan} style={styles.button}>
//                                 <Text style={[styles.buttonText, {left: 8}]}>Apply Personal Loan</Text>
//                                 <Ionicons name="chevron-forward" size={25} color="white" style={[styles.icon, {right: 10}]} />
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </ScrollView>
//             </View>
//             <CustomAlert
//                 visible={showAlertInvalidUser}
//                 onClose={handleCloseAlert}
//                 onConfirm={handleConfirmLogout}
//                 headerMessage="Logout"
//                 message="Are you sure you want to logout?"
//                 Button1="Cancel"
//                 Button2="OK"
//             />
//         </>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     navBar: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         width: '100%',
//         padding: 10,
//         backgroundColor: 'rgba(255, 28, 53, 255)',
//         position: 'absolute',
//         top: 0,
//         zIndex: 10,
//     },
//     text: {
//         color: "#fff",
//         fontSize: 20,
//         fontWeight: "bold",
//     },
//     iconButtonLogout: {
//         marginHorizontal: 10,
//     },
//     detailsContainer: {
//         backgroundColor: '#fff',
//         paddingHorizontal: 20,
//         borderRadius: 10,
//         elevation: 3,
//         marginTop: 70,
//         marginHorizontal: 10,
//         paddingVertical: 14,
//     },
//     rowContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 5
//     },
//     imageContainer: {
//         width: 120,
//         height: 120,
//         marginRight: 10,
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 10,
//     },
//     textContainer: {
//         flex: 1,
//         marginLeft: 10,
//     },
//     detailText: {
//         fontSize: 16,
//         marginBottom: 5,
//         fontWeight: 'bold',
//         color: "red",
//     },
//     loanButton: {
//         marginTop: 20,
//         alignItems: "center"
//     },
//     button: {
//         backgroundColor: "red",
//         padding: 15,
//         borderRadius: 30,
//         width: "60%",
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center"
//     },
//     buttonText: {
//         fontSize: 16,
//         fontWeight: "bold",
//         color: "white",
//         textAlign: "center",
//         marginRight: 15
//     },
//     icon: {
//         marginLeft: 15,
//     },
// });

// export default UserDashboard;





// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, KeyboardAvoidingView, StatusBar, Image, ScrollView, BackHandler } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import HeaderComponent from '../../common/Header';
// import { Ionicons } from '@expo/vector-icons';
// import NetInfo from '@react-native-community/netinfo';
// import CustomAlert from '../../common/CustomAlert';

// const UserDashboard = ({ navigation,route  }) => {
//     const [loading, setLoading] = useState(true);
//     const [loanApplication, setLoanApplication] = useState(null);
//     const [authenticatedUser, setAuthenticatedUser] = useState(null);
//     const [gender, setGender] = useState('');
//     const [mobileNumber, setMobileNumber] = useState('');
//     const [otp, setOtp] = useState('');
//     const [name, setName] = useState('');
//     const [showAlertInvalidUser, setShowAlertInvalidUser] = useState(false);

//     console.log("authenticatedUser:", authenticatedUser);
//     const recordId = authenticatedUser ? authenticatedUser.kf_userid : null;
//     console.log("recordId:", recordId);

//     useEffect(() => {
//         const unsubscribe = NetInfo.addEventListener(state => {
//           console.log('Network state changed:', state.isConnected);
//           if (!state.isConnected) {
//             console.log('No Internet Connection');
//             Alert.alert('No Internet Connection', 'Please check your internet connection and try again.');
//           }
//         });
//         return () => {
//           unsubscribe();
//         };
//       }, []);

//     useEffect(() => {
//         const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//             // Check if the user is on the dashboard screen
//             if (navigation.isFocused()) {
//                 // Show the exit confirmation alert
//                 Alert.alert(
//                     'Exit App',
//                     'Are you sure you want to exit the app?',
//                     [
//                         {
//                             text: 'Cancel',
//                             onPress: () => null,
//                             style: 'cancel',
//                         },
//                         {
//                             text: 'Exit',
//                             onPress: () => BackHandler.exitApp(),
//                         },
//                     ],
//                     { cancelable: false }
//                 );
//                 return true; // Prevent default back button behavior
//             }
//         });
//         return () => backHandler.remove();
//     }, [navigation]);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const userString = await AsyncStorage.getItem('authenticatedUser');
//                 if (userString) {
//                     const user = JSON.parse(userString);
//                     setAuthenticatedUser(user);
//                 }
//             } catch (error) {
//                 console.error('Error getting authenticated user:', error);
//             }
//         };
//         fetchUserData();
//     }, []);

//     useEffect(() => {
//         const fetchLoanRecords = async () => {
//             try {
//                 const tokenResponse = await axios.post(
//                     "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token", {
//                     grant_type: "client_credentials",
//                     client_id: "d9dcdf05-37f4-4bab-b428-323957ad2f86",
//                     resource: "https://org0f7e6203.crm5.dynamics.com",
//                     client_secret: "JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2",
//                 }, {
//                     headers: {
//                         "content-type": "application/x-www-form-urlencoded"
//                     }
//                 });
//                 const accessToken = tokenResponse.data.access_token;
//                 const response = await axios.get(
//                     `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_users(${recordId})`, {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`,
//                         "Content-Type": "application/json",
//                     },
//                 });
//          console.log('response',response);
//                 setLoading(false);
//                 setGender(response.data.kf_gender);
//                 setMobileNumber(response.data.kf_mobilenumber);
//                 setName(response.data.kf_name);
//             } catch (error) {
//                 // Alert.alert("Error", "Failed to fetch loan records. Please try again.");
//                 setLoading(false);
//             }
//         };
//         fetchLoanRecords();
//     }, [authenticatedUser]);

//         const handleLogout = () => {
//         setShowAlertInvalidUser(true);
//     };

//     const handleCloseAlert = () => {
//         setShowAlertInvalidUser(false);
//     };

//     const handleConfirmLogout = async () => {
//         try {
//             await AsyncStorage.setItem('isLoggedIn', 'false');
//             navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'Welcome' }],
//             });
//         } catch (error) {
//             console.error('Error clearing authentication state:', error);
//         }
//     };

//           const handledShowInvalidAlert = () => {
//         setShowAlertInvalidUser(true);
//       }
    
//       const handledCloseInvalidAlert = () => {
//         setShowAlertInvalidUser(false);
//       }

//     const handleHomeLoan = () => {
//         navigation.navigate('HomeLoan');
//       };
    
//       const handlePersonalLoan = () => {
//         navigation.navigate("PersonalLoan");
//       };

//     const handleNavigation = () => {
//         // navigation.navigate("Notification", { kf_adminname });
//         console.log("icon Pressed");
//     };
//     return (
//         <>
//             <StatusBar />
//             <KeyboardAvoidingView
//                 style={{ flex: 1 }}
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             >
//                 <View style={styles.container}>
//                     <View style={styles.navBar}>
//                         <Text style={styles.text}>Kevin Small Finance</Text>
//                         <TouchableOpacity style={styles.iconButton} onPress={handleNavigation}>
//                             <Ionicons name="notifications" size={25} color="#fff" />
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.iconButtonLogout} onPress={handleLogout}>
//                             <Ionicons name="md-log-out" size={28} color="#fff" />
//                         </TouchableOpacity>
//                     </View>
//                     <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//                      <View style={styles.detailsContainer}>
//                         <View style={styles.rowContainer}>
//                              <View style={styles.imageContainer}>
//                                 <Image
//                                     source={require('../../assets/red.png')}
//                                     style={styles.image}
//                                     resizeMode="cover"
//                                 />
//                             </View>
//                             <View style={styles.textContainer}>
//                                 <Text style={styles.detailText}>{name}</Text>
//                                 <Text style={styles.detailText}>{mobileNumber}</Text>
//                             </View>
//                         </View>
//                     </View>
//                     <View>
//                         <View style={[styles.loanButton, { marginTop: 30 }]}>
//                             <TouchableOpacity onPress={handleHomeLoan} style={styles.button}>
//                                 <Text style={styles.buttonText}>Apply Home Loan</Text>
//                                 <Ionicons name="chevron-forward" size={25} color="white" style={styles.icon} />
//                             </TouchableOpacity>
//                         </View>
//                         <View style={[styles.loanButton, { marginTop: 30 }]}>
//                             <TouchableOpacity onPress={handlePersonalLoan} style={styles.button}>
//                                 <Text style={[styles.buttonText, {left: 8}]}>Apply Personal Loan</Text>
//                                 <Ionicons name="chevron-forward" size={25} color="white" style={[styles.icon, {right: 10}]} />
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </ScrollView>
//                 </View>
//                 <CustomAlert
//         visible={showAlertInvalidUser}
//         onClose={handledCloseInvalidAlert}
//         onConfirm={handleConfirmLogout}
//         headerMessage="Logout"
//         message="Are you sure you want to logout?"
//         Button1="Cancel"
//         Button2="OK"
//         // style={styles.alertStyle}
//         // modalHeaderStyle={[styles.modalheaderStyle, { right: 100 }]}
//         // textStyle={styles.textStyle}
//       />
//             </KeyboardAvoidingView>
//         </>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     navBar: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         width: '100%',
//         padding: 10,
//         backgroundColor: 'rgba(255, 28, 53, 255)',
//         position: 'absolute',
//         top: 0,
//         zIndex: 10,
//     },
//     text: {
//         color: "#fff",
//         fontSize: 20,
//         fontWeight: "bold",
//     },
//     iconButtonLogout: {
//         marginHorizontal: 10,
//     },
//     detailsContainer: {
//         backgroundColor: '#fff',
//         paddingHorizontal: 20,
//         borderRadius: 10,
//         elevation: 3,
//         marginTop: 70,
//         marginHorizontal: 10,
//         paddingVertical: 14,
//     },
//     rowContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 5
//     },
//     imageContainer: {
//         width: 120,
//         height: 120,
//         marginRight: 10,
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 10,
//     },
//     textContainer: {
//         flex: 1,
//         marginLeft: 10,
//     },
//     detailText: {
//         fontSize: 16,
//         marginBottom: 5,
//         fontWeight: 'bold',
//         color: "red",
//     },
//     loanButton: {
//         marginTop: 20,
//         alignItems: "center"
//     },
//     button: {
//         backgroundColor: "red",
//         padding: 15,
//         borderRadius: 30,
//         width: "60%",
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center"
//     },
//     buttonText: {
//         fontSize: 16,
//         fontWeight: "bold",
//         color: "white",
//         textAlign: "center",
//         marginRight: 15
//     },
//     icon: {
//         marginLeft: 15,
//     },
//         iconButton: {
//         // marginHorizontal: 10,
//         marginLeft: 90,
//     },
// });

// export default UserDashboard;







import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, KeyboardAvoidingView, StatusBar, Image, ScrollView, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import HeaderComponent from '../../common/Header';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import CustomAlert from '../../common/CustomAlert';

const UserDashboard = ({ navigation,route  }) => {
    const [loading, setLoading] = useState(true);
    const [loanApplication, setLoanApplication] = useState(null);
    const [authenticatedUser, setAuthenticatedUser] = useState(null);
    const [gender, setGender] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [showAlertInvalidUser, setShowAlertInvalidUser] = useState(false);

    console.log("authenticatedUser:", authenticatedUser);
    const recordId = authenticatedUser ? authenticatedUser.kf_userid : null;
    console.log("recordId:", recordId);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
          console.log('Network state changed:', state.isConnected);
          if (!state.isConnected) {
            console.log('No Internet Connection');
            Alert.alert('No Internet Connection', 'Please check your internet connection and try again.');
          }
        });
        return () => {
          unsubscribe();
        };
      }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Check if the user is on the dashboard screen
            if (navigation.isFocused()) {
                // Show the exit confirmation alert
                Alert.alert(
                    'Exit App',
                    'Are you sure you want to exit the app?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => null,
                            style: 'cancel',
                        },
                        {
                            text: 'Exit',
                            onPress: () => BackHandler.exitApp(),
                        },
                    ],
                    { cancelable: false }
                );
                return true; // Prevent default back button behavior
            }
        });
        return () => backHandler.remove();
    }, [navigation]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userString = await AsyncStorage.getItem('authenticatedUser');
                if (userString) {
                    const user = JSON.parse(userString);
                    setAuthenticatedUser(user);
                }
            } catch (error) {
                console.error('Error getting authenticated user:', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchLoanRecords = async () => {
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
                });
                const accessToken = tokenResponse.data.access_token;
                const response = await axios.get(
                    `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_users(${recordId})`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                setLoading(false);
                setGender(response.data.kf_gender);
                setMobileNumber(response.data.kf_mobilenumber);
                setName(response.data.kf_name);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchLoanRecords();
    }, [authenticatedUser]);

    const handleLogout = () => {
        setShowAlertInvalidUser(true);
    };

    const handleCloseAlert = () => {
        setShowAlertInvalidUser(false);
    };

    const handleConfirmLogout = async () => {
        try {
            await AsyncStorage.setItem('isLoggedIn', 'false');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        } catch (error) {
            console.error('Error clearing authentication state:', error);
        }
    };

    const handledShowInvalidAlert = () => {
        setShowAlertInvalidUser(true);
    }
    
    const handledCloseInvalidAlert = () => {
        setShowAlertInvalidUser(false);
    }

    const handleHomeLoan = () => {
        navigation.navigate('HomeLoan');
    };
    
    const handlePersonalLoan = () => {
        navigation.navigate("PersonalLoan");
    };

    const handleNavigation = () => {
        // navigation.navigate("Notification", { kf_adminname });
        console.log("icon Pressed");
    };

    return (
        <>
            <StatusBar />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.container}>
                    <View style={styles.navBar}>
                        <Text style={styles.text}>Kevin Small Finance</Text>
                        <TouchableOpacity style={styles.iconButton} onPress={handleNavigation}>
                            <Ionicons name="notifications" size={25} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButtonLogout} onPress={handleLogout}>
                            <Ionicons name="md-log-out" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={styles.detailsContainer}>
                            <View style={styles.rowContainer}>
                                {name ? (
                                    <View style={styles.imageContainer}>
                                        <Text style={styles.initial}>{name.charAt(0)}</Text>
                                    </View>
                                ) : null}
                                <View style={styles.textContainer}>
                                    <Text style={styles.detailText}>{name}</Text>
                                    <Text style={styles.detailText}>{mobileNumber}</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={[styles.loanButton, { marginTop: 30 }]}>
                                <TouchableOpacity onPress={handleHomeLoan} style={styles.button}>
                                    <Text style={styles.buttonText}>Apply Home Loan</Text>
                                    <Ionicons name="chevron-forward" size={25} color="white" style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.loanButton, { marginTop: 30 }]}>
                                <TouchableOpacity onPress={handlePersonalLoan} style={styles.button}>
                                    <Text style={[styles.buttonText, {left: 8}]}>Apply Personal Loan</Text>
                                    <Ionicons name="chevron-forward" size={25} color="white" style={[styles.icon, {right: 10}]} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <CustomAlert
                    visible={showAlertInvalidUser}
                    onClose={handledCloseInvalidAlert}
                    onConfirm={handleConfirmLogout}
                    headerMessage="Logout"
                    message="Are you sure you want to logout?"
                    Button1="Cancel"
                    Button2="OK"
                />
            </KeyboardAvoidingView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 10,
        backgroundColor: 'rgba(255, 28, 53, 255)',
        position: 'absolute',
        top: 0,
        zIndex: 10,
    },
    text: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    iconButtonLogout: {
        marginHorizontal: 10,
    },
    detailsContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        borderRadius: 10,
        elevation: 3,
        marginTop: 70,
        marginHorizontal: 10,
        paddingVertical: 14,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5
    },
    imageContainer: {
        width: 120,
        height: 120,
        marginRight: 10,
        borderRadius: 60,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initial: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
        color: "red",
    },
    loanButton: {
        marginTop: 20,
        alignItems: "center"
    },
    button: {
        backgroundColor: "red",
        padding: 15,
        borderRadius: 30,
        width: "60%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        marginRight: 15
    },
    icon: {
        marginLeft: 15,
    },
    iconButton: {
        marginLeft: 90,
    },
});

export default UserDashboard;
