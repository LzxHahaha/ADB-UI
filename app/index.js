import 'babel-polyfill';
import { app, BrowserWindow, Menu, shell, ipcMain } from 'electron';
import path from 'path';
import url from 'url';

import packageInfo from '../package.json';

import adb from './adb';
import server from './server';
import './ipc';
import { listen } from './ipc/listen';
import { getUsablePort } from './utils';

let win;

function createWindow () {
  win = new BrowserWindow({
    title: 'ADB UI',
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#FAFAFA',
    show: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegrationInWorker: true
    }
  });
  win.once('ready-to-show', () => {
    win.show()
  });

  getUsablePort().then(port => server.listen(port, () => {
    console.log(`listening on port: ${port}`);
  }));

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

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000/');
    win.webContents.openDevTools();
    Menu.setApplicationMenu(menu);
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, './resources/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.on('closed', () => win = null);

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
