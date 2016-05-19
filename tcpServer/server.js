var api = {};
global.api = api;
api.net = require('net');

var contributors = 4;

var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
var results = [];

function min(a, b) {
return a > b ? b : a;
}

var started = 0;
var finished = 0;

var taskSize = Math.ceil(task.length / contributors
)
console.log('Task size : ' + taskSize);

var server = api.net.createServer(function(socket) {

	if (started >= contributors) {
		socket.write(JSON.stringify("Thank you, but no more contributors required"));
	}
	else {
		var l = taskSize * started;
	    var r = min(taskSize * (started + 1), task.length);

	  socket.write(JSON.stringify({
	  	id : started++,
	  	data : task.slice(l, r)
	  }));
	  console.log('Connected: ' + socket.localAddress);
	  socket.on('data', function(data) {
	    console.log('Data received (by server): ' + data);
	    obj = JSON.parse(data);
	    results[obj.id] = obj.data;
	    finished++;
	    if (finished === contributors) {
		    console.log(results);
		}
	  });
	}
}).listen(2000);
