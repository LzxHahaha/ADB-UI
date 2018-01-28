import { ipcMain } from 'electron';
import adb from '../adb';

const loggers = {};

ipcMain.on('start-log', (event, device) => {
  const now = +new Date();
  const id = `${now}_${Math.ceil(Math.random() * now)}`;
  event.returnValue = id;

  const logger = adb.logcat({ device });
  loggers[id] = logger;

  logger.on('log', (data) => {
    event.sender.send('log', { id, data });
  });

  logger.start();
});

ipcMain.on('stop-log', (event, id) => {
  if (!loggers[id]) {
    return;
  }

  loggers[id].kill();
  delete loggers[id];
});
