import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, KeyboardAvoidingView, ScrollView,
    Dimensions, ActivityIndicator, StatusBar, Platform, RefreshControl, Alert, BackHandler
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import querystring from 'querystring';
import CustomAlert from '../../common/CustomAlert';

import axios from 'axios';

import HomeLoanCard from '../card/HomeLoanCard';
import PersonalLoanCard from '../card/PersonalLoanCard';

const UserDashboard = ({ navigation, route }) => {
    //   const { authenticatedUser } = route.params;
    const [showLoanModal, setShowLoanModal] = useState(false);
    const [loanData, setLoanData] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showClearIcon, setShowClearIcon] = useState(false);
    const [kf_status, setkf_status] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [PersonalLoanRecords, setPersonalLoanRecords] = useState([]);
    const [HomeLoanRecords, setHomeLoanRecords] = useState([]);
    const [lastMonthData, setLastMonthData] = useState([]);
    const [selectedLoanStatus, setSelectedLoanStatus] = useState(null);
    const [kf_adminname, setkf_adminname] = useState(null);

    const [loading, setLoading] = useState(true);
    const [authenticatedUser, setAuthenticatedUser] = useState(null);
    const [gender, setGender] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [name, setName] = useState('');
    const [userapplicationid, setuserapplicationid] = useState('');
    const [showAlertInvalidUser, setShowAlertInvalidUser] = useState(false);

    console.log("authenticatedUser:", authenticatedUser);
    const recordId = authenticatedUser ? authenticatedUser.kf_userid : null;
    console.log("recordId:", recordId);

    const [sendApproval, setSendApproval] = useState(null);
    const [loanApplications, setLoanApplications] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const totalRecords = loanApplications.length + notifications.length;
    const unreadMessagesCount = loanApplications.filter(application => !application.kf_markasread).length + notifications.filter(notification => !notification.kf_markasread).length;

    const [refresh, setRefresh] = useState(false);

    const [displayedHomeLoans, setDisplayedHomeLoans] = useState([]);
    const [displayedPersonalLoans, setDisplayedPersonalLoans] = useState([]);
    const [showAllLoans, setShowAllLoans] = useState(false);
    const [showAllHomeLoans, setShowAllHomeLoans] = useState(false);
    const [showAllPersonalLoans, setShowAllPersonalLoans] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [isConnected, setIsConnected] = useState(true);

    const isFocused = useIsFocused();

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Network state changed:', state.isConnected);
            setIsConnected(state.isConnected);

            if (!state.isConnected) {
                console.log('No Internet Connection');
                setShowAlert(true);
            } else {
                setShowAlert(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        getAuthenticatedUser();
    }, [isFocused, getAuthenticatedUser]);


    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (navigation.isFocused()) {
                // If the user is on the login screen, show the exit confirmation alert
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
        setDisplayedHomeLoans(showAllHomeLoans ? HomeLoanRecords : HomeLoanRecords.slice(0, 3));
        setDisplayedPersonalLoans(showAllPersonalLoans ? PersonalLoanRecords : PersonalLoanRecords.slice(0, 3));
    }, [showAllHomeLoans, showAllPersonalLoans, HomeLoanRecords, PersonalLoanRecords]);

    // Function to toggle showing all home loans
    const toggleShowAllHomeLoans = () => {
        setShowAllHomeLoans(!showAllHomeLoans);
    };

    // Function to toggle showing all personal loans
    const toggleShowAllPersonalLoans = () => {
        setShowAllPersonalLoans(!showAllPersonalLoans);
    };

    useEffect(() => {
        if (route.params?.kf_adminname) {
            console.log("kf_adminname received in Dashboard:", route.params.kf_adminname);
            setkf_adminname(route.params.kf_adminname);
        }
    }, [route.params?.kf_adminname]);

    const getAuthenticatedUser = useCallback(async () => {
        try {
            const userString = await AsyncStorage.getItem('authenticatedUser');

            if (userString) {
                const user = JSON.parse(userString);
                console.log('Authenticated user Dashboard:', user);
                setAuthenticatedUser(user);
                // Update kf_adminname if available in the user object
                if (user.kf_adminname) {
                    setkf_adminname(user.kf_adminname);
                }
            }
        } catch (error) {
            console.error('Error getting authenticated user:', error);
        }
    }, []);

    const deviceWidth = Dimensions.get('window').width;
    const textColor = deviceWidth < 390 ? 'red' : 'blue';

    const handleHomeLoan = () => {
        navigation.navigate('HomeLoan', { userapplicationid });
    };

    const handlePersonalLoan = () => {
        navigation.navigate("PersonalLoan", { userapplicationid });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = {
                    grant_type: "client_credentials",
                    client_id: "d9dcdf05-37f4-4bab-b428-323957ad2f86",
                    resource: "https://org0f7e6203.crm5.dynamics.com",
                    scope: "https://org0f7e6203.crm5.dynamics.com/.default",
                    client_secret: "JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2",
                };
                const tokenResponse = await axios.post(
                    "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token",
                    data,
                    { headers: { "content-type": "application/x-www-form-urlencoded" } }
                );

                const accessToken = tokenResponse.data.access_token;

                const responseLoanApplications = await axios.get(
                    "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const responsePersonalLoans = await axios.get(
                    "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const homeLoans = responseLoanApplications.data.value;
                const personalLoans = responsePersonalLoans.data.value;

                const sortedHomeLoans = homeLoans.sort((a, b) => new Date(b.createdon) - new Date(a.createdon));
                const sortedPersonalLoans = personalLoans.sort((a, b) => new Date(b.createdon) - new Date(a.createdon));

                const latestHomeLoans = sortedHomeLoans.slice(0, 3);
                const latestPersonalLoans = sortedPersonalLoans.slice(0, 3);

                const userAdmin = authenticatedUser ? authenticatedUser.kf_adminname : '';

                setDisplayedHomeLoans(latestHomeLoans);
                setDisplayedPersonalLoans(latestPersonalLoans);


            } catch (error) {
                console.error("Error during data fetch error:", error);
            } finally {
                setInitialLoading(false);
                setLoading(false);
            }
        };

        if (authenticatedUser) {
            fetchData();
        } else {
            console.log('authenticatedUser is null, cannot fetch data');
        }
    }, [searchQuery, isFocused, authenticatedUser]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchLoanData = async () => {
                try {
                    setLoading(true);

                    const data = {
                        grant_type: "client_credentials",
                        client_id: "d9dcdf05-37f4-4bab-b428-323957ad2f86",
                        resource: "https://org0f7e6203.crm5.dynamics.com",
                        scope: "https://org0f7e6203.crm5.dynamics.com/.default",
                        client_secret: "JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2",
                    };

                    const tokenResponse = await axios.post(
                        "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token",
                        new URLSearchParams(data).toString(),
                        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
                    );

                    const accessToken = tokenResponse.data.access_token;

                    const responseLoanApplications = await axios.get(
                        "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications",
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                "Content-Type": "application/json",
                            },
                            // params: {
                            //   "$filter": `kf_createdby eq '${authenticatedUser.kf_adminname}'`
                            // }
                        }
                    );

                    const responsePersonalLoans = await axios.get(
                        "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans",
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                "Content-Type": "application/json",
                            },
                            // params: {
                            //   "$filter": `kf_createdby eq '${authenticatedUser.kf_adminname}'`
                            // }
                        }
                    );

                    const homeLoans = responseLoanApplications.data.value;
                    const personalLoans = responsePersonalLoans.data.value;

                    const filteredHomeLoans = homeLoans.filter(
                        (homeLoan) => homeLoan.kf_status !== null
                    );

                    const filteredPersonalLoans = personalLoans.filter(
                        (personalLoan) => personalLoan.kf_status !== null
                    );

                    const combinedData = [...filteredHomeLoans, ...filteredPersonalLoans];

                    setLoanData(combinedData);

                    const today = new Date();
                    const lastMonth = new Date(today);
                    lastMonth.setMonth(today.getMonth() - 1);

                    const lastMonthRecords = combinedData.filter((item) => {
                        const createdDate = new Date(item.createdon);
                        return createdDate >= lastMonth && createdDate <= today;
                    });

                    setLastMonthData(lastMonthRecords);

                } catch (error) {
                    console.error("Error fetching loan data:", error);
                    console.log("API Response:", error.response?.data);
                } finally {
                    setLoading(false);
                }
            };

            if (authenticatedUser) {
                fetchLoanData();
            } else {
                console.log('authenticatedUser is null, cannot fetch data');
            }
        }, [authenticatedUser])
    );

    const navigateToHomeDetails = (loanApplication) => {
        setSelectedContact(loanApplication);
        navigation.navigate('HomeLoanDetailsScreen', { loanApplication });
    };

    const navigateToPersonalDetails = (personalLoan) => {
        setSelectedContact(personalLoan);
        navigation.navigate('PersonalLoanDetailsScreen', { personalLoan });
    };

    const handleRefresh = () => {
        // This function will be called when you want to refresh the page
        setRefresh(!refresh);
    };

    const handleDynamicDashboard = () => {
        try {
            navigation.navigate('DynamicDashboardScreen');
        } catch (error) {
            console.error('Error navigating to DynamicDashboardScreen:', error);
        }
    }

    const handlelogout = () => {
        // navigation.navigate("Setting");
        navigation.navigate('Setting', { isLoggedInAsManager: true });
    };

    const handleNavigation = () => {
        navigation.navigate("Notification", { kf_adminname });
    };

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
                setuserapplicationid(response.data.kf_applicantid);
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
                routes: [{ name: 'LoginUserForm' }],
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

    return (
        <>
            <StatusBar />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

                <View style={styles.container}>

                <View style={styles.navBar}>

{/* <TouchableOpacity style={styles.iconButton} onPress={handlelogout}>
    <Ionicons name="list-sharp" size={25} color="#fff" />
</TouchableOpacity> */}
<Text style={styles.text}>Kevin Small Finance</Text>

<TouchableOpacity style={styles.iconButton} onPress={handleNavigation}>
    <View>
        <Ionicons name="notifications" size={25} color="#fff" />
        {unreadMessagesCount > 0 && (
            <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{unreadMessagesCount}</Text>
            </View>
        )}
    </View>
   
</TouchableOpacity>

<TouchableOpacity style={styles.iconButtonLogout} onPress={handleLogout}>
            <Ionicons name="md-log-out" size={28} color="#fff" />
        </TouchableOpacity>
        </View>

                    <ScrollView
                        contentContainerStyle={{ width: '100%' }}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={handleRefresh}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >

                        <View style={styles.chart}>
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
                                            <Text style={styles.detailText}>{userapplicationid}</Text>
                                        </View>
                                    </View>
                                </View>


                                <View>
                                    <View style={[styles.loanButton, { marginTop: 20 }]}>
                                        <TouchableOpacity onPress={handleHomeLoan} style={styles.button}>
                                            <Text style={styles.buttonText}>Apply Home Loan</Text>
                                            <Ionicons name="chevron-forward" size={25} color="white" style={styles.icon} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[styles.loanButton, { marginTop: 20 }]}>
                                        <TouchableOpacity onPress={handlePersonalLoan} style={styles.button}>
                                            <Text style={[styles.buttonText, { left: 8 }]}>Apply Personal Loan</Text>
                                            <Ionicons name="chevron-forward" size={25} color="white" style={[styles.icon, { right: 10 }]} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>

                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: -10, paddingHorizontal: 8 }}>
                            {initialLoading ? (
                                <ActivityIndicator size="large" color="#0000ff" />
                            ) : (
                                <ScrollView contentContainerStyle={{ width: "100%", paddingTop: 0 }}>
                                    {displayedHomeLoans.length === 0 && displayedPersonalLoans.length === 0 ? (
                                        <View style={styles.noRecordsContainer}>
                                            {/* <Text style={styles.noRecordsText}>No Records Found</Text> */}
                                        </View>
                                    ) : (
                                        <>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 15, width: "100%" }}>
                                                <Text style={[styles.heading, { right: 0 }]}>Home Loans</Text>
                                            </View>
                                            {displayedHomeLoans.length > 0 && (
                                                <>
                                                    {displayedHomeLoans
                                                        .filter(record => record.kf_userapplicantid === authenticatedUser?.kf_applicantid)
                                                        .map((homeLoan, index) => (
                                                            <HomeLoanCard
                                                                key={index}
                                                                loanApplication={homeLoan}
                                                                onPress={() => navigateToHomeDetails(homeLoan)}
                                                            />
                                                        ))
                                                    }

                                                    {displayedHomeLoans
                                                        .filter(record => record.kf_userapplicantid === authenticatedUser?.kf_applicantid)
                                                        .length === 0 && (
                                                            <View style={styles.noRecordsContainer}>
                                                                <Text style={styles.noRecordsText}>No Records Found</Text>
                                                            </View>
                                                        )
                                                    }

                                                </>
                                            )}

                                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 15, width: "100%" }}>
                                                <Text style={[styles.heading, { marginBottom: 0 }]}>Personal Loans</Text>
                                            </View>
                                            {displayedPersonalLoans.length > 0 && (
                                                <>
                                                    {displayedPersonalLoans
                                                        .filter(record => record.kf_userapplicantid === authenticatedUser?.kf_applicantid)
                                                        .map((personalLoan, index) => (
                                                            <PersonalLoanCard
                                                                key={index}
                                                                personalLoan={personalLoan}
                                                                onPress={() => navigateToPersonalDetails(personalLoan)}
                                                            />
                                                        ))
                                                    }
                                                    {displayedPersonalLoans
                                                        .filter(record => record.kf_userapplicantid === authenticatedUser?.kf_applicantid)
                                                        .length === 0 && (
                                                            <View style={[styles.noRecordsContainer, { textAlign: "center" }]}>
                                                                <Text style={styles.noRecordsText}>No Records Found</Text>
                                                            </View>
                                                        )
                                                    }
                                                </>
                                            )}
                                        </>
                                    )}
                                </ScrollView>
                            )}
                        </View>


                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
            <CustomAlert
                visible={showAlertInvalidUser}
                onClose={handledCloseInvalidAlert}
                onConfirm={handleConfirmLogout}
                headerMessage="Logout"
                message="Are you sure you want to logout?"
                Button1="Cancel"
                Button2="OK"
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
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
    statusContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    statusText: {
        fontSize: 12,
        color: "#007bff",
    },
    iconButton: {
        marginLeft: 50,

    },
    plusIconScetion: {
        position: 'absolute',
        bottom: 40,
        right: 30,
    },
    plusIcon: {
        backgroundColor: 'rgba(255, 28, 53, 255)',
        borderRadius: 50,
        padding: 10,
        width: 60
    },
    plusIconText: {
        fontSize: 30,
        color: "#fff",
        alignSelf: "center"
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        height: "25%"
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 15,
    },
    loanOption: {
        paddingVertical: 10,
    },
    loanOptionText: {
        fontSize: 18,
        color: '#333',
        marginHorizontal: 70,
        marginBottom: 10
    },
    text: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold"
    },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5E4E2',
        marginTop: 45,
        borderColor: "#AAB7B8",
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    searchIcon: {
        padding: 10,
        marginHorizontal: 10
    },
    chart: {
        marginLeft: 0
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        color: '#424242',
    },
    deviceWidthText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
        textAlign: 'center',
        marginRight: 30
    },
    dynamicDashboardButtonText: {
        backgroundColor: 'rgba(255, 28, 53, 255)',
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: "center"
    },
    viewMoreButton: {
        backgroundColor: 'red',
        width: "30%",
        height: 30,
        marginTop: 10,
        borderRadius: 30,
    },
    viewMoreButtonText: {
        textAlign: "center",
        color: "white",
        marginTop: 4,
        fontWeight: "bold"
    },
    badgeContainer: {
        position: 'absolute',
        top: -7, // Adjust the position of the badge vertically
        right: -7, // Adjust the position of the badge horizontally
        backgroundColor: '#697d71',
        borderRadius: 50,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1, // Ensure the badge is above the icon
        borderWidth: 1, // Add border for better visibility
        borderColor: '#fff', // White border color for better contrast
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 10, // Adjust font size for better visibility
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        color: "red"
    },
    noRecordsContainer: {
        backgroundColor: '#FFF', // Background color of the container
        borderRadius: 8, // Border radius to make it look like a card
        padding: 16, // Padding around the text
        marginTop: 16, // Margin around the container
        shadowColor: '#000', // Shadow color
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84,
        // elevation: 5, // Elevation for Android shadow
        justifyContent: 'center', // Center the text vertically
        alignItems: 'center', // Center the text horizontally
        marginHorizontal: 80,
        width: "80%"
    },
    noRecordsText: {
        color: '#0000cc', // Text color
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center', // Center align the text
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
        // backgroundColor:"black"
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
        padding: 5,
        borderRadius: 30,
        width: "50%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        marginRight: 15
    },

});

export default UserDashboard;
