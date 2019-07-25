import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Card, Form, Row, Col, Icon, Button, Input, Modal, message } from 'antd';

import adb from '../../lib/adb';

const FormItem = Form.Item;

@inject(({ store }) => store.devices)
@observer
export default class Install extends React.Component {
  @observable shouldStop = false;
  @observable running = false;
  @observable apkPath = '';
  @observable packageName = '';
  @observable times = '1';
  @observable runningStatus = '';
  @observable runningTimes = 0;
  @observable totalTimes = 0;

  async mission(times, apkPath, packageName) {
    if (this.shouldStop || times <= 0) {
      message.success(`执行完成，共执行${this.runningTimes}次`);
      this.stop();
      return;
    }
    try {
      this.runningTimes += 1;
      this.runningStatus = '安装中';
      const install = await adb.exec(this.props.device, `install ${apkPath}`);
      if (install !== 'Success') {
        throw new Error(`安装失败: ${install}`);
      }
      this.runningStatus = '卸载中';
      const uninstall = await adb.exec(this.props.device, `uninstall ${packageName}`);
      if (uninstall !== 'Success') {
        throw new Error(`卸载失败: ${uninstall}`);
      }
      this.mission(times - 1, apkPath, packageName);
    } catch(e) {
      console.log(e);
      Modal.error({
        title: '执行失败',
        content: e.message
      });
      this.stop();
    }
  }

  stop() {
    this.shouldStop = false;
    this.running = false;
    this.runningTimes = 0;
    this.totalTimes = 0;
  }

  onStartClick = () => {
    this.running = true;
    const times = +this.times || 1;
    this.runningTimes = 0;
    this.totalTimes = times;
    this.runningStatus = '执行中';
    this.mission(times, this.apkPath, this.packageName);
  };

  onStopClick = () => {
    this.shouldStop = true;
    message.info('将在本轮任务执行完成后停止');
  };

  render() {
    return (
      <div>
        <Card>
          <Form>
            <Row gutter={20}>
              <Col span={8}>
                <FormItem label="安装包路径">
                  <Input prefix={<Icon type="folder" />} value={this.apkPath} placeholder="请输入电脑上的安装包绝对路径"
                         onChange={e => this.apkPath = e.target.value} />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="包名">
                  <Input prefix={<Icon type="android" />} value={this.packageName} placeholder="请输入包名"
                         onChange={e => this.packageName = e.target.value} />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="重复次数">
                  <Input prefix={<Icon type="clock-circle-o" />} value={this.times} placeholder="请输入重复次数"
                         onChange={e => this.times = e.target.value} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                {
                  this.running
                    ? (<Button type="primary" disabled={this.shouldStop} onClick={this.onStopClick}>{this.shouldStop ? '正在停止' : '停止'}</Button>)
                    : (<Button type="primary" onClick={this.onStartClick}>开始</Button>)
                }
                {
                  this.running && (
                    <span>&emsp;<Icon type="loading" />&emsp;{this.runningStatus}&emsp;{this.runningTimes}/{this.totalTimes}</span>
                  )
                }
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
}
