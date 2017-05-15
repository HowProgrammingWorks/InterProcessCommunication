'use strict';

global.api = {};
api.net = require('net');
api.os = require('os');

const workersCount = 10;
const startPort = 10000;
const defaultElementsByTask = 1;
const host = '127.0.0.1';
const task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];

const tasks = chunkArray(task, defaultElementsByTask, workersCount);
sendTasks(tasks);

function chunkArray(arr, elementsByPart, clientsCount) {
  const tasks = [];
  let needWorkers = arr.length / elementsByPart;
  if (needWorkers > clientsCount) {
    console.log(needWorkers + '-' + elementsByPart);
    while (needWorkers > clientsCount) {
      elementsByPart++;
      needWorkers = arr.length / elementsByPart;
    }
  }
  let i = 0;
  while (arr.length > 0) {
    tasks.push({
      index: i++,
      task: arr.splice(0, elementsByPart)
    });
  }
  return tasks;
}
function sendTasks(tasks) {
  const answers = [];
  const sockets = [];
  const answersCount = tasks.length;
  for (let i = startPort; i < (answersCount + startPort); i++) {
    const socket = new api.net.Socket();
    socket.on('data', (data) => {
      console.log('Data received (by client): ' + data);
      const res = JSON.parse(data);
      answers.push(res);
      if (answers.length === answersCount) {
        mergeAnswers(answers);
      }
    });
    socket.connect({ port: i, host });
    sockets.push(socket);
  }

  tasks.forEach((task, i) => {
    console.log('Data send (by client): ' + JSON.stringify(task));
    const dataObj = task;
    sockets[i].write(JSON.stringify(dataObj));
  });
}

function mergeAnswers(answers) {
  let res = [];
  const temp = [];
  answers.forEach((value) => {
    temp[value.index] = value.answer;
  });
  for (let i = 0; i < temp.length; i++) {
    res = res.concat(temp[i]);
  }
  console.dir(temp);
  console.dir(res);
}
