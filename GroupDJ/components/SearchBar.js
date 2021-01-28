import React, { Component } from 'react';
import { TextInput, View, FlatList, StyleSheet, Text, Image, Platform, ScrollView } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import { SpotifyWebApi } from './SpotifyAuth.js'
import SearchResults from './SearchResults.js'
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
var firebase = require("firebase");

export default function Bar() {
  const [searchSong, setSearchSong] = React.useState("");
  const [newSongs, setNewSongs] = React.useState([]);
  const [itemSelected, setItemSelected] = React.useState();
  // const [showResults, setShowResults] = React.useState("");

  const addToQueue = (item) => {
    var roomKey = global.roomKey;
    var repeat = false;
    var ref = firebase.database().ref('/Rooms/' + roomKey + "/queue")
    ref.once('value', function (snapshot) {
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
    }
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
          suggestions = response.body.artists.items;
          suggestions = suggestions.concat(response.body.tracks.items);
          suggestions = suggestions.concat(response.body.albums.items);
          suggestions = suggestions.concat(response.body.playlists.items);
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
    if (item.images) {
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
            rightElement=<MaterialCommunityIcons name="artist" size={25} color="#888" />
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
      leftElement=<MaterialIcons name='error-outline' size={30} />
          rightElement = <MaterialCommunityIcons name="artist" size={25} color="#888" />
  bottomDivider
    />
        );
}
    }
    else
{
  if (item.album.images[0].url) {
    return (
      <ListItem
        containerStyle={{ backgroundColor: '#333' }}
        titleStyle={{ color: '#fff' }}
        subtitleStyle={{ color: '#aaa' }}
        button onPress={() => {
          Haptics.selectionAsync()
          clearSearch()
          addToQueue(item)
        }}
        title={item.name}
        subtitle={item.artists[0].name}
        leftAvatar={{ source: { uri: item.album.images[0].url }, rounded: false }}
        rightElement=<MaterialIcons name="music-note" size={25} color="#888" />
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
          clearSearch()
          addToQueue(item)
        }}
        title={item.name}
        leftElement=<MaterialIcons name='error-outline' />
          rightElement = <MaterialIcons name="music-note" size={25} color="#888" />
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
    </View>
  </View>
);
}

const marginTop = Platform.OS === 'ios' ? 20 : 0;

const styles = StyleSheet.create({
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
