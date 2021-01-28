import React from 'react';
import { View } from 'react-native';
import { Header } from 'react-native-elements';
import CreateRoom from '../components/CreateRoom.js'
import { MaterialIcons } from '@expo/vector-icons';

const CreateRoomScreen = ({ navigation }) => {
  return(
    <View style={{ flex: 1}}>
      <Header
      backgroundColor="#000"
      containerStyle={{borderBottomWidth: 0}}
      leftComponent={<MaterialIcons name="arrow-back" size={30} color="#fff" onPress={()=>navigation.navigate("StartScreen")}/> }
      />
      <CreateRoom navigation= {navigation}/>
    </View>
  );
}

export default CreateRoomScreen;
