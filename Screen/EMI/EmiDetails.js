
import React, { useState, } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../../common/Header';
import ButtonComponent from '../../common/ButtonComponent';

const LoanCalculator = () => {
  const navigation = useNavigation();
  const [loanDetails, setLoanDetails] = useState({
    principalLoanAmount: '',
    annualInterestRate: '',
    loanTermMonths: '',
    emiAmount: '',
    amortizationSchedule: [],
  });

  const calculateEMIAmount = () => {
    const { principalLoanAmount, annualInterestRate, loanTermMonths } = loanDetails;

    const monthlyInterestRate = (annualInterestRate / 100) / 12;
    const numberOfPayments = loanTermMonths;

    const emi = principalLoanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const amortizationSchedule = generateAmortizationSchedule(principalLoanAmount, monthlyInterestRate, numberOfPayments, emi);

    setLoanDetails({
      ...loanDetails,
      emiAmount: emi.toFixed(2),
      amortizationSchedule,
    });
  };

  const generateAmortizationSchedule = (principal, monthlyInterestRate, numberOfPayments, emi) => {
    const schedule = [];
    let remainingBalance = principal;

    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = emi - interestPayment;
      remainingBalance -= principalPayment;

      schedule.push({
        month: i,
        paymentDate: new Date(),
        emiAmount: emi.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        principalPayment: principalPayment.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
      });
    }

    return schedule;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToDetails(item)}>
      <View style={styles.amortizationTile}>
        <Text>EMI Payment: {item.month}</Text>
        <Text>Date: {item.paymentDate.toDateString()}</Text>
        <Text>EMI Amount: {item.emiAmount}</Text>
      </View>
    </TouchableOpacity>
  );

  const navigateToDetails = (scheduleItem) => {
    navigation.navigate('LoanDetailsScreen', { scheduleItem });
  };

  const handleGoback = () => {
    navigation.goBack();
  }

  const toggleExpansion = (month) => {
    setLoanDetails({ ...loanDetails, expandedMonth: month === loanDetails.expandedMonth ? null : month });
  };

  return (
    <View style={styles.container}>
      <HeaderComponent titleText="Loan Details" onPress={handleGoback} />
      <View style={styles.loandetails}>
        <Text>Principal Loan Amount:</Text>
        <TextInput
          style={styles.input}
          value={loanDetails.principalLoanAmount}
          onChangeText={(text) => setLoanDetails({ ...loanDetails, principalLoanAmount: text })}
          keyboardType="numeric"
        />

        <Text>Annual Interest Rate (%):</Text>
        <TextInput
          style={styles.input}
          value={loanDetails.annualInterestRate}
          onChangeText={(text) => setLoanDetails({ ...loanDetails, annualInterestRate: text })}
          keyboardType="numeric"
        />

        <Text>Loan Term:</Text>
        <TextInput
          style={styles.input}
          value={loanDetails.loanTermMonths}
          onChangeText={(text) => setLoanDetails({ ...loanDetails, loanTermMonths: text })}
          keyboardType="numeric"
        />
      </View>

      <ButtonComponent title="Calculate EMI" onPress={calculateEMIAmount} style={{ marginTop: -10 }} />

      <Text style={styles.emiAmount}>EMI Amount: {loanDetails.emiAmount}</Text>
      <View style={styles.amortizationTileContainer}>
        <Text style={styles.amortizationTitle}>Amortization Schedule:</Text>
        <FlatList
          data={loanDetails.amortizationSchedule}
          keyExtractor={(item) => item.month.toString()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loandetails: {
    padding: 20,
    backgroundColor: "white"
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  amortizationTileContainer: {
    paddingHorizontal: 20
  },
  amortizationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  amortizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  amortizationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  amortizationTile: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 10,
  },
  emiAmount: {
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default LoanCalculator;
