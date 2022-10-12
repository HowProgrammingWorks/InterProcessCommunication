'use strict';

const cluster = require('node:cluster');

if (cluster.isMaster) {
  require('./master.js');
} else {
  require('./worker.js');
}
