import childProcess from 'child_process';
import _p from 'path';
import fs from 'fs';

import _ from '../utils';
import Logcat from './Logcat';
import ScreenRecord from './ScreenRecord';

function exec(command) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, stdout) => {
      if (err) {
        return reject(err);
      }
      return resolve(stdout.toString().trim());
    });
  });
}

function adbCmd(device, args) {
  const base = device ? `adb -s ${device}` : 'adb';
  return exec(`${base} ${args}`);
}

function getCmd(device) {
  return (args) => adbCmd(device, args);
}

export default {
  continueExecute(cmd, device, onError, onOutput, onClose = () => {}) {
    const base = device ? ['-s', device] : [];
    const exe = childProcess.spawn('adb', base.concat(cmd));
    exe.stdout.on('data', d => onOutput(d.toString()));
    exe.stderr.on('data', d => onOutput(d.toString()));
    exe.on('close', onClose);
    exe.on('error', onError);

    return {
      on: exe.on,
      write: cmd => exe.stdin.write(base.concat(cmd).join(' ')),
      end: () => exe.stdin.end()
    };
  },

  async devices() {
    const listStr = await exec('adb devices');
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

  async screenCapture(basePath = '', filename = '') {
    basePath = _.getAbsolutePath(basePath);
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath);
    }
    if (!/\.\w+$/.test(filename)) {
      filename += '.png';
    }
    const name = _p.join(basePath, filename);
    await exec(`adb exec-out screencap -p > ${name}`);
    return name;
  },

  screenRecord(options) {
    return new ScreenRecord(options);
  },

  async baseInfo(device) {
    const cmd = getCmd(device);

    const model = await cmd('shell getprop ro.product.model');
    const androidId = await cmd('shell settings get secure android_id');
    const systemVersion = await cmd('shell getprop ro.build.version.release');
    const screenSize = {};
    for (let i of (await cmd('shell wm size')).split('\n')) {
      let match = i.match(/^(Physical|Override) size: (\d+x\d+)/);
      if (match) {
        screenSize[match[1].toLowerCase()] = match[2];
      }
    }
    const screenDensity = {};
    for (let i of (await cmd('shell wm size')).split('\n')) {
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

  async appList(device, name) {
    name = name ? ` "${name}"` : '';
    const list = (await adbCmd(device, `shell pm list packages${name}`)).split('\n');
    return list.map(el => el.trim().split(':')[1]);
  }
};
