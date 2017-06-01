'use strict';

global.api = {};
api.net = require('net');
api.os = require('os');
api.metasync = require('metasync');
api.fs = require('fs');

const workers = [];
let workerId = 0;
let taskId = 0;

//for clients
api.net.createServer((clientSocket) => {
  clientSocket.on('error', (err) => {
    console.error(err);
  });
  clientSocket.on('data', (data) => {
    const obj = JSON.parse(data);
    obj.taskId = taskId++;
    console.dir(obj);
    const workerParams = workers.pop();
    const workerSocket = new api.net.Socket();
    workerSocket.connect({ port: workerParams.port, host: workerParams.host });
    workerSocket.on('data', (data) => {
      workers.push(workerParams);
      const resp = JSON.parse(data);
      delete resp.taskId;
      console.dir(resp);
      clientSocket.end(JSON.stringify(resp));
    });
    workerSocket.write(JSON.stringify(obj));
  });
}).listen(20000);

//for workers
api.net.createServer((socket) => {
  socket.on('data', (data) => {
    const connParams = JSON.parse(data);
    workers.push({
      id: workerId++,
      port: connParams.port,
      host: socket.remoteAddress
    });
    console.dir(workers);
    socket.end();
  });
}).listen(21000);
