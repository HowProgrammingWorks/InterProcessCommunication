global.api = {};
api.cluster = require('cluster');
api.os = require('os');

global.application = {};
application.master = require('./master.js');
application.worker = require('./worker.js');

if (api.cluster.isMaster) application.master();
else application.worker();
