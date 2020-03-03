import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from './screens/HomeScreen.js'
import StartScreen from './screens/StartScreen.js'
import CreateRoomScreen from './screens/CreateRoomScreen.js'
import TabScreen from './screens/TabScreen.js'
import RoomScreen from './screens/RoomScreen.js'
import JoinRoomScreen from './screens/JoinRoomScreen.js'
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
const Tab = createBottomTabNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="StartScreen">
        <Stack.Screen name="StartScreen" component={StartScreen}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
        <Stack.Screen name="CreateRoomScreen" component={CreateRoomScreen}/>
        <Stack.Screen name="TabScreen" component={TabScreen}/>
        <Stack.Screen name="JoinRoomScreen" component={JoinRoomScreen}/>
        <Stack.Screen name="RoomScreen" component={RoomScreen}/>
      </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
