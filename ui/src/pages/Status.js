import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Card, Button, message } from 'antd';

@observer
export default class Home extends React.Component {
  @observable current = null;

  componentWillMount() {

  }

  onRefreshClick = () => {
    message.success('刷新成功');
  };

  render() {
    return (
      <div>
        <Card title="设备状态" type="inner"
              extra={<Button size="small" type="primary" onClick={this.onRefreshClick} shape="circle" icon="sync" />}
        >

        </Card>
      </div>
    );
  }
}
