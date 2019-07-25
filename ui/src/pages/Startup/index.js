import React from 'react';
import { observer, inject } from 'mobx-react';
import { autorun, observable } from 'mobx';
import { Button, List, Modal, Input, message } from 'antd';
import { remote } from 'electron';

import { sendEvent } from '../../lib/ipc';

import styles from './index.css';

@inject(({ store }) => store.devices)
@observer
export default class Startup extends React.Component {
  locale = { emptyText: '未检测到设备连接' };
  @observable ipVisible = false;
  @observable ip = '';

  async componentWillMount() {
    autorun(() => {
      if (this.props.list.length === 0) {
        this.current = null;
      } else if (!this.current || !this.props.list.find(el => el.serialNumber === this.current)) {
        this.current = this.props.list[0].serialNumber;
      }
    });
    await this.getDevices(true);
  }

  minimize() {
    const window = remote.getCurrentWindow();
    window.minimize();
  }

  async getDevices(silent) {
    try {
      await this.props.rootStore.devices.getDevices();
      silent && message.success('设备列表已刷新');
    } catch (e) {
      console.error(e);
      message.error(e.message);
    }
  }

  onRefreshClick = async () => {
    this.getDevices();
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

  onDisconnectClick = async () => {
    try {
      await this.props.rootStore.devices.disconnect();
      throw new Error('test');
    } catch (e) {
      console.error(e);
      message.error(e.message);
    }
  };


  onNetClick = () => this.ipVisible = true;
  onIpOk = async () => {
    if (!/^\d{1,3}(\.\d{1,3}){3}(:\d+)?$/.test(this.ip)) {
      message.error('IP输入有误');
      return;
    }
    try {
      const ip = this.ip;
      await this.props.rootStore.devices.linkDevice(ip);
      this.onIpClose();
      this.onDeviceClick(ip);
    } catch (e) {
      message.error(e.message);
      console.error(e);
    }
  };
  onIpClose = () => {
    this.ip = '';
    this.ipVisible = false;
  };

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
    const hasWifiDevice = this.props.list.some(el => el.isWifi);

    return (
      <div className={styles.container}>
        <h1>ADB</h1>
        <List
          className={styles.list}
          bordered
          dataSource={this.props.list}
          locale={this.locale}
          renderItem={this.renderListItem}
        />
        <div className={styles.wifiButton}>
          <Button type="link" size="small" onClick={this.onNetClick}>Wi-Fi连接</Button>
          { hasWifiDevice && <Button type="link" size="small" onClick={this.onDisconnectClick}>断开Wi-Fi连接</Button>}
        </div>
        <div className={styles.buttons}>
          <Button shape="circle" icon="sync" size="small" type="primary" onClick={this.onRefreshClick} />
          <Button shape="circle" icon="minus" size="small" onClick={this.minimize} />
          <Button shape="circle" icon="logout" type="danger" size="small" onClick={() => sendEvent('quit')} />
        </div>

        <Modal className={styles.wifiModal} title="IP输入" visible={this.ipVisible} onOk={this.onIpOk} onCancel={this.onIpClose}>
          <Input value={this.ip} onChange={e => this.ip = e.target.value} />
        </Modal>
      </div>
    );
  }
}
