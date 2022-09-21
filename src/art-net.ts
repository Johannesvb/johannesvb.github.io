'use strict'
import * as dmxlib from 'dmxnet';
const dmxnet = new dmxlib.dmxnet();
// dmxnet.logger.level = "debug"
import { sendPacketToServer } from './wsclient.js';
const args = process.argv.slice(2); // TEMP:



let selectedChannelStart = parseInt(args[0]) - 1; // Input is 1-indexed, it is converted to 0-indexed
var cueChannel = selectedChannelStart;
var cuelistChannel = cueChannel + 1;
var intensityChannel = cuelistChannel + 1;
var lastCue: number;
var lastList: number;
var lastIntensity: number;

console.log(`Listening for Art-Net on channel ${selectedChannelStart} to ${selectedChannelStart + 2}`);

var receiverOptions = {
  subnet: 0, //Destination subnet, default 0
  universe: 0, //Destination universe, default 0
  net: 0, //Destination net, default 0
}

var receiver = dmxnet.newReceiver(receiverOptions);

var lastMessageTime = Date.now();

receiver.on('data', function (data) {
  let dataIsNotNew = data[cuelistChannel] === lastList && data[cueChannel] === lastCue && data[intensityChannel] === lastIntensity;
  if (dataIsNotNew) return;
  // let dataIsZero = data[cueListChannel] === 0 || data[cueChannel] === 0;
  // if(dataIsZero) return;

  // Debugging
  console.clear()
  console.log(data)

  // Record time between messages
  let timeSinceLastMessage = Date.now() - lastMessageTime;
  console.log("Time since last message: ", timeSinceLastMessage);
  lastMessageTime = Date.now();

  let cueID = data[cueChannel];
  let cuelistID = data[cuelistChannel];
  let intensity = data[intensityChannel];

  console.log(`CueList: ${cuelistID}, cue: ${cueID}, intensity: ${intensity}`)


  switch (true) {
    case cueID != lastCue || cuelistID != lastList:
      sendCueUpdateToServer(cueID,cuelistID);
      break;
    case intensity != lastIntensity:
      sendIntensityUpdateToServer(intensity);
      break;
  
    default:
      break;
  }

  lastCue = cueID
  lastList = cuelistID
  lastIntensity = intensity
});

function sendCueUpdateToServer(cueID: number, cuelistID: number) {
  let cueToPlay = {cueID, cuelistID}
  try {
    sendPacketToServer(cueToPlay, "dmx")
  } catch (error) {
    console.log(error);
  }
}
function sendIntensityUpdateToServer(intensity: number) {
  try {
    sendPacketToServer({intensity}, "intensity_change")
  } catch (error) {
    console.log(error);
  }
}

// function sendMockData() {
//   console.log("Starting sending mock data to tmaps.xyz");
//   setInterval(() => {
//     sendPacket(Array.from([1,1]))
//   }, 1000);
// }


// args.forEach(arg => {
//   console.log(arg);
// });

// const myArgs = process.argv.slice(2);
// switch (myArgs[0]) {
//   case "mock":
//     sendMockData()
//     break;

//   default:
//     break;
// }



