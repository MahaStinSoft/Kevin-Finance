import React, { useState, useEffect } from 'react';
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
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import LoanStatusPicker from '../common/LoanStatusPicker ';
import HomeLoanCard from './card/HomeLoanCard';
import PersonalLoanCard from './card/PersonalLoanCard';

const DashboardScreen = ({ navigation, route }) => {
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [kfContacts, setKfContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearIcon, setShowClearIcon] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [kf_status, setkf_status] = useState('');
  const [homeLoanContacts, setHomeLoanContacts] = useState([]);
  const [personalLoanContacts, setPersonalLoanContacts] = useState([]);


  // Fetch authenticated user when component mounts
  useEffect(() => {
    getAuthenticatedUser();
  }, []);

  useEffect(() => {
    if (route.params?.authenticatedUser) {
      setAuthenticatedUser(route.params.authenticatedUser);
    }
  }, [route.params?.authenticatedUser]);

  const getAuthenticatedUser = async () => {
    try {
      const userString = await AsyncStorage.getItem('authenticatedUser');
      console.log("getAuthenticatedUser:", userString);

      if (userString) {
        const user = JSON.parse(userString);
        setAuthenticatedUser(user);
      }
    } catch (error) {
      console.error('Error getting authenticated user:', error);
    }
  };

  // const authenticatedUser = route.params?.authenticatedUser || {};

  const isFocused = useIsFocused();

  const deviceWidth = Dimensions.get('window').width;
  // console.log("device eWidth:" + deviceWidth);

  const textColor = deviceWidth < 390 ? 'red' : 'blue';

  const handleHomeLoan = () => {
    navigation.navigate("HomeLoan");
    console.log("Home Selected");
    setShowLoanModal(false);
  }

  const handlePersonalLoan = () => {
    navigation.navigate("PersonalLoan");
    console.log("Personal Selected");
    setShowLoanModal(false);
  }

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

        const response = await axios.get(
          "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const response1 = await axios.get(
          "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const homeLoans = response.data.value;
        const personalLoans = response1.data.value;

        setHomeLoanContacts(homeLoans);
        setPersonalLoanContacts(personalLoans);

        // Filter contacts based on the search query
        const filteredHomeLoans = homeLoans.filter((homeLoan) =>
          homeLoan.kf_name && homeLoan.kf_name.toUpperCase().includes(searchQuery.toUpperCase())
        );

        const filteredPersonalLoans = personalLoans.filter((personalLoan) =>
          personalLoan.kf_name && personalLoan.kf_name.toUpperCase().includes(searchQuery.toUpperCase())
        );

        setHomeLoanContacts(filteredHomeLoans);
        setPersonalLoanContacts(filteredPersonalLoans);
      } catch (error) {
        console.error("Error during data fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, isFocused]);// Trigger fetchData when the search query changes


  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          var data = {
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

          // console.log("tokenResponse", tokenResponse);
          const accessToken = tokenResponse.data.access_token;
          // console.log("Access Token:", accessToken);

          const response = await axios.get(
            "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const response1 = await axios.get(
            "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const homeLoans = response.data.value;
          const personalLoans = response1.data.value;

          setHomeLoanContacts(homeLoans);
          setPersonalLoanContacts(personalLoans);

          // Filter contacts based on the search query
          const filteredHomeLoans = homeLoans.filter((homeLoan) =>
            homeLoan.kf_name && homeLoan.kf_name.toUpperCase().includes(searchQuery.toUpperCase())
          );

          const filteredPersonalLoans = personalLoans.filter((personalLoan) =>
            personalLoan.kf_name && personalLoan.kf_name.toUpperCase().includes(searchQuery.toUpperCase())
          );

          setHomeLoanContacts(filteredHomeLoans);
          setPersonalLoanContacts(filteredPersonalLoans);
        } catch (error) {
          console.error('Error during data fetch:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [searchQuery, isFocused])
  );

  const navigateToHomeDetails = (loanApplication) => {
    setSelectedContact(loanApplication);
    navigation.navigate('HomeLoanDetailsScreen', { loanApplication });
  };

  const navigateToPersonalDetails = (personalLoan) => {
    setSelectedContact(personalLoan);
    navigation.navigate('PersonalLoanDetailsScreen', { personalLoan });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowClearIcon(false); // Set showClearIcon to false when clearing the search
  };

  const handleLoanStatusChange = (selectedStatus) => {
    setkf_status(selectedStatus);
    console.log('Selected Loan Status:', selectedStatus);
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
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.openDrawer()}>
              <Ionicons name="list-sharp" size={25} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.text}>Kevin Small Finance</Text>
            <TouchableOpacity style={styles.iconButton} onPress={() => console.log('notification icon pressed')}>
              <Ionicons name="notifications" size={25} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchSection}>
            <Ionicons style={styles.searchIcon} name="search" size={25} color="rgba(255, 28, 53, 255)" />
            <TextInput
              style={styles.input}
              placeholder="Search"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setShowClearIcon(text.length > 0); // Show clear icon if there's text in the search input
              }}
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

          <View>
            <LoanStatusPicker
              onOptionChange={handleLoanStatusChange}
              title="Select Loan Status"
              options={['Approved', 'PendingApproval', 'Draft', 'Cancelled']}
            // initialOption="Approved" 
            />
          </View>

          <View>
            {/* <Text>Welcome to the Dashboard</Text> */}
            <Text>Authenticated User:</Text>
            {authenticatedUser && (
              <>
                <Text>Email: {authenticatedUser.kf_name}</Text>
                <Text>Password: {authenticatedUser.kf_password}</Text>
              </>
            )}
          </View>

          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <ScrollView contentContainerStyle={{ width: "100%", paddingTop: 20 }}>
                {/* Display Home Loans */}
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Home Loans</Text>
                {homeLoanContacts.map((homeLoan, index) => (
                  <HomeLoanCard
                    key={index}
                    loanApplication={homeLoan}
                    onPress={() => navigateToHomeDetails(homeLoan)}
                  />
                ))}

                {/* Display Personal Loans */}
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Personal Loans</Text>
                {personalLoanContacts.map((personalLoan, index) => (
                  <PersonalLoanCard
                    key={index}
                    personalLoan={personalLoan}
                    onPress={() => navigateToPersonalDetails(personalLoan)}
                  />
                ))}
              </ScrollView>
            )}
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
        </View>
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
});

export default DashboardScreen;