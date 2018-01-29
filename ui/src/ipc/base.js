import { ipcRenderer } from 'electron';
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
        reject(response.data);
      }
    });
    ipcRenderer.send(eventName, { id, data });
  });
};

export const sendLongEvent = (eventName, options = {}) => {
  const { data } = options;
  const id = uuid.v1();
  const client =  new LongEventClient(id, eventName, data);
  client.connect();
  return client;
};

class LongEventClient {
  constructor(id, eventName, data) {
    this.id = id;
    this.eventName = eventName;
    this.startData = data;
  }

  _getEventName(event) {
    return `${this.eventName}_${this.id}_${event}`;
  }

  connect() {
    ipcRenderer.send(this.eventName, { id, data: this.startData });
  }

  start() {
    ipcRenderer.send(this._getEventName('start'));
  }

  stop() {
    ipcRenderer.send(this._getEventName('stop'));
  }

  disconnect() {
    ipcRenderer.send(this._getEventName('disconnect'));
  }

  on(event, handler) {
    const listener = (e, response) => handler(response);
    ipcRenderer.on(this._getEventName(event), listener);
    return listener;
  }

  remove(event, listener) {
    ipcRenderer.removeListener(this._getEventName(event), listener);
  }

  removeAll(event) {
    ipcRenderer.removeAllListeners(this._getEventName(event));
  }
}
