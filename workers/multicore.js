var api = {};
global.api = api;

api.cluster = require('cluster');
api.os = require('os');

if (api.cluster.isMaster) {

  var cpuCount = api.os.cpus().length;

  var workers = [];
  for (var i = 0; i < cpuCount; i++) {
    var worker = api.cluster.fork();
    workers.push(worker);
  }

  var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
  var results = [];

  workers.forEach(function(worker) {

    worker.send({ task: task });

    worker.on('exit', function (code) {
      console.log('exit ' + worker.process.pid + ' ' + code);
    });

    worker.on('message', function (message) {
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

} else {

  console.log('Hello from worker ' + process.pid + ' ' + api.cluster.worker.id);

  process.on('message', function (message) {
    console.log(
      'message to worker ' + process.pid +
      ' from master: ' + JSON.stringify(message)
    );
    process.send({
      result: message.task.map(function(item) {
        return item * 2
      })
    });
  });

}
