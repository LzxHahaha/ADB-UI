import React from 'react';
import ReactDOM from 'react-dom';
import { remote } from 'electron';

import App from './App';

window.$dirname = remote.app.getAppPath();

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
