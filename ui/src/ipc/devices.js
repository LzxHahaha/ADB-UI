import { sendEvent } from './base';

export const getDevices = () => sendEvent('get-devices');