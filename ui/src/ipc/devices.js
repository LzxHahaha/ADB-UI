import { sendEvent } from './base';

export const getDevices = () => sendEvent('get-devices');

export const getDeviceInfo = (device) => sendEvent('device-info', { data: { device } });

export const getCpuInfo = (device) => sendEvent('cpu-info', { data: { device } });

export const getMemInfo = (device) => sendEvent('memory-info', { data: { device } });
