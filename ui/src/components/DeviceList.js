import React from 'react';
import { inject } from 'mobx-react';
import { Button, Message, Radio } from 'element-react';

import styles from './DeviceList.css';

@inject(({ store }) => store.devicesStore)
export default class DeviceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.rootStore.devicesStore.getDevices();
  }

  onRefreshClick = () => {
    this.props.rootStore.devicesStore.getDevices();
    Message.success('刷新成功');
  };

  onDeviceChange = (index) => {
    this.props.rootStore.devicesStore.setCurrentDevice(index);
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
            ? this.props.list.map((el, index) => (
                <Radio className={styles.listItem} key={el.serialNumber} value={el.serialNumber}
                       checked={this.props.current === el.serialNumber} onChange={() => this.onDeviceChange(index)}
                >
                  {el.serialNumber}
                </Radio>
              ))
            : <div className={styles.listItem}>暂无设备</div>
        }
      </div>
    );
  }
}
