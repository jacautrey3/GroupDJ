import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements';
import { AuthSession } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import Spotify from 'react-native-spotify-web-api';
import clientSecret from '../secret.js'

export const SpotifyWebApi = new Spotify({
  clientId: '7cae269ba3be4c65b1cc891d0adae959',
  clientSecret: {clientSecret},
  redirectUri: 'https://auth.expo.io/@jautrey/groupdj'
});

// var scopes = ['user-read-private', 'user-read-email'],
//   redirectUri = 'https://auth.expo.io/@jautrey/groupdj',
//   clientId = '5fe01282e44241328a84e7c5cc169165',
//   state = 'some-state-of-my-choice';
// var authorizeURL = SpotifyWebApi.createAuthorizeURL(scopes, state);


const CLIENT_ID = '7cae269ba3be4c65b1cc891d0adae959';

export default class Home extends Component {
  constructor() {
    super();
  this.state = {
    userInfo: false,
    didError: false,
    token: 'token',
    playState: 'Play',
  };
}


  handleSpotifyLogin = async () => {
    let redirectUrl = AuthSession.getRedirectUrl();
    let results = await AuthSession.startAsync({
      authUrl: `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=user-read-email%20user-read-private%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private%20user-library-read%20user-read-currently-playing%20streaming%20playlist-read-collaborative%20user-top-read%20app-remote-control&response_type=token&show_dialog=false&state=some-state-of-my-choice`
    });
    console.log(results);
    this.setState({
      token: results.params.access_token,
    });
    SpotifyWebApi.setAccessToken(results.params.access_token)
    code = results.params.access_token;

    if (results.type !== 'success') {
      console.log(results.type);
      this.setState({ didError: true });
    } else {
      console.log("success\n\n\n");
      SpotifyWebApi.getMe().then(
        userInfo => {
          console.log(userInfo);
          this.setState({userInfo: userInfo.body})
          return userInfo;
        },
        function(err) {
          console.error(err,"\n\n\n");
        }
      )}
  };

  displayError = () => {
    return (
      <View style={styles.userInfo}>
        <Text style={styles.errorText}>
          There was an error, please try again.
        </Text>
      </View>
    );
  }

  displayResults = () => {
    { return this.state.userInfo ? (
      <View style={styles.userInfo}>
        <View>
          <Text style={styles.userInfoText}>
            Signed in As

          </Text>
          <Text style={styles.userInfoText}>
            Username:
          </Text>
          <Text style={styles.userInfoText}>
            {this.state.userInfo.id}
          </Text>
          <Text style={styles.userInfoText}>
            Email:
          </Text>
          <Text style={styles.userInfoText}>
            {this.state.userInfo.email}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this.props.navigation.navigate("CreateRoomScreen")}
          >
          <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={styles.userInfo}>
      <FontAwesome
        name="spotify"
        color="#2FD566"
        size={128}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={this.handleSpotifyLogin}
        disabled={this.state.userInfo ? true : false}
      >
        <Text style={styles.buttonText}>
          Login with Spotify
        </Text>
      </TouchableOpacity>
      </View>
    )}
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.didError ?
          this.displayError() :
          this.displayResults()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
