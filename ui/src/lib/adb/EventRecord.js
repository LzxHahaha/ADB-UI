import AdbBase from './AdbBase';

export default class ScreenRecord extends AdbBase {
  constructor(options = {}) {
    super(options);
    this._baseArgs = ['shell', 'getevent', '-t'];

    this._events = [];
  }

  _getExtraArgs() {
    return [];
  }

  onStdData(data) {
    this._events.push(data);
  }

  getEvents() {
    let i = 0;
    for (; i < this._events.length; ++i) {
      if (/^\[.+/.test(this._events[i])) {
        break;
      }
    }
    const eventStr = this._events.slice(i);
    return eventStr.map((el) => {
      // TODO: 解析
      return el;
    });
  }
}
