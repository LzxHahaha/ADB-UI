import { ipcRenderer } from 'electron';

export const sendEvent = (event, ...args) => {
  return new Promise((resolve) => {
    return resolve(ipcRenderer.sendSync(event, ...args));
  });
};

export const sendEventAsync = (event, responseEvent, ...args) => {
  return new Promise(resolve => {
    ipcRenderer.send(event, ...args);
    ipcRenderer.on(responseEvent, (event, args) => {
      resolve(args);
    });
  });
};
