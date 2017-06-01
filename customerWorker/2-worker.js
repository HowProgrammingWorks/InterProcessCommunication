'use strict';

global.api = {};
global.port = 10000;
api.cluster = require('cluster');
api.os = require('os');
api.net = require('net');
api.clientsCount = 15;

global.application = {};
application.master = require('./workersMaster.js');
application.worker = require('./worker.js');

if (api.cluster.isMaster) application.master();
else application.worker();
