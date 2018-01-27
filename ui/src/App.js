import React from 'react';
import { Provider } from 'mobx-react';

import 'element-theme-default';
import './utils.css';
import styles from './App.css';

import RootStore from './store';

import AppRouter from './Router';
import DeviceList from './components/DeviceList';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={new RootStore()}>
        <div className={styles.container}>
          <AppRouter />
          <DeviceList />
        </div>
      </Provider>
    );
  }
}
