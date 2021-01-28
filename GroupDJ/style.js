import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  PlayerContainer: {
    flexDirection: 'column',
    backgroundColor: '#000',
    height: 400,
    alignItems: 'center',
    paddingTop: 20,
    width: '100%'
  },
  PlayerButtons: {
    flexDirection: 'row',
    backgroundColor: '#000',
    width: '100%',
    height: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: '10%'
  },
  PlayButton: {
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    borderRadius: 40
  },
  button: {
    backgroundColor: '#2FD566',
    padding: 20,
    borderRadius: 15
  },
  buttonText: {
    color: '#000',
    fontSize: 20
  },
  userInfo: {
    height: 250,
    width: '100%',
    alignItems: 'center',
  },
  userInfoText: {
    color: '#fff',
    fontSize: 18
  },
  songText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 5,
    paddingTop: 20
  },
  artistText: {
    color: '#ddd',
    fontSize: 20,
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
