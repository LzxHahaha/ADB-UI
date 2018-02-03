import { sendEvent } from './base';

export const getDevices = () => sendEvent('get-devices');

export const getDeviceInfo = (device) => sendEvent('device-info', { data: { device } });
