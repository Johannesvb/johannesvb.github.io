

// import { w3cwebsocket as W3CWebSocket } from "../node_modules/websocket";
// import { Message, type } from '../structs/message';

// HACK: URL er ikke dynamic, den er hardcoded til localhost server
const websocketURL = `${window.location.href
    .replace("http", "ws")
    .replace("3000", "3001")}sequence`;

// TODO: VIL IKKE CONNECTE. MÅSKE W3CWebsocket ER NØDVENDIG?
// const websocketURL = `wss://tmaps.xyz`;


// NOTE: ny implementation herunder, skulle gerne undgå at bruge react only syntax som export og export default

// TODO: Implement en bedre måde at lave en websocket på, brug singleton
class _WebsocketClient {
    constructor(url) {
        this.url = url;
        this.websocket = this._websocketConnect(websocketURL);
        this._callbacks = {};

    }
    /**
     * Send message to given websocket
     *
     * @param {*} ws websocket to send information to
     * @param {*} message JSON object to encode as CONTENT
     * @memberof _WebsocketClient
     */
    sendWebsocketMessage(ws = this.websocket, message) {
        let msg = new Message();
        msg.TYPE = type.TEST;
        msg.CONTENT = message || "empty";

        ws.send(JSON.stringify(msg));
        console.log("Sent msg");
    }

    // Private method
    _websocketConnect(wsURL = websocketURL) {
        console.log(wsURL)
        var ws = new WebSocket(wsURL);
        ws.onopen = () => { // new connection logic
            console.log('WebSocket Client Connected to: ' + websocketURL);
        };
        ws.onclose = (e) => { // closed connection logic
            setTimeout(() => {
                this._websocketConnect(wsURL);
            }, 1000);
            console.log(e);
        }

        // on message logic 
        //TODO: bruge callbacks så alt under the hood stadig fungerer, og developers kan tilføje funktionalitet
        ws.onmessage = (message) => {
            let msg;
            try {
                msg = JSON.parse(message.data)
                console.log(msg);
            } catch (error) {
                let rb = message.data.arrayBuffer().then(midiAB => {
                    // Player.loadArrayBuffer(midiAB)
                    // let midiNameEvent = Player.getEvents()[0][0];
                    // if(midiNameEvent.name === 'Sequence/Track Name') {

                    // }
                    // TODO: Kæmpe side quests: find ud af om det binære data der er sendt er i form af MIDI (tjek 'MThd / 4d 54 68 64' i de første bytes)
                })

                this.emit(type.MIDI.SEQUENCE, message);
                console.log("assuming received midi binary?");
                console.log(message.data);
                console.log(error);
                return;
            }

            this.emit(msg.TYPE, msg);
        };
        this.websocket = ws; // TEST: behold den her, de andre skulle gerne være ligemeget når det er et object
        return ws;
    }

    send(data) {
        try {
            console.log("sending: " + JSON.stringify(data))
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
}

// Singleton pattern for enabling multiple files to use the same instance of a websocket client
var instance;
var WebsocketClient = (function () {
    function createInstance() {
        var ws = new _WebsocketClient(websocketURL);
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
