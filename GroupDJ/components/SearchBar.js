import React, { Component } from 'react';
import { TextInput, View, FlatList, StyleSheet, Text } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import { SpotifyWebApi } from './Home.js'
import SearchResults from './SearchResults.js'

export default function Bar() {
  const [searchSong, setSearchSong] = React.useState("");
  const [newSongs, setNewSongs] = React.useState([]);
  const [itemSelected, setItemSelected] = React.useState();
  const [showResults, setShowResults] = React.useState("");

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
        }, err => {
            console.log(err);
        })
      }
  }

  const clearSearch = () => {
    setSearchSong('');
    setNewSongs([]);
  }

  const handleSelection = (item) => {
    clearSearch();
    setItemSelected(item);
    setShowResults('True');
    console.log(showResults);
    console.log(itemSelected);
  }

  const renderResults = () => {
    if(itemSelected){
      return(
        <View>
          <Text style={{color: 'white', justifyContent: 'center'}}> {itemSelected.name} </Text>
          <SearchResults
            itemSelected = {itemSelected}
          />
        </View>
      );
    }
    else{
      return(
        <Text style={{color: 'white'}}>  </Text>
      );
    }
  }

  const renderItem = ({ item, index }) => (
    <ListItem
    containerStyle={{backgroundColor: '#333'}}
    titleStyle={{color: '#fff'}}
    button onPress={() => {handleSelection(item)}}
    title={item.name}
    leftAvatar={{ source: { uri: item.images[0].url } }}
    bottomDivider
    />
)

  return (
    <View style={styles.container}>
    <View style={{zIndex: 3}}>
    <SearchBar
    value={searchSong}
    onChangeText={songSearch}
    onCancel={clearSearch}
    placeholder="Search"
    round={true}
    inputContainerStyle={styles.textInput}
    containerStyle={{backgroundColor: '#000', borderWidth: 0}}
    />
    <FlatList style = {styles.autocompleteContainer}
    data={newSongs}
    keyExtractor={item => item.id}
    renderItem={renderItem}
    extraData={this.state}
    />
    </View>
    <View style={{position: 'relative', top:0, right:0, left:0, zIndex: 2}}>
      {renderResults()}
    </View>
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
    zIndex: 2,
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
