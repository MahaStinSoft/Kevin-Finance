import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const EmployeeCollectionDashboard = () => {
  const [loanData, setLoanData] = useState([]);
  const [totalAmountCollected, setTotalAmountCollected] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('today');
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    fetchData(selectedFilter);
  }, [selectedFilter, fromDate, toDate]);

  const fetchData = async (filter) => {
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
        new URLSearchParams(data).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
  
      const accessToken = tokenResponse.data.access_token;
  
      const response = await axios.get(
        'https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/kf_loans',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      const loans = response.data.value
        .filter((loan) => loan.kf_employee === loan.kf_createdby) // Only include loans where kf_employee equals kf_createdby
        .map((loan) => {
          const datepicker = loan.kf_datepicker;
          const date = datepicker ? datepicker.split('T')[0] : null;
  
          const amount = loan.kf_emiamount ? parseFloat(loan.kf_emiamount) : 0;
  
          return {
            date,
            amount,
          };
        });
  
      const groupedLoans = loans.reduce((acc, loan) => {
        const { date, amount } = loan;
        if (date) {
          if (!acc[date]) {
            acc[date] = { date, totalAmount: 0 };
          }
          acc[date].totalAmount += amount;
        }
        return acc;
      }, {});
  
      const aggregatedLoans = Object.values(groupedLoans);
  
      let filteredLoans = [];
  
      if (filter === 'customDateRange') {
        filteredLoans = aggregatedLoans.filter(
          (loan) => new Date(loan.date) >= fromDate && new Date(loan.date) <= toDate
        );
      } else if (filter === 'today') {
        const todayDate = new Date().toISOString().split('T')[0];
        filteredLoans = aggregatedLoans.filter((loan) => loan.date === todayDate);
      } else if (filter === 'thisWeek') {
        const currentDate = new Date();
        const startOfWeek = currentDate.getDate() - currentDate.getDay(); // start of the week
        const endOfWeek = startOfWeek + 6; // end of the week
  
        const startOfWeekDate = new Date(currentDate);
        startOfWeekDate.setDate(startOfWeek);
  
        const endOfWeekDate = new Date(currentDate);
        endOfWeekDate.setDate(endOfWeek);
  
        filteredLoans = aggregatedLoans.filter(
          (loan) => new Date(loan.date) >= startOfWeekDate && new Date(loan.date) <= endOfWeekDate
        );
      } else if (filter === 'thisMonth') {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
        filteredLoans = aggregatedLoans.filter(
          (loan) => new Date(loan.date) >= startOfMonth && new Date(loan.date) <= endOfMonth
        );
      } else if (filter === 'thisYear') {
        const thisYear = new Date().getFullYear();
        filteredLoans = aggregatedLoans.filter(
          (loan) => new Date(loan.date).getFullYear() === thisYear
        );
      }
  
      if (filter !== 'today' && filter !== 'thisYear' && filter !== 'customDateRange') {
        filteredLoans.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
  
      setLoanData(filteredLoans);
  
      const totalAmount = filteredLoans.reduce((sum, loan) => sum + loan.totalAmount, 0);
      setTotalAmountCollected(totalAmount);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  
  const onFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(false);
    if (selectedDate) {
      setFromDate(selectedDate);
    }
  };

  const onToDateChange = (event, selectedDate) => {
    setShowToDatePicker(false);
    if (selectedDate) {
      setToDate(selectedDate);
    }
  };

  

  return (
    <View style={{ height: '62%' }}>
      <Picker
        selectedValue={selectedFilter}
        onValueChange={(itemValue) => {
          setSelectedFilter(itemValue);
          if (itemValue === 'customDateRange') {
            setShowFromDatePicker(true);
          }
        }}
        style={{ height: 50, width: '100%' }}
      >
        <Picker.Item label="Today" value="today" />
        {/* <Picker.Item label="Last 5 Days" value="last5days" /> */}
        <Picker.Item label="This Week" value="thisWeek" />
<Picker.Item label="This Month" value="thisMonth" />
        <Picker.Item label="This Year" value="thisYear" />
        <Picker.Item label="Custom Date Range" value="customDateRange" />
      </Picker>

      {showFromDatePicker && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          display="default"
          onChange={onFromDateChange}
        />
      )}

      {showToDatePicker && (
        <DateTimePicker
          value={toDate}
          mode="date"
          display="default"
          onChange={onToDateChange}
        />
      )}

      {selectedFilter === 'customDateRange' && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
          <TouchableOpacity onPress={() => setShowFromDatePicker(true)}>
            <Text style={{ fontWeight: 'bold' }}>From: {fromDate.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowToDatePicker(true)}>
            <Text style={{ fontWeight: 'bold' }}>To: {toDate.toDateString()}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={{ height: selectedFilter === 'customDateRange' ? '80%' : '60%' }}
        horizontal
        showsHorizontalScrollIndicator
      >
        <BarChart
          data={{
                        labels: selectedFilter === 'thisYear'
                          ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                          : loanData.map((loan) => loan.date),
                        datasets: [
                          {
                            data: selectedFilter === 'thisYear'
                              ? Array(12).fill(0).map((_, monthIndex) => {
                                  const monthTotal = loanData.reduce((acc, loan) => {
                                    const loanDate = new Date(loan.date);
                                    return loanDate.getMonth() === monthIndex ? acc + loan.totalAmount : acc;
                                  }, 0);
                                  return monthTotal;
                                })
                              : loanData.map((loan) => loan.totalAmount),
                          },
                        ],
                      }}
          width={Math.max(screenWidth, loanData.length * 20)}
          height={Dimensions.get('window').height * 0.5}
          yAxisLabel="₹"
          fromZero
          chartConfig={{
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            color: (opacity = 1) => `rgba(0,159,239,255)`,
            barRadius: 0,
            barPercentage: 0.8,
          }}
          style={{ marginVertical: 1, borderRadius: 16 }}
          verticalLabelRotation={30}
        />
      </ScrollView>

      <View style={{ justifyContent: 'flex-end', alignItems: 'center', paddingVertical: -5 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          Total Amount Collected: ₹{totalAmountCollected.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};


export default EmployeeCollectionDashboard;
