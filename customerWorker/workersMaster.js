/**
 * Created by Yura on 10.04.2016.
 */
module.exports = function() {

    var workersCount = api.clientsCount;

    var workers = [];
    for (var i = 0; i < workersCount; i++) {
        var worker = api.cluster.fork();
        workers.push(worker);
    }

    var startPort = global.port;

    workers.forEach(function(worker) {

        worker.send(startPort++);

        worker.on('exit', function (code) {
            console.log('exit ' + worker.process.pid + ' ' + code);
        });

    });

};
