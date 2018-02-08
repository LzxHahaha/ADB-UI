import 'babel-polyfill';
import cluster from 'cluster';
import { app, BrowserWindow, Menu, shell, ipcMain } from 'electron';
import path from 'path';
import url from 'url';

import packageInfo from '../package.json';

import adb from './adb';
import server from './server';
import { listen } from './ipc/listen';
import { getUsablePort } from './utils';

let serverPort = 9513;

if (cluster.isMaster) {
  require('./ipc');

  let win;

  app.on('ready', () => {
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

    // start server process
    const startWorker = () => {
      const worker = cluster.fork();
      worker.on('message', msg => {
        serverPort = +msg;
        win.webContents.send('api-port', serverPort);
      });
    };
    let worker = startWorker();

    ipcMain.on('get-api-port', (event) => event.returnValue = serverPort);

    // daemon
    cluster.on('exit', () => worker = startWorker());

    win.once('ready-to-show', () => win.show());

    // electron config
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
    } else {
      Menu.setApplicationMenu(menu);
      win.loadURL(url.format({
        pathname: path.join(__dirname, './resources/index.html'),
        protocol: 'file:',
        slashes: true
      }));
    }
    win.on('closed', () => win = null);

    // start adb server
    adb.startServer();

    listen('quit', () => app.quit());
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });
} else {
  // start koa server
  getUsablePort(serverPort).then(port => server.listen(port, (err) => {
    if (err) {
      console.error(err);
    }
    process.send(port);
    console.log(`listening on port: ${port}`);
  }));
}
