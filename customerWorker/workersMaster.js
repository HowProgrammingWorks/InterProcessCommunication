'use strict';

module.exports = function() {
  const workersCount = 5;
  let startPort = 52000;

  const workers = [];
  for (let i = 0; i < workersCount; i++) {
    const worker = api.cluster.fork();
    workers.push(worker);
  }

  workers.forEach((worker) => {
    worker.send(startPort++);
    worker.on('exit', (code) => {
      console.log('exit ' + worker.process.pid + ' ' + code);
    });
  });
};
