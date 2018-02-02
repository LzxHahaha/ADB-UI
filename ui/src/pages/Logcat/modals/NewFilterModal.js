import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

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
  static propTypes = {
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func
  };

  @observable tag = '*';
  @observable level = levelSource[0].value;

  onOk = () => {
    this.props.onOk && this.props.onOk({
      tag: this.tag,
      level: this.level
    });
  };

  onCancel = () => {
    this.props.onCancel && this.props.onCancel();
  };

  afterClose = () => {
    this.tag = '*';
    this.level = levelSource[0].value;
  };

  render() {
    return (
      <Modal title="新增过滤条件" okText="添加" cancelText="取消" visible={this.props.visible}
             onOk={this.onOk} onCancel={this.onCancel} afterClose={this.afterClose}>
        <Form>
          <FormItem label="Tag">
            <Input value={this.tag} onChange={e => this.tag = e.target.value} />
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
