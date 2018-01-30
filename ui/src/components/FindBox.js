import React from 'react';
import { Icon } from 'antd';
import { remote, ipcRenderer } from 'electron';
import { observable, autorun } from 'mobx';
import { observer } from 'mobx-react';

import styles from './FindBox.css';

@observer
export default class FindBox extends React.Component {
  @observable show = false;
  @observable value = '';

  componentWillMount() {
    ipcRenderer.on('find', () => {
      this.toggle();
    });

    autorun(() => {
      if (this.show) {
        this.input && this.input.focus();
      } else {
        this.clearFind();
      }
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('find');
  }

  search = () => {
    if (!this.value) {
      return;
    }
    const options = {
      matchCase: true,
      medialCapitalAsWordStart: true
    };
    const webContent = remote.webContents.getFocusedWebContents();
    webContent && webContent.findInPage(this.value, options);
    this.input.focus();
  };

  clearFind = () => {
    const webContent = remote.webContents.getFocusedWebContents();
    webContent && webContent.stopFindInPage('clearSelection');
  };

  toggle = () => {
    this.show = !this.show;
  };

  onValueChange = (e) => {
    this.value = e.target.value;
  };

  render() {
    return (
      <div className={styles.container} style={{ display: this.show ? 'flex' : 'none' }}>
        <input ref={r => this.input = r} className={styles.input} value={this.value} onChange={this.onValueChange} />
        {/*<div className={styles.button}>*/}
          {/*<Icon type="up" />*/}
        {/*</div>*/}
        {/*<div className={styles.button}>*/}
          {/*<Icon type="down" />*/}
        {/*</div>*/}
        <div className={styles.button} onClick={this.search}>
        <Icon type="search" />
        </div>
        <div className={styles.line} />
        <div className={styles.button} onClick={this.toggle}>
          <Icon type="close" />
        </div>
      </div>
    );
  }
}
