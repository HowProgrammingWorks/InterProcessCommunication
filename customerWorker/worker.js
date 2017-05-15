module.exports = function() {
    process.on('message', function (message) {
        CreateServer(parseInt(message));
    });
};

function CreateServer(port) {
    console.log('Listen port # '+port);
    var server = api.net.createServer(function(socket) {
        console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);
        socket.on('error', function(err) {
            console.log(err)
        })
        socket.on('data', function(data) {
            var dataObj = JSON.parse(data);
            console.log('Data received (by worker): ' + data);
            // console.dir(dataObj);
            var result = ProcessData(dataObj.task);
            var answer = {index:dataObj.index,answer: result};
            console.log('Counting complete. Sending result - '+JSON.stringify(answer));
            setTimeout(function () {
                socket.write(JSON.stringify(answer),function (err) {
                    socket.end();
                });
            },getRandomInt(1,5)*1000);
        });
    }).listen(port);
}

function ProcessData(data) {
    var res = data.map(function(item) {
        return item * 2;
    });
    return res;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}