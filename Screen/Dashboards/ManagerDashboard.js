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
RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';

import HomeLoanCard from '../card/HomeLoanCard';
import PersonalLoanCard from '../card/PersonalLoanCard';

const ManagerDashboard = ({ navigation, route }) => {
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
    const [refresh, setRefresh] = useState(false);

  const [displayedHomeLoans, setDisplayedHomeLoans] = useState([]);
  const [displayedPersonalLoans, setDisplayedPersonalLoans] = useState([]);
  const [showAllLoans, setShowAllLoans] = useState(false);

  const isFocused = useIsFocused();

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
    getAuthenticatedUser();
  }, [isFocused, getAuthenticatedUser]);

  // Update displayed loans based on showAllLoans state
  useEffect(() => {
    setDisplayedHomeLoans(showAllLoans ? HomeLoanRecords : HomeLoanRecords.slice(0, 3));
    setDisplayedPersonalLoans(showAllLoans ? PersonalLoanRecords : PersonalLoanRecords.slice(0, 3));
  }, [showAllLoans, HomeLoanRecords, PersonalLoanRecords]);


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

        const userAdmin = authenticatedUser ? authenticatedUser.kf_adminname : '';

        const homeLoanRecords = homeLoans.filter(
          (homeLoan) => 
            // homeLoan.kf_createdby === userAdmin &&
            (
              homeLoan.kf_name && homeLoan.kf_name.toUpperCase().includes(searchQuery.toUpperCase()) ||
              homeLoan.kf_lastname && homeLoan.kf_lastname.toUpperCase().includes(searchQuery.toUpperCase()) ||
              (homeLoan.kf_mobilenumber && homeLoan.kf_mobilenumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (homeLoan.kf_aadharnumber && homeLoan.kf_aadharnumber.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        );        
        
        const personalLoanRecords = personalLoans.filter(
          (personalLoan) => 
            // personalLoan.kf_createdby === userAdmin &&
            (
              personalLoan.kf_firstname && personalLoan.kf_firstname.toUpperCase().includes(searchQuery.toUpperCase()) ||
              personalLoan.kf_lastname && personalLoan.kf_lastname.toUpperCase().includes(searchQuery.toUpperCase()) ||
              (personalLoan.kf_mobile && personalLoan.kf_mobile.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (personalLoan.kf_aadharnumber && personalLoan.kf_aadharnumber.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        );
    
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
  
  

  const filteredData = loanData.filter(
    (item) =>
      item.kf_status !== null &&
      (selectedLoanStatus ? item.kf_status === selectedLoanStatus : true)
  );

  const statusCounts = {
    approved: filteredData.filter((item) => item.kf_status === 123950000).length,
    draft: filteredData.filter((item) => item.kf_status === 123950002).length,
    pending: filteredData.filter((item) => item.kf_status === 123950001).length,
    canceled: filteredData.filter((item) => item.kf_status === 123950003).length,
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

const handlelogout = () => {
  navigation.navigate( "Setting");
};

const handleNavigation = () => {
  navigation.navigate( "Notification");
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
             <TouchableOpacity style={styles.iconButton} onPress={handlelogout}>
              <Ionicons name="list-sharp" size={25} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.text}>Kevin Small Finance</Text>
            <TouchableOpacity style={styles.iconButton} onPress={handleNavigation}>
              <Ionicons name="notifications" size={25} color="#fff" />
            </TouchableOpacity>
           
          </View>

          <View style={styles.searchSection}>
            <Ionicons style={styles.searchIcon} name="search" size={25} color="rgba(255, 28, 53, 255)" />
            <TextInput
              style={styles.input} placeholder="Search"
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

            {/* <View>
              {authenticatedUser && (
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 2, textAlign: "center" }}>Created By: {authenticatedUser.kf_adminname}</Text>
              )}
            </View> */}
            {/* <LogoutButton navigation={navigation}/> */}

            <Text style={{textAlign: "center", marginVertical: 10, fontSize: 18, fontWeight: "bold",color: "red"}}>MANAGER DASHBOARD</Text>


            <View style={styles.chart}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 10 }}>Loan Status Chart</Text>
              {/* <Text style={styles.totalLoans}>Total Loans: {filteredData.length}</Text> */}

              <View style={styles.statusContainer}>
                <TouchableOpacity onPress={() => handleStatusClick(123950000)}>
                  <Text style={styles.statusText}>Approved: {statusCounts.approved}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusClick(123950002)}>
                  <Text style={styles.statusText}>Draft: {statusCounts.draft}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusClick(123950001)}>
                  <Text style={styles.statusText}>Pending: {statusCounts.pending}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusClick(123950003)}>
                  <Text style={styles.statusText}>Canceled: {statusCounts.canceled}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusClick(123950004)}>
                  <Text style={styles.statusText}>expired: {statusCounts.expired}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStatusClick(null)}>
                  <Text style={styles.statusText}>All: {filteredData.length}</Text>
                </TouchableOpacity>
              </View>

              <BarChart
                data={{
                  labels: ['Approved', 'Pending', 'Draft', 'Cancelled', 'expired'],
                  datasets: [
                    {
                      data: [
                        statusCounts.approved,
                        statusCounts.pending,
                        statusCounts.draft,
                        statusCounts.canceled,
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

              <View style={{ marginLeft: 0 }}>
                <TouchableOpacity
                  onPress={() => setShowAllLoans(!showAllLoans)}
                  style={styles.viewButton}
                >
                  <Text style={styles.dynamicDashboardButtonText}>
                    {showAllLoans ? 'View Less' : 'View More'}
                  </Text>
                </TouchableOpacity>
              </View>


            {/* <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: -10 }}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <ScrollView contentContainerStyle={{ width: "100%", paddingTop: 0 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Home Loans</Text>
            {displayedHomeLoans.map((homeLoan, index) => (
              <HomeLoanCard
                key={index}
                loanApplication={homeLoan}
                onPress={() => navigateToHomeDetails(homeLoan)}
              />
            ))}

            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Personal Loans</Text>
            {displayedPersonalLoans.map((personalLoan, index) => (
              <PersonalLoanCard
                key={index}
                personalLoan={personalLoan}
                onPress={() => navigateToPersonalDetails(personalLoan)}
              />
            ))}

              </ScrollView>
            )}
          </View> */}

            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: -10 }}>
            {initialLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <ScrollView contentContainerStyle={{ width: "100%", paddingTop: 0 }}>
                  {displayedHomeLoans.length === 0 && displayedPersonalLoans.length === 0 && (
                    <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 20 }}>
                      No records found
                    </Text>
                  )}

                  {displayedHomeLoans.length > 0 && (
                    <>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Home Loans</Text>
                      {displayedHomeLoans.map((homeLoan, index) => (
                        <HomeLoanCard
                          key={index}
                          loanApplication={homeLoan}
                          onPress={() => navigateToHomeDetails(homeLoan)}
                        />
                      ))}
                    </>
                  )}

                  {displayedPersonalLoans.length > 0 && (
                    <>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Personal Loans</Text>
                      {displayedPersonalLoans.map((personalLoan, index) => (
                        <PersonalLoanCard
                          key={index}
                          personalLoan={personalLoan}
                          onPress={() => navigateToPersonalDetails(personalLoan)}
                        />
                      ))}
                    </>
                  )}

                  {displayedHomeLoans.length === 0 && displayedPersonalLoans.length === 0 && (
                    <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 20 }}>
                      No records found for both Home Loans and Personal Loans
                    </Text>
                  )}

                  {displayedHomeLoans.length === 0 && displayedPersonalLoans.length > 0 && (
                    <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 20 }}>
                      No records found for Home Loans
                    </Text>
                  )}

                  {displayedHomeLoans.length > 0 && displayedPersonalLoans.length === 0 && (
                    <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 20 }}>
                      No records found for Personal Loans
                    </Text>
                  )}
                </ScrollView>
              )}
            </View>

          </ScrollView>
        </View>
        <Modal
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
        </Modal>
        <View style={styles.plusIconScetion}>
          <TouchableOpacity style={styles.plusIcon} onPress={() => setShowLoanModal(!showLoanModal)}>
            <Text style={styles.plusIconText}>+</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    fontSize: 12,
    color: "#007bff",
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
    marginTop: 45
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
    marginTop: 10,
    color: '#333',
    textAlign: 'center',
    marginRight: 30
  },
  dynamicDashboardButtonText: {
    backgroundColor:'rgba(255, 28, 53, 255)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign:"center"
  },
  viewButton: {
    backgroundColor:'rgba(255, 28, 53, 255)',
    borderRadius: 25,
    padding: 10,
    marginTop: 10,
    width: 100,
    alignSelf: "flex-end"
},
});

export default ManagerDashboard;
