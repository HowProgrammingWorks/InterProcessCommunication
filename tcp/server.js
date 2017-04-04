'use strict';

global.api = {};
api.net = require('net');

const user = { name: 'Marcus Aurelius', age: 1895 };

const server = api.net.createServer((socket) => {
  console.log('Connected: ' + socket.localAddress);
  socket.write(JSON.stringify(user));
  socket.on('data', (data) => {
    console.log('Data received (by server): ' + data);
  });
});

server.listen(2000);
