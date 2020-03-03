import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
var firebase = require("firebase");
import { SpotifyWebApi } from './Home.js'

export default class Search extends Component {
  constructor() {
    super();
  this.state = {
    access_token: 'not changed'
  };

}


  render() {
    return(
      <View style={styles.form}>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#000',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  container: {
    backgroundColor: '#000',
  },
  button: {
    backgroundColor: '#2FD566',
    padding: 20
  },
  buttonText: {
    color: '#000',
    fontSize: 20
  },
  userInfo: {
    height: 250,
    width: 200,
    alignItems: 'center',
  },
  userInfoText: {
    color: '#fff',
    fontSize: 18
  },
  errorText: {
    color: '#fff',
    fontSize: 18
  },
  profileImage: {
    height: 64,
    width: 64,
    marginBottom: 32
  }
});
