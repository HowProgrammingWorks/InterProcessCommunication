var api = {};
global.api = api;
api.net = require('net');

var user = { name: 'Marcus Aurelius', age: 1895 };

var server = api.net.createServer(function(socket) {
  socket.write(JSON.stringify(user));
  console.log('Connected: ' + socket.localAddress);
  socket.on('data', function(data) {
    console.log('Data received (by server): ' + data);
  });
}).listen(2000);
