import React from 'react';
import { Modal, Form, Select } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { getAppList } from '../../../ipc/shell';

const FormItem = Form.Item;
const Option = Select.Option;

const levelSource = [
  { label: 'Verbose', value: 'V' },
  { label: 'Debug', value: 'D' },
  { label: 'Info', value: 'I' },
  { label: 'Warning', value: 'W' },
  { label: 'Error', value: 'E' },
  { label: 'Fatal', value: 'F' },
  { label: 'Silent', value: 'S' }
];

@observer
export default class NewFilterModal extends React.Component {
  @observable tag = [];
  @observable level = levelSource[0].value;
  @observable apps = [];

  componentWillMount() {
    this.refreshAppSource();
  }

  refreshAppSource = async (name = '') => {
    this.apps = ['*'].concat(await getAppList(this.props.device, name) || []);
  };

  onOk = () => {
    this.props.onOk && this.props.onOk({
      tags: this.tag,
      level: this.level
    });
  };

  onAppNameChange = async (value) => {
    this.tag = value;
  };

  render() {
    return (
      <Modal title="新增过滤条件" okText="添加" cancelText="取消" visible={this.props.visible}
             onOk={this.onOk} onCancel={this.props.onCancel} afterClose={this.afterClose} destroyOnClose>
        <Form>
          <FormItem label="Tag">
            <Select mode="multiple" onChange={this.onAppNameChange} showArrow>
              {this.apps.map(el => <Option key={el} value={el}>{el}</Option>)}
            </Select>
          </FormItem>
          <FormItem label="级别">
            <Select value={this.level} onChange={v => this.level = v}>
              {levelSource.map(el => <Option key={el.value} value={el.value}>{el.label}</Option>)}
            </Select>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
