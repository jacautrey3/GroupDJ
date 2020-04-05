import React from 'react';
import { View } from 'react-native';
import PlayerControls from '../components/PlayerControls.js'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import RoomOwnerScreen from '../screens/RoomOwnerScreen.js'
import SearchScreen from '../screens/SearchScreen.js'
import QueueScreen from '../screens/QueueScreen.js'

const Tab = createBottomTabNavigator();

const TabScreen = ({ navigation }) => {
  return(
    <View style={{ flex: 1, display: 'flex', justifyContent: 'center'}}>
      <Tab.Navigator
      initialRouteName="Now Playing"
      tabBarOptions={{
        activeBackgroundColor: '#222',
        activeTintColor: '#fff',
        inactiveTintColor: '#888',
        inactiveBackgroundColor: '#222',
        style: {
          backgroundColor: '#222'
        },
      }}
      >
        <Tab.Screen name="Queue" component={QueueScreen} />
        <Tab.Screen name="Now Playing" component={RoomOwnerScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
      </Tab.Navigator>
    </View>
  );
}

export default TabScreen;
