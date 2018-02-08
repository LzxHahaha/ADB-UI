import { sendEvent } from './base';

export const quit = () => sendEvent('quit');

export const exportFile = (content, filename, path) => {
  filename = filename || `file_${+new Date()}`;
  return sendEvent('write-file', { data: { content, path, filename } });
};

export const openFolder = (path) => {
  return sendEvent('open-folder', { data: { path } });
};
