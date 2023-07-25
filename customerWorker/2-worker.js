'use strict';

global.api = {};
api.cluster = require('cluster');
api.os = require('os');
api.net = require('net');

global.application = {};
application.master = require('./workersMaster.js');
application.worker = require('./worker.js');

if (api.cluster.isMaster) application.master();
else application.worker();
