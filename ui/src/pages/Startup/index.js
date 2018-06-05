import React from 'react';
import { observer, inject } from 'mobx-react';
import { autorun } from 'mobx';
import { Button, List, message } from 'antd';
import { remote } from 'electron';

import { sendEvent } from '../../lib/ipc';

import styles from './index.css';

import logoImage from '../../resources/adb.png';

@inject(({ store }) => store.devices)
@observer
export default class Startup extends React.Component {
  async componentWillMount() {
    autorun(() => {
      if (this.props.list.length === 0) {
        this.current = null;
      } else if (!this.current || !this.props.list.find(el => el.serialNumber === this.current)) {
        this.current = this.props.list[0].serialNumber;
      }
    });
    await this.props.rootStore.devices.getDevices();
  }

  minimize() {
    const window = remote.getCurrentWindow();
    window.minimize();
  }

  onRefreshClick = async () => {
    await this.props.rootStore.devices.getDevices();
    message.success('设备列表已刷新');
  };

  onDeviceClick(id) {
    const BrowserWindow = remote.BrowserWindow;
    let win = new BrowserWindow({
      title: 'ADB UI',
      width: 1200,
      height: 850,
      webPreferences: {
        webSecurity: false,
        nodeIntegrationInWorker: true
      }
    });
    win.on('close', () => win = null);
    win.loadURL(window.location.href + `device/${id}`);
  }

  renderListHeader = () => (
    <div className={styles.title}>
      <span className={styles.titleText}>设备列表</span>
    </div>
  );

  renderListItem = (el) => (
    <List.Item key={el.serialNumber}>
      <div className={styles.item}>
        {el.serialNumber}
        <Button size="small" onClick={() => this.onDeviceClick(el.serialNumber)}>连接</Button>
      </div>
    </List.Item>
  );

  render() {
    return (
      <div className={styles.container}>
        <img src={logoImage} alt="logo" />
        <List
          className={styles.list}
          bordered
          dataSource={this.props.list}
          renderItem={this.renderListItem}
        />
        <div className={styles.buttons}>
          <Button shape="circle" icon="sync" size="small" type="primary" onClick={this.onRefreshClick} />
          <Button shape="circle" icon="minus" size="small" onClick={this.minimize} />
          <Button shape="circle" icon="logout" type="danger" size="small" onClick={() => sendEvent('quit')} />
        </div>
      </div>
    );
  }
}
