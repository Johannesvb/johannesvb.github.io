// import WebSocket from 'ws';
const WebSocket = require('ws')
const url = "wss://lightr.dk/ws/"
const ws = new WebSocket(url);

ws.on('open', function open() {
  console.log("Connected established");
  ws.send('something');
});

ws.on('message', function message(data) {
  // console.log('received: %s', data);
});

ws.on('close', function close() {
  console.log("Disconnected");
})

function sendPacketToServer(content) {
  let packet = {
    timestamp: Date.now(),
    type: "dmx",
    content: content,
    sender: "dmxpi",
  }
  ws.send(JSON.stringify(packet))
}

module.exports = {
  sendPacketToServer
}