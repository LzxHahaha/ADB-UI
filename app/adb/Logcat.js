import AdbBase from './AdbBase';

export default class Logcat extends AdbBase {
  constructor(options) {
    super(options);
    this._baseArgs = ['logcat'];
  }

  onStdData(data) {
    this.emit('log', data);
  }
}
