import React, { Component } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

class ComponentDatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 'date',
      show: false,
      textColor: 'gray',
      placeholderText: props.placeholder, // Use prop or default value
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedDate !== this.props.selectedDate) {
      this.updatePlaceholderText();
    }
  }

  updatePlaceholderText = () => {
    const { selectedDate } = this.props;
    this.setState({
      placeholderText: selectedDate ? this.formatDate(selectedDate) : this.props.placeholder,
      textColor: selectedDate ? 'black' : 'gray',
    });
  };

  formatDate = (date) => {
    // Format date as MM/DD/YYYY
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  };

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    this.setState({ show: false });
    this.props.onDateChange(currentDate);
    this.props.onDateSelected(currentDate);
    this.setState({ textColor: 'black' }); 
  };

  showMode = (currentMode) => {
    this.setState({ show: true, mode: currentMode });
  };

  showDatepicker = () => {
    this.showMode('date');
  };

  render() {
    const { show, mode, placeholderText, textColor } = this.state;
    const { selectedDate } = this.props;

    return (
      <SafeAreaView>
        <View>
          <TouchableOpacity onPress={this.showDatepicker}>
            <Text style={[styles.textInputContainer,{color: textColor}]}>{placeholderText}</Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate || new Date()} // Set default value if selectedDate is null
              mode={mode}
              is24Hour={true}
              onChange={this.onChange}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

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
