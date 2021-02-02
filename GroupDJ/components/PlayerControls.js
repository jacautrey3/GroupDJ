import React, { Component } from 'react';
import { GetInfo, SwitchFunc, NextSong } from '../spotifyFunctions.js'
import { TouchableOpacity, StyleSheet, Text, View, Button, ScrollView, Image } from 'react-native';
import styles from '../style.js'
import { SpotifyWebApi } from './SpotifyAuth.js'
import { Entypo } from '@expo/vector-icons';
var firebase = require("firebase");

export default class CreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: false,
      didError: false,
      token: 'token',
      playState: 'controller-play',
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
      this.getNowPlaying()
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }


  getNowPlaying() {
    let timeLeft;
    SpotifyWebApi.getMyCurrentPlaybackState({})
      .then(data => {
        if (data.body != null) {
          firebase.database().ref('/Rooms/' + global.roomKey + "/currentSong/").set(data.body.item);
          // console.log("duration: ", data.body.item.duration_ms - data.body.progress_ms);
          if (data.body.item.duration_ms - data.body.progress_ms < 1500) {
            // console.log("play next song")
            this.NextSong();
          }
          this.setState({
            artwork: data.body.item.album.images[0].url,
            is_playing: data.body.is_playing,
            now_playing: data.body.item.name,
            artist: data.body.item.artists[0].name,
            playState: (data.body.is_playing ? 'controller-paus' : 'controller-play')
          })
        }
      }, err => {
        console.log('Something went wrong!', err);
      });
  }


  findDevices() {
    SpotifyWebApi.getMyDevices()
      .then((response) => {
        // console.log(response.body.devices);
        return response.body.devices;
      })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>

        {this.state.now_playing ?
          <View style={{ flex: 1 }}>
            <View style={styles.PlayerContainer}>

              <Image
                style={{ width: 300, height: 300, padding: 10 }}
                source={{ uri: this.state.artwork }}
              />


              <Text style={styles.songText}>
                {this.state.now_playing}
              </Text>


              <Text style={styles.artistText}>
                {this.state.artist}
              </Text>

            </View>
            <View style={styles.PlayerButtons}>
              <TouchableOpacity
                style={styles.PlayButton}
                onPress={this.SwitchFunc}
              >
                <Entypo name={this.state.playState} color='#000' size={40} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.PlayButton}
                onPress={this.NextSong}
              >
                <Entypo name='controller-next' color='#000' size={40} />
              </TouchableOpacity>
            </View>

          </View>

          :

          <View style={styles.PlayerContainer}>
            <Text style={{ color: '#eee', textAlign: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 'bold', paddingTop: '30%' }}>
              No Current Song
          </Text>
          </View>
        }

      </View>
    );
  }
}
