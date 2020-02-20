import React, { Component } from 'react';
import { Button, TextInput, View } from 'react-native';
import { Formik } from 'formik';
var firebase = require("firebase");

export default class CreateRoom extends Component {
  constructor() {
    super();
  this.state = {

  };
}

  addRoom(data) {
    var key = firebase.database().ref('/Rooms').push().key
    firebase.database().ref('/Rooms').child(key).set({ name: data.name, password: data.password});
    this.props.navigation.navigate("RoomOwnerScreen")
  }

  render() {
    return(
      <Formik
          initialValues={{ name: 'name', password: 'password' }}
          onSubmit={values => this.addRoom(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={handleChange('')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={handleChange('')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <Button onPress={handleSubmit} title="Submit" />
            </View>
          )}
        </Formik>
    );
  }
}
