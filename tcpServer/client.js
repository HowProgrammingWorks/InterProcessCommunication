"use strict";


let api = {};
global.api = api;
api.net = require('net');

const socket = new api.net.Socket();

socket.connect({
  port: 2000,
  host: '127.0.0.1',
}, () => {
  console.log('Hello from client');
  socket.on('data', (data) => {
    console.log('Data received (by client): ' + data);
    const task_def = JSON.parse(data);

    const result = {
      idx: task_def.idx,
      result: task_def.data.map((i) => i*2),
    }
    socket.write(JSON.stringify(result)); 
  });
});
