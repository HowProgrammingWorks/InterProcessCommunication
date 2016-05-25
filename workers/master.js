module.exports = function() {

  var cpuCount = api.os.cpus().length;

  var workers = [];
  for (var i = 0; i < cpuCount; i++) {
    var worker = api.cluster.fork();
    workers.push(worker);
  }

  var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
  var results = [];

  function min(a, b) {
    return a > b ? b : a;
  }

  var count = 0;

  var taskSize = Math.ceil(task.length / cpuCount)
  console.log('Task size : ' + taskSize);

  for (var i = 0; i < workers.length; i++) {
    (function(worker, id) {

      var l = taskSize * id;
      var r = min(taskSize * (id + 1), task.length);

      worker.send({ task: task.slice(l, r) });

      worker.on('exit', function (code) {
        console.log('exit ' + worker.process.pid + ' ' + code);
      });

      worker.on('message', function (message) {
        console.log(
          'message from worker ' + worker.process.pid + ': ' +
          JSON.stringify(message)
        );
        results[id] = message.result;
        count++;
        if (count === cpuCount) {
          console.log('results : ' + results)
          process.exit(1);
        }

      });

    })(workers[i], i)
  }

};
