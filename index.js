const WebSocket = require('ws');
var dict = {};
var PORT = 8585;
// "get <key>" command returns the <value> of a certain <key>.
var PREFIX_GET = 'get ';
// "set <key>" command sets the <value> of a certain <key>.
var PREFIX_SET = 'set ';
// "tap <key>" command is used for user interaction. It queries if <key> is
// non-empty and sets to RESULT_NULL at the same time.
var PREFIX_TAP = 'tap ';
// Length of the prefix before <key>.
var COMMAND_LENGTH = 4;
var RESULT_NULL = 'NULL';
var RESULT_TRUE = 'True';
var RESULT_FALSE = 'False';

const wss = new WebSocket.Server({ port: PORT },()=>{
  console.log('Websocket server started.')
});

wss.on('connection', function connection(ws) {
  ws.on('message', (data) => {
    if (typeof(data) === "string") {
      // console.log('data received \n %o', data);
      if (data.length <= COMMAND_LENGTH) {
        return;
      }

      var cmd = data.substr(0, COMMAND_LENGTH);
      var msg = data.substr(COMMAND_LENGTH);
      // console.log(cmd, msg);

      if (cmd === PREFIX_GET || cmd == PREFIX_TAP) {
        if (msg in dict) {
          ws.send(msg + ':' + dict[msg]);
          // console.log('data sent \n %o', msg + ':' + dict[msg]);
          if (cmd == PREFIX_TAP) {
            dict[msg] = RESULT_NULL;
          }
          return;
        } else {
          ws.send(RESULT_NULL);
          return;
        }
      } else
      if (cmd == PREFIX_SET) {
        var pos = msg.indexOf(' ');
        if (pos < 0) {
          ws.send(RESULT_FALSE);
          return;
        }

        var k = msg.substr(0, pos);
        var v = msg.substr(pos + 1);
        dict[k] = v;
        ws.send(RESULT_TRUE);
      }
    }
  })
});

wss.on('listening',()=>{
   console.log('listening on ' + PORT);
});
