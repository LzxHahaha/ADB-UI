import React from 'react';
import { Provider } from 'mobx-react';

import './global.css';

import RootStore from './store';

import AppContainer from './Container';

export default class App extends React.Component {
  // constructor(props) {
  //   super(props);
  //
  //   // 开发时刷新使用
  //   if (window.location.pathname !== '/') {
  //     window.location = '/';
  //   }
  // }

  render() {
    return (
      <Provider store={new RootStore()}>
        <AppContainer />
      </Provider>
    );
  }
}
