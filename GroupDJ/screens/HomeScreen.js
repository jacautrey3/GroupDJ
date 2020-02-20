import React from 'react';
import { View } from 'react-native';
import Home from '../components/Home.js'

const HomeScreen = ({ navigation }) => {
  return(
    <View style={{ flex: 1}}>
      <Home navigation= {navigation}/>
    </View>
  );
}

export default HomeScreen;
