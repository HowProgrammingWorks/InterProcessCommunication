'use strict';

global.api = {};
api.net = require('net');
api.os = require('os');

const broker = { host: '127.0.0.1', port: 50000 };
const task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11, 2, 17, 3, 2, 5];

const sendTask = (task) => {
  const conn = { port: broker.port, host: broker.host };
  const socket = new api.net.Socket();
  socket.on('data', (readData) => {
    console.log('Data received (by client): ' + readData);
    const res = JSON.parse(readData);
    console.dir(task);
    console.dir(res.answer);
  });
  socket.connect(conn, () => {
    console.log('Data send (by client): ' + JSON.stringify({ task }));
    socket.write(JSON.stringify({ task }));
  });
};

sendTask(task);
sendTask(task);
sendTask(task);
