import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NotificationsIcon = ({ onPress }) => {
  const [newRecordsCount, setNewRecordsCount] = useState(0);

  const handleClearBadge = () => {
    setNewRecordsCount(0);
  };

  return (
    <TouchableOpacity style={styles.iconButton} onPress={onPress}>
      <Ionicons name="notifications" size={30} color="#fff" />
      {newRecordsCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{newRecordsCount}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.clearButton} onPress={handleClearBadge}>
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    marginRight: 15,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationsIcon;
