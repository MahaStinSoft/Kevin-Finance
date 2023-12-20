import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export const ComponentDatePicker = ({ selectedDate, onDateChange, onDateSelected, placeholder }) => {
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [textColor, setTextColor] = useState('gray');
  const [placeholderText, setPlaceholderText] = useState('Date of Approval');

  useEffect(() => {
    // Update the placeholder text when selectedDate changes
    setPlaceholderText(selectedDate ? selectedDate.toLocaleDateString() : 'date');
    setTextColor(selectedDate ? 'black' : 'gray');
  }, [selectedDate]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate; // Use the existing date if selectedDate is null
    setShow(false);
    onDateChange(currentDate);
    onDateSelected(currentDate);
    setTextColor('black'); // Change text color to black after selecting date
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity onPress={showDatepicker}>
          <TextInput
            style={[
              styles.textInputContainer,
              { color: textColor }
            ]}
            value={placeholderText}
            editable={false}
          />
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={selectedDate || new Date()} // Set default value if selectedDate is null
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 8,
    backgroundColor: '#FBFCFC',
    padding: 10,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 5,
  },
});

export default ComponentDatePicker;
