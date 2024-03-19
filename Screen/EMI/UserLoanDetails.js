import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, button } from 'react-native';
import axios from 'axios';
import HeaderComponent from '../../common/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const UserLoanDetails = ({ route, navigation }) => {
  const { record, recordId } = route.params;
  const [principalLoanAmount, setPrincipalLoanAmount] = useState(record.kf_principalloanamount);
  const [kf_paidstatus, setkf_paidstatus] = useState(record.kf_paidstatus);
  const [receivedDate, setReceivedDate] = useState(record.kf_receiveddate);
  const [interestRate, setInterestRate] = useState(record.kf_annualinterest);
  const [isPaid, setIsPaid] = useState(false);
  const [remainingBalance, setRemainingBalance] = useState(record.kf_remainingbalance);
  const [emiAmount, setEmiAmount] = useState(record.kf_emiamount.toString());
  const [totalMonths, setTotalMonths] = useState(record.kf_totalmonths.toString());
  const [applicationNumber, setApplicationNumber] = useState(record.kf_applicationnumber);
  const [penalty, setPenalty] = useState(record.kf_penalty || '0');
  const [isLoading, setIsLoading] = useState(false);
  const emiStatusOptions = ['Paid', 'Unpaid'];

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

  useEffect(() => {
    if (penalty) {
      const updatedEmiAmount = parseFloat(emiAmount) + parseFloat(penalty);
      setEmiAmount(updatedEmiAmount.toString());
    } else {
      // Reset EMI amount to its original value
      setEmiAmount(record.kf_emiamount.toString());
    }
  }, [penalty]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <HeaderComponent titleText="Loan Details(EMI)" onPress={handleGoBack} />
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
          <Text style={styles.label}>Term No:</Text>
          <TextInput
            style={styles.valueInput}
            value={totalMonths}
            onChangeText={(text) => setTotalMonths(text)}
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
          <Text style={styles.label}>Interest Rate:</Text>
          <TextInput
            style={styles.valueInput}
            value={interestRate}
            onChangeText={(text) => setInterestRate(text)}
            keyboardType="numeric"
            editable={false}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Received Date:</Text>
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
            style={styles.valueInput}
            value={penalty}
            onChangeText={(text) => setPenalty(text)}
            keyboardType="numeric"
            editable={false}
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
            style={styles.valueInput}
            selectedValue={kf_paidstatus ? 'Paid' : 'Unpaid'}
            onValueChange={(itemValue, itemIndex) => setkf_paidstatus(itemValue === 'Paid')}
            enabled={false}
          >
            {emiStatusOptions.map((option, index) => (
              <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    height:'100%'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  valueInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default UserLoanDetails;
