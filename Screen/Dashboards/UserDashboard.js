import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, KeyboardAvoidingView, StatusBar, FlatList, ScrollView, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import HeaderComponent from '../../common/Header';
import { Ionicons } from '@expo/vector-icons';

const UserDashboard = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [loanRecords, setLoanRecords] = useState([]);
    const [loanApplication, setLoanApplication] = useState(null);
    const [authenticatedUser, setAuthenticatedUser] = useState(null);

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
            if (!authenticatedUser) return;

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

                const response = await axios.get(
                    `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loans`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
                );

                setLoanRecords(response.data.value);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching loan records:", error);
                if (error.response) {
                    console.error("Error response data:", error.response.data);
                    console.error("Error response status:", error.response.status);
                }
                Alert.alert("Error", "Failed to fetch loan records. Please try again.");
                setLoading(false);
            }
        };

        fetchLoanRecords();
    }, [authenticatedUser]);

    useEffect(() => {
        const fetchLoanApplication = async () => {
            if (!authenticatedUser) return;

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
                let response;

                // Check if kf_personalloanid or kf_loanapplicationid exists
                if (authenticatedUser.kf_personalloanid) {
                    response = await axios.get(
                        `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans(${authenticatedUser.kf_personalloanid})`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                    );
                } else if (authenticatedUser.kf_loanapplicationid) {
                    response = await axios.get(
                        `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications(${authenticatedUser.kf_loanapplicationid})`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                    );
                } else {
                    // No loan application data found for the user
                    setLoading(false);
                    return;
                }

                setLoanApplication(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching loan application:", error);
                if (error.response) {
                    console.error("Error response data:", error.response.data);
                    console.error("Error response status:", error.response.status);
                }
                Alert.alert("Error", "Failed to fetch loan application details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchLoanApplication();
    }, [authenticatedUser]);

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to log out?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            // Clear authentication state
                            await AsyncStorage.setItem('isLoggedIn', 'false');
                            // Reset the navigation stack and navigate to the login screen
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'LoginScreen' }],
                            });
                        } catch (error) {
                            console.error('Error clearing authentication state:', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };



    const handleNavigation = () => {
        // navigation.navigate("Notification", { kf_adminname });
        console.log("icon Pressed");
    };


    const handlePress = (item) => {
        navigation.navigate('UserLoanDetails', {
            record: item,
            principalLoanAmount: item.kf_principalloanamount,
            kf_paidstatus: item.kf_paidstatus,
            receivedDate: item.kf_receiveddate,
            remainingBalance: item.kf_remainingbalance,
            emiAmount: item.kf_emiamount,
            applicationNumber: item.kf_applicationnumber,
            totalMonths: item.kf_totalmonths,
            interestRate: item.kf_annualinterest
        });
    };


    const getGenderLabel = (gender) => {
        switch (gender) {
            case 123950000:
                return 'Male';
            case 123950001:
                return 'Female';
            default:
                return '';
        }
    };


    const formatDate = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
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
                        {/* <TouchableOpacity style={styles.iconButton} onPress={handleNavigation}>
                            <Ionicons name="notifications" size={25} color="#fff" />
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.iconButtonLogout} onPress={handleLogout}>
                            <Ionicons name="md-log-out" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={styles.detailsContainer}>
                            <View style={styles.row}>
                                <Text style={styles.label}>Application Number :</Text>
                                <Text style={styles.value}>{loanApplication?.kf_applicationnumber}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Name :</Text>
                                <Text style={styles.value}>{loanApplication?.kf_name}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Email :</Text>
                                <Text style={styles.value}>{loanApplication?.kf_email}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Mobile Number :</Text>
                                <Text style={styles.value}>{loanApplication?.kf_mobilenumber}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Gender :</Text>
                                <Text style={styles.value}>{getGenderLabel(loanApplication?.kf_gender)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Date of Birth:</Text>
                                <Text style={styles.value}>{formatDate(loanApplication?.kf_dateofbirth)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Age :</Text>
                                <Text style={styles.value}>{loanApplication?.kf_age}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>City :</Text>
                                <Text style={styles.value}>{loanApplication?.kf_city}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>State :</Text>
                                <Text style={styles.value}>{loanApplication?.kf_state}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Loan Amount Requested :</Text>
                                <Text style={styles.value}>{loanApplication?.kf_loanamountrequested}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>EMI Schedule :</Text>
                                <Text style={styles.value}>{loanApplication?.kf_emischedule}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Number of EMI :</Text>
                                <Text style={styles.value}>{loanApplication?.kf_numberofemi}</Text>
                            </View>
                            </View>

                            <View style={styles.emiRecords}>
                                <Text style={styles.createdRecordsTitle}>EMI Records</Text>
                                <FlatList
                                    data={loanRecords.filter(item => item.kf_applicationnumber === loanApplication?.kf_applicationnumber)}
                                    renderItem={({ item }) => (
                                        <View>
                                            <View style={styles.amortizationTile}>
                                                <TouchableOpacity key={item.kf_loanId} onPress={() => handlePress(item)}>
                                                    <View style={styles.column}>
                                                        <View style={styles.column1}>
                                                            <Text style={styles.list} >Term</Text>
                                                            <Text >{parseInt(item.kf_totalmonths)}</Text>
                                                        </View>

                                                        <View style={styles.column2}>
                                                            <Text style={styles.list}>EMI Amount</Text>
                                                            <Text>{item.kf_emiamount}</Text>
                                                        </View>

                                                        <View style={styles.column2}>
                                                           
                                                            <Text style={styles.list}>Payment Date</Text>
                                                            <Text>{(item.kf_receiveddate)}</Text>
                                                        </View>

                                                        <View style={[styles.column3, {backgroundColor: item.kf_paidstatus ? "green" : "red"}]}>
                                                             {/* <Text style={styles.label}>Paid Status :</Text> */}
                                                            <Text style={[styles.value, { color: "white"}]}>
                                                                {item.kf_paidstatus ? "Paid" : "Unpaid"}
                                                            </Text>
                                                        </View>


                                                    </View>
                                                </TouchableOpacity>

                                            </View>

                                        </View>

                                    )}
                                    keyExtractor={(item) => item.id}
                                />
                            </View>
                     
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>

        </>
    );

};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        // backgroundColor: '#f0f0f0',

    },
    detailsContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        borderRadius: 10,
        elevation: 3,
        marginTop: 70,
        marginHorizontal: 10
    },
    row: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
    },
    label: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 16,
    },
    value: {
        flex: 2,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 5
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
    iconButton: {
        marginHorizontal: 10,
        marginLeft: 120,
    },
    iconButtonLogout: {
        marginHorizontal: 10,
    },
    amortizationTile: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        // marginHorizontal: 10
    },
    column: {
        flexDirection: 'row',
    },
    column1: {

    },
    column2: {
        marginLeft: 18
    },
    column3: {
        marginLeft: 20,
        height: 30,
        width: "18%",
        borderRadius: 10
    },
    createdRecordsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: 'rgba(255, 28, 53, 255)',
        textAlign: 'center',
        padding: 5,
        color: 'white'
    },
    list: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    emiRecords:{
        padding: 10
    }

});

export default UserDashboard;
