import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderComponent from '../../common/Header';

const ScheduleDetailsScreenHomeLoan = ({route}) => {
    const navigation = useNavigation();
    const [accessToken, setAccessToken] = useState(null);
    const [recordId, setRecordId] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const { scheduleItem, loanDetails, applicationNumber } = route.params;
    const [otherCharges, setOtherCharges] = useState('');
    const [newEMIPayment, setNewEMIPayment] = useState(null); 

    // const { personalLoan } = route.params || {};
    // const [recordId, setRecordId] = useState(personalLoan.kf_loanapplicationid);

    const handlePaidButtonPress = async (loanDetails) => {
        try {
            if (scheduleItem.installment === 1) {
                setIsPaid(true); 
    
                const updatedAmortizationSchedule = loanDetails.amortizationSchedule.map(item => {
                    if (item.installment === scheduleItem.installment) {
                        return { ...item, paid: true };
                    }
                    return item;
                });
                
                // Save the updated amortization schedule to AsyncStorage
                await AsyncStorage.setItem('amortizationSchedule', JSON.stringify(updatedAmortizationSchedule));
    
                Alert.alert(
                    'Payment Marked', 
                    'The payment for the first installment has been marked as paid.', 
                    [
                        {
                            text: 'OK', onPress: () => navigation.navigate('AmortizationScreenHome', {
                                isPaid: true,
                                installment: scheduleItem.installment,
                                NoOfEMIsPaid: scheduleItem.installment
                            })
                        }
                    ]
                );
            } else {
                // For months other than the first installment, check the previous installment's payment status
                const previousMonthIndex = scheduleItem.installment - 1;
                const previousMonthItem = loanDetails.amortizationSchedule.find(item => item.installment === previousMonthIndex);
    
                if (!previousMonthItem || !previousMonthItem.paid) {
                    Alert.alert(
                        'Payment Not Allowed', 
                        'You cannot mark the payment for this installment as paid because the previous installment\'s payment has not been made yet.', 
                        [{ text: 'OK' }]
                    );
                    return;
                }
    
                setIsPaid(true);
    
                // Update the AsyncStorage with the updated amortization schedule
                const updatedAmortizationSchedule = loanDetails.amortizationSchedule.map(item => {
                    if (item.installment === scheduleItem.installment) {
                        return { ...item, paid: true };
                    }
                    return item;
                });
    
                await AsyncStorage.setItem('amortizationSchedule', JSON.stringify(updatedAmortizationSchedule));
    
                Alert.alert(
                    'Payment Marked',
                    'The payment has been marked as paid.',
                    [
                        { text: 'Cancel' },
                        {
                            text: 'OK', onPress: () => navigation.navigate('AmortizationScreenHome', {
                                isPaid: true,
                                installment: scheduleItem.installment,
                                NoOfEMIsPaid: scheduleItem.installment
                            })
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Error marking payment as paid:', error);
            Alert.alert('Error', 'An error occurred while marking the payment as paid.');
        }
    };

    useEffect(() => {
        const fetchPaidStatus = async () => {
            try {
                const storedSchedule = await AsyncStorage.getItem('amortizationSchedule');
                if (storedSchedule) {
                    const parsedSchedule = JSON.parse(storedSchedule);
                    const currentMonthItem = parsedSchedule.find(item => item.installment === scheduleItem.installment);
                    if (currentMonthItem && currentMonthItem.paid) {
                        setIsPaid(true);
                    } else {
                        setIsPaid(false); 
                    }
                }
            } catch (error) {
                console.error('Error fetching paid status:', error);
            }
        };
    
        fetchPaidStatus();
    }, [scheduleItem, loanDetails]); 

    useEffect(() => {
        // Retrieve other charges from AsyncStorage when the component mounts
        const fetchOtherCharges = async () => {
            try {
                const savedOtherCharges = await AsyncStorage.getItem('otherCharges');
                if (savedOtherCharges) {
                    setOtherCharges(savedOtherCharges);
                }
            } catch (error) {
                console.error('Error fetching other charges:', error);
            }
        };
        fetchOtherCharges();
    }, []);

    useEffect(() => {
        const calculateNewEMIPayment = () => {
            // Calculate the new EMI payment by adding other charges to the existing EMI amount
            const emi = parseFloat(scheduleItem.emiAmount);
            const charges = parseFloat(otherCharges);
            return emi + charges;
        };
        setNewEMIPayment(calculateNewEMIPayment());
    }, [otherCharges, scheduleItem.emiAmount]);

    const handleOtherChargesChange = async (text) => {
        try {
            // Save other charges to AsyncStorage whenever it changes
            await AsyncStorage.setItem('otherCharges', text);
            setOtherCharges(text);
        } catch (error) {
            console.error('Error saving other charges:', error);
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

    const calculateOtherCharge = () => {
        const currentDate = new Date();
        const paymentDate = new Date(scheduleItem.paymentDate);
    
        // Calculate the difference in days between current date and payment date
        const timeDifference = currentDate.getTime() - paymentDate.getTime();
        const differenceInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
    
        // Define other charge per day (you can adjust this value)
        const otherChargePerDay = 10;
    
        // Calculate the other charge
        const otherCharge = differenceInDays * otherChargePerDay;
    
        return otherCharge;
      };

      const calculateNewEMIPayment = () => {
        // Convert otherCharges to a number and add it to the EMI amount
        const emi = parseFloat(scheduleItem.emiAmount);
        const charges = parseFloat(otherCharges);
        return emi + charges;
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
            console.error('Error generating access token:', error);
        }
    };

    const fetchRecordId = async () => {
        try {
            const response = await axios.get('https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications?$select=kf_loanapplicationid', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            const fetchedRecordId = response.data.value[0].kf_loanapplicationid;
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
            if (!accessToken || !recordId) {
                Alert.alert('Error', 'Access token or Record ID not available');
                return;
            }
    
            const subject = `Loan Payment Details for Month ${scheduleItem.installment}\n` +
            `EMI Amount: ${scheduleItem.emiAmount}\n` +
            `Interest Payment: ${scheduleItem.interestPayment}\n` +
            `Principal Payment: ${scheduleItem.principalPayment}\n` +
            `Remaining Balance: ${scheduleItem.remainingBalance}`;

            // Fetch the related record ID based on scheduleItem details
            const relatedRecordId = await fetchRelatedRecordId(scheduleItem);

            const annotation = {
                subject: subject,
                'objectid_kf_loanapplication@odata.bind': `/kf_loanapplications(${relatedRecordId})`, // Use the related record ID
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
                if (scheduleItem.installment === 1) {
                    setIsPaid(true); 
        
                    const updatedAmortizationSchedule = loanDetails.amortizationSchedule.map(item => {
                        if (item.installment === scheduleItem.installment) {
                            return { ...item, paid: true };
                        }
                        return item;
                    });
                    
                    // Save the updated amortization schedule to AsyncStorage
                    await AsyncStorage.setItem('amortizationSchedule', JSON.stringify(updatedAmortizationSchedule));
        
                    Alert.alert(
                        'Payment Marked', 
                        'The payment for the first installment has been marked as paid.', 
                        [
                            {
                                text: 'OK', onPress: () => navigation.navigate('AmortizationScreenHome', {
                                    isPaid: true,
                                    installment: scheduleItem.installment,
                                    NoOfEMIsPaid: scheduleItem.installment
                                })
                            }
                        ]
                    );
                } else {
                    // For months other than the first installment, check the previous installment's payment status
                    const previousMonthIndex = scheduleItem.installment - 1;
                    const previousMonthItem = loanDetails.amortizationSchedule.find(item => item.installment === previousMonthIndex);
        
                    if (!previousMonthItem || !previousMonthItem.paid) {
                        Alert.alert(
                            'Payment Not Allowed', 
                            'You cannot mark the payment for this installment as paid because the previous installment\'s payment has not been made yet.', 
                            [{ text: 'OK' }]
                        );
                        return;
                    }
        
                    setIsPaid(true);
        
                    // Update the AsyncStorage with the updated amortization schedule
                    const updatedAmortizationSchedule = loanDetails.amortizationSchedule.map(item => {
                        if (item.installment === scheduleItem.installment) {
                            return { ...item, paid: true };
                        }
                        return item;
                    });
        
                    await AsyncStorage.setItem('amortizationSchedule', JSON.stringify(updatedAmortizationSchedule));
        
                    Alert.alert(
                        'Payment Marked',
                        'The payment has been marked as paid.',
                        [
                            { text: 'Cancel' },
                            {
                                text: 'OK', onPress: () => navigation.navigate('AmortizationScreenHome', {
                                    isPaid: true,
                                    installment: scheduleItem.installment,
                                    NoOfEMIsPaid: scheduleItem.installment
                                })
                            }
                        ]
                    );
                }
                console.log('Annotation (Note) with file attachment created successfully.');
                Alert.alert('Success', 'Note with file attachment created successfully.');
            } else {
                console.error('Failed to create annotation (note) with file attachment. Response:', createAnnotationResponse.data);
                Alert.alert('Error', 'Failed to create note with file attachment.');
            }
        } catch (error) {
            console.error('Error creating annotation (note) with file attachment:', error.response?.data || error.message);
            Alert.alert('Error', 'An error occurred while creating note with file attachment.');
        }
    };
    
    const fetchRelatedRecordId = async (scheduleItem) => {
        try {
            const applicationNumber = scheduleItem.applicationNumber;

            const queryUrl = `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loanapplications?$filter=kf_applicationnumber eq '${applicationNumber}'&$select=kf_loanapplicationid`;

            const response = await axios.get(queryUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const fetchedRecordId = response.data.value[0].kf_loanapplicationid;

            return fetchedRecordId;
        } catch (error) {
            console.error('Error fetching related record ID:', error.response?.data || error.message);
            throw error; 
        }
    };
  
    return (
        <View style={styles.container}>
        <HeaderComponent titleText="Payment Details(Home)" onPress={handleGoBack}/>
        <View style={{padding: 20}}>
        <Text>Application Number: {applicationNumber}</Text> 
            <Text>Details for Month {scheduleItem.installment}:</Text>
            <Text>Payment Date: {scheduleItem.paymentDate}</Text>
            <Text>EMI Amount: {scheduleItem.emiAmount}</Text>
            <Text>Interest Payment: {scheduleItem.interestPayment}</Text>
            <Text>Principal Payment: {scheduleItem.principalPayment}</Text>
            <Text>Remaining Balance: {scheduleItem.remainingBalance}</Text>
            <Text>No of EMI Payment: {scheduleItem.installment } </Text>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isPaid ? 'green' : 'red' }]}
                    disabled={isPaid}
                >
                    <Text style={styles.buttonText}>{isPaid ? 'Paid' : 'Mark as Paid'}</Text>
                </TouchableOpacity>
               {/* <TextInput
                    style={styles.input}
                    onChangeText={handleOtherChargesChange}
                    value={otherCharges}
                    placeholder="Enter Other Charges"
                    keyboardType="numeric"
                />
                <Text>New EMI Payment: {newEMIPayment}</Text> */}
                <Button title="Create Note with File" onPress={createNoteWithFile} />
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

export default ScheduleDetailsScreenHomeLoan;