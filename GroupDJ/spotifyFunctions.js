import { SpotifyWebApi } from './components/SpotifyAuth.js'
var firebase = require("firebase");

export const SwitchFunc = function SwitchFunc() {
  SpotifyWebApi.getMyCurrentPlaybackState({})
    .then(data => {
      console.log("Now Playing: ", data.body.is_playing);
      return data.body.is_playing
    }, err => {
      console.log('play function', err);
    })
    .then(state => {
      if (state === true) {
        console.log(state, 'pause song')
        this.setState({ playState: 'controller-play' })
        return SpotifyWebApi.pause();
      }
      else {
        console.log(state, 'play song')
        this.setState({ playState: 'controller-paus' })
        return SpotifyWebApi.play();
      }
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
    function (data) {
      console.log(data);
    },
    function (err) {
      console.error(err);
    }
  );
  console.log(this.state.token);
}

export const PlaySong = function PlaySong(song, devices) {
  console.log(devices);
  // let activeIndex = -1;
  // for(let i = 0; i < devices.length; i++)
  // {
  //   console.log("index", i)
  //   if(devices[i].is_active === true)
  //   {
  //     console.log("activeIndex", i)
  //     activeIndex = i;
  //   }
  // }
  var device = devices[0].id;
  var isActive = false;
  for (i = 0; i < devices.length; i++) {
    if (devices[i].is_active === true) {
      device = devices[i].id;
      console.log("active device ", devices[i].id)
      isActive = true;
    }
  }
  if (!isActive) {
    setActiveDevice(device);
  }
  var options = '{"device_id":"' + device + '", "uris":["spotify:track:' + song + '"]}'
  var obj = JSON.parse(options);
  SpotifyWebApi.play(obj)
    .then((response) => {
      console.log(response);
    },
      function (err) {
        console.log("play error", err);
      })
}

export const NextSong = function NextSong() {
  var roomKey = global.roomKey;
  var nextId;
  var ref = firebase.database().ref('/Rooms/' + roomKey + "/queue")
  //get first song in queue
  ref.orderByKey().limitToFirst(1).once('value', function (snapshot) {
    snapshot.forEach(function (childSnap) {
      console.log("next song", childSnap.val().id)
      nextId = childSnap.val().id;
      var devices = [];
      //get device to play song on
      SpotifyWebApi.getMyDevices()
        .then(response => {
          devices = response.body.devices;
          //play first song in queue
          PlaySong(nextId, response.body.devices);
          //remove current song
          firebase.database().ref('/Rooms/' + roomKey + "/queue/" + childSnap.key).remove();
        }, err => {
          console.log("getmydevice error", err);
        }
        );
    })
  })
}

export const GetTrackInfo = function (trackID) {
  SpotifyWebApi.getTrack(trackID)
    .then(response => {
      // console.log("response from getrackinfo ",response.body)
      this.setState({
        queueData: response.body
      })
    }, err => {
      console.log("GETTRACK ERROR", err)
    })
}

const setActiveDevice = function setActiveDevice(id) {
  //convert var id to JSON array
  var deviceIds = [id];
  var options = { "deviceIds": [id] };
  // console.log(options);
  //call to API
  SpotifyWebApi.transferMyPlayback(options)
    .then((response) => {
      // console.log(response);
    })

}

export const findDevices = function findDevices() {
  SpotifyWebApi.getMyDevices()
    .then(response => {
      console.log(response);
      this.setState({
        devices: response.body.devices
      })
      return response.body.devices;
    }, err => {
      console.log("getmydevice error", err);
    }
    );
}

// export const GetSong = function GetSong(id) {
//   SpotifyWebApi.getTrack(id)
//     .then((response) => {
//       console.log('GET SONG RESPONSE')
//       return response;
//     })
// }

export const GetSong = function GetSong(id) {
  SpotifyWebApi.getTrack(id)
    .then((response) => {
      // console.log("Song \n", response);
      var item = response.body;
      var roomKey = global.roomKey;
      var repeat = false;
      var ref = firebase.database().ref('/Rooms/' + roomKey + "/queue")
      ref.once('value', function (snapshot) {
        snapshot.forEach(function (childSnap) {
          //if song already in queue
          if (childSnap.val().id == item.id) {
            console.log("already in Queue\n")
            repeat = true;
          }
        })
      })
      if (!repeat) {
        firebase.database().ref('/Rooms/' + roomKey + "/queue").push(item);
      }
    },
      function (err) {
        console.log("Get Track error", err);
      })
}
