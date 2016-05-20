var api = {};
global.api = api;
api.net = require('net');
api.os = require('os');

var contributorsCount = api.os.cpus().length;

var contributors = [];

var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
var results = [];

function min(a, b) {
	return a > b ? b : a;
}

var started = 0;
var finished = 0;

var taskSize = Math.ceil(task.length / contributorsCount);
console.log('Task size : ' + taskSize);

var server = api.net.createServer(function(socket) {

	if (started >= contributorsCount) {
		socket.write(JSON.stringify("Thank you, but no more contributors required"));
	}
	else {

	  contributors[started++] = socket;
	  if (started == contributorsCount) {
	  	for (var i = 0; i < contributorsCount; i++) {
	  		var l = taskSize * i;
	    	var r = min(taskSize * (i + 1), task.length);
	  		contributors[i].write(JSON.stringify({
		  	id : i,
		  	data : task.slice(l, r)
		  }));
	  	}
	  }
	  
	  console.log('Connected: ' + socket.localAddress);
	  socket.on('data', function(data) {
	    console.log('Data received (by server): ' + data);
	    obj = JSON.parse(data);
	    results[obj.id] = obj.data;
	    finished++;
	    if (finished === contributorsCount) {
		    console.log('results : ' + results);
		}
	  });
	}
}).listen(2000);
