import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const PatientChatHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat with Doctor</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#7c3aed'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  }
});