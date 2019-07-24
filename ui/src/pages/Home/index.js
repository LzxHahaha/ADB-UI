import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Card, Button } from 'antd';

import withRouter from '../../decorators/withRouter';

import Info from './components/Info';

@withRouter
@inject(({ store }) => store.devices)
@observer
export default class Home extends React.Component {
  @observable current = '';

  componentWillMount() {
    this.current = this.props.match.params.device;
    document.title = this.current;
  }

  openTab(key, tabName) {
    this.props.rootStore.tab.push({
      key,
      tab: tabName,
      props: {
        device: this.current
      }
    });
  }

  onLogClick = () => this.openTab('logcat', '日志捕获');

  onRecordClick = () => this.openTab('recorder', '步骤录制');

  onShellClick = () => this.openTab('shell', '命令输入');

  render() {
    const buttonDisabled = !this.current;

    return (
      <div>
        <Card title={this.current} type="inner">
          {/*<Button onClick={this.onStatusClick} disabled={!this.current}>设备信息</Button>*/}
          <Button onClick={this.onLogClick} disabled={buttonDisabled}>日志捕获</Button>
          <Button onClick={this.onRecordClick} className="f-ml10" disabled={buttonDisabled}>步骤录制</Button>
          <Button onClick={this.onShellClick} className="f-ml10" disabled={buttonDisabled}>命令输入</Button>
        </Card>
        <div className="f-mb10" />
        <Info />
      </div>
    );
  }
}
