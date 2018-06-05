import _p from 'path';
import fs from 'fs';
import childProcess from 'child_process';

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

  onStdData(data) {
    // 这个指令讲道理不会有输出，有的话都是错误
    this.emit('exception', data);
  }

  onClose(code) {
    try {
      childProcess.execSync(`adb pull ${this._tempFile} ${this._outputPath}/.`);
    } catch (err) {
      console.error(err);
    }

    super.onClose(code);
  }

  start() {
    if (!fs.existsSync(this._outputPath)) {
      fs.mkdirSync(this._outputPath);
    }
    super.start();
  }
}
