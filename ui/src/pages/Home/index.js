import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Card, Button } from 'antd';

import withRouter from '../../decorators/withRouter';

@withRouter
@inject(({ store }) => store.devices)
@observer
export default class Home extends React.Component {
  @observable current = '';

  componentWillMount() {
    this.current = this.props.match.params.device;
    document.title = this.current;
  }

  onStatusClick = () => {
    this.props.rootStore.tab.push({
      key: 'info',
      tab: `设备信息`,
      props: {
        device: this.current
      }
    });
  };

  onLogClick = () => {
    this.props.rootStore.tab.push({
      key: 'logcat',
      tab: `日志捕获`,
      props: {
        device: this.current
      }
    });
  };

  onRecordClick = () => {
    this.props.rootStore.tab.push({
      key: 'recorder',
      tab: `步骤录制`,
      props: {
        device: this.current
      }
    });
  };

  render() {
    return (
      <div>
        <Card title={this.current} type="inner">
          <Button onClick={this.onStatusClick} disabled={!this.current}>设备信息</Button>
          <Button onClick={this.onLogClick} className="f-ml10" disabled={!this.current}>日志捕获</Button>
          <Button onClick={this.onRecordClick} className="f-ml10" disabled={!this.current}>步骤录制</Button>
        </Card>
      </div>
    );
  }
}
