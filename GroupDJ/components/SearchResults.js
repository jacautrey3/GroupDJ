import React, { Component } from 'react';
import { TextInput, View, FlatList, StyleSheet, Text } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import { SpotifyWebApi } from './Home.js'
import { PlaySong, findDevices } from '../spotifyFunctions.js'
var firebase = require("firebase");

export default class SearchResults extends Component {
  constructor(props) {
    super(props);
  this.state = {
    results: null,
    devices: []
  };
  this.findDevices = findDevices.bind(this);
}

  componentDidUpdate(prevProps) {
    if(this.props.itemSelected !== prevProps.itemSelected) {
      this.suggestionSelected(this.props.itemSelected, this.props.itemSelected.type)
    }
  }

  componentDidMount() {
    this.findDevices();
    this.suggestionSelected(this.props.itemSelected, this.props.itemSelected.type);
  }

  addToQueue(item) {
    var roomKey = global.roomKey;
    var key = firebase.database().ref('/Rooms/'+roomKey+"/queue").push(item);
  }

  suggestionSelected (value, type) {
    console.log(value);
    if(type === 'artist') {
      this.getArtist(value);
    }
    else if(type === 'track') {
      this.getSong(value);
    }
    else if(type === 'album') {
      this.getAlbum(value);
    }
  }

  getArtist(item) {
    SpotifyWebApi.getArtistTopTracks(item.id, 'US')
    .then((response) => {
      console.log(response.body.tracks);
      this.setState({
        results: response.body.tracks
      })
    })
  }

  getArtistAlbums(item) {
    SpotifyWebApi.getArtistAlbums(item.id)
    .then((response) => {
      console.log(response);
      this.setState({
        artistAlbums: response.items
      })
    })
    .then(() => this.getArtist(item))
  }

  renderItem = ({ item, index }) => (
    <ListItem
    containerStyle={{backgroundColor: '#333'}}
    titleStyle={{color: '#fff'}}
    button onPress={() => {
      this.addToQueue(item)
      // PlaySong(item.id, this.state.devices)
      console.log("RENDER ITEM", item)
    }}
    title={item.name}
    bottomDivider
    />
)

  renderTopTracks(item) {
    console.log("LOGGING THE DATA", item);
    return (
      <View style={{flex:1, width: '100%'}}>
        <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        style={{flex: 1, width: '100%'}}
        data={this.state.results}
        keyExtractor={item => item.id}
        renderItem={this.renderItem}
        extraData={this.state}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={{flex:1, width: '100%'}}>
        {this.renderTopTracks(this.props.itemSelected)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flexGrow: 1,
    paddingTop: 30
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
