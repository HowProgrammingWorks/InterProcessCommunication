"use strict";

let ps = require('process');
let api = {};
global.api = api;
api.net = require('net');
api.rand_int = (max) => Math.floor(Math.random() * max);


// server configuration
const REQUIRED_CONN = parseInt(ps.argv[2] || 2);
const clients = [];


// Data
const DATA_SIZE = 100 * REQUIRED_CONN + api.rand_int(REQUIRED_CONN);
const DATA = Array(DATA_SIZE).fill().map(() => api.rand_int(7 * REQUIRED_CONN));
let responses = [];
console.log(`DATA: ${DATA}`);


function send_task(conn, idx) {
  const part_size = Math.floor(DATA_SIZE / clients.length);

  // Calculate subtask bounds
  let from = part_size * idx; 
  let to = part_size * (idx + 1);
  if (idx === DATA.length - 1) to = DATA.length;

  const task_def = {
    idx: idx,
    data: DATA.slice(from, to),
  };

  conn.write(JSON.stringify(task_def));
}


function on_client_response(response) {
  console.log(`Data received (by server): ${response}`);
  const response_ = JSON.parse(response);
  responses.push(response_);
  if (responses.length === clients.length) {
    responses.sort((left, right) => left.idx - right.idx);
    let result = responses.reduce((ac, i) => ac.concat(i.result), []);
    console.log(`Final result: ${result}`);
    responses.length = 0;

    while (clients.length > 0) { clients.pop().end(); }
  };
}


console.log(`Waiting for ${REQUIRED_CONN} clients to connect`);
var server = api.net.createServer((conn) => {
  // Drop connection if already have enough clients 
  if (clients.length >= REQUIRED_CONN) {conn.end(); return;}

  console.log(`Connected: ${conn.localAddress}`);
  clients.push(conn);

  // If we have enough clients, run distributed task
  if (clients.length === REQUIRED_CONN) clients.map(send_task);

  if (clients.length < REQUIRED_CONN) {
    console.log(`Need ${REQUIRED_CONN - clients.length} clients to connect`);
  }

  conn.on('data', on_client_response);

  conn.on('end', () => {
    clients.splice(clients.indexOf(conn), 1);
    console.log('Client disconnected');
    console.log(`Need ${REQUIRED_CONN - clients.length} clients to connect`);
  });
}).listen(2000);
