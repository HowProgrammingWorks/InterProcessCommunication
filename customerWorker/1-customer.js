'use strict';

global.api = {};
api.net = require('net');
api.os = require('os');
api.metasync = require('metasync');

const host = { workerIp: '127.0.0.1', workerPort: 20000 };
const workersCount = 15;
const defaultElementsByTask = 1;
const task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11, 2, 17, 3, 2, 5];

const createConnection = (task, counter) => {
  const conn = { port: host.workerPort + counter, host: host.workerIp };
  return (data, cb) => {
    const socket = new api.net.Socket();
    socket.on('data', (readData) => {
      console.log('Data received (by client): ' + readData);
      const res = JSON.parse(readData);
      data[parseInt(res.index)] = res.answer;
      cb(data);
    });
    socket.connect(conn);
    console.log('Data send (by client): ' + JSON.stringify(task));
    socket.write(JSON.stringify(task));
  };
};

const mergeResult = (data) => {
  console.log('Merging - ');
  console.dir(data);
  //merge array of results in one
  const res = data.reduce((a, b) => a.concat(b));
  console.log(task);
  console.log(res);
};

const createTasks = (arr, elementsByPart, clientsCount) => {
  const tasks = [];
  const needWorkers = arr.length / elementsByPart;
  let elems = elementsByPart;
  if (needWorkers > clientsCount) {
    elems = Math.ceil(arr.length / clientsCount);
  }
  let i = 0;
  while (arr.length > 0) {
    tasks.push({
      index: i++,
      funcId: 1,
      task: arr.splice(0, elems)
    });
  }
  return tasks;
};

const sendTasks = (tasks) => {
  api.metasync.reduce(
    tasks,
    (prev, curr, cb, counter) => {
      prev.push(createConnection(curr, 0));
      cb(null, prev);
    },
    (err, res) => {
      if (err) console.error(err);
      api.metasync.parallel(
        res,
        (data) => {
          mergeResult(data);
        },
        []
      );
    },
    []);
};

sendTasks(createTasks(task.slice(), defaultElementsByTask, workersCount));
