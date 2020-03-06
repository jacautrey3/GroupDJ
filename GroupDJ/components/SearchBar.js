import React, { Component } from 'react';
import { TextInput, View, FlatList, StyleSheet } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import { SpotifyWebApi } from './Home.js'



export default function Bar() {
  const [searchSong, setSearchSong] = React.useState("");
  const [newSongs, setNewSongs] = React.useState([]);

  const songSearch = (searchSong) => {
    if(searchSong != null){
      setSearchSong(String(searchSong));
      console.log(searchSong);
        var type = ['artist'];
        var obj = '{ "limit" : "3"}';
        var options = JSON.parse(obj);
        SpotifyWebApi.search(searchSong, type, options)
        .then((response) => {
          console.log(response.body.artists)
          setNewSongs(response.body.artists.items)
        })
      }
  }

  const clearSearch = () => {
    setSearchSong('');
    setNewSongs([]);
  }

  const itemSelected = (item) => {
    console.log(item.name)
    clearSearch();
  }

  const renderItem = ({ item, index }) => (
    <ListItem
    containerStyle={{backgroundColor: '#333'}}
    titleStyle={{color: '#fff'}}
    button onPress={() => {itemSelected(item)}}
    title={item.name}
    leftAvatar={{ source: { uri: item.images[0].url } }}
    bottomDivider
    />
)

  return (
    <View style={styles.container}>
    <SearchBar
    value={searchSong}
    onChangeText={songSearch}

    placeholder="Search"
    round={true}
    inputContainerStyle={styles.textInput}
    containerStyle={{backgroundColor: '#000', borderWidth: 0}}
    />
    <FlatList style = {styles.autocompleteContainer}
    data={newSongs}
    keyExtractor={item => item.id}
    renderItem={renderItem}
    extraData={true}
    />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    paddingTop: 30
  },
  autocompleteContainer: {
    backgroundColor: '#000',
    marginLeft: 0,
    marginRight: 0
  },
  textInput:{
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
