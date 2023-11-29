import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Setting = ({navigation}) => {

  const handleSignOut = () => {
    console.log("sign out");
    navigation.navigate('ToggleForm');
  };

  return (
    <View>
        <Text>Setting</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 28, 53, 255)',
    borderRadius: 10,
  },
  signOutText: {
    color: '#fff',
  },
});

export default Setting;