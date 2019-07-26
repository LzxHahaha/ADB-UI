import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Button, Form, Row, Col, Input, Icon, Modal, message } from 'antd';

import adb from '../../../../lib/adb';

import styles from './index.css';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;

@inject(({ store }) => store.devices)
@observer
export default class File extends React.Component {
  @observable phoneDirPath = '';
  @observable pcDirPath = '';

  onPullClick = async () => {
    try {
      await adb.pullFile(this.props.devices, this.phoneDirPath, this.pcDirPath);
      message.success('导出成功');
    } catch (e) {
      console.error(e);
      message.error(e.message);
    }
  };

  onPushClick = async () => {
    try {
      await adb.pushFile(this.props.devices, this.pcDirPath, this.phoneDirPath);
      message.success('导入成功');
    } catch (e) {
      console.error(e);
      message.error(e.message);
    }
  };

  render() {
    const buttonDisabled = !(this.phoneDirPath || this.pcDirPath);

    return (
      <div>
        <Form layout="inline">
          <Row>
            <Col span={8}>
              <FormItem label="手机文件路径">
                  <Input
                    prefix={<Icon type="mobile" />} value={this.phoneDirPath} placeholder="请输入手机上的文件路径"
                    onChange={e => this.phoneDirPath = e.target.value}
                  />
              </FormItem>
            </Col>
            <Col span={8} className={styles.transBtn}>
              <ButtonGroup>
                <Button disabled={buttonDisabled} onClick={this.onPushClick}>
                <Icon type="double-left" />&nbsp;Push
                </Button>
                <Button disabled={buttonDisabled} onClick={this.onPullClick}>
                  Pull&nbsp;<Icon type="double-right" />
                </Button>
              </ButtonGroup>
            </Col>
            <Col span={8}>
              <FormItem label="电脑文件路径">
                  <Input
                    prefix={<Icon type="folder-open" />} value={this.pcDirPath} placeholder="请输入电脑上的文件路径"
                    onChange={e => this.pcDirPath = e.target.value}
                  />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
