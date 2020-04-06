import React, { Component } from 'react';
import { Button, TextInput, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
var firebase = require("firebase");
import { SpotifyWebApi } from './Home.js'

export default class JoinRoom extends Component {
  constructor() {
    super();
  this.state = {
    access_token: 'not changed'
  };

}

  GetDatabaseToken(data) {
    firebase.database().ref('/Rooms').once('value', function(snapshot) {
      snapshot.forEach(childSnap => {
        if(childSnap.val().name === data.name)
        {
          if(childSnap.val().password === data.password)
          {
            console.log(childSnap.val().token);
            global.roomKey = childSnap.key
            console.log(childSnap.key)
            SpotifyWebApi.setAccessToken(childSnap.val().token)

            this.props.navigation.navigate("TabScreen");
          }
          else
          {
            //wrong password
          }
        }
        else
        {
          //room does not exist
        }
      })
    }.bind(this))
  }

  render() {
    return(
      <KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={styles.form}>
        <Formik
            initialValues={{ name: '', password: '' }}
            onSubmit={values => this.GetDatabaseToken(values)}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={styles.container}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  autoFocus={true}
                />
                <TextInput
                  style={styles.textInput}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                <Button
                color='#fff'
                onPress={handleSubmit}
                title="Submit" />
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
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
  textInput:{
     alignItems: 'center',
      backgroundColor: '#333',
      borderRadius: 10,
      color: '#86939e',
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
