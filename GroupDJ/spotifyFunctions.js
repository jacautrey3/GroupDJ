import { SpotifyWebApi } from './components/Home.js'

export const SwitchFunc = function SwitchFunc() {
  SpotifyWebApi.getMyCurrentPlaybackState({})
.then(data => {
    console.log("Now Playing: ", data.body.is_playing);
    return data.body.is_playing
}, err => {
    console.log('play function', err);
})
.then(state => {
  if(state === true)
  {console.log(state, 'pause song')
  this.setState({ playState: 'Play'})
  return SpotifyWebApi.pause();}
  else
  {console.log(state, 'play song')
  this.setState({ playState: 'Pause'})
  return SpotifyWebApi.play();}
})
.then(data => {
  console.log(data);
})
.catch(error => {
  console.error(error);
});

//   SpotifyWebApi.getMySavedTracks({
//   limit : 1,
//   offset: 5
// })
// .then(function(data) {
//   console.log('Done!', data);
// }, function(err) {
//   console.log('get my tracks error', err);
// });
}

export const GetInfo = function GetInfo() {
  SpotifyWebApi.getMe().then(
    function(data) {
      console.log(data);
    },
    function(err) {
      console.error(err);
    }
  );
  console.log(this.state.token);
}

export const PlaySong = function PlaySong(song) {
  console.log(song);
  var device_id = findDevices();
  var options = '{"device_id":"'+device_id+'", "uris":["spotify:track:' + song +  '"]}'
  var obj = JSON.parse(options);
  SpotifyWebApi.play(obj)
  .then((response) => {
    console.log(response);
  })
  // this.songTimer = setInterval(() => {
  //   this.nextSong()}, 3000);
}

const findDevices = function findDevices() {
  SpotifyWebApi.getMyDevices()
  .then((response) => {
    return response.body.devices[0].id;
  })
}
