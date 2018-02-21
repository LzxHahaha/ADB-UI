import adb from '../lib/adb';

export const getDevices = () => adb.devices();

export const getDeviceInfo = (device) => adb.baseInfo(device);

export const getCpuInfo = (device) => adb.cpuInfo(device);

export const getMemInfo = (device) => adb.memoryInfo(device);
