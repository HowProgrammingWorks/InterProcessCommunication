'use strict';

module.exports = () => {

  const cpuCount = api.os.cpus().length;

  const workers = [];
  for (let i = 0; i < cpuCount; i++) {
    const worker = api.cluster.fork();
    workers.push(worker);
  }

  const task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
  const results = [];

  workers.forEach((worker) => {

    worker.send({ task });

    worker.on('exit', (code) => {
      console.log('exit ' + worker.process.pid + ' ' + code);
    });

    worker.on('message', (message) => {

      console.log(
        'message from worker ' + worker.process.pid + ': ' +
        JSON.stringify(message)
      );
      results.push(message.result);

      if (results.length === cpuCount) {
        process.exit(1);
      }

    });

  });

};
