import _p from 'path';
import net from 'net';


export const getAbsolutePath = (path, basePath) => {
  basePath = basePath || __dirname;
  if (basePath && !_p.isAbsolute(basePath)) {
    throw new Error('basePath should be absolute');
  }

  if (_p.isAbsolute(path)) {
    return path;
  }

  return _p.resolve(basePath, path);
};

export const portUsable = (port) => {
  return new Promise(resolve => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
};

export const getUsablePort = async (port) => {
  port = +port || 2333;
  while (!await portUsable(port)) {
    ++port;
  }
  return port;
};