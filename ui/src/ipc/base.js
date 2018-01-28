import { ipcRenderer } from 'electron';
import uuid from 'uuid';

export const sendEvent = (eventName, options = {}) => {
  const { data } = options;

  const id = uuid.v1();
  const responseEvent = `${eventName}_res_${id}`;

  return new Promise((resolve, reject) => {
    ipcRenderer.on(responseEvent, (event, response) => {
      if (response.code === 200) {
        resolve(response.data);
        ipcRenderer.removeAllListeners(responseEvent);
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

  const getResponseEvent = n => `${eventName}_res_${id}_${n}`;

  // TODO: 改成一个类，参考一下websocket
  const emitter = {
    listen: (event, handle) => {
      const listener = (e, response) => {
        handle(response.data);
      };
      ipcRenderer.on(getResponseEvent(event), listener);
      return listener;
    },
    remove: (event, listener) => {
      ipcRenderer.removeListener(getResponseEvent(event), listener);
    },
    stop: (event) => {
      ipcRenderer.removeAllListeners(getResponseEvent(event));
    }
  };

  ipcRenderer.send(eventName, { id, data });

  return { id, emitter };

};
