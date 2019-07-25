import { shell } from 'electron';
import fs from 'fs';
import _p from 'path';

import { listen } from './listen';
import _ from '../utils';

listen('write-file', (data) => {
  const { content, filename } = data;
  let basePath = _.mkdir(data.path);
  const filePath = _p.join(basePath, filename);
  fs.writeFileSync(filePath, content);
  event.returnValue = filePath;
  shell.showItemInFolder(filePath);
});

listen('open-folder', (data) => {
  shell.showItemInFolder(_.getAbsolutePath(data.path));
});
