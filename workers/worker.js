'use strict';

console.log(process.pid + '\tHELLO');

const caltulations = item => item * 2;

process.on('message', (message) => {

  console.log(
    process.pid + '\t' +
    'FROM master: ' + JSON.stringify(message)
  );

  process.send({
    result: message.task.map(caltulations)
  });

});
