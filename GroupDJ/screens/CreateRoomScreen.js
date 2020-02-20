import React from 'react';
import { View } from 'react-native';
import CreateRoom from '../components/CreateRoom.js'

const CreateRoomScreen = ({ navigation }) => {
  return(
    <View style={{ flex: 1, display: 'flex', justifyContent: 'center'}}>
      <CreateRoom navigation= {navigation}/>
    </View>
  );
}

export default CreateRoomScreen;
