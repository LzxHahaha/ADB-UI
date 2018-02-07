import { get } from './request';

export const getDevices = () => get('/adb/device/list');

export const getDeviceInfo = (device) => get('/adb/device/info/base', { device });

export const getCpuInfo = (device) => get('/adb/device/info/cpu', { device });

export const getMemInfo = (device) => get('/adb/device/info/memory', { device });
