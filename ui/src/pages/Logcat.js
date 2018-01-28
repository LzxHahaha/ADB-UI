import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Modal } from 'antd';

import { startLog, stopLog } from '../ipc/logcat';
import { exportFile } from '../ipc/system';

import styles from './Logcat.css';

@observer
export default class Logcat extends React.Component {
  @observable logging = false;
  @observable log = '';
  loggerId = null;

  onStartClick = () => {
    this.logging = true;
    const { id, emitter } = startLog(this.props.device);
    this.loggerId = id;
    emitter.addListener('log', (data) => this.log += data);
  };

  onStopClick = () => {
    stopLog(this.loggerId);
    this.loggerId = null;
    this.logging = false;
  };

  onExportClick = () => {
    const filePath = exportFile(this.log, `adb_log_${+new Date()}.log`);
    Modal.success({ title: '导出成功', content: `日志已保存到${filePath}` });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className="f-mb10">
          {
            this.logging
              ? <Button type="primary" onClick={this.onStopClick}>停止捕获</Button>
              : <Button type="primary" onClick={this.onStartClick}>开始捕获</Button>
          }

          <Button className="f-ml10" onClick={() => this.log = ''}>清空日志</Button>
          <Button className="f-ml10" onClick={this.onExportClick}>导出</Button>
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
