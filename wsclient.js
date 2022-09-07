// import WebSocket from 'ws';
const WebSocket = require('ws')
const url = "wss://lightr.dk/ws/"
const ws = new WebSocket(url);

ws.on('open', function open() {
  console.log("Connected established");
  ws.send('something');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
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


client.conn = conn;
console.log("")
console.log("Connection established with tmaps.xyz")
conn.on('close', () => {
  console.log("Closed ws connection");
  setTimeout(() => {
    client.connect(wsURL)
  }, 5000);
})
conn.on('error', (error) => {
  console.log(error);
  
})
conn.on('message', (message) => {
  console.log(Timer.timeEnd())
  //console.log(message);
})