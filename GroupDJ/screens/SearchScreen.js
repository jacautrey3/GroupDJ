import React from 'react';
import { View } from 'react-native';
import Bar from '../components/SearchBar.js'
import styles from '../style.js'

const SearchScreen = ({ }) => {
  return(
    <View style={{ flex: 1, display: 'flex', justifyContent: 'center', backgroundColor: '#000'}}>
      <Bar/>
    </View>
  );
}

export default SearchScreen;
