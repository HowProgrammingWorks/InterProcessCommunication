module.exports = function() {
	
  console.log('Hello from worker ' + process.pid + ' ' + api.cluster.worker.id);

  process.on('message', function (message) {
    console.log(
      'message to worker ' + process.pid +
      ' from master: ' + JSON.stringify(message)
    );
    process.send({
      result: message.task.map(function(item) {
        return item * 2;
      })
    });
  });

};
