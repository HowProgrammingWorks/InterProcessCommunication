'use strict';

global.api = {};
api.cluster = require('cluster');
api.os = require('os');

if (api.cluster.isMaster) {
  require('./master.js')();
} else {
  require('./worker.js')();
}
