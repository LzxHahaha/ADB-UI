import AdbBase from './AdbBase';

export default class Logcat extends AdbBase {
  constructor(options) {
    super(options);
    this._baseArgs = ['logcat'];

    const { format = '', filters = [] } = options;
    this.format = format;
    this.filters = filters;
  }

  _getExtraArgs() {
    let args = [];
    if (this.format) {
      args.push('-v');
      args.push(this.format);
    }
    if (this.filters.length) {
      args = args.concat(this.filters.map(el => `"${el.tag}:${el.level}"`));
    }

    return args;
  }

  onStdData(data) {
    this.emit('log', data);
  }
}
