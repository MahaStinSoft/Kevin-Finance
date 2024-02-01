// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, Image, TextInput } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';

// const FormRecognizerComponent = ({ documentURL }) => {
//   const [aadharNumber, setAadharNumber] = useState('');

//   useEffect(() => {
//     if (documentURL) {
//       extractAadharNumber();
//     }
//   }, [documentURL]);

//   const extractAadharNumber = async () => {
//     try {
//       const apiKey = '5ab882f80e5843648ecbed780d435417';
//       const endpoint = 'https://crmfinance.cognitiveservices.azure.com';
//       const apiUrl = `${endpoint}/formrecognizer/v2.1/prebuilt/idDocument?includeTextDetails=true`;
  
//       // Log the request payload
//       console.log('Request Payload:', {
//         source: documentURL,
//       });
  
//       const response = await axios.post(apiUrl, {
//         source: documentURL,
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Ocp-Apim-Subscription-Key': apiKey,
//         },
//       });
  
//       // Log the entire response
//       console.log('Form Recognizer API Response:', response.data);
  
//       const extractedText = response.data?.analyzeResult?.readResults?.[0]?.lines?.map(line => line.text).join(' ');
//       setAadharNumber(extractedText);
//     } catch (error) {
//       console.error('Error extracting Aadhar number:', error);
//     }
//   };
  

//   return (
//     <View>
//       <Text>Extracted Aadhar Number: {aadharNumber}</Text>
//     </View>
//   );
// };

// export default FormRecognizerComponent;


import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, TextInput } from 'react-native';
import axios from 'axios';

const FormRecognizerComponent = () => {
  const [aadharNumber, setAadharNumber] = useState('');

  useEffect(() => {
    extractAadharNumber();
  }, []);

  const extractAadharNumber = async () => {
    try {
      const endpoint = "https://crmfinance.cognitiveservices.azure.com/";
      const key = "5ab882f80e5843648ecbed780d435417";
      const formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/DriverLicense.png";

      const response = await axios.post(
        `${endpoint}/formrecognizer/v2.1/prebuilt/idDocument/analyze`,
        { source: formUrl },
        {
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': key,
          },
        }
      );
      
      console.log('Form Recognizer API Response:', response.data);

      const documentNumber = response.data?.analyzeResult?.readResults?.[0]?.lines.find(line => line.text.includes('DocumentNumber'))?.text;

      if (documentNumber) {
        setAadharNumber(documentNumber);
      }
    } catch (error) {
      console.error('Error extracting Aadhar number:', error);
    }
  };

  return (
    <View>
      <Text>Extracted Aadhar Number: {aadharNumber}</Text>
      <TextInput
        placeholder="Aadhar Number"
        value={aadharNumber}
        onChangeText={(text) => setAadharNumber(text)}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20 }}
      />
    </View>
  );
};

export default FormRecognizerComponent;
