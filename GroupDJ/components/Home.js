import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements';
import { AuthSession } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import Spotify from 'react-native-spotify-web-api';
import Secret from '../secret.js'
import styles from '../style.js'

export const SpotifyWebApi = new Spotify({
  clientId: '7cae269ba3be4c65b1cc891d0adae959',
  clientSecret: '8c74036424b1435b8094b8348f1ea769',
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
    // console.log('The redirectURI is ' + SpotifyWebApi.getRedirectURI());
    // console.log('The client ID is ' + SpotifyWebApi.getClientId());
    // console.log('The client secret is ' + SpotifyWebApi.getClientSecret());
    let results = await AuthSession.startAsync({
      authUrl: `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=user-read-email%20user-read-private%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private%20user-library-read%20user-read-currently-playing%20streaming%20playlist-read-collaborative%20user-top-read%20app-remote-control&show_dialog=false&state=some-state-of-my-choice`
    });
    console.log(results);
    this.setState({
      token: results.params.access_token,
    });
    SpotifyWebApi.setAccessToken(results.params.access_token)
    code = results.params.access_token;
    // SpotifyWebApi.authorizationCodeGrant(results.params.code).then(
    //   function(data) {
    //     console.log('The token expires in ' + data.body['expires_in']);
    //     console.log('The access token is ' + data.body['access_token']);
    //     console.log('The refresh token is ' + data.body['refresh_token']);
    //
    //     // Set the access token on the API object to use it in later calls
    //     SpotifyWebApi.setAccessToken(data.body['access_token']);
    //     SpotifyWebApi.setRefreshToken(data.body['refresh_token']);
    //   },
    //   function(err) {
    //     console.log('Something went wrong! authorization error', err);
    //   }
    // );
    if (results.type !== 'success') {
      console.log(results.type);
      this.setState({ didError: true });
    } else {
      console.log("success\n\n\n");
      SpotifyWebApi.getMe().then(
        userInfo => {
          console.log(userInfo);
          this.setState({ userInfo: userInfo.body })
          return userInfo;
        },
        function (err) {
          console.error(err, "\n\n\n");
        }
      )
    }
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
    {
      return this.state.userInfo ? (
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
        )
    }
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
