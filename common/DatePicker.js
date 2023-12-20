import React, { useState } from 'react';
import { SafeAreaView, View,  Text, StyleSheet , Button, Alert  } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

import ButtonComponent from './ButtonComponent';

export const DateTimePickerComponent = () => {
    const [kf_dateofapproval, setkf_dateofapproval] = useState(null);
    const [kf_firstemidate, setkf_firstemidate] = useState(null);
  
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    console.log("Request Payload to CRM:", {
        kf_dateofapproval: kf_dateofapproval,
        kf_firstemidate: kf_firstemidate,
      });
  
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setShow(false);
      setDate(currentDate);
    };
  
    const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    };
  
    const showDatepicker = () => {
      showMode('date');
    };
  
    const showTimepicker = () => {
      showMode('time');
    };

    const handleSaveRecord = async () => {      
        try {
            var data = {
                grant_type: "client_credentials",
                client_id: "d9dcdf05-37f4-4bab-b428-323957ad2f86",
                resource: "https://org0f7e6203.crm5.dynamics.com",
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

          const createRecordResponse = await axios.post(
            "https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications",
            {
            //   kf_dateofapproval: kf_dateofapproval,
            //   kf_firstemidate: kf_firstemidate,
            kf_dateofapproval: kf_dateofapproval ? kf_dateofapproval.toISOString() : null,
            kf_firstemidate: kf_firstemidate ? kf_firstemidate.toISOString() : null,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
      
          if (createRecordResponse.status === 204) {
            console.log("Record created successfully in CRM");
            // Optionally, you can handle success here, e.g., navigate to another screen
          } else {
            console.log("else part");
            Alert.alert("Error", "Failed to create a record in CRM.");
          }
        } catch (error) {
            console.error("Error during record creation:", error);
            console.log("Detailed Error Response:", error.response); // Log the detailed error response
            Alert.alert("Error", "An unexpected error occurred. Please try again later.");
          }
      };
  
    return (
        <SafeAreaView>
            <View style={styles.Container}>
                <Button onPress={showDatepicker} title="Show date picker!" />
                <Text style={styles.textContainer}>selected: {date.toLocaleString()}</Text>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChange}
                    />
                )}

                <ButtonComponent
                    title="SUBMIT"
                    onPress={handleSaveRecord}
                />
            </View>
        </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    Container:{
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
        alignItems: "center",
        marginTop: 50
    },
    textContainer: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
  });

  export default DateTimePickerComponent;