// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, Image, TextInput, Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';

// const {
//   AzureKeyCredential,
//   DocumentAnalysisClient,
// } = require("@azure/ai-form-recognizer");

// export default function Copilot() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [typedAadharNumber, setTypedAadharNumber] = useState("");
//   const [kf_aadharnumber, setkf_aadharnumber] = useState("");
//   const [kf_aadharcard, setkf_aadharcard] = useState({ fileName: null, fileContent: null });

//   useEffect(() => {
//     // Request permission to access the device's camera roll
//     (async () => {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         console.error('Permission to access media library was denied');
//       }
//     })();
//   }, []);

//   const pickImage = async () => {
//     // Launch the image picker
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled) {
//       setSelectedImage(result.uri);
//       analyzeDocument(result.uri);
//     }
//   };

//   // const analyzeDocument = async (imageUrl) => {
//   //   const key = "4369a8155f49477f91d6c947d2740ac3";
//   //   const endpoint = "https://crmfinance.cognitiveservices.azure.com/";
//   //   const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

//   //   const poller = await client.beginAnalyzeDocument("prebuilt-idDocument", imageUrl);

//   //   const {
//   //     documents: [result]
//   //   } = await poller.pollUntilDone();

//   //   if (result) {
//   //     // Extracting Aadhar number from the result
//   //     const aadharNumberFromDocument = result.fields["AadharNumber"]?.value;

//   //     // Verifying Aadhar numbers
//   //     if (aadharNumberFromDocument && aadharNumberFromDocument === typedAadharNumber) {
//   //       console.log("Aadhar number verification successful");
//   //     } else {
//   //       console.log("Aadhar number verification failed");
//   //     }

//   //     // The rest of your code to process and display the document information
//   //     // ...

//   //     // Example: Displaying document fields
//   //     console.log("Document Type:", result.docType);
//   //     console.log("Extracted Fields:", result.fields);
//   //   } else {
//   //     throw new Error("No result received from document analysis.");
//   //   }
//   // };

//   const analyzeDocument = async (imageUrl) => {
//     const key = "4369a8155f49477f91d6c947d2740ac3";
//     const endpoint = "https://crmfinance.cognitiveservices.azure.com/";
//     const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
  
//     const poller = await client.beginAnalyzeDocument("prebuilt-idDocument", imageUrl);
  
//     const {
//       documents: [result]
//     } = await poller.pollUntilDone();
  
//     if (result) {
//       // Extracting Aadhar number from the result
//       const aadharNumberFromDocument = result.fields["AadharNumber"]?.value;
  
//       // Verifying Aadhar numbers
//       if (aadharNumberFromDocument && aadharNumberFromDocument === typedAadharNumber) {
//         console.log("Aadhar number verification successful");
//       } else {
//         console.log("Aadhar number verification failed");
//       }
  
//       // Update state with the extracted Aadhar number
//       setkf_aadharnumber(aadharNumberFromDocument || "");
  
//       // The rest of your code to process and display the document information
//       // ...
  
//       // Example: Displaying document fields
//       console.log("Document Type:", result.docType);
//       console.log("Extracted Fields:", result.fields);
//     } else {
//       throw new Error("No result received from document analysis.");
//     }
//   };
  


//   const handleSaveRecord = async () => {
//     try {
//       const data = {
//         grant_type: "client_credentials",
//         client_id: "d9dcdf05-37f4-4bab-b428-323957ad2f86",
//         resource: "https://org0f7e6203.crm5.dynamics.com",
//         client_secret: "JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2",
//       };

//       const tokenResponse = await axios.post(
//         "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token",
//         data,
//         { headers: { "content-type": "application/x-www-form-urlencoded" } }
//       );

//       const accessToken = tokenResponse.data.access_token;

//       const createRecordResponse = await axios.post(
//         "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications",
//         {
//           kf_aadharnumber: kf_aadharnumber,
//           kf_aadharcard: kf_aadharcard.fileContent,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (kf_aadharnumber && kf_aadharcard && kf_aadharnumber === kf_aadharcard) {
//         console.log("Aadhar number verification successful");
//       } else {
//         console.log("Aadhar number verification failed");
//         Alert.alert("Error", "Aadhar numbers do not match.");
//         return; // Stop further execution if verification fails
//       }

//       if (createRecordResponse.status === 204) {
//         console.log("Record created successfully in CRM");
//         Alert.alert('Created record Successfully.', '', [
//           {
//             text: 'OK',
//             onPress: () => {
//               // Handle navigation or other actions
//             },
//           },
//         ]);
//       } else {
//         console.log("Failed to create a record in CRM");
//         Alert.alert("Error", "Failed to create a record in CRM.");
//       }
//     } catch (error) {
//       console.error("Error during record creation:", error);
//       console.log("Detailed Error Response:", error.response);
//       Alert.alert("Error", "An unexpected error occurred. Please try again later.");
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Image Picker Example</Text>
//       <Button title="Pick an image from camera roll" onPress={pickImage} />
//       <TextInput
//         placeholder="Type Aadhar Number"
//         value={kf_aadharnumber}
//         onChangeText={(text) => setkf_aadharnumber(text)}
//         style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20 }}
//       />
//       {selectedImage && (
//         <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200, marginTop: 20 }} />
//       )}
//       <Button title="Save Record" onPress={handleSaveRecord} />
//     </View>
//   );
// }


// import React, { useState } from 'react';
// import { View, TextInput, StyleSheet, Button, TouchableOpacity, Image, Alert,Text } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';
// import { encode } from 'base64-js';
// import * as DocumentPicker from 'expo-document-picker';



// const Copilot = () => {
//   const [kf_principalamount, setkf_principalamount] = useState(null);
//   const [kf_receiveddate, setkf_receiveddate] = useState(null);
//   const [kf_payslip, setkf_payslip] = useState({ fileName: null, fileContent: null });
//   const [kf_document, setkf_document] = useState({ guid:'',fileName: '', fileContent: '' });
//   const [showPicker, setShowPicker] = useState(false);
//   const [date, setDate] = useState(new Date(1598051730000));


//   const onChange = (event, selectedDate) => {
//     const currentDate = selectedDate || kf_receiveddate;
//     setShowPicker(false);
//     setkf_receiveddate(currentDate.toISOString());ṭ
//   };

//   const toggleDatepicker = () => {
//     setShowPicker((prev) => !prev);
//   };

//   const formatDate = (date) => {
//     const formattedDate = date.toLocaleDateString();
//     return formattedDate;
//   };


// const pickImage = async () => {
//   try {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//       base64: true,
//     });

//     if (result.canceled) {
//       return;
//     }

//     const byteArray = result.base64; // Use result.base64 directly

//     setkf_payslip({
//       fileName: 'payslip.jpg', // You can set a default file name
//       fileContent: byteArray,
//     });
//   } catch (error) {
//     console.error('Error picking or processing the image:', error);
//     Alert.alert('Error', 'Failed to pick or process the image.');
//   }
// };

// const pickDocument = async () => {
//   try {
//     console.log('Starting file picking...');
//     const result = await DocumentPicker.getDocumentAsync({
//       type: '*/*',
//     });

//     if (result.type === 'cancel') {
//       console.log('File picking canceled.');
//       return;
//     }

//     const uri = result.uri || (result.assets.length > 0 ? result.assets[0].uri : undefined);
//     if (!uri) {
//       console.log('File URI is undefined.');
//       return;
//     }

//     const byteArray = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

//     const guid = generateGUID(); // Generate a new GUID

//     setkf_document({
//       fileName: result.name || 'file',
//       fileContent: byteArray,
//       guid: guid,
//     });

//   } catch (error) {
//     console.error('Error picking or processing the file:', error);
//     Alert.alert('Error', 'Failed to pick or process the file. Please try again.');
//   }
// };

// function generateGUID() {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//     var r = Math.random() * 16 | 0,
//       v = c === 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// }


// // console.log('Generated GUID:', guid);
     
//     const navigation = useNavigation();
//     // const { user } = route.params;
//     const handleSaveRecord = async () => {
//       if (!kf_principalamount ) {
//         Alert.alert("Error", "Please enter values");
//         return;
//       }
  
//       try {
//         var data = {
//             grant_type: "client_credentials",
//             client_id: "d9dcdf05-37f4-4bab-b428-323957ad2f86",
//             resource: "https://org0f7e6203.crm5.dynamics.com",
//             scope: "https://org0f7e6203.crm5.dynamics.com/.default",
//             client_secret: "JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2",
//         };
        
//         const tokenResponse = await axios.post(
//           "https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token",
//           data, 
//           { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//         );
  
//         const accessToken = tokenResponse.data.access_token;
      
       
       
//         const createRecordResponse = await axios.post(
//           "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loans",
//           {
//             kf_principalamount: kf_principalamount,
//             kf_receiveddate: kf_receiveddate,
//             kf_payslip: kf_payslip.fileContent,
//             kf_document:kf_document.guid,

//           },
          
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//     // console.log('Selected document :', kf_document.fileContent);
//         console.log("Request Payload:", {
//           kf_principalamount: kf_principalamount,
//           kf_receiveddate: kf_receiveddate, 
//           // kf_payslip: kf_payslip.fileContent,
//           kf_document:kf_document.guid,
         
//         });
        
//         if (createRecordResponse.status === 204) {
//           console.log("Record created successfully in CRM");
        
//         //  navigation.navigate("LoanRecord");
//         } else {
//           console.log("else part", createRecordResponse.data);
//           Alert.alert("Error", "Failed to create a record in CRM.");
//         }
//       } catch (error) {
//         console.error("Error during login:", error.response?.data);
//         Alert.alert(
//           "Error",
//           "An unexpected error occurred. Please try again later."
//         );
//       }
//     };

//     return (
//       <View style={styles.container}>
//         <View style={styles.wrapper}>
//           <TextInput
//             style={styles.input}
//             value={kf_principalamount}
//             placeholder="Enter principal amount"
//             onChangeText={(text) => setkf_principalamount(text)}
//           />
  
//           <View>
//             {showPicker && (
//               <DateTimePicker
//                 mode="date"
//                 display="spinner"
//                 value={date}
//                 onChange={onChange}
//               />
//             )}
  
//             <TouchableOpacity onPress={toggleDatepicker}>
//               <TextInput
//                 style={styles.input}
//                 value={kf_receiveddate ? formatDate(new Date(kf_receiveddate)) : ''}
//                 editable={false}
//                 placeholder="due date"
//               />
//             </TouchableOpacity>
//           </View>

//           <Button title="Pick document" onPress={pickDocument} />

//           {kf_document.fileContent && (
//             <View>
//               <Text>Selected Document: {kf_document.fileName}</Text>
//               {/* Display other details or options related to the selected document */}
//             </View>
//           )}

         
  
//           <Button title="SUBMIT" onPress={handleSaveRecord} />
//         </View>
//       </View>
//     );
//   };
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     wrapper: {
//       width: '80%',
//     },
//     input: {
//       marginBottom: 12,
//       borderWidth: 1,
//       borderColor: '#bbb',
//       borderRadius: 5,
//       paddingHorizontal: 14,
//     },
//   });
  
//   export default Copilot;





import React, { useState, useEffect } from 'react';
import { View, Button, Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { WebView } from 'react-native-webview';

const DynamicsCRMDocumentUploader = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [selectedDocumentName, setSelectedDocumentName] = useState(null);
  const [kfDocumentValue, setKfDocumentValue] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [webViewVisible, setWebViewVisible] = useState(false);

  const viewDocumentContent = () => {
    if (documentContent) {
      // Display the WebView
      setWebViewVisible(true);
    }
  };

  const hideWebView = () => {
    // Hide the WebView
    setWebViewVisible(false);
  };

  useEffect(() => {
    checkAndRequestPermissions();
  }, []);

  const checkAndRequestPermissions = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permission to access documents denied.');
      }
    } catch (error) {
      console.error('Error checking or requesting permissions:', error.message);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const uploadDocumentToCRM = async (documentData, documentName) => {
    try {
        const data = {
          grant_type: 'client_credentials',
          client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
          resource: 'https://org0f7e6203.crm5.dynamics.com',
          scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
          client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
        };
  
        const tokenResponse = await axios.post(
          'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
          data,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
  
        const accessToken = tokenResponse.data.access_token;
  
        const fileContent = await FileSystem.readAsStringAsync(documentData, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        const formData = new FormData();
        formData.append('file', {
          uri: documentData,
          name: 'sample.pdf',
          type: 'application/pdf',
          data: fileContent,
        });
  
        const response = await fetch(
          'https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loans',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          }
        );
  
        if (response.ok) {
          console.log('Document uploaded successfully!');
  
          // Set the selected document name in the state
          setSelectedDocumentName(documentName);
  
          // Set the kf_document field value in the state
          setKfDocumentValue(documentName);
  
          const createdRecord = await response.json();
          const recordId = createdRecord.id;
  
        } else {
          console.error('Error uploading document:', response.statusText);
        }
      } catch (error) {
      console.error('Error uploading document:', error.message);
      Alert.alert(
        'Error',
        'An unexpected error occurred during document upload. Please try again.'
      );
    }
  };
  

  const pickDocumentAndUpload = async () => {
    try {
      const documentResult = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      console.log('Document Result:', documentResult);

      if (!documentResult.canceled) {
        const documentURI = documentResult.assets[0].uri;
        const documentName = documentResult.assets[0].name;

        if (!documentURI) {
          console.error('Document URI is null or undefined.');
          Alert.alert('Error', 'Failed to pick or process the document.');
          return;
        }

        const encodedURI = encodeURI(documentURI);

        // Set the selected document name in the state
        setSelectedDocumentName(documentName);

        // Set the kf_document field value in the state
        setKfDocumentValue(documentName);

        // Read the document content
        const content = await FileSystem.readAsStringAsync(documentURI);
        
        // Set the document content in the state
        setDocumentContent(content);

        // Upload document to CRM
        await uploadDocumentToCRM(encodedURI, documentName);
      } else {
        console.log('Document picking canceled.');
      }
    } catch (error) {
      console.error('Error uploading document:', error); // Log the entire error object for more information
      if (response) {
        console.error('Error uploading document response:', await response.text()); // Log the response details if available
      }
      Alert.alert(
        'Error',
        'An unexpected error occurred during document upload. Please try again.'
      );
    }
  };    

  return (
    <View style={{ marginTop: 100, padding: 20 }}>
    <Button title="Pick and Upload Document" onPress={pickDocumentAndUpload} />

    {selectedDocumentName && (
      <TouchableOpacity onPress={viewDocumentContent}>
        <Text style={{ marginTop: 20, color: 'blue' }}>
          Selected Document: {selectedDocumentName}
        </Text>
      </TouchableOpacity>
    )}

    <TextInput
      style={{ marginTop: 10, borderColor: 'gray', borderWidth: 1, padding: 5 }}
      value={kfDocumentValue}
      onChangeText={(text) => setKfDocumentValue(text)}
      placeholder="Enter KF Document Name"
    />

    {webViewVisible && (
      <View style={{ flex: 1 }}>
        <WebView
          source={{ html: documentContent }}
          style={{ flex: 1, marginTop: 20 }}
        />
        <Button title="Hide Document" onPress={hideWebView} />
      </View>
    )}
  </View>
  );
};

export default DynamicsCRMDocumentUploader;