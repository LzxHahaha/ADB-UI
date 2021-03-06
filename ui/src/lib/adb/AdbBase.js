import childProcess from 'child_process';
import { EventEmitter } from 'fbemitter';

export default class AdbBase {
  constructor(options = {}) {
    this._process = null;
    this._emitter = new EventEmitter();
    this._events = {};
    this._baseArgs = [];

    const { device = '' } = options;
    this.device = device;
  }

  _getArgs() {
    let args = [];
    if (this.device) {
      args.push('-s');
      args.push(this.device);
    }

    return args.concat(this._baseArgs).concat(this._getExtraArgs());
  }

  start() {
    if (this._process) {
      return false;
    }
    const cmd = `adb ${this._getArgs().join(' ')}`;
    console.log('adb exec:', cmd);
    this._process = childProcess.exec(cmd);

    this._process.stdout.on('data', (data) => this.onStdData(data.toString()));
    this._process.stderr.on('data', (data) => this.onStdError(data.toString()));
    this._process.on('close', (code) => this.onClose(code));
    this._process.on('error', (code) => this.onStdError(code));
  }

  reset() {
    this._process = null;
    this._emitter = new EventEmitter();
    this._events = {};
  }

  // send ctrl-c
  break() {
    try {
      this._process.stdin.write('\x03');
    } finally {
      this._process = null;
    }
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
    this.reset();
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

  emit(event, data) {
    return this._emitter.emit(event, data);
  }

  // 以下是用来覆盖的函数

  _getExtraArgs() { return []; }

  onStdData(data) {
    this.emit('data', data);
  }
  onStdError(data) {
    this.emit('error', data);
  }
  onClose(code) {
    this.emit('close', code);
    this.reset();
  }
  onError(err) {
    this.emit('error', err);
    this.reset();
  }
}
