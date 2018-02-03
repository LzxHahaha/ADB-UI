import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Modal, Card, Row, Col, Form, Select, Tag } from 'antd';

import NewFilterModal from './modals/NewFilterModal';

import { startLog } from '../../ipc/logcat';
import { exportFile } from '../../ipc/system';

import styles from './index.css';

const FormItem = Form.Item;
const Option = Select.Option;

const logFormatSource = ['brief', 'process', 'tag', 'raw', 'time', 'threadtime', 'long'];
const levels = {
  'V': { color: '#aaa', level: 1 },
  'D': { color: '#808cff', level: 2 },
  'I': { color: '#2db7f5', level: 3 },
  'W': { color: '#faad14', level: 4 },
  'E': { color: '#ffa39e', level: 5 },
  'F': { color: '#f5222d', level: 6 },
  'S': { color: '#2b2b2b', level: 7 },
};

@observer
export default class Logcat extends React.Component {
  @observable format = logFormatSource[0];
  @observable filterModalVisible = false;
  @observable filters = [];

  @observable logging = false;
  @observable log = '';
  logClient = null;

  componentWillUnmount() {
    if (this.logClient) {
      this.logClient.disconnect();
    }
  }

  onStartClick = () => {
    if (this.logging) {
      return;
    }
    this.logging = true;
    if (!this.logClient) {
      this.logClient = startLog({
        device: this.props.device,
        format: this.format,
        filters: this.filters.map(el => el)
      });
    }

    // let timer = null;
    this.logClient.on('log', (data) => {
      this.log += data;
      // if (timer) {
      //   clearTimeout(timer);
      // }
      // timer = setTimeout(() => {
      //   TODO: scroll to bottom
      //   clearTimeout(timer);
      //   timer = null;
      // }, 100);
    });
    this.logClient.on('close', () => this.onStopClick());

    this.logClient.start();
  };

  onStopClick = () => {
    if (!this.logging) {
      return;
    }
    this.logClient.disconnect();
    this.logClient = null;
    this.logging = false;
    if (this.log) {
      this.log += '\n================================\n\n';
    }
  };

  onExportClick = () => {
    const filePath = exportFile(this.log, `adb_log_${+new Date()}.log`);
    Modal.success({ title: '导出成功', content: `日志已保存到${filePath}` });
  };

  onFilterAdd = (data) => {
    const item = this.filters.find(el => el.tag === data.tag);
    if (item) {
      const itemLevel = levels[item.level].level;
      const newLevel = levels[data.level].level;
      if (newLevel < itemLevel) {
        item.level = data.level;
      }
    } else {
      this.filters.push(data);
    }
    this.filterModalVisible = false;
  };

  render() {
    return (
      <div className={styles.container}>
        <div className="f-mb10">
          <Card title="过滤条件" type="inner">
            <Form>
              <Row gutter={20}>
                <Col xl={6} lg={8} md={10} sm={12} xs={24}>
                  <FormItem label="日志格式">
                    <Select value={this.format} onChange={v => this.format = v}>
                      {logFormatSource.map(el => <Option key={el} value={el}>{el}</Option>)}
                    </Select>
                  </FormItem>
                </Col>
                <Col xl={18} lg={16} md={14} sm={12} xs={24}>
                  <FormItem label="过滤条件">
                    <Button icon="plus" size="small" className="f-mr10" onClick={() => this.filterModalVisible = true} />
                    {
                      this.filters.map((el, index) => (
                        <Tag key={`${el.tag}:${el.level}_${index}`} closable color={levels[el.level].color}
                             onClose={() => this.filters.splice(index, 1)}>
                          {el.tag}:{el.level}
                        </Tag>
                      ))
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  {
                    this.logging
                      ? <Button type="primary" onClick={this.onStopClick}>停止捕获</Button>
                      : <Button type="primary" onClick={this.onStartClick}>开始捕获</Button>
                  }

                  <Button className="f-ml10" onClick={() => this.log = ''}>清空日志</Button>
                  <Button className="f-ml10" onClick={this.onExportClick}>导出当前日志</Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        <div className={styles.loggerContainer}>
          <pre className={styles.logger}>
            {this.log || '无日志'}
          </pre>
        </div>
        <NewFilterModal visible={this.filterModalVisible} onOk={this.onFilterAdd} onCancel={() => this.filterModalVisible = false} />
      </div>
    );
  }
}
