'use strict';

exports.Queue = Queue;
//simple queue for workers
function Queue() {
  //free workers
  this.queue = [];
  //functions waiting for worker
  this.process = [];
}

Queue.prototype.size = function() {
  return this.queue.length;
};

Queue.prototype.canGet = function() {
  return this.queue.length > 0;
};

Queue.prototype.put = function(data) {
  this.queue.push(data);
  if (this.process.length > 0) {
    const fn = this.process.shift();
    const item = this.get();
    fn(item, () => {
      this.put(item);
    });
  }
};

Queue.prototype.get = function() {
  return this.queue.shift();
};

Queue.prototype.use = function(func) {
  if (this.queue.length > 0) {
    const worker = this.get();
    func(worker, () => {
      this.put(worker);
    });
  } else {
    this.process.push(func);
  }
};

Queue.prototype.clear = function() {
  this.queue = [];
};
