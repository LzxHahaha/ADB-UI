import _p from 'path';

export default {
  getAbsolutePath(path, basePath) {
    basePath = basePath || __dirname;
    if (basePath && !_p.isAbsolute(basePath)) {
      throw new Error('basePath should be absolute');
    }

    if (_p.isAbsolute(path)) {
      return path;
    }

    return _p.resolve(basePath, path);
  }
};
