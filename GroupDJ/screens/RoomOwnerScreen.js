import React from 'react';
import { View } from 'react-native';
import { Header } from 'react-native-elements';
import PlayerControls from '../components/PlayerControls.js'
import { FontAwesome } from '@expo/vector-icons';

const CreateRoomScreen = ({ navigation }) => {
  return(
    <View style={{ flex: 1, display: 'flex', justifyContent: 'center'}}>
      <Header
      backgroundColor="#000"
      containerStyle={{borderBottomWidth: 0}}
      centerComponent={{text: 'Now Playing', style: {color: 'white', fontSize: 20, fontWeight:'bold'}}}
      rightComponent={<FontAwesome name="spotify" color="#2FD566" size={30}/> }
      />
      <PlayerControls/>
    </View>
  );
}

export default CreateRoomScreen;
