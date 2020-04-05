import React, { Component } from 'react';
import { TextInput, View, FlatList, StyleSheet, Text } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import { SpotifyWebApi } from './Home.js'
import { PlaySong, findDevices, GetTrackInfo } from '../spotifyFunctions.js'
var firebase = require("firebase");

export default class Queue extends Component {
  constructor(props) {
    super(props);
  this.state = {
    queueData: [],
    devices: []
  };
  this.findDevices = findDevices.bind(this);
  this.GetTrackInfo = GetTrackInfo.bind(this);
}

  componentDidMount() {
    this.findDevices();
    this.getQueue();
  }

  GetName = (trackID) => {
    SpotifyWebApi.getTrack(trackID)
    .then(response => {
      console.log("response from getrackinfo ",response.body)
      return response.body.id
    }, err => {
      console.log("GETTRACK ERROR", err)
    })
  }

  getQueue() {
    var ref = firebase.database().ref('/Rooms/'+global.roomKey+"/queue")
    ref.on('value', function(snapshot) {
      var newQueue = []
      let newItem = {}
      snapshot.forEach(function(childSnap) {
          newQueue.push(childSnap.val())
      })
      this.setState({
        queueData: newQueue
      })
    }.bind(this))
  }

  renderItem = ({ item, index }) => (
    <ListItem
    containerStyle={{backgroundColor: '#333'}}
    titleStyle={{color: '#fff'}}
    subtitleStyle={{color: '#fff'}}
    button onPress={() => {
      PlaySong(item.id, this.state.devices)
      console.log("render queue item", item)
    }}
    title={item.name}
    subtitle={item.artists[0].name}
    bottomDivider
    />
)

  renderQueue() {
    console.log("this queuedata", this.state.queueData)
    if(this.state.queueData.length > 0)
    {
      return (
        <View style = {{flex: 1}}>
        <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={this.state.queueData}
        keyExtractor={(item, index) => item.id}
        renderItem={this.renderItem}
        extraData={this.state}
        />
        </View>
      );
    }
    else
    {
      return (
        <View style = {{flex: 1 }}>
          <Text style = {{color: 'white', textAlign: 'center', fontSize: 30, fontWeight: 'bold', paddingTop: '50%'}}>No Queue</Text>
        </View>
      );
    }
    console.log("render queue");
  }

  render() {
    return (
      <View style={{flex:1}}>
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
  textInput:{
     alignItems: 'center',
        backgroundColor: '#000',
        borderRadius: 10,

        flexDirection: 'row',
        height: 43,
        margin: 8,
        marginVertical: 10,
        paddingHorizontal: 10
  },
})
