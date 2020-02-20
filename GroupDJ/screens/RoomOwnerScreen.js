import React from 'react';
import { View } from 'react-native';
import PlayerControls from '../components/PlayerControls.js'

const CreateRoomScreen = ({ navigation }) => {
  return(
    <View style={{ flex: 1, display: 'flex', justifyContent: 'center'}}>
      <PlayerControls/>
    </View>
  );
}

export default CreateRoomScreen;
