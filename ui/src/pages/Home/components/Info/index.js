import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Card, Button, Form, Row, Col, message } from 'antd';

import adb from '../../../../lib/adb';
import InfoModal from './modals/InfoModal';

@observer
export default class Info extends React.Component {
  @observable loading = true;
  @observable info = null;
  @observable cpuInfo = '';
  @observable memInfo = '';
  @observable cpuInfoVisible = false;
  @observable memInfoVisible = false;

  async componentWillMount() {
    setTimeout(this.getInfo, 200);
  }

  getInfo = async () => {
    try {
      this.loading = true;
      this.info = await adb.baseInfo(this.props.device);
    } finally {
      this.loading = false;
    }
  };

  showInfoModal = (key) => {
    const visibleKey = `${key}InfoVisible`;
    this[visibleKey] = true;
    setTimeout(async () => {
      try {
        await this.updateInfoModal(key);
      } catch (err) {
        message.error(err.message);
        this[visibleKey] = false;
      }
    }, 100);
  };

  updateInfoModal = async (key) => {
    let func;
    if (key === 'cpu') {
      func = adb.cpuInfo;
    } else if (key === 'mem') {
      func = adb.memoryInfo;
    } else {
      return;
    }
    this[`${key}Info`] = await func(this.props.device);
  };

  onInfoModalClose = (key) => {
    this[`${key}InfoVisible`] = false;
    setTimeout(() => this[`${key}Info`] = '', 0);
  };

  renderBaseInfo() {
    if (this.loading) {
      return <div>加载中...</div>
    }

    if (!this.info) {
      return null;
    }

    const info = this.info;
    return (
      <Form>
        <Row gutter={20} type="flex">
          <Col lg={4} md={8} sm={12} xs={24}>
            <Form.Item label="Android ID">
              {info.androidId}
            </Form.Item>
          </Col>
          <Col lg={4} md={8} sm={12} xs={24}>
            <Form.Item label="设备型号">
              {info.model}
            </Form.Item>
          </Col>
          <Col lg={4} md={8} sm={12} xs={24}>
            <Form.Item label="系统版本">
              {info.systemVersion}
            </Form.Item>
          </Col>
          <Col lg={4} md={8} sm={12} xs={24}>
            <Form.Item label="屏幕分辨率">
              {info.screenSize.physical}
              { !!info.screenSize.override && ` (当前${info.screenSize.override})` }
            </Form.Item>
          </Col>
          <Col lg={4} md={8} sm={12} xs={24}>
            <Form.Item label="屏幕密度">
              {info.screenDensity.physical}
              { !!info.screenDensity.override && ` (当前${info.screenDensity.override})` }
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  renderButtons() {
    if (!this.info) {
      return null;
    }

    return (
      <Row>
        <Col span={24}>
          <Button onClick={() => this.showInfoModal('cpu')}>CPU 信息</Button>
          <Button className="f-ml10" onClick={() => this.showInfoModal('mem')}>内存信息</Button>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <Card title="设备信息" type="inner"
            extra={<Button size="small" type="primary" onClick={this.onRefreshClick} shape="circle" icon="sync" disabled={this.loading} />}
      >
        {this.renderBaseInfo()}
        {this.renderButtons()}
        <InfoModal title="CPU 信息" visible={this.cpuInfoVisible} justOkText="关闭" info={this.cpuInfo} closable={false}
                   onRefresh={() => this.updateInfoModal('cpu')} onClose={() => this.onInfoModalClose('cpu')} />
        <InfoModal title="内存信息" visible={this.memInfoVisible} justOkText="关闭" info={this.memInfo} closable={false}
                   onRefresh={() => this.updateInfoModal('mem')} onClose={() => this.onInfoModalClose('mem')} />
      </Card>
    );
  }
}
