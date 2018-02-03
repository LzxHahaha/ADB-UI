import { listen } from './listen';
import adb from '../adb';

listen('get-devices', () => adb.devices());

listen('device-info', ({ device }) => adb.baseInfo(device));

listen('cpu-info', ({ device }) => adb.cpuInfo(device));

listen('memory-info', ({ device }) => adb.memoryInfo(device));
