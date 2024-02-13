import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../common/Header';
import axios from 'axios';

const Setting = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

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

        setUser({ 
          ...userJson,
          ...userDetails,
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
    }, [])
  );

  useEffect(() => {
    fetchUser();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

   const handleDashboard = () => {
    navigation.navigate("Dashboard");
  };

  const handleAccountScreen = () => {
    navigation.navigate("AccountScreen");
  };

  
  const handleLogout = async () => {
    // Display confirmation alert
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
  
  return (
<View style={styles.container}>
  <HeaderComponent titleText="SettingScreen" onPress={handleGoBack} />

  <View>
    {user ? (
      <View>
        {user.kf_profilepicture ? (
          <Image
            source={{ uri: `data:image/png;base64,${user.kf_profilepicture}` }}
            style={styles.cardImage}
            onError={(error) => console.error('Image load error:', error.nativeEvent.error)}
          />
         ) : ( 
          <View style={styles.cardImageInitial}>
            <Text style={styles.initialLetter}>{user.kf_adminname ? user.kf_adminname.charAt(0) : ''}</Text>
          </View>
        )} 

        {/* {user.kf_adminname && (
          <Text style={styles.adminName}>{user.kf_adminname}</Text>
        )} */}

        <View style={styles.sepratorContent}>
          <View style={styles.iconContent}>
            <Ionicons name="md-person" size={24} color="white" />
          </View>
          <TouchableOpacity onPress={handleAccountScreen}>
            <Text style={styles.textContent}>Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sepratorContent}>
          <View style={styles.iconContent}>
            <Ionicons name="md-home" size={24} color="white" />
          </View>
          <TouchableOpacity onPress={handleDashboard}>
            <Text style={styles.textContent}>Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sepratorContent}>
          <View style={styles.iconContent}>
            <Ionicons name="md-log-out" size={24} color="white" />
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.textContent}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <ActivityIndicator size="large" color="#0000ff" />
    )}
  </View>
</View>

  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#e6e6e6",
  },
  cardImage: {
    width: 85,
    // backgroundColor: '#rgba(255,28,53,255)',
    // marginLeft:0,
    alignSelf: 'center',
    paddingTop:-20,
    marginTop:20,
    height: 85,
    borderRadius: 50,
  },
  cardImageInitial: {
    width: 85,
    backgroundColor: 'gray',
    // marginLeft:0,
    alignSelf: 'center',
    paddingTop: -20,
    marginTop: 20,
    height: 85,
    borderRadius: 50,
  },
  initialLetter: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    padding: 25
  },
    iconButton: {
    marginRight: 16,
  },
  accountText: {
    flex: 1,
    textAlign: 'center',
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginRight: 50,
  },
  sepratorContent: {
    marginHorizontal: 20,
    borderColor: "gray",
    borderBottomWidth: 1.,
    padding: 15,
    // backgroundColor: "#e6e6e6",
    flexDirection: "row",
    // justifyContent: "space-between"
  }, 
  iconContent: {
  backgroundColor: "red",
   borderRadius: 20,
   padding: 5
  },
  textContent: {
    fontSize: 18,
    marginRight: 140,
    color: "red",
    marginTop: 5,
    marginLeft: 15
  }
});

export default Setting;
