import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Card, Button } from 'antd';

import { getDeviceInfo } from '../../ipc/devices';

@observer
export default class Info extends React.Component {
  onRefreshClick = async () => {
    const info = await getDeviceInfo(this.props.device);
  };

  render() {
    return (
      <div>
        <Card title="信息" type="inner"
              extra={<Button size="small" type="primary" onClick={this.onRefreshClick} shape="circle" icon="sync" />}
        >

        </Card>
      </div>
    );
  }
}
