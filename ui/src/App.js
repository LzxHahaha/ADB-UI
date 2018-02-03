import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'mobx-react';

import './global.css';

import RootStore from './store';

import Startup from './pages/Startup';
import Device from './pages/Device';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={new RootStore()}>
        <Router>
          <Switch>
            <Route path="/device/:device" component={Device} />
            <Route component={Startup} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}
