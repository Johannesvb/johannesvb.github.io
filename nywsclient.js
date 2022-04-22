// NOTE: Remember to check if this keeps working as intended, the port is important.
/**
 * Set the correct URL for the websocket to talk to. If in development, the socket is unsecure
 */
// const ws = require('ws');
const WebSocketClient = require('websocket').client;
const wsURL = "wss://tmaps.xyz:3000/sequence";

var client = new WebSocketClient(); // TODO: find ud af hvordan vi i helvede får styr på certificates.

client.on('connectFailed', function(error) {
  console.log('Connect Error: ' + error.toString());
});

client.on('connect', (conn) => {
  console.log("wawaweewa very nice connection")
  conn.on('close', () => {
    console.log("Closed ws connection");
  })
  conn.on('error', (error) => {
    console.log(error);
  })
  conn.on('message', (message) => {
    console.log(message);
  })
})

console.log("gib plees")

client.connect(wsURL);

module.exports = {
  client
}


console.log("test")
class _WebsocketClient {
  constructor(url) {
    this.url = url;
    this.websocket = this._websocketConnect();
    this._callbacks = {};
  }

  // Private method
  _websocketConnect() {
    var wsc;
    try {
      wsc = new WebSocket(wsURL)
    } catch (error) {
      console.log(error);
      return;
    }
    
    // var wsc = new W3CWebSocket(wsURL);
    var heartbeat;
    wsc.onopen = () => { // new connection logic
      console.log('WebSocket Client Connected to: ' + wsURL);
      var interval = 20000; // ms
      var expected = Date.now() + interval;
      let payload = new Message();
      payload.TYPE = type.PING;

      heartbeat = setTimeout(step, interval);
      function step() {
        var dt = Date.now() - expected; // the drift (positive for overshooting)
        if (dt > interval) {
            // something really bad happened. Maybe the browser (tab) was inactive?
            // possibly special handling to avoid futile "catch up" run
        }
        payload.TIMESTAMP = Date.now();
        wsc.send(JSON.stringify(payload))
        expected += interval;
        heartbeat = setTimeout(step, Math.max(0, interval - dt)); // take into account drift
      }
    };
    wsc.onclose = (e) => { // closed connection logic
      clearTimeout(heartbeat);
      setTimeout(() => {
        this._websocketConnect(wsURL);
      }, 1000);
      console.log(e);
    }

    // Callback for setting login when a specific event it emitted
    wsc.onmessage = (message) => { 
      let msg;
      try {
        msg = JSON.parse(message.data)
        console.log(msg);
      } catch (error) {
        console.log(message.data);
        console.log(error);
        return;
      }
      this.emit(msg.TYPE, msg);
    };
    this.websocket = wsc; // TEST: behold den her, de andre skulle gerne være ligemeget når det er et object
    return wsc;
  }

  send(data) {
    try {
      this.websocket.send(JSON.stringify(data));
    } catch (error) {
      console.log(error);  
    }
  } 

  // Create callback to a given event
  on = function (event, callback) {
    var callbacks = this._callbacks[event] || (this._callbacks[event] = []);
    callbacks.push(callback);
    return this;
  };

  // Activate a callback to a corresponding event
  emit = function (event, data) {
    var callbacks = this._callbacks[event];
    callbacks && callbacks.forEach(function (callback) {
      return callback(data);
    });
  };

  // createInstance() {
  //   var ws = new _WebsocketClient(wsURL);
  //   return ws;
  // }

  // getInstance() {
  //   if(!instance) {
  //     instance = this.createInstance();
  //   }
  //   return instance;
  // }
}

// Singleton pattern for enabling multiple files to use the same instance of a websocket client
var instance;
var WebsocketClient = (function () {
  function createInstance() {
    var ws = new _WebsocketClient(wsURL);
    return ws;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();
// module.exports = {
//   WebsocketClient
// }