import 'babel-polyfill';
import { app, BrowserWindow, Menu, shell } from 'electron';
import path from 'path';
import url from 'url';

import packageInfo from '../package.json';

import adb from './adb';
import './ipc';
import { listen } from './ipc/listen';

let win;

function createWindow () {
  win = new BrowserWindow({
    title: 'ADB UI',
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      webSecurity: false,
      nodeIntegrationInWorker: true
    }
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000/');
    win.webContents.openDevTools();
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, './resources/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  const menu = Menu.buildFromTemplate([
    // {
    //   label: '功能',
    //   submenu: [
    //     {
    //       label: '查找',
    //       accelerator: 'CmdOrCtrl+F',
    //       click: () => win.webContents.send('find')
    //     }
    //   ]
    // },
    {
      label: '帮助',
      submenu: [
        {
          label: '问题反馈',
          click: () => shell.openExternal('https://github.com/LzxHahaha/ADB-UI/issues')
        },
        {
          label: '当前版本：' + packageInfo.version
        }
      ]
    }
  ]);
  // Menu.setApplicationMenu(menu);

  win.on('closed', () => {
    win = null
  });

  // start server
  adb.startServer();
  listen('quit', () => app.quit());
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});
