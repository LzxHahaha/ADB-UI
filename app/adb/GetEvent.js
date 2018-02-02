import AdbBase from './AdbBase';

export default class ScreenRecord extends AdbBase {
  constructor(options = {}) {
    super(options);
    this._baseArgs = ['shell', 'getevent', '-l'];
  }

  _getExtraArgs() {
    return [];
  }


}
