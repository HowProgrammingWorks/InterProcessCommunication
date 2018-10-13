'use strict';

const os = require('os');
const cp = require('child_process');

console.log('Started master:', process.pid);

const cpuCount = os.cpus().length;
const workers = [];

for (let i = 0; i < cpuCount; i++) {
  const worker = cp.fork('./worker.js');
  console.log('Started worker:', worker.pid);
  workers.push(worker);
}

const task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
const results = [];

workers.forEach(worker => {

  worker.send({ task });

  worker.on('exit', code => {
    console.log('Worker exited:', worker.pid, code);
  });

  worker.on('message', message => {

    console.log('Message from worker', worker.pid);
    console.log(message);

    results.push(message.result);

    if (results.length === cpuCount) {
      process.exit(0);
    }

  });

  setTimeout(() => process.exit(1), 5000);

});
