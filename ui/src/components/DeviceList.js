import React from 'react';
import { inject } from 'mobx-react';
import { Button, Message } from 'element-react';

import styles from './DeviceList.css';

@inject(({ store }) => store.devicesStore)
export default class DeviceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onRefreshClick = () => {
    this.props.rootStore.devicesStore.getDevices();
    Message.success('刷新成功');
  };

  render() {
    return (
      <div className={styles.listContainer}>
        <div className={styles.title}>
          <span className="f-mr10">设备列表</span>
          <Button size="small" onClick={this.onRefreshClick}>刷新</Button>
        </div>
        {
          this.props.list.length
            ? this.props.list.map(el => <div className={styles.listItem}>{el.serialNumber}</div>)
            : <div className={styles.listItem}>暂无设备</div>
        }
      </div>
    );
  }
}
