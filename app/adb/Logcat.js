import childProcess from 'child_process';

import AdbBase from './AdbBase';

export default class Logcat extends AdbBase {
  constructor(options) {
    super(options);
    this._baseArgs = ['logcat'];
  }

  _getExtraArgs() {
    const args = [];
    // ...
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
      this.reset();
    });
  }
}
