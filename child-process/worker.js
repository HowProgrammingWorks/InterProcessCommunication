'use strict';

console.log('Hello from worker', process.pid);

const caltulations = item => item * 2;

process.on('message', message => {
  console.log('Message to worker', process.pid);
  console.log('from master:', message);

  const result = message.task.map(caltulations);
  process.send({ result });
});
