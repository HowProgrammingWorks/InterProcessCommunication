'use strict';

const net = require('net');

const socket = new net.Socket();

socket.connect({
  port: 2000,
  host: '127.0.0.1',
}, () => {
  socket.write('Hello from client');
  socket.on('data', data => {
    const message = data.toString();
    const user = JSON.parse(message);
    console.log('Data received (by client):', data);
    console.log('toString:', message);
    console.log(`Age of ${user.name} is ${user.age}`);
  });
});
