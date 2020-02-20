import React, { Component } from 'react';
import { GetInfo, SwitchFunc } from '../spotifyFunctions.js'
import { TouchableOpacity, StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import styles from '../style.js'

import { SpotifyWebApi } from './Home.js'

export default class CreateRoom extends Component {
  constructor() {
    super();
  this.state = {
    userInfo: false,
    didError: false,
    token: 'token',
    playState: null,
    now_playing: null,
    artist: null
  };
  this.SwitchFunc = SwitchFunc.bind(this);
  this.GetInfo = GetInfo.bind(this);

    SpotifyWebApi.getMyCurrentPlaybackState({
  })
  .then(data => {
    // Output items
    console.log("Now Playing: ",data.body.item);
    if(data.body != null)
    {
      this.setState({
        playState: data.body.is_playing,
        now_playing: data.body.item.name,
        artist: data.body.item.artists[0].name
      })
    }
  }, err => {
    console.log('Something went wrong!', err);
  });
  }



  render() {
    return(
      <View style={styles.container}>
      <View style={styles.userInfo}>
        <View>
          <Text style={styles.userInfoText}>
            Current Track

          </Text>
          <Text style={styles.userInfoText}>
            Song:
          </Text>
          <Text style={styles.userInfoText}>
            {this.state.now_playing}
          </Text>
          <Text style={styles.userInfoText}>
            Artist:
          </Text>
          <Text style={styles.userInfoText}>
            {this.state.artist}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={this.GetInfo}
      >
        <Text style={styles.buttonText}>
          get info
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={this.SwitchFunc}
      >
        <Text style={styles.buttonText}>
          {this.state.playState}
        </Text>
      </TouchableOpacity>
      <Text style={styles.userInfoText}>
      {this.state.token}
      </Text>
      </View>
    );
  }
}
