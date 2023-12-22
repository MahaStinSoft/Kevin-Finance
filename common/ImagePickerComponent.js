// import React, { useState, useEffect } from 'react';
// import { Button, Image, View, Platform, Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
// import * as FileSystem from 'expo-file-system';

// export default function ImagePickerExample() {
//   const [Kf_aadharcard, setKf_aadharcard] = useState('');

//   useEffect(() => {
//     (async () => {
//       if (Platform.OS !== 'web') {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//           alert('Sorry, we need camera roll permissions to make this work!');
//         }
//       }
//     })();
//   }, []);

//   const pickImage = async () => {
//     try {
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.All,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       console.log(result);

//       if (!result.cancelled) {
//         const imageName = `customFileName.jpg`;
//         const imagePath = `${FileSystem.documentDirectory}${imageName}`;

//         await FileSystem.copyAsync({
//           from: result.uri,
//           to: imagePath,
//         });

//         setKf_aadharcard(imagePath);
//       }
//     } catch (error) {
//       console.error('An error occurred while picking an image:', error);
//     }
//   };

//   const handleSaveRecord = async () => {
//     try {
//         var data = {
//           grant_type: "client_credentials",
//           client_id: "d9dcdf05-37f4-4bab-b428-323957ad2f86",
//           resource: "https://org0f7e6203.crm5.dynamics.com",
//           client_secret: "JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2",
//         };
//         const tokenResponse = await axios.post(
//           "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token",
//           data,
//           { headers: { "content-type": "application/x-www-form-urlencoded" } }
//         );
//         console.log("tokenResponse", tokenResponse);
//         const accessToken = tokenResponse.data.access_token;
//         console.log("Access Token:", accessToken);

//         const createRecordResponse = await axios.post(
//             "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications?$select=kf_aadharcard",
//             {
//                 Kf_aadharcard: Kf_aadharcard, // Make sure this field name is correct
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (createRecordResponse.status === 204) {
//         console.log("Record created successfully in CRM", createRecordResponse);
//         // navigation.navigate("Dashboard");
//       } else {
//         console.log("else part");
//         Alert.alert("Error", "Failed to create a record in CRM.");
//       }
//     } catch (error) {
//       console.error("Error during record creation:", error);
//       console.log("Detailed Error Response:", error.response); // Log the detailed error response
//       Alert.alert("Error", "An unexpected error occurred. Please try again later.");
//     }
//   };

//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Button title="Pick an image from camera roll" onPress={pickImage} />
//       {Kf_aadharcard && <Image source={{ uri: Kf_aadharcard }} style={{ width: 200, height: 200 }} />}
//       <Button title="Save Record in CRM" onPress={handleSaveRecord} />
//     </View>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Button, Image, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

export default function ImagePickerExample() {
  const [kf_aadharcard, setKf_aadharcard] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        const imageName = `customFileName.jpg`;
        const imagePath = `${FileSystem.documentDirectory}${imageName}`;

        await FileSystem.copyAsync({
          from: result.uri,
          to: imagePath,
        });

        setKf_aadharcard(imagePath);
      }
    } catch (error) {
      console.error('An error occurred while picking an image:', error);
    }
  };

  const uploadImageAndCreateRecord = async () => {
    try {
      // Your CRM authentication and API endpoint details here
      const clientId = 'your-client-id';
      const clientSecret = 'your-client-secret';
      const resource = 'https://your-crm-instance.crm.dynamics.com';
      const tokenEndpoint = `https://login.microsoftonline.com/your-tenant-id/oauth2/token`;
      const crmApiEndpoint = `${resource}/api/data/v9.0/kf_loanapplications`;

      // Step 1: Retrieve Access Token
      const tokenResponse = await axios.post(
        tokenEndpoint,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          resource: resource,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const accessToken = tokenResponse.data.access_token;

      // Step 2: Upload Image to CRM
      const imageUploadResponse = await axios.post(
        crmApiEndpoint,
        {
          kf_aadharcard: `data:image/jpeg;base64,${await FileSystem.readAsStringAsync(kf_aadharcard, {
            encoding: FileSystem.EncodingType.Base64,
          })}`,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (imageUploadResponse.status === 204) {
        console.log('Image uploaded successfully in CRM');

        // Handle success (e.g., navigate to another screen)
      } else {
        console.log('Error during image upload:', imageUploadResponse.data);
        Alert.alert('Error', 'Failed to upload the image to CRM.');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      Alert.alert('Error', `An unexpected error occurred: ${error.message}`);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {kf_aadharcard && <Image source={{ uri: kf_aadharcard }} style={{ width: 200, height: 200 }} />}
      <Button title="Save Record in CRM" onPress={uploadImageAndCreateRecord} />
    </View>
  );
}
