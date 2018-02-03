import React from 'react';
import { Modal, Button } from 'antd';

import styles from './InfoModal.css';

export default class InfoModal extends React.Component {
  refresh = () => {
    this.props.onRefresh && this.props.onRefresh();
  };

  render() {
    return (
      <Modal {...this.props} footer={[
        this.props.onRefresh ? <Button onClick={this.props.onRefresh}>刷新</Button> : null,
        <Button type="primary" onClick={this.props.onClose}>关闭</Button>
      ]}>
        <pre className={styles.info}>
          {this.props.info || '加载中...'}
        </pre>
      </Modal>
    );
  }
}
