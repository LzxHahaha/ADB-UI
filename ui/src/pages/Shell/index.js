import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Card, Button, Input, message } from 'antd';

import adb from '../../lib/adb';

import styles from './index.css';

@inject(({ store }) => store.devices)
@observer
export default class Shell extends React.Component {
  childProcess = null;
  @observable input = '';
  @observable log = '';

  addLog = (value) => {
    this.log += value;
    this.codeView.scrollTop = this.codeView.scrollHeight;
  };

  parseCmd(cmd) {
    const res = [];
    let tmp = '';
    let start = null;
    for (let i = 0; i < cmd.length; ++i) {
      if (start) {
        tmp += cmd[i];
        if (cmd[i] === start) {
          start = null;
          res.push(tmp);
          tmp = '';
        }
      } else if (cmd[i] === '"' || cmd[i] === '\'') {
        tmp += cmd[i];
        start = cmd[i];
      } else if (cmd[i] === '\\' && cmd[i + 1] === ' ') {
        tmp += ' ';
        i += 1;
      } else if (cmd[i] === ' ') {
        res.push(tmp);
        tmp = '';
      } else {
        tmp += cmd[i];
      }
    }
    tmp && res.push(tmp);

    return res;
  }

  submit = async () => {
    const input = this.input.trim();
    this.input = '';
    if (!input) {
      return;
    }
    if (input === 'shell') {
      message.warn('暂不支持直接进入shell，请使用shell + 具体指令');
      return;
    }

    this.addLog(`\n$ adb -s ${this.props.device} ${input}\n`);
    const cmd = this.parseCmd(input);

    await adb.continueExecute(
      cmd,
      this.props.device,
      (err) => message.error(err.message),
      this.addLog
    );
  };

  onInputChange = e => this.input = e.target.value;

  render() {
    return (
      <div className={styles.container}>
        <div className="f-mb10">
          <Card>
            <Input value={this.input} allowClear placeholder="请输入命令，按回车提交"
              addonBefore={`$ adb -s ${this.props.device} `}
              addonAfter={<Button type="link" size="small" onClick={this.submit}>发送</Button>}
              onChange={this.onInputChange} onPressEnter={this.submit}
            />
          </Card>
        </div>
        <div ref={r => this.codeView = r} className={styles.loggerContainer}>
          <pre className={styles.logger}>
            {this.log}
          </pre>
        </div>
      </div>
    );
  }
}
