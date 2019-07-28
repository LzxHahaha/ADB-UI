import React from 'react';
import ReactDOM from 'react-dom';
import { remote } from 'electron';
import path from 'path';

import App from './App';
import _ from './lib/utils';

const root = path.parse(remote.app.getAppPath('userData')).root;
_.mkdir('.adbui', root);
window.$dirname = path.resolve(root, '.adbui');

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
