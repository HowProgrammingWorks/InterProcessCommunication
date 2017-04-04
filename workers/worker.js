'use strict';

module.exports = () => {

  console.log('Hello from worker ' + process.pid + ' ' + api.cluster.worker.id);

  const caltulations = item => item * 2;

  process.on('message', (message) => {

    console.log(
      'message to worker ' + process.pid +
      ' from master: ' + JSON.stringify(message)
    );

    process.send({
      result: message.task.map(caltulations)
    });

  });

};
