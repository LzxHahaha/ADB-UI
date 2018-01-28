import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable, autorun } from 'mobx';
import { Card, Button, message, Radio } from 'antd';

@inject(({ store }) => store.devices)
@observer
export default class Home extends React.Component {
  @observable current = null;

  componentWillMount() {
    autorun(() => {
      if (this.props.list.length === 0) {
        this.current = null;
      } else if (!this.current || !this.props.list.find(el => el.serialNumber === this.current)) {
        this.current = this.props.list[0].serialNumber;
      }
    });
    this.props.rootStore.devices.getDevices();
  }

  onRefreshClick = async () => {
    await this.props.rootStore.devices.getDevices();
    message.success('刷新成功');
  };

  onDeviceChange = (e) => {
    this.current = e.target.value;
  };

  onLogClick = () => {
    this.props.rootStore.tab.push({
      key: 'logcat',
      tab: `logcat - ${this.current}`,
      props: {
        device: this.current
      }
    });
  };

  onRecordClick = () => {
    this.props.rootStore.tab.push({
      key: 'recorder',
      tab: `步骤录制 - ${this.current}`,
      props: {
        device: this.current
      }
    });
  };

  render() {
    return (
      <div>
        <Card title="设备列表" type="inner"
              extra={<Button size="small" type="primary" onClick={this.onRefreshClick} shape="circle" icon="sync" />}
        >
          {
            this.props.list.length
              ? (
                <Radio.Group value={this.current} onChange={this.onDeviceChange}>
                  {
                    this.props.list.map((el, index) => (
                      <Radio key={el.serialNumber} value={el.serialNumber}>
                        {el.serialNumber}
                      </Radio>
                    ))
                  }
                </Radio.Group>
              )
              : '暂无设备'
          }
        </Card>

        <div className="f-mb20" />

        <Card title="操作" type="inner">
          <Button onClick={this.onLogClick} disabled={!this.current}>日志捕获</Button>
          <Button onClick={this.onRecordClick} className="f-ml10" disabled={!this.current}>步骤录制</Button>
        </Card>
      </div>
    );
  }
}
