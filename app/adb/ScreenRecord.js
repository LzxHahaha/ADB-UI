import childProcess from 'child_process';
import _p from 'path';

import _ from '../utils';
import AdbBase from './AdbBase';

export default class ScreenRecord extends AdbBase {
  constructor(options = {}) {
    super(options);
    const { path, filename } = options;

    const basePath = _.getAbsolutePath(path);
    this._outputFile = _p.join(basePath, filename);

    this._baseArgs = ['shell', 'screenrecord', `/sdcard`];
  }
}
