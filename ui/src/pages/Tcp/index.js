import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Card, Button, Form, Row, Col, Input, Icon, message } from 'antd';

import adb from '../../lib/adb';
import _ from '../../lib/utils';

const FormItem = Form.Item;

@inject(({ store }) => store.devices)
@observer
export default class Tcp extends React.Component {
  @observable logPath = '/data/local';
  @observable tcpParams = '-p -s 0 -w';
  @observable exportPath = './tcplog';
  @observable running = false;
  @observable process = null;
  fileName = '';

  clear = (err) => {
    this.running = false;
    this.process = null;
    err && message.error(`${err}`);
  }

  stop = async () => {
    try {
      if (!this.running || !this.process) {
        return;
      }
      this.process.stdin && this.process.stdin.end();
      const dir = _.mkdir(this.exportPath);
      const file = `${dir}/${this.fileName}`;
      await adb.pullFile(this.props.devices, `${this.logPath}/${this.fileName}`, file);
      message.success(`日志已导出到${file}`);
    } catch (e) {
      console.error(e);
      message.error(e.message);
    } finally {
      this.clear();
    }
  }

  onStartClick = async () => {
    try {
      this.running = true;
      this.fileName = `tcpdump_${+new Date()}.cap`
      this.process = adb.continueExecute(
        ['shell', `cd ${this.logPath} && tcpdump ${this.tcpParams} ${this.fileName}`],
        this.props.devices,
        this.clear,
        data => message.info(data),
        this.clear
      );
    } catch (e) {
      console.error(e);
      message.error(e.message);
      this.clear();
    }
  };

  onClearClick = async () => {
    try {
      await adb.exec(this.props.device, `shell rm ${this.logPath}/tcpdump_*.cap`);
      message.success('清理完成');
    } catch (e) {
      console.error(e);
      message.error(e.message);
    }
  };

  render() {
    return (
      <Card type="inner">
        <Form>
          <Row gutter={20}>
            <Col span={6}>
              <FormItem label="手机临时存储路径">
                <Input prefix={<Icon type="mobile" />} value={this.logPath} placeholder="请输入手机上的临时保存路径"
                      onChange={e => this.logPath = e.target.value} />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="tcpdump 参数">
                <Input prefix={<Icon type="form" />} value={this.tcpParams} placeholder="请输入tcpdump参数"
                      onChange={e => this.tcpParams = e.target.value} />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="导出路径">
                <Input prefix={<Icon type="snippets" />} value={this.exportPath} placeholder="请输入导出到电脑上的路径"
                      onChange={e => this.exportPath = e.target.value} />
              </FormItem>
            </Col>
            <Col span={24}>
              {
                this.running
                  ? <Button type="primary" onClick={this.stop}>停止</Button>
                  : <Button type="primary" onClick={this.onStartClick}>开始</Button>
              }
              { !this.running && <Button className="f-ml10" onClick={this.onClearClick}>清理临时文件</Button> }
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}
