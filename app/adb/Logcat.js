import childProcess from 'child_process';
import { EventEmitter } from 'fbemitter';

export default class Logcat {
  constructor(options = {}) {
    this._process = null;
    this._emitter = new EventEmitter();
    this._events = {};

    const { device } = options;
    this.device = device;
  }

  getArgs() {
    const args = ['logcat'];
    if (this.device) {
      args.push('-s');
      args.push(this.device);
    }

    return args;
  }

  start() {
    if (this._process) {
      console.warn('Already started.');
      return;
    }

    this._process = childProcess.spawn('adb', this.getArgs());

    this._process.stdout.on('data', (data) => {
      this._emitter.emit('log', data.toString());
    });

    this._process.stderr.on('data', (data) => {
      this._emitter.emit('error', data.toString());
    });

    this._process.on('close', (code) => {
      this._emitter.emit('close', code);
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
