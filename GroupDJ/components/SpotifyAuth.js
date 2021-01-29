import * as React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import styles from '../style.js'
import Spotify from 'react-native-spotify-web-api';
var firebase = require("firebase");

export const SpotifyWebApi = new Spotify({
    clientId: '7cae269ba3be4c65b1cc891d0adae959',
    clientSecret: '8c74036424b1435b8094b8348f1ea769',
    redirectUri: 'https://auth.expo.io/@jautrey/groupdj'
});

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function App({ navigation, switchAccount }) {
    const [userInfo, setUserInfo] = React.useState();
    const [token, setToken] = React.useState("");
    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Token,
            clientId: '7cae269ba3be4c65b1cc891d0adae959',
            scopes: ['user-read-email', 'playlist-modify-public'],
            // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            // For usage in managed apps using the proxy
            redirectUri: makeRedirectUri({
                // For usage in bare and standalone
                native: 'groupdj://callback',
            }),
        },
        discovery
    );

    const setNewToken = () => {
        console.log('SET NEW TOKEN')
        var roomKey = global.roomKey;
        var updates = {}
        updates['/Rooms/' + roomKey + '/token/'] = token
        firebase.database().ref().update(updates)
        navigation.navigate("TabScreen")
    }

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { access_token } = response.params;
            console.log('ACCESS TOKEN ', response.params.access_token);
            //put token in state
            setToken(response.params.access_token)
            // this.setState({
            //     token: response.params.access_token,
            // });
            SpotifyWebApi.setAccessToken(response.params.access_token)
            code = response.params.access_token;
            console.log("success\n\n\n");
            SpotifyWebApi.getMe().then(
                userInfo => {
                    console.log('USER INFO ', userInfo);
                    setUserInfo(userInfo.body)
                    return userInfo;
                },
                function (err) {
                    console.error(err, "\n\n\n");
                }
            )

        }
    }, [response]);

    const displayResults = () => {
        return (userInfo) ? (
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
                        onPress={() => {
                            switchAccount ? setNewToken() : navigation.navigate("CreateRoomScreen")
                        }}
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
                        onPress={() => {
                            promptAsync();
                        }}
                    >
                        <Text style={styles.buttonText}>
                            Login with Spotify
                </Text>
                    </TouchableOpacity>
                </View >
            )
    };

    const displayError = () => {
        console.log('DISPLAY ERROR ', response)
        return (
            <View style={styles.userInfo}>
                <Text style={styles.errorText}>
                    There was an error, please try again.
                    {response}
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {(response && response.error) ?
                displayError() :
                displayResults()
            }
        </View>
    );
}