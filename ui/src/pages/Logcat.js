import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Modal, Card } from 'antd';

import { startLog } from '../ipc/logcat';
import { exportFile } from '../ipc/system';

import styles from './Logcat.css';

@observer
export default class Logcat extends React.Component {
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
      this.logClient = startLog(this.props.device);
    }
    this.logClient.on('log', (data) => this.log += data);
    this.logClient.start();
  };

  onStopClick = () => {
    if (!this.logging) {
      return;
    }
    this.logClient.stop();
    this.logging = false;
    this.log += '\n\n================================\n\n'
  };

  onExportClick = () => {
    const filePath = exportFile(this.log, `adb_log_${+new Date()}.log`);
    Modal.success({ title: '导出成功', content: `日志已保存到${filePath}` });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className="f-mb10">
            <Card title="过滤条件" type="inner">
            {
              this.logging
                ? <Button type="primary" onClick={this.onStopClick}>停止捕获</Button>
                : <Button type="primary" onClick={this.onStartClick}>开始捕获</Button>
            }

            <Button className="f-ml10" onClick={() => this.log = ''}>清空日志</Button>
            <Button className="f-ml10" onClick={this.onExportClick}>导出</Button>
          </Card>
        </div>
        <div className={styles.logger}>
          <pre>
            {this.log || '无日志'}
          </pre>
        </div>
      </div>
    );
  }
}
