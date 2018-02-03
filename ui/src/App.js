import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Provider } from 'mobx-react';

import './global.css';

import RootStore from './store';

import Startup from './pages/Startup';
import Device from './pages/Device';

export default () => (
  <LocaleProvider locale={zhCN}>
    <Provider store={new RootStore()}>
      <Router>
        <Switch>
          <Route path="/device/:device" component={Device} />
          <Route component={Startup} />
        </Switch>
      </Router>
    </Provider>
  </LocaleProvider>
)
