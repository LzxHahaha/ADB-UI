import { listen } from './listen';
import adb from '../adb';

listen('get-devices', () => adb.devices());

