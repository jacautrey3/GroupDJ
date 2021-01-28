import React from 'react';
import { View } from 'react-native';
import { Header } from 'react-native-elements';
import Home from '../components/SpotifyAuth.js'
import SpotifyAuth from '../components/SpotifyAuth.js'
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <Header
        backgroundColor="#000"
        containerStyle={{ borderBottomWidth: 0 }}
        leftComponent={<MaterialIcons name="arrow-back" size={30} color="#fff" onPress={() => navigation.navigate("StartScreen")} />}
      />
      <SpotifyAuth navigation={navigation} />
    </View>
  );
}

export default HomeScreen;
