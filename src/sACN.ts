import { Receiver } from 'sacn';
// import { sendPacketToServer } from './wsclient.js';
import { convertToArray } from './util/util';
import { sendCueUpdateToServer, sendPacketToServer } from './wsclient';
const numberOfAdditionalChannelsListened = 2;

let packetSent = false;

class sACNReceiver {
  iface: string;
  universe: number | number[];
  startChannel: number;
  receiver: Receiver;
  constructor(iface: string, universes: number | number[], startChannel: number) {
    this.iface = iface;
    this.universe = universes;
    this.startChannel = startChannel
    this.receiver = this.newReceiver(iface, universes, startChannel)
  }
  newReceiver(iface: string, universes: number | number[], startChannel: number): Receiver {
    let rec = new Receiver({
      universes: convertToArray(universes),
      iface // use iface from parameters
      // iface: "169.254.30.194" // LundBook IP
      // iface: "169.254.95.10" // Pi IP
      // see table 1 below for all options
    });
    console.log(`Listening for sACN on universe ${universes}, listenening to channels ${startChannel}-${startChannel + numberOfAdditionalChannelsListened}`);
    
    var lastUpdate = 0;
    var latestUpdate = 0;
    // var latestUpdates = new Array();
    
    rec.on('packet', (packet) => {
      // console.log('got dmx data:', packet.payload);
      console.clear();
      let listenSlice = packet.payloadAsBuffer?.slice(startChannel - 1, startChannel + numberOfAdditionalChannelsListened)
      let values: number[] = []
      if(!listenSlice) return;
      for (const [i, byte] of listenSlice.entries()) {
        values.push(byte);
        console.log("pos %i val %i", startChannel + i,byte.toString(10));
      }
 
      // Measure time between messages TODO: represent it with FPS
      var currentTime = Date.now();
      let timeSinceLastUpdate = currentTime - lastUpdate;
      console.log("Time since last update", timeSinceLastUpdate);
      if(lastUpdate != 0) {
        if (timeSinceLastUpdate > latestUpdate) {
          latestUpdate = timeSinceLastUpdate;
        }
      }
      lastUpdate = currentTime;
      console.log("Latest update recorded:", latestUpdate);
    });
    
    rec.on('PacketCorruption', (err) => {
      // trigged if a corrupted packet is received
    });
    
    rec.on('PacketOutOfOrder', (err) => {
      // trigged if a packet is received out of order
    });
    
    /* advanced usage below */
    
    rec.on('error', (err) => {
      // trigged if there is an internal error (e.g. the supplied `iface` does not exist)
    });
    return rec;
  }
}

export default (sACNReceiver)

