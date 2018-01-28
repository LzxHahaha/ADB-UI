import { ipcMain, shell, clipboard } from 'electron';
import fs from 'fs';
import path from 'path';

import _ from '../utils';

ipcMain.on('write-file', (event, arg) => {
  const { content, filename } = arg;
  let basePath = _.getAbsolutePath(arg.path);
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
  }
  const filePath = path.join(basePath, filename);
  fs.writeFileSync(filePath, content);
  event.returnValue = filePath;
  shell.showItemInFolder(filePath);
});

ipcMain.on('copy', (event, arg) => {
  clipboard.writeText(arg);
});

ipcMain.on('read-copy', (event, arg) => {
  clipboard.readText(arg);
});

ipcMain.on('open-folder', (event, basePath) => {
  shell.showItemInFolder(_.getAbsolutePath(basePath));
});
