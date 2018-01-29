import { shell, clipboard } from 'electron';
import fs from 'fs';
import _p from 'path';

import { listen } from './listen';
import _ from '../utils';

listen('write-file', (data) => {
  console.log(data);
  const { content, filename } = data;
  let basePath = _.getAbsolutePath(data.path);
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
  }
  const filePath = _p.join(basePath, filename);
  fs.writeFileSync(filePath, content);
  event.returnValue = filePath;
  shell.showItemInFolder(filePath);
});

listen('open-folder', (data) => {
  shell.showItemInFolder(_.getAbsolutePath(data.path));
});
