import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Button, Form, Input, Icon, Modal } from 'antd';

import adb from '../../../../lib/adb';

@inject(({ store }) => store.devices)
@observer
export default class Dir extends React.Component {
  @observable dirPath = '/sdcard/download';

  onSubmitClick = async () => {
    const res = await adb.exec(this.props.device, `shell ls -la ${this.dirPath}`);
    Modal.info({
      title: this.dirPath,
      content: (<pre><code>{res}</code></pre>),
      width: 1000,
      okText: '关闭'
    })
  };

  render() {
    return (
      <div>
        <Input
          prefix={<Icon type="mobile" />} value={this.dirPath} placeholder="请输入要查询的文件夹路径"
          addonAfter={<Button type="link" size="small" onClick={this.onSubmitClick}>查询</Button>}
          onChange={e => this.dirPath = e.target.value}
        />
      </div>
    );
  }
}
