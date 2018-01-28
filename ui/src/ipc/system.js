import { sendEvent } from './base';

export const exportFile = (content, filename, path = './logs') => {
  filename = filename || `${+new Date()}.log`;
  return sendEvent('write-file', { data: { content, path, filename } });
};

export const openFolder = (path) => {
  return sendEvent('open-folder', { data: { path } });
};
