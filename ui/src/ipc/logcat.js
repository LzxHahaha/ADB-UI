import { ipcRenderer } from 'electron';
import { EventEmitter } from 'fbemitter';

export const startLog = (device) => {
  const id = ipcRenderer.sendSync('start-log', device);
  const emitter = new EventEmitter();
  ipcRenderer.on('log', (event, arg) => {
    if (arg.id === id) {
      emitter.emit('log', arg.data);
    }
  });

  return { id, emitter };
};

export const stopLog = (id) => {
  ipcRenderer.send('stop-log', id);
};
