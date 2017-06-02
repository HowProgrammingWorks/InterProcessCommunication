'use strict';

module.exports = function() {
  process.on('message', (message) => {
    const broker = { port: 51000, host: '127.0.0.1' };
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
    const registerInBroker = (myPort, connParams) => {
      const brokerConn = new api.net.Socket();
      const connParam = { port: myPort };
      brokerConn.connect(connParams, () => {
        brokerConn.write(JSON.stringify(connParam));
      });
    };

    const port = parseInt(message);

    registerInBroker(port, broker);
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
