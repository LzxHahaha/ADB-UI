import { sendLongEvent } from './base';

export const startLog = ({ device, format, filters }) => {
  return sendLongEvent('log', { data: { device, format, filters } });
};
