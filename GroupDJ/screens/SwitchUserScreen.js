import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Header } from 'react-native-elements';
import { AuthSession } from 'expo';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { SpotifyWebApi } from '../components/SpotifyAuth.js'
import clientSecret from '../secret.js'
import styles from '../style.js'
var firebase = require("firebase");

// export const SpotifyWebApi = new Spotify({
//   clientId: '7cae269ba3be4c65b1cc891d0adae959',
//   clientSecret: {clientSecret},
//   redirectUri: 'https://auth.expo.io/@jautrey/groupdj'
// });

// var scopes = ['user-read-private', 'user-read-email'],
//   redirectUri = 'https://auth.expo.io/@jautrey/groupdj',
//   clientId = '5fe01282e44241328a84e7c5cc169165',
//   state = 'some-state-of-my-choice';
// var authorizeURL = SpotifyWebApi.createAuthorizeURL(scopes, state);


const CLIENT_ID = '7cae269ba3be4c65b1cc891d0adae959';

const SwitchUserScreen = ({ navigation }) => {
  const [didError, setdidError] = React.useState(false);
  const [token, settoken] = React.useState("");
  const [userInfo, setuserInfo] = React.useState();

  const handleSpotifyLogin = async () => {
    let redirectUrl = AuthSession.getRedirectUrl();
    let results = await AuthSession.startAsync({
      authUrl: `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=user-read-email%20user-read-private%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private%20user-library-read%20user-read-currently-playing%20streaming%20playlist-read-collaborative%20user-top-read%20app-remote-control&response_type=token&show_dialog=false&state=some-state-of-my-choice`
    });
    console.log(results);
    //put token in state
    settoken(results.params.access_token)
    // this.setState({
    //   token: results.params.access_token,
    // });
    SpotifyWebApi.setAccessToken(results.params.access_token)
    code = results.params.access_token;
    if (results.type !== 'success') {
      console.log(results.type);
      setdidError(true)
      // this.setState({ didError: true });
    } else {
      console.log("success\n\n\n");
      SpotifyWebApi.getMe().then(
        userInfo => {
          console.log(userInfo);
          setuserInfo(userInfo.body)
          // this.setState({userInfo: userInfo.body})
          return userInfo;
        },
        function (err) {
          console.error(err, "\n\n\n");
        }
      )
    }
  };

  const setNewToken = () => {
    var roomKey = global.roomKey;
    var updates = {}
    updates['/Rooms/' + roomKey + '/token/'] = token
    firebase.database().ref().update(updates)
    navigation.navigate("TabScreen")
  }

  const displayError = () => {
    return (
      <View style={styles.userInfo}>
        <Text style={styles.errorText}>
          There was an error, please try again.
        </Text>
      </View>
    );
  }

  const displayResults = () => {
    {
      return userInfo ? (
        <View style={styles.userInfo}>
          <View>
            <Text style={styles.userInfoText}>
              Signed in As

          </Text>
            <Text style={styles.userInfoText}>
              Username:
          </Text>
            <Text style={styles.userInfoText}>
              {userInfo.id}
            </Text>
            <Text style={styles.userInfoText}>
              Email:
          </Text>
            <Text style={styles.userInfoText}>
              {userInfo.email}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={setNewToken}
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
              onPress={handleSpotifyLogin}
            >
              <Text style={styles.buttonText}>
                Login with Spotify
        </Text>
            </TouchableOpacity>
          </View>
        )
    }
  }


  return (
    <View style={{ flex: 1 }}>
      <Header
        containerStyle={{ borderBottomWidth: 0 }}
        backgroundColor="#000"
        centerComponent={{ text: 'Switch Account', style: { color: 'white', fontSize: 20, fontWeight: 'bold' } }}
        leftComponent={<MaterialIcons name="arrow-back" size={30} color="#fff" onPress={() => navigation.navigate("TabScreen")} />}
      />
      <View style={styles.container}>
        {didError ?
          displayError() :
          displayResults()
        }
      </View>
    </View>
  );
}

export default SwitchUserScreen;
