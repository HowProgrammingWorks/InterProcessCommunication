'use strict';

const cluster = require('node:cluster');

if (cluster.isPrimary) {
  require('./primary.js');
} else {
  require('./worker.js');
}
