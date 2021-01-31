import React, { Component } from 'react';
import { Modal, TouchableHighlight, TextInput, View, FlatList, StyleSheet, Text, Image, List } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import { SpotifyWebApi } from './SpotifyAuth.js'
import { PlaySong, findDevices, GetSong } from '../spotifyFunctions.js'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
var firebase = require("firebase");

export default class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      devices: [],
      artistAlbums: null,
      albumTracks: null,
      album: null,
      selected: null,
      modalVisible: ""
    };
    this.findDevices = findDevices.bind(this);
    this.GetSong = GetSong.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.itemSelected !== prevProps.itemSelected) {
      this.suggestionSelected(this.props.itemSelected, this.props.itemSelected.type)
    }
  }

  componentDidMount() {
    this.findDevices();
    this.suggestionSelected(this.props.itemSelected, this.props.itemSelected.type);
  }

  async addToQueue(item) {
    var roomKey = global.roomKey;
    var repeat = false;
    var ref = firebase.database().ref('/Rooms/' + roomKey + "/queue")
    await ref.once('value', function (snapshot) {
      snapshot.forEach(function (childSnap) {
        //if song already in queue
        if (childSnap.val().id == item.id) {
          console.log("already in Queue\n")
          repeat = true;
        }
      })
    })
    if (!repeat) {
      firebase.database().ref('/Rooms/' + roomKey + "/queue").push(item);
      this.setModalVisible("Added to Queue")
    }
    else {
      this.setModalVisible("Already Added")
    }
    setTimeout(() => {
      this.setModalVisible("")
    }, 1000);
  }

  setModalVisible(visible) {
    this.setState({
      modalVisible: visible
    });
  }

  suggestionSelected(value, type) {
    console.log("value \n", value);
    // console.log("type ", type);
    if (type === 'artist') {
      this.setState({
        selected: 'artist'
      })
      this.getArtist(value);
      this.getArtistAlbums(value);
    }
    else if (type === 'track') {
      console.log('ADD TO QUEUE VALUE', value)
      this.addToQueue(value);
    }
    else if (type === 'album') {
      this.setState({
        selected: 'album',
        album: value
      })
      this.getAlbum(value);
    }
  }

  getArtist(item) {
    SpotifyWebApi.getArtistTopTracks(item.id, 'US')
      .then((response) => {
        // console.log(response.body.tracks);
        this.setState({
          results: response.body.tracks
        })
      })
  }

  getArtistAlbums(item) {
    SpotifyWebApi.getArtistAlbums(item.id)
      .then((response) => {
        // console.log("artist albums", response.body.items);
        this.setState({
          artistAlbums: response.body.items
        })
      })
  }

  getAlbum(item) {
    console.log("Album Item \n", item);
    SpotifyWebApi.getAlbumTracks(item.id)
      .then((response) => {
        // console.log(response.body.items);
        this.setState({
          albumTracks: response.body.items
        })
      })
  }

  renderItem = ({ item, index }) => (
    <ListItem
      containerStyle={{ backgroundColor: '#333' }}
      titleStyle={{ color: '#fff' }}
      avatarStyle={{ padding: 0 }}
      button onPress={() => {
        Haptics.selectionAsync()
        console.log('ADD TO QUEUE ITEM ', item)
        this.addToQueue(item)
        // PlaySong(item.id, this.state.devices)
        // console.log("RENDER ITEM", item)
      }}
      title={item.name}
      leftAvatar={{ source: { uri: item.album.images[0].url }, size: 30, rounded: false }}
      rightElement={<MaterialIcons name="playlist-add" size={25} color="#aaa" />}
      bottomDivider
    />
  )

  renderTopTracks(value) {
    // console.log("LOGGING THE DATA", item);
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', paddingBottom: 10 }}>Top Songs</Text>
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          style={{ flex: 1, width: '100%' }}
          data={this.state.results}
          keyExtractor={item => item.id}
          renderItem={this.renderItem}
          extraData={this.state}
        />
      </View>
    );
  }

  renderAlbumTracks(value) {
    // console.log("LOGGING THE DATA \n", value);
    // console.log("this.state.album \n", this.state.album);
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          style={{ flex: 1, width: '100%' }}
          data={this.state.albumTracks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ListItem
              containerStyle={{ backgroundColor: '#333' }}
              titleStyle={{ color: '#fff' }}
              avatarStyle={{ padding: 0 }}
              button onPress={() => {
                Haptics.selectionAsync()
                console.log('GET SONG ITEM ', item)
                SpotifyWebApi.getTrack(item.id)
                  .then((response) => {
                    this.addToQueue(response.body)
                  })
              }}
              title={item.name}
              rightElement={<MaterialIcons name="playlist-add" size={25} color="#aaa" />}
              bottomDivider
            />
          )}
          extraData={this.state}
        />
      </View >
    );
  }


  renderAlbums(value) {
    return (
      <View style={{ flex: 1, width: '100%', }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', paddingTop: 30, paddingBottom: 15 }}>Albums</Text>
        </View>
        <FlatList
          data={this.state.artistAlbums}
          renderItem={({ item }) => (
            <View style={{ flex: 1, flexDirection: 'column', margin: 1, padding: 10, alignItems: 'center', justifyContent: 'center' }} >
              <TouchableOpacity onPress={() => { this.suggestionSelected(item, item.type) }}>
                <Image style={styles.imageThumbnail} source={{ uri: item.images[0].url }} />
              </TouchableOpacity>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
            </View>
          )}
          numColumns={2}
          keyExtractor={item => item.id}
          extraData={this.state}
        />
      </View>
    );
  }


  render() {
    const { modalVisible } = this.state;
    if (this.state.selected == "artist") {
      return (
        <View style={{ flex: 1, width: '100%' }}>
          <View style={{ alignItems: 'center', paddingBottom: 10 }} >
            {this.props.itemSelected.images[0] ?
              <Image
                style={{ width: 150, height: 150 }}
                resizeMode='contain'
                source={{ uri: this.props.itemSelected.images[0].url }}
              />
              :
              <MaterialIcons
                name='error-outline'
              />
            }
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 25 }}> {this.props.itemSelected.name} </Text>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible !== ""}
              onRequestClose={() => {
                alert('Modal has been closed.');
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>{this.state.modalVisible}</Text>
                </View>
              </View>
            </Modal>
          </View>
          {this.renderTopTracks(this.props.itemSelected)}
          {this.renderAlbums(this.props.itemSelected)}
        </View >
      );
    }
    else {
      return (
        <View style={{ flex: 1, width: '100%' }}>
          <View style={{ alignItems: 'center', paddingBottom: 10 }} >
            {this.props.itemSelected.images[0] ?
              <Image
                style={{ width: 150, height: 150 }}
                resizeMode='contain'
                source={{ uri: this.props.itemSelected.images[0].url }}
              />
              :
              <MaterialIcons
                name='error-outline'
              />
            }
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 25 }}> {this.props.itemSelected.name} </Text>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                alert('Modal has been closed.');
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Added to Queue</Text>
                </View>
              </View>
            </Modal>
          </View>
          {this.renderAlbumTracks(this.props.itemSelected)}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 20
  },
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
  imageThumbnail: {
    height: 150,
    width: 150
  }
})
