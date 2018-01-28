import { ipcMain } from 'electron';
import adb from '../adb';

ipcMain.on('screen-cap', (event, args) => {
  adb.screenCapture(args.path, args.filename);
  event.returnValue = true;
});
