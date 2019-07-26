import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Card, Button, Collapse } from 'antd';

import withRouter from '../../decorators/withRouter';

import Info from './components/Info';
import Dir from './components/Dir';
import File from './components/File';

const Panel = Collapse.Panel;

@withRouter
@inject(({ store }) => store.devices)
@observer
export default class Home extends React.Component {
  @observable current = '';
  buttons = [
    { key: 'logcat', text: '日志捕获' },
    { key: 'recorder', text: '步骤录制' },
    { key: 'shell', text: '命令输入' },
    { key: 'tcp', text: '网络抓包' },
  ];

  componentWillMount() {
    this.current = this.props.match.params.device;
    document.title = this.current;
  }

  openTab(key, tabName) {
    this.props.rootStore.tab.push({
      key,
      tab: tabName,
      props: {
        device: this.current
      }
    });
  }

  render() {
    const buttonDisabled = !this.current;

    return (
      <div>
        <Card title={this.current} type="inner">
          {
            this.buttons.map((el, index) => (
              <Button key={el.key} className={index ? 'f-ml10' : ''} onClick={() => this.openTab(el.key, el.text)} disabled={buttonDisabled}>
                {el.text}
              </Button>
            ))
          }
        </Card>
        <div className="f-mb10" />
        <Collapse defaultActiveKey={['info']}>
          <Panel header="设备信息" key="info">
            <Info />
          </Panel>
          <Panel header="查看文件夹" key="dir">
            <Dir />
          </Panel>
          <Panel header="文件传输" key="pull">
            <File />
          </Panel>
        </Collapse>
      </div>
    );
  }
}
