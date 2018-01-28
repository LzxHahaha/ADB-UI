import { ipcRenderer } from 'electron';
import { EventEmitter } from 'fbemitter';

import { sendEvent } from './base';

export const screenCapture = (path, filename) => sendEvent('screen-cap', { data: { path, filename } });

export const startRecord = (device, path, filename, time = 180) => {
  const id = ipcRenderer.sendSync('start-record', {
    device, path, filename, time
  });
  const emitter = new EventEmitter();
  ipcRenderer.on('log', (event, arg) => {
    if (arg.id === id) {
      emitter.emit('log', arg.data);
    }
  });

  return { id, emitter };
};

export const stopRecord = (id) => sendEvent('stop-record', { data: { id } });
