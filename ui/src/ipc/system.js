import { ipcRenderer } from 'electron';

export const exportFile = (content, filename, path = './logs') => {
  filename = filename || `${+new Date()}.log`;
  return ipcRenderer.sendSync('write-file', { content, path, filename });
};

export const openFolder = (path) => {
  return ipcRenderer.send('open-folder', path);
};
