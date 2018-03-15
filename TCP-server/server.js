'use strict';

const net = require('net');

const tasks = [];
const customers = [];
const workers = [];

let id = 0;

const checkTasks = () => {
  if (tasks.length) {
    const worker = workers.pop();
    const task = tasks.shift();
    worker.write(JSON.stringify(task));
  }
};

const sendTask = (task, customerId) => {
  const data = { task, customerId };

  if (workers.length) {
    const worker = workers.pop();
    worker.write(JSON.stringify(data));
  } else {
    tasks.push(data);
    console.log(
      `--- Please wait, customer ${customerId}, all workers are busy ---`
    );
  }

};

const sendResult = data => {
  const { result, customerId } = data;
  const customer = customers.find(x => x.id === customerId);
  customer.write(JSON.stringify(result));
};

const server = net.createServer((socket) => {
  console.log('**New connection to the server**');

  socket.id = id++;

  socket.on('data', (data) => {
    data = JSON.parse(data);

    if (data === 'worker') {
      console.log('(it was worker)');
      workers.push(socket);
      checkTasks();
    } else if (data.result) {
      console.log('receive Result for customer', data.customerId);
      sendResult(data);
      workers.push(socket);
      checkTasks();
    } else {
      console.log('receive Task from customer', socket.id);
      customers.push(socket);
      const customerId = socket.id;
      sendTask(data, customerId);
    }

  });

  socket.on('close', () => {
    const indexCustomer = customers.indexOf(socket);

    if (indexCustomer !== -1) {
      customers.splice(indexCustomer, 1);
    } else {
      const indexWorker = workers.indexOf(socket);
      workers.splice(indexWorker, 1);
    }

    console.log(
      `Socket closed, left connections: ${workers.length + customers.length}`,
      `\nworkers: ${workers.length}, customers: ${customers.length}`
    );

  });

});

server.listen(2020, () => {
  console.log('Listening start...');
});
