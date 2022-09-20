const { Receiver } = require('sacn');

const sACN = new Receiver({
  universes: [1, 2],
  // see table 1 below for all options
});
console.log("Listening for sACN");

sACN.on('packet', (packet) => {
  console.log('got dmx data:', packet.payload);
  // see table 2 below for all packet properties
});

sACN.on('PacketCorruption', (err) => {
  // trigged if a corrupted packet is received
});

sACN.on('PacketOutOfOrder', (err) => {
  // trigged if a packet is received out of order
});

/* advanced usage below */

sACN.on('error', (err) => {
  // trigged if there is an internal error (e.g. the supplied `iface` does not exist)
});

// start listening to a new universe (universe 3 in this example)
// sACN.addUniverse(3);

// stop listening to a universe 1
// sACN.removeUniverse(1);

// close all connections; terminate the receiver
setTimeout(() => {
  sACN.close();
}, 60000);

// sACN.universes; // is a list of the universes being listened to