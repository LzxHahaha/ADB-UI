import childProcess from 'child_process';
import { EventEmitter } from 'fbemitter';

export default class Logcat {
  constructor() {
    this._process = null;
    this._emitter = new EventEmitter();
    this._events = {};
  }

  start() {
    if (this._process) {
      console.warn('Already started.');
      return;
    }

    this._process = childProcess.spawn('adb', ['logcat']);

    this._process.stdout.on('data', (data) => {
      console.log(`output: ${data}`);
      this._emitter.emit('log', data);
    });

    this._process.stderr.on('data', (data) => {
      console.log(`error: ${data}`);
      this._emitter.emit('error', data);
    });

    this._process.on('close', (code) => {
      console.log(`close: ${code}`);
      this._process = null;
      this._emitter = new EventEmitter();
      this._events = {};
    });
  }

  // send ctrl-c
  stop() {
    this._process.stdin.write('\x03');
  }

  restart() {
    this.kill();
    this.start();
  }

  kill() {
    this._process.kill();
  }

  on(event, cb) {
    this._events[event] = this._emitter.addListener(event, cb);
  }

  removeEvnet(event) {
    if (!this._events[event]) {
      return;
    }

    this._events[event].remove();
  }
}
