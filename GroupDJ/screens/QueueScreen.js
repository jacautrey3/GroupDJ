import React from 'react';
import { View, Text } from 'react-native';
import { Header } from 'react-native-elements';
import Queue from '../components/Queue.js'
import styles from '../style.js'

const QueueScreen = ({ }) => {
  return(
    <View style={{ flex: 1, display: 'flex', justifyContent: 'center', backgroundColor: '#000'}}>
    <Header
    containerStyle={{borderBottomWidth: 0}}
    backgroundColor="#000"
    centerComponent={{text: 'Queue', style: {color: 'white', fontSize: 20, fontWeight:'bold'}}}
    />
      <Queue/>
    </View>
  );
}

export default QueueScreen;
