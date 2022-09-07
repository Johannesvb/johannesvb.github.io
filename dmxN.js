'use strict'

const dmxlib = require('dmxnet');
const dmxnet = new dmxlib.dmxnet();
// dmxnet.logger.level = "debug"
const { Timer } = require('./Timer');
const { sendPacketToServer } = require('./wsclient.js');



var receiverOptions = {
  subnet: 0, //Destination subnet, default 0
  universe: 0, //Destination universe, default 0
  net: 0, //Destination net, default 0
}

var receiver = dmxnet.newReceiver(receiverOptions);

// What channels to listen to
var cuelistChannel = 4;
var cueChannel = 5;
var lastCue;
var lastList;

var lastMessage = Date.now();
receiver.on('data', function (data) {
  let dataIsNotNew = data[cuelistChannel] === lastList && data[cueChannel] === lastCue;
  if (dataIsNotNew) return;
  // let dataIsZero = data[cueListChannel] === 0 || data[cueChannel] === 0;
  // if(dataIsZero) return;

  // Debugging
  // console.clear()
  // console.log(data)

  // Record time between messages
  let timeSinceLastMessage = Date.now() - lastMessage;
  console.log("Time since last message: ", timeSinceLastMessage);
  lastMessage = Date.now();

  let cuelistID = data[cuelistChannel];
  let cueID = data[cueChannel];

  console.log(`CueList: ${cuelistID}, cue: ${cueID}`)

  lastCue = data[cueChannel]
  lastList = data[cuelistChannel]

  let cueToPlay = {cuelistID, cueID}
  try {
    sendPacketToServer(cueToPlay)
  } catch (error) {
    console.log(error);
  }
});

function sendMockData() {
  console.log("Starting sending mock data to tmaps.xyz");
  setInterval(() => {
    sendPacket(Array.from([1,1]))
  }, 1000);
}

const myArgs = process.argv.slice(2);
switch (myArgs[0]) {
  case "mock":
    sendMockData()
    break;

  default:
    break;
}

