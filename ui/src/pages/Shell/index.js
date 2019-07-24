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
  @observable shell = '';
  @observable log = '';

  addLog = (value) => {
    this.log += value;
    this.codeView.scrollTop = this.codeView.scrollHeight;
  };

  submit = async () => {
    const shell = this.shell.trim();
    if (!shell) {
      return;
    }
    this.shell = '';
    const prefix = this.childProcess ? '' : `adb -s ${this.props.device} `;
    this.addLog(`\n$ ${prefix}${shell}\n`);

    if (shell === '^C') {
      this.childProcess && this.childProcess.end();
      return;
    }

    if (this.childProcess) {
      this.childProcess && this.childProcess.write(shell);
    } else {
      this.childProcess = await adb.continueExecute(
        shell, this.props.device,
        (err) => {
          message.error(err.message);
          this.childProcess = null;
        },
        this.addLog,
        () => this.childProcess = null
      );
    }
  };

  onShellChange = e => this.shell = e.target.value;

  render() {
    return (
      <div className={styles.container}>
        <div className="f-mb10">
          <Card>
            <Input value={this.shell} allowClear placeholder="请输入命令，按回车提交"
                   addonBefore={`$ adb -s ${this.props.device} `}
                   addonAfter={<Button type="link" size="small" onClick={this.submit}>发送</Button>}
                   onChange={this.onShellChange} onPressEnter={this.submit}
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
