import listen from './listen';
import adb from '../adb';

listen('screen-cap', (args) => adb.screenCapture(args.path, args.filename));
