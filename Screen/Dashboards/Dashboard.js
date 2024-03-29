import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Platform,
  RefreshControl,
  Alert,
  BackHandler
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';
import LogoutButton from '../../common/CustomDrawer';
import querystring from 'querystring';
import CustomAlert from '../../common/CustomAlert';
import HomeLoanCard from '../card/HomeLoanCard';
import PersonalLoanCard from '../card/PersonalLoanCard';
import DynamicDashboardScreen from '../DynamicDashboardScreen';
import ButtonComponent from '../../common/ButtonComponent';

const DashboardScreen = ({ navigation, route }) => {
  // const { authenticatedUser } = route.params;
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearIcon, setShowClearIcon] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [kf_status, setkf_status] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [homeLoanContacts, setHomeLoanContacts] = useState([]);
  const [personalLoanContacts, setPersonalLoanContacts] = useState([]);
  const [PersonalLoanRecords, setPersonalLoanRecords] = useState([]);
  const [HomeLoanRecords, setHomeLoanRecords] = useState([]);
  const [lastMonthData, setLastMonthData] = useState([]);
  const [selectedLoanStatus, setSelectedLoanStatus] = useState(null);
  const [kf_adminname, setkf_adminname] = useState(null);

  const [loanApplications, setLoanApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loanApplicationsCount, setLoanApplicationsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [sendApproval, setSendApproval] = useState(null);

  const [displayedHomeLoans, setDisplayedHomeLoans] = useState([]);
  const [displayedPersonalLoans, setDisplayedPersonalLoans] = useState([]);
  // const [showAllLoans, setShowAllLoans] = useState(false);
  const [showAllHomeLoans, setShowAllHomeLoans] = useState(false);
  const [showAllPersonalLoans, setShowAllPersonalLoans] = useState(false);
  const [showAlert, setShowAlert] = useState(false); 
  const [isConnected, setIsConnected] = useState(true);
  const isFocused = useIsFocused();

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     // console.log('Network state changed:', state.isConnected);
  //     if (!state.isConnected) {
  //       console.log('No Internet Connection');
  //       // Alert.alert('No Internet Connection', 'Please check your internet connection and try again.');
  //       setShowAlert(true);
  //     }

  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);
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

  const toggleShowAllHomeLoans = () => {
    setShowAllHomeLoans(!showAllHomeLoans);
  };

  // Function to toggle showing all personal loans
  const toggleShowAllPersonalLoans = () => {
    setShowAllPersonalLoans(!showAllPersonalLoans);
  };

  const handleHomeLoan = () => {
    navigation.navigate('HomeLoan');
    setShowLoanModal(false);

  };

  const handlePersonalLoan = () => {
    navigation.navigate("PersonalLoan");
    console.log("Personal Selected");
    setShowLoanModal(false);
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

        const homeLoanRecords = homeLoans.filter(
          (homeLoan) =>
            homeLoan.kf_createdby === userAdmin &&
            (
              homeLoan.kf_name && homeLoan.kf_name.toUpperCase().includes(searchQuery.toUpperCase()) ||
              homeLoan.kf_lastname && homeLoan.kf_lastname.toUpperCase().includes(searchQuery.toUpperCase()) ||
              (homeLoan.kf_mobilenumber && homeLoan.kf_mobilenumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (homeLoan.kf_aadharnumber && homeLoan.kf_aadharnumber.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        );

        const personalLoanRecords = personalLoans.filter(
          (personalLoan) =>
            personalLoan.kf_createdby === userAdmin &&
            (
              personalLoan.kf_firstname && personalLoan.kf_firstname.toUpperCase().includes(searchQuery.toUpperCase()) ||
              personalLoan.kf_lastname && personalLoan.kf_lastname.toUpperCase().includes(searchQuery.toUpperCase()) ||
              (personalLoan.kf_mobile && personalLoan.kf_mobile.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (personalLoan.kf_aadharnumber && personalLoan.kf_aadharnumber.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        );

        setDisplayedHomeLoans(latestHomeLoans);
        setDisplayedPersonalLoans(latestPersonalLoans);

        setHomeLoanRecords(homeLoanRecords);
        setPersonalLoanRecords(personalLoanRecords);

        setHomeLoanContacts(homeLoanRecords);
        setPersonalLoanContacts(personalLoanRecords);

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
              params: {
                "$filter": `kf_createdby eq '${authenticatedUser.kf_adminname}'`
              }
            }
          );

          const responsePersonalLoans = await axios.get(
            "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              params: {
                "$filter": `kf_createdby eq '${authenticatedUser.kf_adminname}'`
              }
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

  const filteredData = loanData.filter(
    (item) =>
      item.kf_status !== null &&
      (selectedLoanStatus ? item.kf_status === selectedLoanStatus : true)
  );

  const statusCounts = {
    approved: filteredData.filter((item) => item.kf_status === 123950000).length,
    // draft: filteredData.filter((item) => item.kf_status === 123950002).length,
    pending: filteredData.filter((item) => item.kf_status === 123950001).length,
    // canceled: filteredData.filter((item) => item.kf_status === 123950003).length,
    expired: filteredData.filter((item) => item.kf_status === 123950004).length,
  };

  const handleStatusClick = (status) => {
    if (selectedStatus === status) {
      // If the same status is clicked again, reset the filter
      setSelectedLoanStatus(null);
    } else {
      setSelectedLoanStatus(status);
    }
  };

  const navigateToHomeDetails = (loanApplication) => {
    setSelectedContact(loanApplication);
    navigation.navigate('HomeLoanDetailsScreen', { loanApplication });
  };

  const navigateToPersonalDetails = (personalLoan) => {
    setSelectedContact(personalLoan);
    navigation.navigate('PersonalLoanDetailsScreen', { personalLoan });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowClearIcon(query.length > 0);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowClearIcon(false);
    // Optionally, you can reset or re-fetch your data here
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

  // notificaiton badge
  useEffect(() => {
    fetchLoanApplications();
    fetchNotifications();
  }, []);

  const fetchLoanApplications = async () => {
    try {
      const tokenResponse = await axios.post(
        'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
        querystring.stringify({
          grant_type: 'client_credentials',
          client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
          resource: 'https://org0f7e6203.crm5.dynamics.com',
          scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
          client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data && response.data.value && Array.isArray(response.data.value)) {
        // Filter loan applications where kf_sendapproval is equal to 1
        const filteredApplications = response.data.value.filter(application => application.kf_sendapproval == 1);
        setLoanApplications(filteredApplications);
        setLoanApplicationsCount(filteredApplications.length);
        // setRefresh(!refresh);
      } else {
        console.error('Invalid loan applications response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching loan applications:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const tokenResponse = await axios.post(
        'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
        querystring.stringify({
          grant_type: 'client_credentials',
          client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
          resource: 'https://org0f7e6203.crm5.dynamics.com',
          scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
          client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data && response.data.value && Array.isArray(response.data.value)) {
        // Filter personal loan notifications where kf_sendapproval is equal to 1
        const filteredNotifications = response.data.value.filter(notification => notification.kf_sendapproval == 1);
        setNotifications(filteredNotifications);
        setNotificationsCount(filteredNotifications.length); // Update count based on the fetched data
        // setRefresh(!refresh);
      } else {
        console.error('Invalid notifications response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSettings = () => {
    navigation.navigate("Setting");
  };
  const handleNavigation = () => {
    navigation.navigate("AdminNotification", { authenticatedUser });
  };

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
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
            {/* <TouchableOpacity style={styles.iconButton} onPress={() => navigation.openDrawer()}>
              <Ionicons name="list-sharp" size={25} color="#fff" />
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
              <Ionicons name="list-sharp" size={25} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.text}>Kevin Small Finance</Text>

            <TouchableOpacity style={styles.iconButton} onPress={handleNavigation}>
              <Ionicons name="notifications" size={25} color="#fff" />
              {(
                loanApplications
                  .filter(
                    application =>
                      (sendApproval === null || application.kf_sendapproval === (sendApproval ? 1 : 0)) &&
                      authenticatedUser &&
                      application.kf_createdby === authenticatedUser.kf_adminname &&
                      !application.kf_markasread // Filter only unread home loan applications
                  )
                  .length +
                notifications
                  .filter(
                    notification =>
                      authenticatedUser &&
                      notification.kf_createdby === authenticatedUser.kf_adminname &&
                      !notification.kf_markasread // Filter only unread personal loan notifications
                  )
                  .length
              ) > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {
                        loanApplications
                          .filter(
                            application =>
                              (sendApproval === null || application.kf_sendapproval === (sendApproval ? 1 : 0)) &&
                              authenticatedUser &&
                              application.kf_createdby === authenticatedUser.kf_adminname &&
                              !application.kf_markasread // Filter only unread home loan applications
                          )
                          .length +
                        notifications
                          .filter(
                            notification =>
                              authenticatedUser &&
                              notification.kf_createdby === authenticatedUser.kf_adminname &&
                              !notification.kf_markasread // Filter only unread personal loan notifications
                          )
                          .length
                      }
                    </Text>
                  </View>
                )}
            </TouchableOpacity>
          </View>

          <View style={styles.searchSection}>
            <Ionicons style={styles.searchIcon} name="search" size={25} color="rgba(255, 28, 53, 255)" />
            <TextInput
              style={styles.input} placeholder="Search -Mobile No, Aadhar No, Pancard No"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {showClearIcon && (
              <Ionicons
                style={styles.searchIcon}
                name="close"
                size={25}
                color="rgba(255, 28, 53, 255)"
                onPress={handleClearSearch}
              />
            )}
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
            {/* <Text style={{textAlign: "center", marginBottom: 10, fontSize: 18, fontWeight: "bold",color: "red"}}>ADMIN DASHBOARD</Text> */}

            {/* <View>
              {authenticatedUser && (
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 2, textAlign: "center" }}>Created By: {authenticatedUser.kf_adminname}</Text>
              )}
            </View> */}
            {/* <LogoutButton navigation={navigation}/> */}

            <View style={styles.chart}>
              <Text style={styles.heading}>Loan Status Chart</Text>
              {/* <Text style={styles.totalLoans}>Total Loans: {filteredData.length}</Text> */}

              <View style={styles.statusContainer}>
                <TouchableOpacity onPress={() => handleStatusClick(123950000)}>
                  <Text style={styles.statusText}>Approved: {statusCounts.approved}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => handleStatusClick(123950002)}>
                  <Text style={styles.statusText}>Draft: {statusCounts.draft}</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => handleStatusClick(123950001)}>
                  <Text style={styles.statusText}>Pending: {statusCounts.pending}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => handleStatusClick(123950003)}>
                  <Text style={styles.statusText}>Canceled: {statusCounts.canceled}</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => handleStatusClick(123950004)}>
                  <Text style={styles.statusText}>Rejected: {statusCounts.expired}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusClick(null)}>
                  <Text style={styles.statusText}>All: {filteredData.length}</Text>
                </TouchableOpacity>
              </View>

              <BarChart
                data={{
                  labels: ['Approved', 'Pending', 'Rejected'],
                  datasets: [
                    {
                      data: [
                        statusCounts.approved,
                        statusCounts.pending,
                        // statusCounts.draft,
                        // statusCounts.canceled,
                        statusCounts.expired,
                      ],
                    },
                  ],
                }}
                width={deviceWidth - 20}
                height={220}
                yAxisLabel=""
                chartConfig={{
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  color: (opacity = 1) => `rgba(255, 28, 53, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  barPercentage: 1.5,
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>

            {/* Dynamic Dashboard Button */}
            {/* <TouchableOpacity style={styles.dynamicDashboardButton} onPress={handleDynamicDashboard}>
                <Text style={styles.dynamicDashboardButtonText}>Dynamic Dashboard</Text>
              </TouchableOpacity> */}

            {/* <View style={{ marginRight: 10 }}>
              <TouchableOpacity
                onPress={() => setShowAllLoans(!showAllLoans)}
                style={styles.viewButton}
              >
                <Text style={styles.dynamicDashboardButtonText}>
                  {showAllLoans ? 'View Less' : 'View More'}
                </Text>
              </TouchableOpacity>
            </View> */}

            {/* <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: -10, paddingHorizontal: 8 }}>
              {initialLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <ScrollView contentContainerStyle={{ width: "100%", paddingTop: 0 }}>
                  {displayedHomeLoans.length === 0 && displayedPersonalLoans.length === 0 && (
                    <View style={[styles.noRecordsContainer, { marginTop: 80 }]}>
                      <Text style={styles.noRecordsText}>No Records Found</Text>
                    </View>
                  )}

                  <View style={{ bottom: 50 }}>
                    {displayedHomeLoans.length > 0 && (
                      <>
                        <View style={{ marginRight: 10 }}>
                          {displayedHomeLoans.length > 0 && (
                            <ButtonComponent
                              title={showAllHomeLoans ? 'View Less' : 'View More'}
                              onPress={toggleShowAllHomeLoans}
                              style={{ width: "30%", top: 70, left: 0, alignSelf: "flex-end" }}
                            />
                          )}
                        </View>
                        <Text style={[styles.heading, { marginBottom: 20 }]}>Home Loans</Text>
                        {displayedHomeLoans.map((homeLoan, index) => (
                          <HomeLoanCard
                            key={index}
                            loanApplication={homeLoan}
                            onPress={() => navigateToHomeDetails(homeLoan)}
                          />
                        ))}
                      </>
                    )}
                  </View>
                  <View style={{ marginTop: -100, width: "100%" }}>
                    {displayedPersonalLoans.length > 0 && (
                      <>
                        <View style={{ marginRight: 10 }}>
                          {displayedPersonalLoans.length > 0 && (
                            <ButtonComponent
                              title={showAllPersonalLoans ? 'View Less' : 'View More'}
                              onPress={toggleShowAllPersonalLoans}
                              style={{ width: "30%", top: 60, left: 0, alignSelf: "flex-end" }}
                            />
                          )}
                        </View>
                        <Text style={[styles.heading, { paddingHorizontal: 5, top: -10 }]}>Personal Loans</Text>
                        {displayedPersonalLoans.map((personalLoan, index) => (
                          <PersonalLoanCard
                            key={index}
                            personalLoan={personalLoan}
                            onPress={() => navigateToPersonalDetails(personalLoan)}
                          />
                        ))}
                      </>
                    )}
                  </View>
                  {displayedHomeLoans.length === 0 && displayedPersonalLoans.length === 0 && (
                    <View style={[styles.noRecordsContainer, { marginTop: 180 }]}>
                      <Text style={styles.noRecordsText}>No Records Found</Text>
                    </View>
                  )}

                  {displayedHomeLoans.length === 0 && displayedPersonalLoans.length > 0 && (
                    <View style={styles.noRecordsContainer}>
                      <Text style={styles.noRecordsText}>No Records Found</Text>
                    </View>
                  )}

                  {displayedHomeLoans.length > 0 && displayedPersonalLoans.length === 0 && (
                    <View style={styles.noRecordsContainer}>
                      <Text style={styles.noRecordsText}>No Records Found</Text>
                    </View>
                  )}
                </ScrollView>
              )}
            </View> */}

<View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: -10, paddingHorizontal: 8 }}>
  {initialLoading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (
    <ScrollView contentContainerStyle={{ width: "100%", paddingTop: 0 }}>
      {(displayedHomeLoans.length === 0 && displayedPersonalLoans.length === 0) && (
        <View style={[styles.noRecordsContainer, { marginTop: 80 }]}>
          <Text style={styles.noRecordsText}>No Records Found</Text>
        </View>
      )}

<View style={{ marginTop: 10 }}>
        {displayedHomeLoans.length > 0 && (
        <>
            <View style={{  flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={[styles.heading, { marginBottom: 20 }]}>Home Loans</Text>
          
          <TouchableOpacity
                            onPress={toggleShowAllHomeLoans} style={{backgroundColor:'red', width: "30%", height: 30, marginTop: 10, borderRadius: 30}}>
                              <Text style={{textAlign: "center", color: "white", marginTop: 4, fontWeight: "bold"}}>
                                {showAllHomeLoans ? 'View Less' : 'View More'}
                            </Text>
                          </TouchableOpacity>
                          </View>
          {displayedHomeLoans.map((homeLoan, index) => (
            <HomeLoanCard
              key={index}
              loanApplication={homeLoan}
              onPress={() => navigateToHomeDetails(homeLoan)}
            />
          ))}
        </>
      )}
</View>
<View style={{ marginTop: 10, width: "100%" }}>
      {displayedPersonalLoans.length > 0 && (
        <>
           <View style={{  flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={[styles.heading, { marginBottom: 20 }]}>Personal Loans</Text>
          
          <TouchableOpacity
                            onPress={toggleShowAllPersonalLoans} style={{backgroundColor:'red', width: "30%", height: 30, marginTop: 10, borderRadius: 30}}>
                              <Text style={{textAlign: "center", color: "white", marginTop: 4, fontWeight: "bold"}}>
                                {showAllPersonalLoans ? 'View Less' : 'View More'}
                            </Text>
                          </TouchableOpacity>
                          </View>
          {displayedPersonalLoans.map((personalLoan, index) => (
            <PersonalLoanCard
              key={index}
              personalLoan={personalLoan}
              onPress={() => navigateToPersonalDetails(personalLoan)}
            />
          ))}
        </>
      )}
</View>
      {(displayedHomeLoans.length === 0 && displayedPersonalLoans.length > 0) && (
        <View style={styles.noRecordsContainer}>
          <Text style={styles.noRecordsText}>No Home Loan Records Found</Text>
        </View>
      )}

      {(displayedHomeLoans.length > 0 && displayedPersonalLoans.length === 0) && (
        <View style={styles.noRecordsContainer}>
          <Text style={styles.noRecordsText}>No Personal Loan Records Found</Text>
        </View>
      )}
    </ScrollView>
  )}
</View>


          </ScrollView>
        </View>
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={showLoanModal}
          onRequestClose={() => setShowLoanModal(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.modalHeading}>LOAN TYPES</Text>

                <TouchableOpacity style={styles.closeButton} onPress={() => setShowLoanModal(false)}>
                  <Ionicons name="close" size={20} color="#000" />
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: -20 }}>
                <TouchableOpacity style={[styles.loanOption, { borderBottomWidth: 1, borderBottomColor: '#ccc', marginTop: 40 }]} onPress={handleHomeLoan}>
                  <Text style={styles.loanOptionText}>Home Loan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loanOption} onPress={handlePersonalLoan}>
                  <Text style={styles.loanOptionText}>Personal Loan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal> */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={showLoanModal}
          onRequestClose={() => setShowLoanModal(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalHeading, { textAlign: "center" }]}>Choose Loan Type</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setShowLoanModal(false)}>
                  <Ionicons name="close" size={26} color="red" />
                </TouchableOpacity>
              </View>
              <View style={[styles.optionContainer, { height: "50%" }]}>
                <TouchableOpacity style={[styles.optionButton, { marginTop: 0 }]} onPress={handleHomeLoan}>
                  <Text style={styles.optionText}>Home Loan</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.optionButton, { marginTop: 10 }]} onPress={handlePersonalLoan}>
                  <Text style={styles.optionText}>Personal Loan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.plusIconScetion}>
          <TouchableOpacity style={styles.plusIcon} onPress={() => setShowLoanModal(!showLoanModal)}>
            <Text style={styles.plusIconText}>+</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <CustomAlert
          // visible={handleShowAlert}
          visible={showAlert && !isConnected}
          onClose={handleCloseAlert}
          onConfirm={handleCloseAlert}
          headerMessage="No Internet Connection"
          message="Please check your internet connection and try again."
          Button1="Cancel"
          Button2="OK"
          style={[styles.alertStyle, {height: "23%"}]}
          modalHeaderStyle={[styles.modalheaderStyle, {right: 40}]}
          textStyle={styles.textStyle}
        />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 14,
    color: "#007bff",
    marginHorizontal: 15
  },
  iconButton: {
    marginHorizontal: 10,
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
  // modalContainer: {
  //   backgroundColor: '',
  //   borderRadius: 10,
  //   padding: 20,
  //   width: '70%',
  //   height: "25%"
  // },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 5,
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
    marginTop: 50,
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 40
  },
  dynamicDashboardButtonText: {
    // backgroundColor: 'rgba(255, 28, 53, 255)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: "center",
    marginVertical: 8
  },
  viewButton: {
    // backgroundColor: 'rgba(255, 28, 53, 255)',
    // borderRadius: 25,
    // // padding: 10,
    // top: 40,
    // width: "28%",
    // alignSelf: "flex-end",
  },
  chart: {
    marginLeft: 10
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: "red"
  },
  badge: {
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
    fontSize: 12, // Adjust font size for better visibility
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
  },
  noRecordsText: {
    color: '#0000cc', // Text color
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Center align the text
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '70%',
    borderRadius: 10,
    padding: 20,
    height: "35%"
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  // closeButton: {
  //   padding: 5,
  // },
  optionContainer: {
    alignItems: 'center',
    // backgroundColor:"green",
  },
  optionButton: {
    backgroundColor: '#ffb3b3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: "70%",
    borderColor: "red",
    borderWidth: 1
  },
  optionText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  alertStyle:{
    // backgroundColor: "blue",
    width: "80%",
      },
      modalheaderStyle:{
        // backgroundColor: "green",
        right: 85
      },
      textStyle:{
        // backgroundColor: "yellow"
      }
});

export default DashboardScreen;
