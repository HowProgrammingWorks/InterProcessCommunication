'use strict';

const net = require('net');

//Generate 10 workers with different time to connect

module.exports = () => {

  const fn = x => x * 2;

  const delay = (randorn) => setTimeout(() => {

    const socket = net.createConnection(2020, () => {
      socket.write(JSON.stringify('worker'));
    });

    socket.on('data', (data) => {
      data = JSON.parse(data);
      const task = data.task;
      data.result = task.map(fn);

      //Emulate data processing

      const randorn = (Math.random() * (4 - 2)) * 1000;
      setTimeout(() => {
        socket.write(JSON.stringify(data));
        console.log('Worker send result for customer', data.customerId);
      }, randorn);

    });

  }, randorn);

  for (let i = 0; i < 10; i++) {
    const randorn = (Math.random() * (6 - 1)) * 1000;
    delay(randorn);
  }

};
