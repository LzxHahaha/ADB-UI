import _p from 'path';
import fs from 'fs';


function getAbsolutePath(path, basePath) {
  basePath = basePath || window.$dirname;
  if (basePath && !_p.isAbsolute(basePath)) {
    throw new Error('basePath should be absolute');
  }

  if (_p.isAbsolute(path)) {
    return path;
  }

  return _p.resolve(basePath, path);
}


function mkdir(path, basePath) {
  const dirPath = getAbsolutePath(path, basePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return dirPath;
}

export default {
  getAbsolutePath,
  mkdir
};
