import { ipcMain } from 'electron';
import adb from '../adb';

ipcMain.on('get-devices', (event) => {
  event.returnValue = adb.devices();
});

