import { sendLongEvent } from './base';

export const startLog = (device) => {
  return sendLongEvent('log', { data: { device } });
};
