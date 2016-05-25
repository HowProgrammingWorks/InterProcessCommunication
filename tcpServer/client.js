var api = {};
global.api = api;
api.net = require('net');

var socket = new api.net.Socket();

socket.connect({
  port: 2000,
  host: '127.0.0.1',
}, function() {
  socket.on('data', function(data) {
  	console.log('Data received (by client): ' + data);
  	data = JSON.parse(data);
    if (typeof data !== 'string') {
	    socket.write(JSON.stringify({
	    	id : data.id, 
		    data: data.data.map(function(item) {
		        return item * 2;
		    })
	    }));
	}
  });
});
