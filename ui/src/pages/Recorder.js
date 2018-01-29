import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Row, Col, Card, Radio, Button, Input, Icon, Form } from 'antd'

import { screenCapture } from '../ipc/shell';
import { openFolder } from '../ipc/system';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;

const recordWay = [
  { key: 'screenCap', label: '屏幕截图' },
  { key: 'screenRecord', label: '屏幕录像' },
  { key: 'eventListener', label: '事件监听' }
];

@observer
export default class Recorder extends React.Component {
  @observable recordWay = recordWay[0].key;
  @observable capPath = './capture';

  @observable recordPhonePath = '/sdcard';
  @observable recordPath = './record';
  @observable recordTime = 180;
  @observable recording = false;

  onCaptureClick = () => {
    screenCapture(this.capPath, `screencap_${+new Date()}.png`);
  };

  onShowCaptureClick = () => {
    openFolder(this.capPath);
  };

  onRecordTimeChange = e => {
    let value = +e.target.value || this.recordTime;
    value = Math.min(value, 180);
    value = Math.max(0, value);
    this.recordTime = value;
  };

  onRecordClick = () => {};

  onShowRecordClick = () => {};

  renderContent() {
    switch (this.recordWay) {
      case 'screenCap':
        return (
          <Row gutter={10}>
            <Col span={6}>
              <Input prefix={<Icon type="folder" />} value={this.capPath} placeholder="请输入保存路径"
                     onChange={e => this.capPath = e.target.value} />
            </Col>
            <Col span={18}>
              <Button type="primary" icon="camera" onClick={this.onCaptureClick}>截图</Button>
              <Button className="f-ml10" onClick={this.onShowCaptureClick}>查看截图</Button>
            </Col>
          </Row>
        );
      case 'screenRecord':
        return (
          <Form layout="inline">
            <Row gutter={10}>
              <Col span={6}>
                <FormItem label="手机存储路径">
                  <Input prefix={<Icon type="mobile" />} value={this.recordPhonePath} placeholder="请输入手机上的保存路径"
                         onChange={e => this.recordPath = e.target.value} />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="电脑存储路径">
                  <Input prefix={<Icon type="folder" />} value={this.recordPath} placeholder="请输入保存路径"
                         onChange={e => this.recordPath = e.target.value} />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="录制时长">
                  <Input prefix={<Icon type="clock-circle-o" />} value={this.recordTime} placeholder="录制时长"
                         onChange={this.onRecordTimeChange} addonAfter="秒"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Button type="primary" icon="camera" onClick={this.onRecordClick}>开始录制</Button>
                <Button className="f-ml10" onClick={this.onShowRecordClick}>查看录像</Button>
              </Col>
            </Row>
          </Form>
        );
      case 'eventListener':
        return '~~~';
      default:
        return null;
    }
  }

  render() {
    return (
      <div>
        <div>
          <Card title="录制方式" type="inner">
            <RadioGroup value={this.recordWay} onChange={e => this.recordWay = e.target.value} disabled={this.recording}>
              {recordWay.map(el => <RadioButton value={el.key} key={el.key}>{el.label}</RadioButton>)}
            </RadioGroup>

            <div className="f-mt10">
              {this.renderContent()}
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
