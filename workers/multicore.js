'use strict';

global.api = {};
api.cp = require('child_process');
api.os = require('os');

const cpuCount = api.os.cpus().length;
console.log('Number of CPUs in computer: ' + cpuCount);
console.log();

const task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
const results = [];

const header = 'PID\tMESSAGE';
const TAB_LENGTH = 4;
console.log(header);
console.log('-'.repeat(header.length + TAB_LENGTH));

for (let i = 0; i < cpuCount; i++) {
  const worker = api.cp.fork('./worker');

  worker.on('message', (message) => {
    console.log(
      worker.pid + '\tFROM worker ' +
      JSON.stringify(message)
    );

    results.push(message.result);

    if (results.length === cpuCount) {
      console.log();
      console.log('Tasks done successfully by ' + cpuCount + ' workers.');
      process.exit(0);
    }
  });

  worker.on('exit', (code) => {
    console.log('exit ' + worker.pid + ' ' + code);
  });

  worker.send({ task });
}
