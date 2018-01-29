import { ipcMain } from 'electron';

export const listen = (eventName, handler) => {
  ipcMain.on(eventName, async (e, request) => {
    const { id, data } = request;
    const response = { code: 200 };
    try {
      response.data = await handler(data);
    } catch (err) {
      response.code = err.code || 500;
      response.data = { message: err.message || 'Main thread error.' };
    }
    e.sender.send(`${eventName}_res_${id}`, response);
  });
};

export const listenLong = (eventName) => {
  return new Promise((resolve) => {
    ipcMain.on(eventName, (e, args) => {
      const {id, data} = args;
      const server = new LongEventServer({
        eventName, id, data,
        sender: e.sender
      });
      ipcMain.on(server._getEventName('start'), () => server.onStart(server.startData));
      ipcMain.on(server._getEventName('stop'), () => server.onStop());
      ipcMain.on(server._getEventName('disconnect'), () => {
        ['start', 'stop', 'disconnect'].forEach(el => ipcMain.removeAllListeners(server._getEventName(el)));
        server.onDisconnect();
      });
      resolve(server);
    })
  });
}

class LongEventServer {
  constructor({ eventName, id, data, sender }) {
    this.eventName = eventName;
    this.id = id;
    this.startData = data;
    this.sender = sender;

    this.onStart = () => {};
    this.onStop = () => {};
    this.onDisconnect = () => {};
  }

  _getEventName(event) {
    return `${this.eventName}_${this.id}_${event}`;
  }

  emit(event, data) {
    this.sender.send(this._getEventName(event), data);
  }
}
