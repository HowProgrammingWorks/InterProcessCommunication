'use strict';

global.api = {};
api.net = require('net');
api.os = require('os');
api.metasync = require('metasync');
api.queue = require('./queue.js');

const workersQueue = new api.queue.Queue();
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
    workersQueue.use((workerParams, cb) => {
      const workerSocket = new api.net.Socket();
      workerSocket.connect({
        port: workerParams.port,
        host: workerParams.host
      });
      workerSocket.on('data', (data) => {
        const resp = JSON.parse(data);
        delete resp.taskId;
        console.dir(resp);
        clientSocket.end(JSON.stringify(resp));
        cb();
      });
      workerSocket.write(JSON.stringify(obj));
    });
  });
}).listen(50000);

//for workers
api.net.createServer((socket) => {
  socket.on('data', (data) => {
    const connParams = JSON.parse(data);
    workersQueue.put({
      id: workerId++,
      port: connParams.port,
      host: socket.remoteAddress
    });
    console.dir(workersQueue.queue);
    socket.end();
  });
}).listen(51000);
