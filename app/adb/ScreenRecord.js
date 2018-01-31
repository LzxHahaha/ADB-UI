import childProcess from 'child_process';
import _p from 'path';
import fs from 'fs';

import _ from '../utils';
import AdbBase from './AdbBase';

export default class ScreenRecord extends AdbBase {
  constructor(options = {}) {
    super(options);
    const { phonePath, path, filename, time } = options;

    this._outputPath = _.getAbsolutePath(path);
    this._phonePath = phonePath || '/data';
    this._tempFile = _p.join(this._phonePath, filename).replace(/\\/g, '/');
    this._time = time || 180;

    this._baseArgs = ['shell', 'screenrecord'];
  }

  _getExtraArgs() {
    return [this._tempFile, `--time=${this._time}`];
  }

  start() {
    if (!fs.existsSync(this._outputPath)) {
      fs.mkdirSync(this._outputPath);
    }

    this._process = childProcess.spawn('adb', this.getArgs());

    this._process.stdout.on('data', (data) => {
      // 这个指令讲道理不会有输出，有的话都是错误
      this._emitter.emit('exception', data.toString());
    });

    this._process.stderr.on('data', (data) => {
      this._emitter.emit('error', data.toString());
    });

    this._process.on('close', (code) => {
      this._emitter.emit('end', code);
      childProcess.execSync(`adb pull ${this._tempFile} ${this._outputPath}/.`);
      this.reset();
    });
  }
}
