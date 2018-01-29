import adb from '../adb';
import { listenLong } from './listen';

listenLong('log', (eventServer) => {
  let logger = null;
  eventServer.onStart = (data) => {
    logger = adb.logcat(data);

    logger.on('log', (log) => {
      eventServer.emit('log', log);
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

