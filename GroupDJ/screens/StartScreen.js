import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Button, StatusBar } from 'react-native';
import styles from '../style.js'

const StartScreen = ({ navigation }) => {
  return(
    <View style={styles.container}>
    <StatusBar barStyle={'light-content'}/>
      <TouchableOpacity
        style={styles.button}
        onPress={()=>navigation.navigate("HomeScreen")}
      >
        <Text style={styles.buttonText}>
          Create Room
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={()=>navigation.navigate("JoinRoomScreen")}
      >
        <Text style={styles.buttonText}>
          Join Room
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default StartScreen;
