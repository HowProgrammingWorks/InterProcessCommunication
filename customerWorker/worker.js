'use strict';

module.exports = function() {
  process.on('message', (message) => {
    const port = parseInt(message);
    console.log('Listen port # ' + port);
    api.net.createServer((socket) => {
      console.log('Conn: ' + socket.remoteAddress + ':' + socket.remotePort);
      socket.on('error', (err) => {
        console.error(err);
      });
      socket.on('data', (data) => {
        const dataObj = JSON.parse(data);
        console.log('Data received (by worker): ' + data);
        const result = multiply(dataObj.task);
        const answer = { index: dataObj.index, answer: result };
        console.log('Task complete. Send result - ' + JSON.stringify(answer));
        setTimeout(() => {
          socket.end(JSON.stringify(answer));
        }, getRandomInt(1, 5) * 1000);
      });
    }).listen(port);
  });
};

function multiply(data) {
  const res = data.map((item) => item * 2);
  return res;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
