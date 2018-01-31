import { sendEvent, sendLongEvent } from './base';

export const screenCapture = (path, filename) => sendEvent('screen-cap', { data: { path, filename } });

export const startRecord = (device, phonePath, path, filename, time = 180) => {
  return sendLongEvent('screen-record', {
    data: { device, phonePath, path, filename, time }
  });
};
