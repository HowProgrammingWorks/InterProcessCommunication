var net = require('net');
var socket = new net.Socket();
var user;

socket.connect({
	port: 2000,
	host: '127.0.0.1',
}, function() {
	socket.write('Hello from client');
	socket.on('data', function(data) {
		user = JSON.parse(data);
		console.log('Data received (by client): ' + data);
		console.log('Age of ' + user.name + ' is ' + user.age);
	});
});
