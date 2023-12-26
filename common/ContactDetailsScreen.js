// import React from 'react';
// import { View, Text, Image, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';

// import HeaderComponent from './Header';

// const ContactDetailsScreen = ({ route }) => {
  
//   const navigation = useNavigation();

//   const { contact } = route.params;
// console.log("output:",route.params);
//   const handleGoBack = () => {
//     navigation.goBack();
//   };

//   // const handleEdit = () => {
//   //   navigation.navigate("EditScreen");
//   // };

//   const handleEdit = () => {
//     navigation.navigate("EditScreen", { contact });
//   };

//   const getGenderLabel = () => {
//     return contact.gendercode === 2 ? 'Female' : 'Male';
//   };

//   const renderImage = () => {
//     if (contact.entityimage) {
//       return (
//         <Image
//           source={{ uri: `data:image/png;base64,${contact.entityimage}` }}
//           style={styles.cardImage}
//         />
//       );
//     } else {
//       // If entityimage is not available, display the first and last name as an image
//       const initials = contact.fullname
//         .split(' ')
//         .map((name) => name[0])
//         .join('');
//       return (
//         <View style={[styles.cardImage, styles.placeholderImage]}>
//           <Text style={styles.placeholderText}>{initials}</Text>
//         </View>
//       );
//     }
//   };


//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <HeaderComponent titleText="User Details" onPress={handleGoBack} />
//       <TouchableOpacity onPress={handleEdit}>
//       <Ionicons name="list-sharp" size={25} color="red" />
//       </TouchableOpacity>
//       {/* <Button title="Edit"/> */}

//       <View style={styles.contactImageContainer}>
//         {/* <Image
//           source={{ uri: `data:image/png;base64,${contact.entityimage}` }}
//           style={styles.contactImage}
//           onError={(error) => console.error('Image load error:', error.nativeEvent.error)}
//         /> */}
        
//       </View>
//       <View style={[styles.card, styles.cardElevated]}>
//         {/* <Image
//           source={{ uri: `data:image/png;base64,${contact.entityimage}` }}
//           style={styles.cardImage}
//           // onError={(error) => console.error('Image load error:', error.nativeEvent.error)}
//         /> */}
//         <View>{renderImage()}</View>
//         <Text style={styles.cardTitle}>{contact.fullname}</Text>
//         <Text style={styles.cardLabel}>Password: {contact.adx_identity_newpassword}</Text>
//         <Text style={styles.cardLabel}>Gender: {getGenderLabel()}</Text>
//         <Text style={styles.cardLabel}>Date of Birth: {contact.birthdate}</Text>
//         <Text style={styles.cardLabel}>Mobile: {contact.mobilephone}</Text>
//         <Text style={styles.cardLabel}>Email: {contact.emailaddress1}</Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     height: "90%",
//   },
//   contactImageContainer: {
//     width: '100%',
//     height: 200, // Adjust the height as needed
//     overflow: 'hidden',
//     marginBottom: 16,
//   },
//   contactImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   card: {
//     width: '90%',
//     height: "60%", // Adjust the height as needed
//     borderRadius: 6,
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//     elevation: 3,
//     shadowOffset: {
//       width: 1,
//       height: 1,
//     },
//   },
//   cardElevated: {
//     marginTop: -150, // Adjust the value based on your preference
//   },
//   cardImage: {
//     width: '100%',
//     height: "70%", // Adjust the height as needed
//     resizeMode: "contain",
//     borderRadius: 6,
//   },
//   cardTitle: {
//     color: '#000000',
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     marginTop: -60
//   },
//   cardLabel: {
//     color: '#000000',
//     fontSize: 14,
//     marginBottom: 6,
//   },
//   placeholderText: {
//     fontSize: 100,
//     fontWeight: 'bold',
//     color: '#707070',
//     textAlign: 'center',
//     backgroundColor: "gray",
//     height: "100%",
//     // borderRadius: 200, 
//     color: "white", 
//     paddingTop: 35
//   }
// });

// export default ContactDetailsScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HeaderComponent from './Header';

const ContactDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [contact, setContact] = useState(route.params.contact);

  useEffect(() => {
    // Update contact state when the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      setContact(route.params.contact);
    });
  
    return unsubscribe;
  }, [navigation, route.params.contact]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate('EditScreen', {
      contact,
      updateContactDetails: updatedContact => setContact(updatedContact),
    });
  };
   
  

  const getGenderLabel = () => {
    return contact.gendercode === 2 ? 'Female' : 'Male';
  };

  const renderImage = () => {
    if (contact.entityimage) {
      return (
        <Image
          source={{ uri: `data:image/png;base64,${contact.entityimage}` }}
          style={styles.cardImage}
        />
      );
    } else {
      const initials = contact.fullname
        .split(' ')
        .map((name) => name[0])
        .join('');
      return (
        <View style={[styles.cardImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>{initials}</Text>
        </View>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderComponent titleText="User Details" onPress={handleGoBack} />
      <TouchableOpacity onPress={handleEdit}>
        <Ionicons name="list-sharp" size={25} color="red" />
      </TouchableOpacity>

      <View style={styles.contactImageContainer}></View>

      <View style={[styles.card, styles.cardElevated]}>
        <View>{renderImage()}</View>
        <Text style={styles.cardTitle}>{contact.fullname}</Text>
        <Text style={styles.cardLabel}>Password: {contact.adx_identity_newpassword}</Text>
        <Text style={styles.cardLabel}>Gender: {getGenderLabel()}</Text>
        <Text style={styles.cardLabel}>Date of Birth: {contact.birthdate}</Text>
        <Text style={styles.cardLabel}>Mobile: {contact.mobilephone}</Text>
        <Text style={styles.cardLabel}>Email: {contact.emailaddress1}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '90%',
  },
  contactImageContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    marginBottom: 16,
  },
  card: {
    width: '90%',
    height: '60%',
    borderRadius: 6,
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  cardElevated: {
    marginTop: -150,
  },
  cardImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: 6,
  },
  cardTitle: {
    color: '#000000',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: -60,
  },
  cardLabel: {
    color: '#000000',
    fontSize: 14,
    marginBottom: 6,
  },
  placeholderText: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#707070',
    textAlign: 'center',
    backgroundColor: 'gray',
    height: '100%',
    color: 'white',
    paddingTop: 35,
  },
});

export default ContactDetailsScreen;
