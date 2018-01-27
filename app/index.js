import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';

import adb from './adb';

let win;

function createWindow () {
    win = new BrowserWindow({ width: 800, height: 600 });

    win.loadURL(url.format({
        pathname: path.join(__dirname, './resources/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('closed', () => {
        win = null
    });

    console.log(adb.devices());
}

app.on('ready', createWindow);

// 当全部窗口关闭时退出。
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
