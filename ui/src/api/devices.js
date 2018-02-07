import { get } from './request';

export const getDevices = () => get('/adb/device/list');
