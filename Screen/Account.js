import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import TextInputComponent from '../common/TextInput';
import HeaderComponent from '../common/Header';

const AccountScreen = () => {
  const [user, setUser] = useState(null);

  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.navigate("Dashboard");
  };

  const mapGenderLabel = (genderCode) => {
    // Define a mapping of gender codes to labels
    const genderLabels = {
      1: 'Male',
      2: 'Female',
      3: 'Other',
    };
    // Return the corresponding label, or 'Unknown' if not found
    return genderLabels[genderCode] || '';
  };

  const mapRoleLabel = (roleCode) => {
    const roleLabels = {
      1: 'Collection Officer',
      2: 'Employee',
      3: 'Manager',
      4: 'Supervisor',
    };
    return roleLabels[roleCode] || '';
  };

  const mapStatusLabel = (statusCode) => {
    const statusLabels = {
      0: 'Active',
      1: 'Inactive',
    };
    return statusLabels[statusCode] || '';
  };  
  
  // Moved the declaration of fetchUser to the top of useEffect
  const fetchUser = async () => {
    try {
      // Authenticate and obtain the access token
      const tokenResponse = await axios.post(
        "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token",
        `grant_type=client_credentials&client_id=d9dcdf05-37f4-4bab-b428-323957ad2f86&client_secret=JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2&resource=https://org0f7e6203.crm5.dynamics.com`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Fetch authenticated user information
      const authenticatedUser = await AsyncStorage.getItem('authenticatedUser');

      if (authenticatedUser) {
        const userJson = JSON.parse(authenticatedUser);

        // Fetch additional details from Dynamics CRM based on user's ID or another identifier
        const userResponse = await axios.get(
          `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/contacts(${userJson.contactid})?$select=mobilephone,kf_name,address1_country,firstname,kf_profilepicture,kf_profilepictureid,kf_profilepicture_url,kf_employeeid,gendercode,accountrolecode,birthdate,statecode,address1_line1,address1_line2,address1_line3,address1_city,address1_stateorprovince,address1_postalcode,address1_country`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const userDetails = userResponse.data;

        // Update the user object with the fetched details
        setUser({ 
          ...userJson,
          ...userDetails,
          genderLabel: mapGenderLabel(userDetails.gendercode),
          roleLabel: mapRoleLabel(userDetails.accountrolecode),
          statusLabel: mapStatusLabel(userDetails.statecode), 
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Use useFocusEffect after the fetchUser function declaration
  useFocusEffect(
    React.useCallback(() => {
      // Refetch user data when the screen comes into focus
      fetchUser();
    }, [])
  );

  useEffect(() => {
    // Initial fetch on component mount
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderComponent titleText="Account" onPress={handleGoBack} />
      {user && user.kf_profilepicture && (
        <View style={{ width: '95%', flexDirection: 'row', backgroundColor: 'red',borderRadius:10, marginTop: 10, paddingLeft: 40, height: '14%' }}>
          <Image
            source={{ uri: `data:image/png;base64,${user.kf_profilepicture}` }}
            style={styles.cardImage}
            onError={(error) => console.error('Image load error:', error.nativeEvent.error)}
          />
          <View style={{ width: '50%', paddingTop: 35, paddingLeft: 10 }}>
            <Text style={{ color: 'rgba(249,249,249,255)', fontWeight: 'bold', fontSize: 18, letterSpacing: 1, paddingBottom: 8 }}>{user.kf_adminname}</Text>
            <Text style={{ color: 'rgba(249,249,249,255)', letterSpacing: 1,fontWeight: 'bold', marginLeft:1 }}>{user.kf_employeeid}</Text>
          </View>
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={{ width: 330, marginTop: 10 }}>
          {user ? (
            <View>
              {/* {renderFieldWithTitle('Employee ID', user.kf_employeeid)} */}
              {renderFieldWithTitle('Email', user.kf_name)}
              {renderFieldWithTitle('Admin Name', user.kf_adminname)}
              {renderFieldWithTitle('Mobile Number', user.mobilephone)}
              {renderFieldWithTitle('Gender', user.genderLabel)}
              {renderFieldWithTitle('Role', user.roleLabel)}
              {renderFieldWithTitle('Date of Birth', user.birthdate)}
              {renderFieldWithTitle('Status', user.statusLabel)}
              {renderFieldWithTitle('Address 1: Street 1', user.address1_line1)}
              {renderFieldWithTitle('Address 1: Street 2', user.address1_line2)}
              {renderFieldWithTitle('Address 1: Street 3', user.address1_line3)}
              {renderFieldWithTitle('Address 1: City', user.address1_city)}
              {renderFieldWithTitle('Address 1: State/Province', user.address1_stateorprovince)}
              {renderFieldWithTitle('Address 1: Postal Code', user.address1_postalcode)}
              {renderFieldWithTitle('Country', user.address1_country)}
            </View>
          ) : (
            user === null ? (
              <Text style={styles.label}>Loading...</Text>
            ) : (
              <Text style={styles.label}>No user information available</Text>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const renderFieldWithTitle = (title, value) => (
  <View style={styles.columnContainer}>
    <View style={styles.columnTitle}>
      <Text style={styles.columnTitleText}>{title}</Text>
    </View>
    <TextInput
      style={styles.input}
      value={value}
      editable={false}
      placeholder={title}
      placeholderTextColor="#999"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    justifyContent: 'center',
    textAlign: "center",
    color: "red",
    marginVertical: "100%"
},
  input: {
    fontSize: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    color: 'gray',
    padding: 10,
    backgroundColor: '#FBFCFC',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  columnContainer: {
    marginBottom: 10,
  },
  columnTitle: {
    marginLeft:10,
    marginBottom: 5,
    
  },
  columnTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red'
  },
  cardImage: {
    width: 80,
    // backgroundColor: '#rgba(255,28,53,255)',
    marginLeft:0,
    paddingTop:-20,
    marginTop:20,
    height: 80,
    borderRadius: 50,
  },
});

export default AccountScreen;