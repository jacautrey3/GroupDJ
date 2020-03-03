import React from 'react';
import { View } from 'react-native';
import PlayerControls from '../components/PlayerControls.js'

const JoinRoomScreen = ({ navigation }) => {
  return(
    <View style={{ flex: 1}}>
      <PlayerControls/>
    </View>
  );
}

export default JoinRoomScreen;
