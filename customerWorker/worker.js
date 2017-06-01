'use strict';

module.exports = function() {
  process.on('message', (message) => {
    const funcs = {
      0: (item) => (item * 2),
      1: (item) => (item * item)
    };
    const calculate = (funcId, array) => array.map(funcs[funcId]);
    const createHandler = (socket) => (data) => {
      const dataObj = JSON.parse(data);
      const taskId = parseInt(dataObj.funcId);
      console.log('Data received (by worker): ' + data);
      const result = calculate(taskId, dataObj.task);
      const answer = { index: dataObj.index, answer: result };
      console.log('Task complete. Send result - ' + JSON.stringify(answer));
      socket.end(JSON.stringify(answer));
    };

    const port = parseInt(message);

    const brokerConn = new api.net.Socket();
    brokerConn.connect({ port: 21000, host: '127.0.0.1' });
    const connParam = { port };
    brokerConn.write(JSON.stringify(connParam));

    console.log('Listen port # ' + port);
    api.net.createServer((socket) => {
      console.log('Conn: ' + socket.remoteAddress + ':' + socket.remotePort);
      const handler = createHandler(socket);
      socket.on('error', (err) => {
        console.error(err);
      });
      socket.on('data', handler);
    }).listen(port);
  });
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
