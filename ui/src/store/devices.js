import { observable, action } from 'mobx';

import { getDevices } from "../ipc/devices";

export default class DevicesStore {
  @observable list = [];

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  getDevices() {
    const list = getDevices();
    this.list = list;
    return list;
  }
}