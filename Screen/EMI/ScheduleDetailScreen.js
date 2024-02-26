import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderComponent from '../../common/Header';
import ButtonComponent from '../../common/ButtonComponent';

const ScheduleDetailsScreen = ({route}) => {
    const navigation = useNavigation();
    const [accessToken, setAccessToken] = useState(null);
    const [recordId, setRecordId] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const { scheduleItem, loanDetails, applicationNumber } = route.params;
    const [otherCharges, setOtherCharges] = useState('');
    const [newEMIPayment, setNewEMIPayment] = useState(null); 
    const [isNoteCreationDisabled, setIsNoteCreationDisabled] = useState(false);
    const [otherChargesData, setOtherChargesData] = useState({}); // Store other charges for each month

    useEffect(() => {
        fetchPaidStatus();
        fetchOtherChargesData();
    }, [applicationNumber, scheduleItem.month]);

    useEffect(() => {
        // Update other charges data whenever it changes
        storeOtherChargesData();
    }, [otherChargesData, isPaid]);

    useEffect(() => {
        storePaidStatus();
    }, [isPaid]);

    const fetchPaidStatus = async () => {
        try {
            const paidStatus = await AsyncStorage.getItem(`paidStatus_${applicationNumber}_${scheduleItem.month}`);
            setIsPaid(paidStatus === 'true');
        } catch (error) {
            console.error('Error fetching paid status:', error);
        }
    };

    const storePaidStatus = async () => {
        try {
            await AsyncStorage.setItem(`paidStatus_${applicationNumber}_${scheduleItem.month}`, isPaid.toString());
        } catch (error) {
            console.error('Error storing paid status:', error);
        }
    };

    const fetchOtherChargesData = async () => {
        try {
            // Retrieve the serialized data from AsyncStorage
            const data = await AsyncStorage.getItem(`${applicationNumber}_${scheduleItem.month}`);
            if (data) {
                // Deserialize the data back into an object
                setOtherChargesData(JSON.parse(data));
            }
        } catch (error) {
            console.error('Error fetching other charges data:', error);
        }
    };
    

    const storeOtherChargesData = async () => {
        try {
            // Serialize the object to a string before storing
            const serializedData = JSON.stringify(otherChargesData);
            await AsyncStorage.setItem(`${applicationNumber}_${scheduleItem.month}`, serializedData);
        } catch (error) {
            console.error('Error storing other charges data:', error);
        }
    };
    

    const handleOtherChargesChange = (text) => {
        // Update the otherChargesData state object with the penalty amount for the current month
        setOtherChargesData({ ...otherChargesData, [scheduleItem.month]: text });
    };

    useEffect(() => {
        console.log('Other charges data:', otherChargesData);
    }, [otherChargesData]);    

    // Calculate the new EMI payment by adding EMI amount and penalty for the current month
    useEffect(() => {
        const calculateNewEMIPayment = () => {
            // Convert otherChargesData for the current month to a number
            const penalty = parseFloat(otherChargesData[scheduleItem.month] || 0); // If no penalty is entered, default to 0
            // Convert EMI amount to a number
            const emi = parseFloat(scheduleItem.emiAmount);
            // Calculate the new EMI payment by adding EMI amount and penalty
            return emi + penalty;
        };
        // Update the state with the new EMI payment
        setNewEMIPayment(calculateNewEMIPayment());
    }, [otherChargesData, scheduleItem.emiAmount, scheduleItem.month]);

    // Retrieve other charges from AsyncStorage for the specific month when the component mounts
    useEffect(() => {
        const fetchOtherCharges = async () => {
            try {
                const savedOtherCharges = await AsyncStorage.getItem(`otherCharges_${scheduleItem.month}`);
                if (savedOtherCharges) {
                    setOtherCharges(savedOtherCharges);
                } else {
                    // Set default value to 0 if no other charges are saved
                    setOtherCharges('0');
                }
            } catch (error) {
                console.error('Error fetching other charges:', error);
            }
        };
        fetchOtherCharges();
    }, [scheduleItem.month]);

    useEffect(() => {
        // Fetch data for the current application number when the component mounts
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch paid status for the current application number
            const paidStatus = await AsyncStorage.getItem(`paidStatus_${applicationNumber}`);
            if (paidStatus === 'true') {
                setIsPaid(true);
                setIsNoteCreationDisabled(true);
            }

            // Fetch other charges for the current application number
            const savedOtherCharges = await AsyncStorage.getItem(`otherCharges_${applicationNumber}`);
            if (savedOtherCharges) {
                setOtherCharges(savedOtherCharges);
            } else {
                // Set default value to 0 if no other charges are saved
                setOtherCharges('0');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        if (scheduleItem.paid) {
            setIsPaid(true);
        }
    }, []);

    const handleGoBack = () => {
        navigation.goBack();
    };

      useEffect(() => {
        generateAccessToken();
    }, []);
    
    useEffect(() => {
        if (accessToken) {
            fetchRecordId();
        }
    }, [accessToken]);

    const generateAccessToken = async () => {
        try {
            const tokenEndpoint = 'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token'; // Replace with your Azure AD token endpoint
            const clientId = 'd9dcdf05-37f4-4bab-b428-323957ad2f86'; // Replace with your Azure AD client ID
            const clientSecret = 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2'; // Replace with your Azure AD client secret
            const resource = 'https://org0f7e6203.crm5.dynamics.com'; // Replace with your Dynamics 365 CRM instance URL

            const requestBody = `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&resource=${encodeURIComponent(resource)}`;

            const tokenResponse = await axios.post(
                tokenEndpoint,
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            const token = tokenResponse.data.access_token;
            setAccessToken(token);
        } catch (error) {
            // console.error('Error generating access token:', error);
        }
    };

    const fetchRecordId = async () => {
        try {
            const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans?$select=kf_personalloanid', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            const fetchedRecordId = response.data.value[0].kf_personalloanid;
            setRecordId(fetchedRecordId);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Token expired, refresh token or obtain a new one
                generateAccessToken();
            } else {
                console.error('Error fetching record ID:', error);
            }
        }
    };
    
    const createNoteWithFile = async () => {
        try {
            if (!isPaid && (scheduleItem.month === 1 || (scheduleItem.month > 1 && loanDetails.amortizationSchedule[scheduleItem.month - 2]?.paid))) {
                const penalty = otherChargesData[scheduleItem.month] || 0;
                const subject = `Loan Payment Details for Month ${scheduleItem.month}\n` +
                    `EMI Amount: ${scheduleItem.emiAmount}\n` +
                    `Interest Payment: ${scheduleItem.interestPayment}\n` +
                    `Principal Payment: ${scheduleItem.principalPayment}\n` +
                    `Remaining Balance: ${scheduleItem.remainingBalance}\n` +
                    `Other Charges: ${penalty}\n` +
                    `New EMI Amount: ${newEMIPayment}`;

            // Fetch the related record ID based on scheduleItem details
            const relatedRecordId = await fetchRelatedRecordId(scheduleItem);

            const annotation = {
                subject: subject,
                'objectid_kf_personalloan@odata.bind': `/kf_personalloans(${relatedRecordId})`, // Use the related record ID
            };

            const createAnnotationResponse = await axios.post(
                'https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/annotations',
                annotation,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (createAnnotationResponse.status === 204) {
                setIsPaid(true);
                setIsNoteCreationDisabled(true);

            //     // Update the amortization schedule if the month is 1
            //     if (scheduleItem.month === 1) {
            //         const updatedAmortizationSchedule = loanDetails.amortizationSchedule.map(item => {
            //             if (item.month === scheduleItem.month) {
            //                 return { ...item, paid: true };
            //             }
            //             return item;
            //         });

            //         await AsyncStorage.setItem('amortizationSchedule', JSON.stringify(updatedAmortizationSchedule));
            //         await AsyncStorage.setItem(`paidStatus_${scheduleItem.month}`, 'true');
            //     }
            if (scheduleItem.month === 1) {
                setIsPaid(true); 
    
                const updatedAmortizationSchedule = loanDetails.amortizationSchedule.map(item => {
                    if (item.month === scheduleItem.month) {
                        return { ...item, paid: true };
                    }
                    return item;
                });
                
                // Save the updated amortization schedule to AsyncStorage
                await AsyncStorage.setItem('amortizationSchedule', JSON.stringify(updatedAmortizationSchedule));                
            }

                // Show success alert
                Alert.alert(
                    'Success',
                    'Note with file attachment created successfully.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Navigate to AmortizationScreen with updated payment status
                                navigation.navigate('AmortizationScreen', {
                                    isPaid: true,
                                    month: scheduleItem.month,
                                    NoOfEMIsPaid: scheduleItem.month
                                });
                            }
                        }
                    ]
                );
            } else {
                console.error('Failed to create annotation (note) with file attachment. Response:', createAnnotationResponse.data);
                Alert.alert('Error', 'Failed to create note with file attachment.');
            }
        } else {
            // Notify user that payment is not allowed
            Alert.alert(
                'Payment Not Allowed',
                'You cannot mark the payment for this month as paid because the previous month\'s payment has not been made yet.',
                [{ text: 'OK' }]
            );
        }
    } catch (error) {
        console.error('Error creating annotation (note) with file attachment:', error.response?.data || error.message);
        Alert.alert('Error', 'An error occurred while creating note with file attachment.');
    }
};

    
    const fetchRelatedRecordId = async (scheduleItem) => {
        try {
            const applicationNumber = scheduleItem.applicationNumber;

            const queryUrl = `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_personalloans?$filter=kf_applicationnumber eq '${applicationNumber}'&$select=kf_personalloanid`;

            const response = await axios.get(queryUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const fetchedRecordId = response.data.value[0].kf_personalloanid;

            return fetchedRecordId;
        } catch (error) {
            console.error('Error fetching related record ID:', error.response?.data || error.message);
            throw error; 
        }
    };
  
    return (
        <View style={styles.container}>
        <HeaderComponent titleText="Payment Details" onPress={handleGoBack}/>
        <View style={{padding: 20}}>
        <Text>Application Number: {applicationNumber}</Text> 
            <Text>Details for Month {scheduleItem.month}:</Text>
            <Text>Payment Date: {scheduleItem.paymentDate}</Text>
            <Text>EMI Amount: {scheduleItem.emiAmount}</Text>
            <Text>Interest Payment: {scheduleItem.interestPayment}</Text>
            <Text>Principal Payment: {scheduleItem.principalPayment}</Text>
            <Text>Remaining Balance: {scheduleItem.remainingBalance}</Text>
            <Text>No of EMI Payment: {scheduleItem.month } </Text>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isPaid ? 'green' : 'red' }]}
                    disabled={isPaid}
                >
                    <Text style={styles.buttonText}>{isPaid ? 'Paid' : 'Mark as Paid'}</Text>
                </TouchableOpacity>
                <Text>Penalty</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => handleOtherChargesChange(text)}
                    value={otherChargesData[scheduleItem.month] || ''} 
                    placeholder="Enter Penalty"
                    editable={!isPaid && !isNoteCreationDisabled} 
                    />
                <Text>New EMI Payment: {newEMIPayment}</Text>
                <ButtonComponent title="Create Note with File" onPress={createNoteWithFile} disabled={isPaid || isNoteCreationDisabled}/>
            </View>
        </View>
    );
  };

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ScheduleDetailsScreen;