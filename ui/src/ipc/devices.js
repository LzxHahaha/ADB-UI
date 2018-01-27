import { ipcRenderer } from 'electron';

export const getDevices = () => ipcRenderer.sendSync('get-devices');