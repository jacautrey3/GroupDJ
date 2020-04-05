import React from 'react';
import { View, Text } from 'react-native';
import Queue from '../components/Queue.js'
import styles from '../style.js'

const QueueScreen = ({ }) => {
  return(
    <View style={{ flex: 1, display: 'flex', justifyContent: 'center', backgroundColor: '#000'}}>
      <Text style= {{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginTop: '10%', marginBottom: 20}}> Queue </Text>
      <Queue/>
    </View>
  );
}

export default QueueScreen;
