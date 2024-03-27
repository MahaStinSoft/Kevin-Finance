import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import HeaderComponent from '../../common/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import ButtonComponent from '../../common/ButtonComponent';
import ComponentDatePicker from '../../common/ComponentDatePicker';
import LoanStatusPicker from '../../common/LoanStatusPicker ';
import { Ionicons } from '@expo/vector-icons'; // Import the close icon from your icon library
import CustomAlert from '../../common/CustomAlert';

const EditLoanDetail = ({ route, navigation }) => {
  const { record, recordId } = route.params;
  // console.log('Record ID:', record); 
  const [principalLoanAmount, setPrincipalLoanAmount] = useState(record.kf_principalloanamount);
  const [kf_paidstatus, setkf_paidstatus] = useState(record.kf_paidstatus);
  const [PaymentDate, setPaymentDate] = useState(record.kf_receiveddate);
  const [isPaid, setIsPaid] = useState(false);
  const [remainingBalance, setRemainingBalance] = useState(record.kf_remainingbalance);
  const [kf_totalmonths, setMonth] = useState(record.kf_totalmonths);
  const [interestPayment, setInterestPayment] = useState(record.kf_annualinterest);
  const [emiAmount, setEmiAmount] = useState(record.kf_emiamount);
  const [applicationNumber, setApplicationNumber] = useState(record.kf_applicationnumber);
  const [penalty, setPenalty] = useState(record.kf_penalty);
  const [isLoading, setIsLoading] = useState(false);
  const emiStatusOptions = ['Paid', 'Unpaid'];
  const [statusUpdated, setStatusUpdated] = useState(false); // New state variable
  const [emiStatusUpdated, setEmiStatusUpdated] = useState(false); // New state variable
  // const [ReceivedDate, setReceivedDate] = useState('');
  const [kf_datepicker, setkf_datepicker] = useState(record.kf_datepicker);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [updateClicked, setUpdateClicked] = useState(false);
  const [updatePerformed, setUpdatePerformed] = useState(false);
  // const [kf_gender, setkf_gender] = useState(null);
  const [showAlert, setShowAlert] = useState(false); // New state for showing custom alert
  const [showAlertEMIUnpaid, setShowAlertEMIUnpaid] = useState(false); // New state for showing custom alert


  useEffect(() => {
    console.log('Penalty updated:', penalty);

    // Check if penalty has actually changed
    if (penalty !== record.kf_penalty) {
      if (penalty) {
        const updatedEmiAmount = parseFloat(record.kf_emiamount) + parseFloat(penalty);
        console.log('Updated EMI amount with penalty:', updatedEmiAmount);
        setEmiAmount(parseFloat(updatedEmiAmount).toFixed(2)); // Convert to float and format
      } else {
        // Reset EMI amount to its original value
        setEmiAmount(record.kf_emiamount.toString());
      }
    }
  }, [penalty, record.kf_penalty]);

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

  const handleEmiStatusChange = (value) => {
    setkf_paidstatus(value === 'Paid');
    // Disable the Penalty input if EMI status is Paid
    if (value === 'Paid') {
      setPenalty(''); // Clear the Penalty value
    }
  };

  const handleReceivedDate = (date) => {
    console.log('New Date:', date); // Add this console log
    setkf_datepicker(date);
    setSelectedDate(date);
  };

  console.log('Selected Date:', kf_datepicker);

  const formatDate = (date) => {
    if (!date) return ''; // Handle null or undefined dates
    if (typeof date === 'string') {
      date = new Date(date); // Convert string date to Date object
    }
    return date.toLocaleDateString();
  };

  const handleUpdate = async () => {

    if (!kf_datepicker) {
      handleShowAlert(); 
      setIsLoading(false);
      return;
    };

    if (!kf_paidstatus) {
      handleShowAlertEMIUnPaid();
      setIsLoading(false);
      return;
    };
    
    if (updateClicked || updatePerformed) {
      return;
    };

    setIsLoading(true);
    setUpdateClicked(true);
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
        kf_receiveddate: PaymentDate,
        kf_emiamount: emiAmount,
        kf_remainingbalance: remainingBalance,
        kf_paidstatus: updatedKfPaidStatus,
        kf_penalty: penalty,
        kf_datepicker: kf_datepicker
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
    await AsyncStorage.setItem(`paid_${record.kf_loanid}`, 'true');
    Alert.alert('EMI', 'EMI Amount is Paided Successfully.', [
      {
        text: 'OK',
        onPress: () => {
          setIsPaid(true);
          setEmiStatusUpdated(true);
          setUpdatePerformed(true);
          setkf_paidstatus(kf_paidstatus);
          navigation.goBack({ isPaid: true });
        },
      },
    ]);
  } else {
    console.log('Error updating record in CRM:', updateRecordResponse);
    Alert.alert('Error', 'Failed to update the record in CRM.');
  }
} catch (error) {
  console.error('Error during update:', error.response?.data || error.message);
  Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
} finally {
  setIsLoading(false);
}
};

  const handleEMIStatusOptionset = (selectedOptionGender) => {

    if (!kf_datepicker ) {
      Alert.alert(
        'Alert',
        'Please select the payment received date before changing the EMI status.'
      );
      return; 
    }
    if (selectedOptionGender === 'Paid') {
      Alert.alert(
        'Confirmation',
        'Are you sure you want to mark this as Paid?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              setkf_paidstatus(1); // Set as Paid
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      let numericValue;
      switch (selectedOptionGender) {
        case 'Unpaid':
          numericValue = 0;
          break;
        case 'Paid':
          numericValue = 1;
          break;
        default:
          numericValue = '';
      }
      setkf_paidstatus(numericValue);
    }
  };

  const handleGoBackPersonaldetails = () => {
    navigation.goBack();
  };

  const date = kf_datepicker ? new Date(kf_datepicker) : null;

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleShowAlertEMIUnPaid = () => {
    setShowAlertEMIUnpaid(true);
  };

  // Function to close the custom alert
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleCloseAlertEMIUnPaid = () => {
    setShowAlertEMIUnpaid(false);
  };

  return (
    <View style={styles.container}>
      <HeaderComponent titleText="EMI Details" onPress={handleGoBackPersonaldetails} />
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
        <View style={styles.row}>
          <Text style={styles.label}>Due Date:</Text>
          <TextInput
            style={styles.valueInput}
            value={PaymentDate}
            onChangeText={(text) => setPaymentDate(text)}
            editable={false}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>EMI Amount:</Text>
          <TextInput
            style={styles.valueInput}
            value={record.kf_emiamount}
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
          <Text style={styles.label}>Penalty:</Text>
          <TextInput
            style={[styles.valueInput, { color: kf_paidstatus ? "gray" : "black" }]}
            value={penalty}
            onChangeText={(text) => setPenalty(text)}
            editable={!kf_paidstatus}
            placeholder= "Enter penalty"
          />
        </View>

        {kf_paidstatus ? (
          <View style={styles.row}>
            <Text style={styles.label}>Payment Received Date:</Text>
            <Text style={[styles.valueInput, { height: 40, padding: 5 }]}>{formatDate(date)}</Text>
          </View>
        ) : (
          <View style={styles.row}>
            <Text style={styles.label}>Received Date:</Text>
            <View style={[styles.datepicker, {left: 18}]}>
              <ComponentDatePicker
                selectedDate={date}
                onDateChange={handleReceivedDate}
                placeholder="Payment Received Date"
              />
            </View>
          </View>
        )}

        <View style={styles.row}>
          <Text style={[styles.label,{top: -10}]}>EMI Status:</Text>
          <View style={{width: "80%", left: 18, top: -10, height: "100%"}}>
          <LoanStatusPicker style={{height: 40, color: kf_paidstatus ? "gray" : "black" }}
            onOptionChange={handleEMIStatusOptionset}
            title="EMI Status"
            options={['Paid', 'Unpaid']}
            initialOption={kf_paidstatus ? 'Paid' : 'Unpaid'}
            Optiontitle= "EMI Status"
          disabled={kf_paidstatus}
          />
          </View>
        </View>

        <ButtonComponent
          title={isPaid ? "Paid" : "Update"}
          onPress={handleUpdate}
          disabled={isPaid || isLoading || emiStatusUpdated || updatePerformed}
          style={isPaid ? styles.disabledButton : styles.button}
        />
        <CustomAlert
        visible={showAlert}
        onClose={handleCloseAlert}
        title="Cannot Update"
        headerMessage= "Alert"
        message="Select Payment Received Date"
        buttonText="OK"
      />

        <CustomAlert
          visible={showAlertEMIUnpaid}
          onClose={handleCloseAlertEMIUnPaid}
          title="Cannot Update"
          headerMessage="Cannot Update"
          message="EMI status is unpaid. Cannot update."
          buttonText="OK"
          style={styles.alertStyle}
          modalHeaderStyle={styles.modalheaderStyle}
          textStyle={styles.textStyle}
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
  disabledButton: {
    backgroundColor: 'gray', 
    marginTop: 20,
    padding: 0,
    borderRadius: 50,
    alignItems: 'center',
    width: "30%"
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
    width: "100%"
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
  },
  valueInput: {
    flex: 2,
    borderRadius: 5,
    paddingHorizontal: 9,
    fontSize: 14,
    color: "gray",
    height: 40,
    backgroundColor: "#FBFCFC",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  valueInputEMI: {
    flex: 2,
    borderRadius: 5,
    paddingHorizontal: 9,
  },
  button: {
    marginTop: 20,
    padding: 0,
    borderRadius: 50,
    alignItems: 'center',
    width: "30%"
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  datepicker: {
    width: "80%",
    // marginRight: -20,
    marginTop: -10,
  },
  alertStyle:{
// backgroundColor: "blue",
width: "80%",
  },
  modalheaderStyle:{
    // backgroundColor: "green",
    marginLeft: 40
  },
  textStyle:{
    // backgroundColor: "yellow"
  }
});

export default EditLoanDetail;