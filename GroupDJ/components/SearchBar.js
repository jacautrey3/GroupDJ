import React, { Component } from 'react';
import { Modal, TextInput, View, FlatList, StyleSheet, Text, Image, Platform, ScrollView } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import { SpotifyWebApi } from './SpotifyAuth.js'
import SearchResults from './SearchResults.js'
// import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
var firebase = require("firebase");

export default function Bar() {
  const [searchSong, setSearchSong] = React.useState("");
  const [newSongs, setNewSongs] = React.useState([]);
  const [itemSelected, setItemSelected] = React.useState();
  const [modalVisible, setModalVisible] = React.useState("");
  // const [showResults, setShowResults] = React.useState("");

  const addToQueue = async (item) => {
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
      setModalVisible("Added to Queue")
    }
    else {
      setModalVisible("Already Added")
    }
    setTimeout(() => {
      setModalVisible("")
    }, 1000);
  }

  const songSearch = (searchSong) => {
    if (searchSong) {
      setSearchSong(String(searchSong));
      // console.log(searchSong);
      var type = ['artist', 'track', 'album', 'playlist'];
      var obj = '{ "limit" : "3"}';
      var options = JSON.parse(obj);
      SpotifyWebApi.search(searchSong, type, options)
        .then((response) => {
          // console.log("new response", response.body.tracks.items)
          artists = [...response.body.artists.items]
          artists.forEach(function (item) {
            item.searchType = 'artist';
          })
          tracks = [...response.body.tracks.items]
          tracks.forEach(function (item) {
            item.searchType = 'track';
          })
          albums = [...response.body.albums.items]
          albums.forEach(function (item) {
            item.searchType = 'album';
          })
          playlists = [...response.body.playlists.items]
          playlists.forEach(function (item) {
            item.searchType = 'playlist';
          })
          suggestions = [...tracks, ...artists, ...albums, ...playlists]
          setNewSongs(suggestions)
        }, err => {
          console.log(err);
        })
    }
    else {
      // console.log('empty search')
      clearSearch()
    }
  }

  const clearSearch = () => {
    setSearchSong('');
    setNewSongs([]);
  }

  const handleSelection = (item) => {
    clearSearch();
    setItemSelected(item);
    // setShowResults('True');
    // console.log(showResults);
    // console.log("item selected",itemSelected);
  }

  const renderModal = () => {
    if (modalVisible !== "") {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible !== ""}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modalVisible}</Text>
            </View>
          </View>
        </Modal>
      )
    }
  }

  const renderResults = () => {
    if (itemSelected) {
      return (
        <ScrollView style={{ flex: 1 }}>
          <SearchResults
            itemSelected={itemSelected}
          />
        </ScrollView>
      );
    }
    else {
      return (
        <Text style={{ color: 'white' }}>  </Text>
      );
    }
  }

  const renderItem = ({ item, index }) => {
    //artist
    if (item.searchType == 'artist') {
      if (item.images[0]) {
        return (
          <ListItem
            containerStyle={{ backgroundColor: '#333' }}
            titleStyle={{ color: '#fff' }}
            button onPress={() => {
              Haptics.selectionAsync()
              handleSelection(item)
            }}
            title={item.name}
            leftAvatar={{ source: { uri: item.images[0].url } }}
            rightElement={<MaterialIcons name="person" size={25} color="#888" />}
            subtitle={'Artist'}
            subtitleStyle={{ color: '#aaa' }}
            bottomDivider
          />
        );
      }
      //artist without image
      else {
        return (
          <ListItem
            containerStyle={{ backgroundColor: '#333' }}
            titleStyle={{ color: '#fff' }}
            button onPress={() => {
              Haptics.selectionAsync()
              handleSelection(item)
            }}
            title={item.name}
            leftElement={<MaterialIcons name='error-outline' size={30} />}
            rightElement={<MaterialIcons name="person" size={25} color="#888" />}
            subtitle={'Artist'}
            subtitleStyle={{ color: '#aaa' }}
            bottomDivider
          />
        );
      }
    }
    //album
    if (item.searchType == 'album') {
      if (item.images[0]) {
        return (
          <ListItem
            containerStyle={{ backgroundColor: '#333' }}
            titleStyle={{ color: '#fff' }}
            button onPress={() => {
              Haptics.selectionAsync()
              handleSelection(item)
            }}
            title={item.name}
            leftAvatar={{ source: { uri: item.images[0].url }, rounded: false }}
            rightElement={<MaterialIcons name="album" size={25} color="#888" />}
            subtitle={'Album'}
            subtitleStyle={{ color: '#aaa' }}
            bottomDivider
          />
        );
      }
      //album without artwork
      else {
        return (
          <ListItem
            containerStyle={{ backgroundColor: '#333' }}
            titleStyle={{ color: '#fff' }}
            button onPress={() => {
              Haptics.selectionAsync()
              handleSelection(item)
            }}
            title={item.name}
            leftElement={<MaterialIcons name='error-outline' size={30} />}
            rightElement={<MaterialIcons name="album" size={25} color="#888" />}
            subtitle={'Album'}
            subtitleStyle={{ color: '#aaa' }}
            bottomDivider
          />
        );
      }
    }
    //playlist
    if (item.searchType == 'playlist') {
      if (item.images[0]) {
        return (
          <ListItem
            containerStyle={{ backgroundColor: '#333' }}
            titleStyle={{ color: '#fff' }}
            button onPress={() => {
              Haptics.selectionAsync()
              handleSelection(item)
            }}
            title={item.name}
            leftAvatar={{ source: { uri: item.images[0].url }, rounded: false }}
            rightElement={<Ionicons name="albums" size={25} color="#888" />}
            subtitle={'Playlist'}
            subtitleStyle={{ color: '#aaa' }}
            bottomDivider
          />
        );
      }
      else {
        return (
          <ListItem
            containerStyle={{ backgroundColor: '#333' }}
            titleStyle={{ color: '#fff' }}
            button onPress={() => {
              Haptics.selectionAsync()
              handleSelection(item)
            }}
            title={item.name}
            leftElement={<MaterialIcons name='error-outline' size={30} />}
            rightElement={<Ionicons name="albums" size={25} color="#888" />}
            subtitle={'Playlist'}
            subtitleStyle={{ color: '#aaa' }}
            bottomDivider
          />
        );
      }
    }
    //song
    if (item.searchType == "track") {
      if (item.album.images[0].url) {
        return (
          <ListItem
            containerStyle={{ backgroundColor: '#333' }}
            titleStyle={{ color: '#fff' }}
            subtitleStyle={{ color: '#aaa' }}
            button onPress={() => {
              Haptics.selectionAsync()
              // clearSearch()
              addToQueue(item)
            }}
            title={item.name}
            subtitle={`Song • ${item.artists[0].name}`}
            leftAvatar={{ source: { uri: item.album.images[0].url }, rounded: false }}
            rightElement={<MaterialIcons name="music-note" size={25} color="#888" />}
            bottomDivider
          />
        );
      }
      //song without album artwork
      else {
        return (
          <ListItem
            containerStyle={{ backgroundColor: '#333' }}
            titleStyle={{ color: '#fff' }}
            subtitleStyle={{ color: '#aaa' }}
            button onPress={() => {
              Haptics.selectionAsync()
              // clearSearch()
              addToQueue(item)
            }}
            title={item.name}
            subtitle={`Song • ${item.artists[0].name}`}
            leftElement={<MaterialIcons name='error-outline' />}
            rightElement={<MaterialIcons name="music-note" size={25} color="#888" />}
            bottomDivider
          />
        );
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ zIndex: 3 }}>
        <SearchBar
          value={searchSong}
          onChangeText={songSearch}
          onClear={clearSearch}
          placeholder="Search"
          round={true}
          inputContainerStyle={styles.textInput}
          containerStyle={{ backgroundColor: '#000', borderWidth: 0 }}
        />
        <FlatList style={styles.autocompleteContainer}
          data={newSongs}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          extraData={this.state}
        />
      </View>
      <View style={{ flex: 1, position: 'relative', top: 0, right: 0, left: 0, zIndex: 2 }}>
        {renderResults()}
        {renderModal()}
      </View>
    </View>
  );
}

const marginTop = Platform.OS === 'ios' ? 20 : 0;

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
    flex: 1,
    paddingTop: marginTop
  },
  autocompleteContainer: {
    zIndex: 2,
    backgroundColor: '#000',
    marginLeft: 0,
    marginRight: 0
  },
  textInput: {
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    flexDirection: 'row',
    height: 43,
    margin: 8,
    marginVertical: 10,
    paddingHorizontal: 10
  },
})
