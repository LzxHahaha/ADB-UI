import fs from 'fs';
import _p from 'path';
import { remote } from 'electron';

import _ from '../utils';

export const exportFile = (content, filename, path = '.') => {
  let basePath = _.mkdir(path);
  const filePath = _p.join(basePath, filename);
  fs.writeFileSync(filePath, content);
  remote.shell.showItemInFolder(filePath);
  return filePath;
};

export const openFolder = (path) => {
  remote.shell.showItemInFolder(_.getAbsolutePath(path));
};
