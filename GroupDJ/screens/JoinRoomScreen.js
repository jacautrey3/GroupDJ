import React from 'react';
import { View } from 'react-native';
import JoinRoom from '../components/JoinRoom.js'

const JoinRoomScreen = ({ navigation }) => {
  return(
    <View style={{ flex: 1}}>
      <JoinRoom navigation= {navigation}/>
    </View>
  );
}

export default JoinRoomScreen;
