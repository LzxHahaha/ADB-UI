import { ipcRenderer } from 'electron';
import { message } from 'antd';
import uuid from 'uuid';

export const sendEvent = (eventName, options = {}) => {
  const { data } = options;

  const id = uuid.v1();
  const responseEvent = `${eventName}_res_${id}`;

  return new Promise((resolve, reject) => {
    ipcRenderer.once(responseEvent, (event, response) => {
      if (response.code === 200) {
        resolve(response.data);
      } else {
        message.error(response.data);
        reject(response.data);
      }
    });
    ipcRenderer.send(eventName, { id, data });
  });
};

export const sendLongEvent = (eventName, options = {}) => {
  const { data } = options;
  const client =  new LongEventClient(eventName, data);
  client.connect();
  return client;
};

class LongEventClient {
  constructor(eventName, data) {
    this.id = uuid.v1();
    this.eventName = eventName;
    this.startData = data;

    this.events = new Map();
  }

  _getEventName(event) {
    return `${this.eventName}_${this.id}_${event}`;
  }

  connect() {
    ipcRenderer.send(this.eventName, { id: this.id, data: this.startData });
  }

  start() {
    ipcRenderer.send(this._getEventName('start'));
  }

  stop() {
    ipcRenderer.send(this._getEventName('stop'));
    this.clearEvents();
  }

  disconnect() {
    ipcRenderer.send(this._getEventName('disconnect'));
    this.clearEvents();
  }

  on(event, handler) {
    let count = this.events.get(event);
    if (!count) {
      this.events.set(event, 1);
    } else {
      this.events.set(event, count + 1);
    }

    const listener = (e, response) => handler(response);
    ipcRenderer.on(this._getEventName(event), listener);
    return listener;
  }

  remove(event, listener) {
    let count = this.events.get(event);
    if (!count) {
      return;
    }
    count -= 1;
    if (count === 0) {
      this.events.delete(event);
    }

    ipcRenderer.removeListener(this._getEventName(event), listener);
  }

  removeAll(event) {
    this.events.delete(event);
    ipcRenderer.removeAllListeners(this._getEventName(event));
  }

  clearEvents() {
    this.events.forEach((v, k) => this.removeAll(k));
  }
}
