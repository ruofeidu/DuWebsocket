const WebSocket = require('ws');
var dict = {};
var PORT = 8585;
var PREFIX_GET = 'get ';
var PREFIX_SET = 'set ';
var RESULT_NULL = 'NULL';
var RESULT_TRUE = 'True';
var RESULT_FALSE = 'False';

const wss = new WebSocket.Server({ port: PORT },()=>{
  console.log('server started')
});

wss.on('connection', function connection(ws) {
  ws.on('message', (data) => {
    if (typeof(data) === "string") {
      console.log('data received \n %o', data);
      if (data.length < 5) {
        return;
      }

      var cmd = data.substr(0, 4);
      var msg = data.substr(4);
      console.log(cmd, msg);

      if (cmd === PREFIX_GET) {
        if (msg in dict) {
          ws.send(msg + ':' + dict[msg]);
          console.log('data sent \n %o', msg + ':' + dict[msg]);
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
