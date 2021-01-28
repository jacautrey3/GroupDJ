import React from 'react';
import { View } from 'react-native';
import PlayerControls from '../components/PlayerControls.js'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import NowPlayingScreen from '../screens/NowPlayingScreen.js'
import SearchScreen from '../screens/SearchScreen.js'
import QueueScreen from '../screens/QueueScreen.js'
import Icon from 'react-native-vector-icons/MaterialIcons';

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
        showIcon: true,
        style: {
          backgroundColor: '#222'
        },
      }}
      >
        <Tab.Screen
          name="Queue"
          component={QueueScreen}
          options={{
            tabBarLabel: 'Queue',
            tabBarIcon: ({ focused, tintColor }) => (
              <Icon name="list" size={25} color={focused ? '#fff' : '#888'}/>
            ),
          }}
        />
        <Tab.Screen
          name="Now Playing"
          component={NowPlayingScreen}
          options={{
            tabBarLabel: 'Now Playing',
            tabBarIcon: ({ focused, tintColor }) => (
              <Icon name="home" size={25} color={focused ? '#fff' : '#888'}/>
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ focused, tintColor }) => (
              <Icon name="search" size={25} color={focused ? '#fff' : '#888'} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default TabScreen;
