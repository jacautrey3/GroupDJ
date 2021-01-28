import React, {useState} from 'react';
import { View, Modal } from 'react-native';
import { Header } from 'react-native-elements';
import PlayerControls from '../components/PlayerControls.js'
import { AntDesign, Feather } from '@expo/vector-icons';

const NowPlayingOwnerScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  return(
    <View style={{ flex: 1}}>
    <Header
    backgroundColor="#000"
    containerStyle={{borderBottomWidth: 0}}
    centerComponent={{text: 'Now Playing', style: {color: 'white', fontSize: 20, fontWeight:'bold'}}}
    rightComponent={<Feather name="speaker" size={30} color="#888" /> }
    leftComponent={<AntDesign name="user" size={30} color="#888" onPress={()=>navigation.navigate("SwitchUserScreen")}/> }
    />
      <PlayerControls/>
    </View>
  );
}

export default NowPlayingOwnerScreen;
