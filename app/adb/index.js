import childProcess from 'child_process';

import Logcat from './Logcat';

function exec(command, options) {
    const { encoding, start, end, ...other } = options;
    const buffer = childProcess.execSync(command, other);
    return buffer.toString(encoding, start, end);
}

export default {
    startServer() {
        return exec('adb start-server');
    },

    killServer() {
        return exec('adb kill-server');
    },

    devices() {
        const listBuffer = childProcess.execSync('adb devices');
        const list = listBuffer.toString().trim().split('\n');
        list.shift();
        return list.map(el => {
            const tmp = el.trim().split('\t');
            return {
                serialNumber: tmp[0],
                state: tmp[1]
            }
        });
    },

    logcat() {
        return new Logcat();
    }
};
