import React from 'react';
import { View } from 'react-native';
import Search from '../components/Search.js'

const SearchScreen = ({ }) => {
  return(
    <View style={{ flex: 1, display: 'flex', justifyContent: 'center'}}>
      <Search/>
    </View>
  );
}

export default SearchScreen;
