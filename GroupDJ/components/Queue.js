import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { SpotifyWebApi } from './SpotifyAuth.js'
import { PlaySong, findDevices, GetTrackInfo } from '../spotifyFunctions.js'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import DraggableFlatList from 'react-native-draggable-flatlist'

var firebase = require("firebase");


export default class Queue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queueData: [],
      devices: [],
      now_playing: null,
      artist: null,
      is_playing: null
    };
    this.findDevices = findDevices.bind(this);
    this.GetTrackInfo = GetTrackInfo.bind(this);
  }

  componentDidMount() {
    this.findDevices();
    this.getQueue();
    this.getNowPlaying();
  }

  getNowPlaying() {
    var { roomKey } = global
    var ref = firebase.database().ref('/Rooms/' + roomKey + "/currentSong")
    ref.on('value', (snapshot) => {
      const data = snapshot.val();
      console.log("GET NOW PLAYING", data)
      if (data) {
        this.setState({
          now_playing: data.name,
          artist: data.artists[0].name,
          artwork: data.album.images[0].url
        })
      }
    })
  }

  renderCurrentSong() {
    if (this.state.now_playing !== null) {
      return (
        <ListItem
          containerStyle={{ backgroundColor: '#ddd', marginLeft: 5, marginRight: 5, marginTop: 10, borderRadius: 10, borderBottomWidth: 0 }}
          titleStyle={{ color: '#000', fontWeight: 'bold' }}
          subtitleStyle={{ color: '#000', fontWeight: 'bold' }}
          // button onPress={() => {
          //   PlaySong(item.id, this.state.devices)
          //   // console.log("render queue item", item)
          // }}
          title={this.state.now_playing}
          subtitle={this.state.artist}
          leftAvatar={{ source: { uri: this.state.artwork }, rounded: false }}
          bottomDivider
        />
      );
    }
    else {
      <ListItem
        containerStyle={{ backgroundColor: '#ddd', marginLeft: 5, marginRight: 5, marginTop: 10, borderRadius: 10, borderBottomWidth: 0 }}
        titleStyle={{ color: '#000', fontWeight: 'bold' }}
        subtitleStyle={{ color: '#000', fontWeight: 'bold' }}
        title='No Current Song'
      />
    }
  }

  GetName = (trackID) => {
    SpotifyWebApi.getTrack(trackID)
      .then(response => {
        // console.log("response from getrackinfo ", response.body)
        return response.body.id
      }, err => {
        console.log("GETTRACK ERROR", err)
      })
  }

  getQueue() {
    var ref = firebase.database().ref('/Rooms/' + global.roomKey + "/queue")
    ref.on('value', function (snapshot) {
      var newQueue = []
      let newItem = {}
      snapshot.forEach(function (childSnap) {
        newQueue.push(childSnap.val())
      })
      this.setState({
        queueData: newQueue
      })
    }.bind(this))
  }

  renderItem = ({ item, index, drag, isActive }) => {
    return (
      // <Swipeable
      //   renderRightActions={this.RightActions}
      //   // onSwipeableRightOpen={this.onSwipeFromRight(item)}
      // >
      <ListItem
        containerStyle={{ backgroundColor: '#333', marginLeft: 5, marginRight: 5, marginTop: 10, borderRadius: 10, borderBottomWidth: 0 }}
        titleStyle={{ color: '#fff' }}
        subtitleStyle={{ color: '#ddd' }}
        // button onPress={() => {
        //   // PlaySong(item.id, this.state.devices)
        //   // console.log("render queue item", item)
        // }}
        button onLongPress={() => {
          console.log(item.name)
          Alert.alert(
            "Remove Song",
            "Do you want to remove this song?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => this.removeSong(item) }
            ],
            { cancelable: false }
          );
        }}
        title={item.name}
        subtitle={item.artists[0].name}
        leftAvatar={{ source: { uri: item.album.images[0].url }, rounded: false }}
        rightElement={<MaterialIcons name="drag-handle" size={30} color="#888" onLongPress={drag} />}
        bottomDivider
      />
      // </Swipeable>
    );
  }

  RightActions = (progress, dragX, item) => {
    console.log("item", item)
    return (
      <TouchableOpacity onLongPress={this.onSwipeFromRight(item)}>
        <View style={styles.rightAction}>
          <MaterialCommunityIcons name='trash-can-outline' color='#fff' size={40} style={{ padding: 10 }} />
        </View>
      </TouchableOpacity>
    )
  }

  onSwipeFromRight(item) {
    console.log("trash clicked")
    var roomKey = global.roomKey;
    var nextId;
    var ref = firebase.database().ref('/Rooms/' + roomKey + "/queue")
    ref.orderByKey().once('value', function (snapshot) {
      snapshot.forEach(function (childSnap) {
        console.log("cur song id", childSnap.val().id)
        console.log('item id ', item.id)
        nextId = childSnap.val();
        //remove current song
        if (childSnap.val().id == item.id) {
          firebase.database().ref('/Rooms/' + roomKey + "/queue/" + childSnap.key).remove();
        }
      })
    })
  }

  removeSong(item) {
    var roomKey = global.roomKey;
    var nextId;
    var ref = firebase.database().ref('/Rooms/' + roomKey + "/queue")
    ref.orderByKey().once('value', function (snapshot) {
      snapshot.forEach(function (childSnap) {
        console.log("cur song id", childSnap.val().id)
        console.log('item id ', item.id)
        nextId = childSnap.val();
        //remove current song
        if (childSnap.val().id == item.id) {
          firebase.database().ref('/Rooms/' + roomKey + "/queue/" + childSnap.key).remove();
        }
      })
    })
  }

  renderQueue() {
    // console.log("this queuedata", this.state.queueData)
    if (this.state.queueData.length > 0) {
      return (
        <View style={{ flex: 1 }}>
          <DraggableFlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={this.state.queueData}
            keyExtractor={(item, index) => `draggable-item-${item.id}`}
            renderItem={this.renderItem}
            extraData={this.state}
            onDragEnd={({ data }) => {
              var ref = firebase.database().ref('/Rooms/' + roomKey + "/queue")
              ref.once('value', function (snapshot) {
                firebase.database().ref('/Rooms/' + roomKey + "/queue/").remove();
                firebase.database().ref('/Rooms/' + roomKey + "/queue/").set(data);
              })
              this.setState({ data })
            }}
          />
        </View>
      );
    }
    else {
      return (
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: 'white', textAlign: 'center', fontSize: 30, fontWeight: 'bold', paddingTop: '50%'
            }}>
            No Queue
            </Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderCurrentSong()}
        {this.renderQueue()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flexGrow: 1,
    height: '100%'
  },
  autocompleteContainer: {
    backgroundColor: '#000',
    marginLeft: 0,
    marginRight: 0
  },
  textInput: {
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 10,

    flexDirection: 'row',
    height: 43,
    margin: 8,
    marginVertical: 10,
    paddingHorizontal: 10
  },
  rightAction: {
    backgroundColor: '#dd2c00',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
    marginTop: 10,
    borderRadius: 10
  }
})
