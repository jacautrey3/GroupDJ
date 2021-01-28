import React, {useState} from 'react';
import { View, Modal } from 'react-native';
import { Header } from 'react-native-elements';
import Player from '../components/Player.js'
import { MaterialIcons, Feather } from '@expo/vector-icons';

const NowPlayingScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  return(
    <View style={{ flex: 1, display: 'flex', justifyContent: 'center'}}>
    <Header
    backgroundColor="#000"
    containerStyle={{borderBottomWidth: 0}}
    centerComponent={{text: 'Now Playing', style: {color: 'white', fontSize: 20, fontWeight:'bold'}}}
    />
      <Player/>
    </View>
  );
}

export default NowPlayingScreen;
