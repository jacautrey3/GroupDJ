import React, { Component } from 'react';
import { GetInfo, SwitchFunc, NextSong } from '../spotifyFunctions.js'
import { TouchableOpacity, StyleSheet, Text, View, Button, ScrollView, Image } from 'react-native';
import styles from '../style.js'
import { SpotifyWebApi } from './Home.js'

export default class CreateRoom extends Component {
  constructor(props) {
    super(props);
  this.state = {
    userInfo: false,
    didError: false,
    token: 'token',
    playState: 'play',
    now_playing: null,
    artist: null,
    is_playing: null
  };
  this.SwitchFunc = SwitchFunc.bind(this);
  this.GetInfo = GetInfo.bind(this);
  this.NextSong = NextSong.bind(this);

  }

componentDidMount() {
  this.getNowPlaying();
  this.myInterval = setInterval(() => {
  this.getNowPlaying()}, 1000);
}

componentWillUnmount() {
  clearInterval(this.myInterval);
}

getNowPlaying() {
  SpotifyWebApi.getMyCurrentPlaybackState({
  })
  .then(data => {
    // console.log("Now Playing: ",data.body.item);
    if(data.body != null)
    {
      this.setState({
        artwork: data.body.item.album.images[0].url,
        is_playing: data.body.is_playing,
        now_playing: data.body.item.name,
        artist: data.body.item.artists[0].name
      })
    }
  }, err => {
    console.log('Something went wrong!', err);
  });
}

findDevices() {
  SpotifyWebApi.getMyDevices()
  .then((response) => {
    console.log(response.body.devices);
    return response.body.devices;
  })
}

  render() {
    return(
      <View style={styles.container}>
      <View style={styles.userInfo}>
        <View>
          <Text style={styles.userInfoText}>
            Current Track

          </Text>
          <Image
          style={{height: 100, width: 100}}
          source={{uri: this.state.artwork}}
          />
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
      <TouchableOpacity
        style={styles.button}
        onPress={this.NextSong}
      >
        <Text style={styles.buttonText}>
          Next
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={this.findDevices}
      >
        <Text style={styles.buttonText}>
          get Devices
        </Text>
      </TouchableOpacity>
      </View>
    );
  }
}
