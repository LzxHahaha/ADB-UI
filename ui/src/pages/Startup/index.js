import React from 'react';
import { observer, inject } from 'mobx-react';
import { autorun } from 'mobx';
import { Button, List, message } from 'antd';
import { remote } from 'electron';

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

  onRefreshClick = async () => {
    await this.props.rootStore.devices.getDevices();
    message.success('刷新成功');
  };

  onDeviceClick(id) {
    const BrowserWindow = remote.BrowserWindow;
    let win = new BrowserWindow({
      title: 'ADB UI',
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
      <Button size="small" type="primary" onClick={this.onRefreshClick} shape="circle" icon="sync" />
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
          header={this.renderListHeader()}
          bordered
          dataSource={this.props.list}
          renderItem={this.renderListItem}
        />
      </div>
    );
  }
}
