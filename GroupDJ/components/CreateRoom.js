import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
var firebase = require("firebase");
import { SpotifyWebApi } from './SpotifyAuth.js'

export default class CreateRoom extends Component {
  constructor() {
    super();
    this.state = {
      access_token: 'not changed'
    };

  }

  addRoom(data) {
    var token = SpotifyWebApi.getAccessToken();
    const key = firebase.database().ref('/Rooms').push().key
    firebase.database().ref('/Rooms').child(key).set({ name: data.name, password: data.password, token: token, queue: [] });
    this.props.navigation.navigate("TabScreen")
    global.roomKey = key
    global.owner = true
  }

  render() {
    return (
      <View style={styles.form}>
        <KeyboardAvoidingView
          behavior={Platform.Os == "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>
          <Formik
            initialValues={{ name: '', password: '' }}
            onSubmit={values => this.addRoom(values)}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={styles.container}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  autoFocus={true}
                  placeholder="Room Name"
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={styles.textInput}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  placeholder="Password"
                  placeholderTextColor="#666"
                />
                <Button
                  color='#fff'
                  onPress={handleSubmit}
                  title="Submit" />
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    backgroundColor: '#000',
    flex: 1,
  },
  textInput: {
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    color: '#aaa',
    fontSize: 20,
    flexDirection: 'row',
    height: 43,
    margin: 8,
    marginVertical: 10,
    paddingHorizontal: 10
  },
  button: {
    backgroundColor: '#fff',
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
