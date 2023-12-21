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
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ContactGridCard from '../common/ContactGridCard';
import axios from 'axios';

const Dashboard = ({ navigation }) => {
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [kfContacts, setKfContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  const deviceWidth = Dimensions.get('window').width;
  console.log("device eWidth:" + deviceWidth);

  const textColor = deviceWidth < 390 ? 'red' : 'blue';

  const handleHomeLoan = () => {
    navigation.navigate("HomeLoan");
    console.log("Home Selected");
    setShowLoanModal(false);
  }

  const handlePersonalLoan = () => {
    navigation.navigate("PersonalScreen");
    console.log("Personal Selected");
    setShowLoanModal(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        console.log("tokenResponse", tokenResponse);
        const accessToken = tokenResponse.data.access_token;
        console.log("Access Token:", accessToken);

        const response = await axios.get(
          "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/contacts",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setKfContacts(response.data.value);
        } else {
          console.log("Failed to fetch data. Response status:", response.status);
        }
      } catch (error) {
        console.error("Error during data fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigateToContactDetails = (contact) => {
    setSelectedContact(contact);
    navigation.navigate('UserDetails', { contact });
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={{ flex: 1 }}>
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
                onFocus={() => console.log('TextInput focused')}
              />
            </View>

            <View>
              <Text style={[styles.deviceWidthText, { color: textColor }]}>Device Width: {deviceWidth}</Text>
            </View>

            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <ScrollView contentContainerStyle={{ width: "80%", paddingTop: 20 }}>
                  {kfContacts.length === 0 ? (
                    <Text>No contacts records found.</Text>
                  ) : (
                    kfContacts.map((kfContact, index) => (
                      <ContactGridCard
                        key={index}
                        contact={kfContact}
                        onPress={navigateToContactDetails}
                      />
                    ))
                  )}
                </ScrollView>
              )}
            </View>

            <View style={styles.plusIconScetion}>
              <TouchableOpacity style={styles.plusIcon} onPress={() => setShowLoanModal(!showLoanModal)}>
                <Text style={styles.plusIconText}>+</Text>
              </TouchableOpacity>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={showLoanModal}
              onRequestClose={() => setShowLoanModal(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <View>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowLoanModal(false)}>
                      <Ionicons name="close" size={20} color="#000" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={[styles.loanOption, { borderBottomWidth: 1, borderBottomColor: '#ccc', marginTop: 40 }]} onPress={handleHomeLoan}>
                    <Text style={styles.loanOptionText}>Home Loan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.loanOption} onPress={handlePersonalLoan}>
                    <Text style={styles.loanOptionText}>Personal Loan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
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
    marginTop: 24
  },
  iconButton: {
    marginHorizontal: 10,
  },
  plusIconScetion: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginLeft: 250,
    marginTop: 580,
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
    paddingVertical: 15,
  },
  loanOptionText: {
    fontSize: 18,
    color: '#333',
    marginHorizontal: 70,
    alignSelf: "flex-start"
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
    marginTop: 70
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
});

export default Dashboard;