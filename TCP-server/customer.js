'use strict';

const net = require('net');

//Generate 10 customers with different time to connect

module.exports = () => {

  const delay = (task, randorn) => setTimeout(() => {
    const result = [];

    const socket = net.createConnection(2020);

    socket.on('data', (data) => {
      data = JSON.parse(data);
      result.push(data);
      console.log('Result:', ...result);
    });

    socket.write(JSON.stringify(task));

  }, randorn);

  for (let i = 0; i < 10; i++) {
    const randorn = (Math.random() * (10 - 5)) * 1000;
    const task = [i, i + 5, i + 10];
    delay(task, randorn);
  }

};
