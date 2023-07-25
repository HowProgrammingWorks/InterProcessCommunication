'use strict';

global.api = {};
api.net = require('net');
api.os = require('os');
api.metasync = require('metasync');
api.queue = require('./queue.js');

const workersQueue = new api.queue.Queue();
let workerId = 0;
let taskId = 0;

const newWorker = (socket) => {
  socket.on('data', (data) => {
    const connParams = JSON.parse(data);
    //add new worker
    workersQueue.put({
      id: workerId++,
      port: connParams.port,
      host: socket.remoteAddress
    });
    console.dir(workersQueue.queue);
    socket.end();
  });
};


const createConnection = (task) => (data, datacb) => {
  workersQueue.use((workerParams, qcb) => {
    const workerSocket = new api.net.Socket();
    workerSocket.on('data', (readData) => {
      console.log('Data received (by broker): ' + readData);
      const res = JSON.parse(readData);
      data[parseInt(res.index)] = res.answer;
      qcb();
      datacb(data);
    });
    workerSocket.connect({
      port: workerParams.port,
      host: workerParams.host
    }, () => {
      console.log('Data send (by broker): ' + JSON.stringify(task));
      workerSocket.write(JSON.stringify(task));
    });
  });
};

const mergeResult = (data) => {
  console.log('Merging - ');
  console.dir(data);
  //merge array of results in one
  const res = data.reduce((a, b) => a.concat(b));
  // console.log(task);
  console.log(res);
  return res;
};

const createTasks = (arr, workers) => {
  const tasks = [];
  const elemsByTask = Math.ceil(arr.length / workers);
  let i = 0;
  while (arr.length > 0) {
    tasks.push({
      index: i++,
      funcId: 1,
      task: arr.splice(0, elemsByTask),
      taskId: taskId++
    });
  }
  return tasks;
};

const sendTasks = (tasks, clientSocket) => {
  api.metasync.map(
    tasks,
    (curr, cb) => {
      cb(null, createConnection(curr));
    },
    (err, res) => {
      if (err) console.error(err);
      api.metasync.parallel(
        res,
        (data) => {
          const res = mergeResult(data);
          const response = { answer: res };
          clientSocket.end(JSON.stringify(response));
        },
        []
      );
    });
};

const newTasks = (data, clientSocket) => {
  const obj = JSON.parse(data);
  sendTasks(createTasks(obj.task, workersQueue.size()), clientSocket);
};

//for clients
api.net.createServer((clientSocket) => {
  clientSocket.on('error', (err) => {
    console.error(err);
  });
  clientSocket.on('data', (data) => {
    newTasks(data, clientSocket);
  });
}).listen(50000);

//for workers
api.net.createServer(newWorker).listen(51000);
