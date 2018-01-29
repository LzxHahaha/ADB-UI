import { EventEmitter } from 'fbemitter';

export default class AdbBase {
  constructor(options = {}) {
    this._process = null;
    this._emitter = new EventEmitter();
    this._events = {};
    this._baseArgs = [];

    const { device } = options;
    this.device = device;
  }

  _getExtraArgs() { return []; }

  getArgs() {
    const args = [...this._baseArgs];
    if (this.device) {
      args.push('-s');
      args.push(this.device);
    }

    return args.concat(this._getExtraArgs());
  }

  start() {}

  reset() {
    this._process = null;
    this._emitter = new EventEmitter();
    this._events = {};
  }

  // send ctrl-c
  break() {
    this._process.stdin.write('\x03');
  }

  restart() {
    this.kill();
    this.start();
  }

  kill() {
    if (!this._process) {
      return;
    }
    this._process.kill();
  }

  on(event, cb) {
    this._events[event] = this._emitter.addListener(event, cb);
  }

  removeEvent(event) {
    if (!this._events[event]) {
      return;
    }

    this._events[event].remove();
  }
}
