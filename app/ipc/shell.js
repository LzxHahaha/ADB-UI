import { listen, listenLong } from './listen';
import adb from '../adb';

listen('screen-cap', (args) => adb.screenCapture(args.path, args.filename));

listenLong('screen-record', (eventServer) => {
  let logger = null;
  eventServer.onStart = (data) => {
    logger = adb.screenRecord(data);

    logger.on('exception', (log) => {
      eventServer.emit('exception', log);
    });

    logger.start();
  };

  eventServer.onStop = () => {
    if (!logger) {
      return;
    }
    logger.kill();
    logger = null;
  };
});

listen('app-list', (data) => adb.appList(data.device, data.name));
