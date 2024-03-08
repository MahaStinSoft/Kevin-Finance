import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, button } from 'react-native';
import axios from 'axios';
import HeaderComponent from '../../common/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import ButtonComponent from '../../common/ButtonComponent';

const EditLoanDetail = ({ route, navigation }) => {
  const { record, recordId } = route.params;
  // console.log('Record ID:', record); 
  const [principalLoanAmount, setPrincipalLoanAmount] = useState(record.kf_principalloanamount);
  const [kf_paidstatus, setkf_paidstatus] = useState(record.kf_paidstatus);
  const [receivedDate, setReceivedDate] = useState(record.kf_receiveddate);
  const [isPaid, setIsPaid] = useState(false);
  const [remainingBalance, setRemainingBalance] = useState(record.kf_remainingbalance);
  const [kf_totalmonths, setMonth] = useState(record.kf_totalmonths);
  const [interestPayment, setInterestPayment] = useState(record.kf_annualinterest);
  const [emiAmount, setEmiAmount] = useState(record.kf_emiamount.toString());
  const [applicationNumber, setApplicationNumber] = useState(record.kf_applicationnumber);
  const [penalty, setPenalty] = useState(record.kf_penalty || '0');
  const [isLoading, setIsLoading] = useState(false);
  const emiStatusOptions = ['Paid', 'Unpaid'];
  const [statusUpdated, setStatusUpdated] = useState(false); // New state variable
  const [emiStatusUpdated, setEmiStatusUpdated] = useState(false); // New state variable

  useEffect(() => {
    if (penalty) {
      const updatedEmiAmount = parseFloat(emiAmount) + parseFloat(penalty);
      setEmiAmount(updatedEmiAmount.toString());
    } else {
      // Reset EMI amount to its original value
      setEmiAmount(record.kf_emiamount.toString());
    }
  }, [penalty]);

  useEffect(() => {
    const retrievePaidStatus = async () => {
      try {
        const paidStatus = await AsyncStorage.getItem(`paid_${record.kf_loanid}`);
        setIsPaid(paidStatus === 'true');
      } catch (error) {
        console.error('Error retrieving paid status:', error);
      }
    };

    retrievePaidStatus();
  }, []);

  // const handleUpdate = async () => {
  //   setIsLoading(true);
  //   if (!kf_paidstatus) {
  //     // If EMI status is unpaid, show an alert and return
  //     Alert.alert('Cannot Update', 'EMI status is unpaid. Cannot update.');
  //     setIsLoading(false);
  //     return;
  //   }
  //   try {
  //     const tokenResponse = await axios.post(
  //       'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
  //       {
  //         grant_type: 'client_credentials',
  //         client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
  //         resource: 'https://org0f7e6203.crm5.dynamics.com',
  //         scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
  //         client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
  //       },
  //       { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  //     );

  //     const accessToken = tokenResponse.data.access_token;
  //     const updatedKfPaidStatus = kf_paidstatus ? true : false;

  //     const payload = {
  //       kf_applicationnumber: applicationNumber,
  //       kf_principalloanamount: principalLoanAmount,
  //       kf_receiveddate: receivedDate,
  //       kf_emiamount: emiAmount,
  //       kf_remainingbalance: remainingBalance,
  //       kf_paidstatus: updatedKfPaidStatus,
  //     };

  //     console.log('Payload:', payload);
  //     const updateRecordResponse = await axios.patch(
  //       `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loans(${record.kf_loanid})`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     if (updateRecordResponse.status === 204) {
  //       console.log('Record updated successfully in CRM');
  //       setIsPaid(true);
  //       await AsyncStorage.setItem(`paid_${record.kf_loanid}`, 'true');
  //       Alert.alert('EMI Amount Is Paided Successfully.', '', [
  //         {
  //           text: 'OK',
  //           onPress: () => {
  //             setIsPaid(true);
  //             setIsLoading(false);
  //             setEmiStatusUpdated(true);
  //             navigation.goBack({ isPaid })
  //           },
  //         },
  //       ]);
  //     } else {
  //       console.log('Error updating record in CRM:', updateRecordResponse);
  //       Alert.alert('Error', 'Failed to update the record in CRM.');
  //     }
  //     setkf_paidstatus(kf_paidstatus);
  //   } catch (error) {
  //     console.error('Error during update:', error.response?.data || error.message);
  //     Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleUpdate = async () => {
    setIsLoading(true);
    if (!kf_paidstatus) {
      Alert.alert('Cannot Update', 'EMI status is unpaid. Cannot update.');
      setIsLoading(false);
      return;
    }
    try {
      const tokenResponse = await axios.post(
        'https://login.microsoftonline.com/722711d7-e701-4afa-baf6-8df9f453216b/oauth2/token',
        {
          grant_type: 'client_credentials',
          client_id: 'd9dcdf05-37f4-4bab-b428-323957ad2f86',
          resource: 'https://org0f7e6203.crm5.dynamics.com',
          scope: 'https://org0f7e6203.crm5.dynamics.com/.default',
          client_secret: 'JRC8Q~MLbvG1RHclKXGxhvk3jidKX11unzB2gcA2',
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const accessToken = tokenResponse.data.access_token;
      const updatedKfPaidStatus = kf_paidstatus ? true : false;

      const payload = {
        kf_applicationnumber: applicationNumber,
        kf_principalloanamount: principalLoanAmount,
        kf_receiveddate: receivedDate,
        kf_emiamount: emiAmount,
        kf_remainingbalance: remainingBalance,
        kf_paidstatus: updatedKfPaidStatus,
      };

      const updateRecordResponse = await axios.patch(
        `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loans(${record.kf_loanid})`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (updateRecordResponse.status === 204) {
        console.log('Record updated successfully in CRM');
        setIsPaid(true);
        await AsyncStorage.setItem(`paid_${record.kf_loanid}`, 'true');
        Alert.alert('EMI Amount Is Paided Successfully.', '', [
          {
            text: 'OK',
            onPress: () => {
              setIsPaid(true);
              setIsLoading(false);
              setEmiStatusUpdated(true);
              setStatusUpdated(true); // Set statusUpdated to true after successful update
              navigation.goBack({ isPaid });
            },
          },
        ]);
      } else {
        console.log('Error updating record in CRM:', updateRecordResponse);
        Alert.alert('Error', 'Failed to update the record in CRM.');
      }
      setkf_paidstatus(kf_paidstatus);
    } catch (error) {
      console.error('Error during update:', error.response?.data || error.message);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoBackPersonaldetails = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <HeaderComponent titleText="Edit Loan Details(EMI)" onPress={handleGoBackPersonaldetails} />
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Application Number:</Text>
          <TextInput
            style={styles.valueInput}
            value={applicationNumber}
            onChangeText={(text) => setApplicationNumber(text)}
            editable={false}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Loan Terms:</Text>
          <TextInput
            style={styles.valueInput}
            value={kf_totalmonths}
            onChangeText={(text) => setMonth(text)}
            editable={false}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Principal Loan Amount:</Text>
          <TextInput
            style={styles.valueInput}
            value={principalLoanAmount}
            onChangeText={(text) => setPrincipalLoanAmount(text)}
            keyboardType="numeric"
            editable={false}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Interest:</Text>
          <TextInput
            style={styles.valueInput}
            value={interestPayment}
            onChangeText={(text) => setInterestPayment(text)}
            keyboardType="numeric"
            editable={false}
          />
        </View>
        {/* <Text>{interestPayment}</Text> */}
        <View style={styles.row}>
          <Text style={styles.label}>Due Date:</Text>
          <TextInput
            style={styles.valueInput}
            value={receivedDate}
            onChangeText={(text) => setReceivedDate(text)}
            editable={false}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Penalty:</Text>
          <TextInput
            style={[styles.valueInput, { color: "black" }]}
            value={penalty}
            onChangeText={(text) => setPenalty(text)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>EMI Amount:</Text>
          <TextInput
            style={styles.valueInput}
            value={emiAmount}
            onChangeText={(text) => setEmiAmount(text)}
            keyboardType="numeric"
            editable={false}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Remaining Balance:</Text>
          <TextInput
            style={styles.valueInput}
            value={remainingBalance}
            onChangeText={(text) => setRemainingBalance(text)}
            keyboardType="numeric"
            editable={false}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>EMI Status</Text>
          <Picker
            style={[styles.valueInput, { color: kf_paidstatus ? "gray" : "black" }]}
            selectedValue={kf_paidstatus ? 'Paid' : 'Unpaid'}
            onValueChange={(itemValue, itemIndex) => setkf_paidstatus(itemValue === 'Paid')}
            enabled={!kf_paidstatus && !isLoading} // Disable the Picker if isLoading is true
          >
            {emiStatusOptions.map((option, index) => (
              <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        </View>
        {/* <TouchableOpacity
  style={[styles.button, { backgroundColor: kf_paidstatus ? 'green' : 'blue' }]}
  onPress={handleUpdate}
  disabled={isLoading || kf_paidstatus === 'Paid' || statusUpdated} 
>
  <Text style={styles.buttonText}>Paid</Text>
</TouchableOpacity> */}

        <ButtonComponent title="Update"
          onPress={handleUpdate}
          disabled={isLoading || kf_paidstatus === 'Paid' || statusUpdated}
          style={{ width: "35%", backgroundColor: kf_paidstatus ? 'green' : 'red' }}
        />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    // backgroundColor: '#fff',
    padding: 20,
    // borderRadius: 10,
    // elevation: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
  },
  valueInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 5,
    fontSize: 14,
    color: "gray"
  },
  button: {
    marginTop: 20,
    padding: 10,
    // backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EditLoanDetail;
