var api = {};
global.api = api;
api.net = require('net');
api.os = require('os');

var workersCount = 10;
var startPort = 10000;
var defaultElementsByTask = 1;
var host = '127.0.0.1';
var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];

var tasks = ChunkArray(task,defaultElementsByTask,workersCount);
SendTasksAndAggregateAnswers(tasks);

function ChunkArray(arr,elementsByPart,clientsCount) {
    var tasks = [];
    var needWorkers = arr.length/elementsByPart;
    if (needWorkers <= clientsCount) {

    } else {
        console.log(needWorkers+'-'+elementsByPart);
        while (needWorkers > clientsCount){
            elementsByPart++;
            needWorkers = arr.length/elementsByPart;
            console.log(needWorkers+'-'+elementsByPart);
        }
    }
    var i = 0;
    while (arr.length > 0) {
        tasks.push({
                index: i++,
                task: arr.splice(0, elementsByPart)
            }
        );
    }
    //console.dir(tasks);
    return tasks;
}
function SendTasksAndAggregateAnswers(tasks) {
    var answers = [];
    var sockets = [];
    var answersCount = tasks.length;
    for(var i = startPort;i<(answersCount+startPort);i++) {
        var socket = new api.net.Socket();
        socket.on('data', function (data) {
            console.log('Data received (by client): ' + data);
            var res = JSON.parse(data);
            answers.push(res);
            if (answers.length === answersCount) {
                //console.dir(answers);
                SortAndMergeAnswers(answers);
            }
        });
        //socket.on('close', function () {
        //    console.log('Connection closed');
        //});
        socket.connect({port: i, host: host});
        sockets.push(socket);
    }

    tasks.forEach(function (task, i) {
        console.log('Data send (by client): ' + JSON.stringify(task));
        // console.dir(task);
        var dataObj = task;
        sockets[i].write(JSON.stringify(dataObj));
    });
}

function SortAndMergeAnswers(answers) {
    var res = [];
    var temp = [];
    answers.forEach(function (value) {
        temp[value.index] = value.answer;
    });
    for(var i=0;i<temp.length;i++)
    {
        res = res.concat(temp[i]);
    }
    console.dir(temp);
    console.dir(res);
}
