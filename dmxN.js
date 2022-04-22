var dmxlib = require('dmxnet');
var dmxnet = new dmxlib.dmxnet();

var webSocket = new _WebsocketClient(`wss://tmaps.xyz/`)

var receiverOptions = {
  subnet: 0, //Destination subnet, default 0
  universe: 1, //Destination universe, default 0
  net: 0, //Destination net, default 0
}

var receiver = dmxnet.newReceiver(receiverOptions);


// What channels to listen to
var cueListChannel = 0;
var cueChannel = 1;
var lastCue;
var lastList;

// var lastData = [];
// var channels = [0,1]

receiver.on('data', function (data) {
  // var interestingData = []
  // channels.forEach(channel => {
  //   interestingData.push(data[channel])
  // })

  // if (JSON.stringify(lastData) == JSON.stringify(interestingData)) {
  //   // We only want to do something if we received new data on the channels we are looking at
  //   return;
  // }
  // else {
  //   console.log(interestingData)
  //   // console.log("Channel: " + `${i + 1}` + " Value: " + data[i])
  //   lastData = interestingData;
  // }

  if (data[cueListChannel] === lastList && data[cueChannel] === lastCue){
    // We only want to do something if we received new data on the channels we are looking at
    return;
  } else {
    console.log("CueList: " + data[cueListChannel])
    console.log("Cue: " + data[cueChannel])
    console.log(" ")
    lastCue = data[cueChannel]
    lastList = data[cueListChannel]

    //TODO: Send id of cue to play
  }
});