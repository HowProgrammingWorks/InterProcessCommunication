'use strict';

module.exports = function() {

  const workersCount = api.clientsCount;

  const workers = [];
  for (let i = 0; i < workersCount; i++) {
    const worker = api.cluster.fork();
    workers.push(worker);
  }

  let startPort = global.port;

  workers.forEach((worker) => {

    worker.send(startPort++);

    worker.on('exit', (code) => {
      console.log('exit ' + worker.process.pid + ' ' + code);
    });

  });

};
