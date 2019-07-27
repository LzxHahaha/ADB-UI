import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Row, Col, Card, Radio, Button, Input, Icon, Form, Alert, Modal, Tooltip, message } from 'antd';

import adb from '../../lib/adb';
import { exportFile, openFolder } from '../../lib/system/file';
import _ from '../../lib/utils';

import styles from './index.css';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;

const recordWay = [
  { key: 'screenCap', label: '屏幕截图' },
  { key: 'screenRecord', label: '屏幕录像' },
  // { key: 'eventListener', label: '事件监听' }
];

@observer
export default class Recorder extends React.Component {
  @observable recordWay = recordWay[0].key;
  @observable capPath = _.getAbsolutePath('./capture');
  @observable capImages = [];

  @observable recordPhonePath = '/data';
  @observable recordPath = _.getAbsolutePath('./record');
  @observable recordTime = 180;
  @observable recording = false;

  @observable logging = false;
  @observable log = '';

  recordClient = null;
  eventClient = null;
  latestCap = '';
  latestVideo = '';

  onCaptureClick = async () => {
    try {
      this.latestCap = `screencap_${+new Date()}.png`;
      const file = await adb.screenCapture(this.props.device, this.capPath, this.latestCap);
      this.capImages.push(file);
    } catch (e) {
      console.error(e);
      message.error(e.message);
    }
  };

  onRecordTimeChange = e => {
    let value = +e.target.value || this.recordTime;
    value = Math.min(value, 180);
    value = Math.max(0, value);
    this.recordTime = value;
  };

  onRecordClick = () => {
    if (this.recording) {
      return;
    }
    this.recording = true;
    this.latestVideo = `record_${+new Date()}.mp4`;
    this.recordClient = adb.screenRecord({
      device: this.props.device,
      phonePath: this.recordPhonePath,
      path: this.recordPath,
      filename: this.latestVideo,
      time: this.recordTime
    });
    this.recordClient.on('exception', err => {
      const msg = err.message || err;
      message.error(msg);
      this.onStopRecordClick();
    });
    this.recordClient.on('close', () => this.onStopRecordClick());

    this.recordClient.start();
  };

  onStopRecordClick = () => {
    if (!this.recording) {
      return;
    }
    try {
      this.recordClient.break();
    } catch (e) {
      console.error(e);
    } finally {
      this.recordClient = null;
      this.recording = false;
    }
  };

  onShowRecordClick = () => {
    openFolder(`${this.recordPath}/${this.latestVideo}`);
  };

  onExportEventClick = () => {
    const filePath = exportFile(this.log, `adb_events_${+new Date()}.log`);
    Modal.success({ title: '导出成功', content: `记录已保存到${filePath}` });
  };

  // onStartClick = () => {
  // };

  // onStopClick = () => {
  // };

  renderScreenCap() {
    return (
      <Form>
        <Row gutter={20}>
          <Col span={6}>
            <FormItem label="截图保存文件夹">
              <Input prefix={<Icon type="folder" />} value={this.capPath} placeholder="请输入保存路径"
                    onChange={e => this.capPath = e.target.value} />
            </FormItem>
          </Col>
          <Col span={24}>
            <Button type="primary" icon="camera" onClick={this.onCaptureClick}>截图</Button>
          </Col>
        </Row>
        <div className={styles.capContainer}>
          {
            this.capImages.length ? this.capImages.map(el => (
              <Tooltip placement="top" title="在文件夹中查看" key={el}>
                <div className={styles.capPreview}>
                  <img src={`file://${el}`} alt={el} className={styles.capImage} onClick={() => openFolder(el)} />
                  <span className={styles.capTitle}>{el.split(/[\\/]/g).pop()}</span>
                </div>
              </Tooltip>
            )) : null
          }
        </div>
      </Form>
    );
  }

  renderScreenRecord() {
    return (
      <Form>
        <Alert
          message="视频录像需要Android 4.1.1 以上，且部分设备或虚拟机可能不支持"
          type="warning"
          closable
        />
        <Row gutter={20}>
          <Col span={6}>
            <FormItem label="手机临时存储路径">
              <Input prefix={<Icon type="mobile" />} value={this.recordPhonePath} placeholder="请输入手机上的临时保存路径"
                     onChange={e => this.recordPhonePath = e.target.value} />
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
          <Col span={24}>
            {
              this.recording
                ? (<Button type="primary" icon="camera" onClick={this.onStopRecordClick}>停止录制</Button>)
                : (<Button type="primary" icon="camera" onClick={this.onRecordClick}>开始录制</Button>)
            }
            <Button className="f-ml10" onClick={this.onShowRecordClick}>查看录像</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  // renderEventCap() {
  //   return (
  //     <div>
  //       {
  //         this.logging
  //           ? <Button type="primary" onClick={this.onStopClick}>停止捕获</Button>
  //           : <Button type="primary" onClick={this.onStartClick}>开始捕获</Button>
  //       }
  //       <Button className="f-ml10" onClick={() => this.log = ''}>清空记录</Button>
  //       <Button className="f-ml10" onClick={this.onExportEventClick}>导出</Button>
  //     </div>
  //   );
  // }

  renderContent() {
    switch (this.recordWay) {
      case 'screenCap':
        return this.renderScreenCap();
      case 'screenRecord':
        return this.renderScreenRecord();
      // case 'eventListener':
      //   return this.renderEventCap();
      default:
        return null;
    }
  }

  render() {
    return (
      <div>
        <Card type="inner">
          <RadioGroup value={this.recordWay} onChange={e => this.recordWay = e.target.value}>
            {recordWay.map(el => <RadioButton value={el.key} key={el.key}>{el.label}</RadioButton>)}
          </RadioGroup>

          <div className="f-mt10">
            {this.renderContent()}
          </div>
        </Card>
      </div>
    );
  }
}
