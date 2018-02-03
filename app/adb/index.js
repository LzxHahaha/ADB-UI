import childProcess from 'child_process';
import _p from 'path';
import fs from 'fs';

import _ from '../utils';
import Logcat from './Logcat';
import ScreenRecord from './ScreenRecord';

function exec(command, options = {}) {
  const { encoding, start, end, ...other } = options;
  const buffer = childProcess.execSync(command, other);
  return buffer.toString(encoding, start, end).trim();
}

function adbCmd(device, args) {
  const base = device ? `adb -s ${device}` : 'adb';
  return exec(`${base} ${args}`);
}

function getCmd(device) {
  return (args) => adbCmd(device, args);
}

export default {
  startServer() {
    return exec('adb start-server');
  },

  killServer() {
    return exec('adb kill-server');
  },

  devices() {
    const listStr = exec('adb devices');
    const list = listStr.trim().split('\n');
    list.shift();
    return list.filter(el => {
      // 过滤adb server启动时的信息
      return !/^\*.+\*$/.test(el);
    }).map(el => {
      const tmp = el.trim().split('\t');
      return {
        serialNumber: tmp[0],
        state: tmp[1]
      }
    });
  },

  logcat(options) {
    return new Logcat(options);
  },

  screenCapture(basePath, filename) {
    basePath = _.getAbsolutePath(basePath);
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath);
    }
    if (!/\.\w+$/.test(filename)) {
      filename += '.png';
    }
    const name = _p.join(basePath, filename);
    exec(`adb exec-out screencap -p > ${name}`);
    return name;
  },

  screenRecord(options) {
    return new ScreenRecord(options);
  },

  baseInfo(device) {
    const cmd = getCmd(device);

    const model = cmd('shell getprop ro.product.model');
    const androidId = cmd('shell settings get secure android_id');
    const systemVersion = cmd('shell getprop ro.build.version.release');
    const screenSize = {};
    for (let i of cmd('shell wm size').split('\n')) {
      let match = i.match(/^(Physical|Override) size: (\d+x\d+)/);
      if (match) {
        screenSize[match[1].toLowerCase()] = match[2];
      }
    }
    const screenDensity = {};
    for (let i of cmd('shell wm size').split('\n')) {
      let match = i.match(/^(Physical|density) size: (\d+)/);
      if (match) {
        screenDensity[match[1].toLowerCase()] = match[2];
      }
    }

    return {
      model,
      screenSize,
      screenDensity,
      androidId,
      systemVersion
    };
  },

  cpuInfo(device) {
    return adbCmd(device, 'shell cat /proc/cpuinfo');
  },

  memoryInfo(device) {
    return adbCmd(device, 'shell cat /proc/meminfo');
  },

  appList(device, name) {
    name = name ? ` "${name}"` : '';
    const list = adbCmd(device, `shell pm list packages${name}`).split('\n');
    return list.map(el => el.trim().split(':')[1]);
  }
};
