import React from 'react';
import { View } from 'react-native';
import { Header } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import clientSecret from '../secret.js'
import SpotifyAuth from '../components/SpotifyAuth.js'

const SwitchUserScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <Header
        containerStyle={{ borderBottomWidth: 0 }}
        backgroundColor="#000"
        centerComponent={{
          text: 'Switch Account',
          style: { color: 'white', fontSize: 20, fontWeight: 'bold' }
        }}
        leftComponent={
          <MaterialIcons name="arrow-back" size={30} color="#fff"
            onPress={() => navigation.navigate("TabScreen")} />}
      />
      <SpotifyAuth navigation={navigation} switchAccount={true} />
    </View>
  );
}

export default SwitchUserScreen;
