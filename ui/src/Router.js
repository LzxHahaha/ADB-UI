import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';

export default (props) => (
  <div style={{flex: 1}}>
    <Router>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  </div>
);
