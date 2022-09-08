'use strict'
const dmxlib = require('dmxnet');
const dmxnet = new dmxlib.dmxnet();
// dmxnet.logger.level = "debug"
const { Timer } = require('./Timer');
const { sendPacketToServer } = require('./wsclient.js');

const args = process.argv.slice(2);
console.log(args);
// Abort the process if the argument requirements are not met.
checkArguments()

let selectedChannelStart = args[0] - 1; // Input is 1-indexed, it is converted to 0-indexed
var cueChannel = selectedChannelStart;
var cuelistChannel = cueChannel + 1;
var intensityChannel = cuelistChannel + 1;
var lastCue;
var lastList;
var lastIntensity;

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

function sendCueUpdateToServer(cueID, cuelistID) {
  let cueToPlay = {cueID, cuelistID}
  try {
    sendPacketToServer(cueToPlay, "dmx")
  } catch (error) {
    console.log(error);
  }
}
function sendIntensityUpdateToServer(intensity) {
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


function onlyNumbers(str) {
  return /^[0-9]*$/.test(str);
}

function checkArguments() {
  let tooFewArgs = args.length < 1;
  if(tooFewArgs) {
    console.error("Not enough arguments, must be 1")
    process.exit();
  }
  let argsOnlyContainNumbers = onlyNumbers(args[0])
  if(!argsOnlyContainNumbers) {
    console.error("Arguments must only contain numbers");
    process.exit();
  };
  let argsOutOfBounds = args[0] < 1 || args[0] > 512;
  if(argsOutOfBounds) {
    console.error("DMX channel out of bounds, must be between 1-512");
    process.exit()
  }
}