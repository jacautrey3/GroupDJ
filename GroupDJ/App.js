import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './screens/HomeScreen.js'
import StartScreen from './screens/StartScreen.js'
import CreateRoomScreen from './screens/CreateRoomScreen.js'
import RoomOwnerScreen from './screens/RoomOwnerScreen.js'
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDBJYmHz39zi3ekY4ZT2LdMQ8p0UXm0rqI",
  authDomain: "group-dj.firebaseapp.com",
  databaseURL: "https://group-dj.firebaseio.com",
  projectId: "group-dj",
  storageBucket: "group-dj.appspot.com",
  messagingSenderId: "735265761710",
  appId: "1:735265761710:web:2c265f9ff004322c3b403f",
  measurementId: "G-X3X1JK5N5K"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


const Stack = createStackNavigator()

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen">
        <Stack.Screen name="StartScreen" component={StartScreen}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
        <Stack.Screen name="CreateRoomScreen" component={CreateRoomScreen}/>
        <Stack.Screen name="RoomOwnerScreen" component={RoomOwnerScreen}/>
      </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
