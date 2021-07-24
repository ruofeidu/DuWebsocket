const WebSocket = require('ws');
var dict = {};

const wss = new WebSocket.Server({ port: 8585 },()=>{
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
      var msg = data.substr(5);

      if (cmd == 'get ') {
        if (msg in dict) {
          ws.send(msg + ':' + dict[msg]);
          return;
        } else {
          ws.send('NULL');
          return;
        }
      } else
      if (cmd == 'set ') {
        var pos = cmd.indexOf(' ');
        if (pos < 0) {
          ws.send('False');
          return;
        }

        var k = msg.substr(0, pos);
        var v = msg.substr(pos + 1);
        dict[k] = v;
        ws.send('True');
      }
    }
  })
});

wss.on('listening',()=>{
   console.log('listening on 8585');
});
