import AdbBase from './AdbBase';

export default class EventRecord extends AdbBase {
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

    const events = eventStr.map((el) => {
      const [, timestamp, device, type, code, value] = /^[]/.match(el);
      return {
        timestamp: parseFloat(timestamp),
        device,
        type: parseInt(type, 16),
        code: parseInt(code, 16),
        value: parseInt(value, 16),
        next: 0
      };
    });
    for (let i = 0; i < events.length - 1; ++i) {
      events[i].next = events[i + 1].timestamp - events[i].timestamp;
    }

    return events;
  }

  execute() {

  }
}
