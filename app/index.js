import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';

import './ipc';

let win;

function createWindow () {
  win = new BrowserWindow({
    title: 'ADB UI'
  });

  if (process.env.NODE_ENV === 'production') {
    win.loadURL(url.format({
      pathname: path.join(__dirname, './resources/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  } else {
    win.loadURL('http://localhost:3000/');
    win.webContents.openDevTools();
  }

  // win.setMenu(null);

  win.on('closed', () => {
    win = null
  });
}

app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (win === null) {x
    createWindow()
  }
});
