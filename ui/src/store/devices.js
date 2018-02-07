import { observable, action, runInAction } from 'mobx';

import { getDevices } from "../api/devices";

export default class DevicesStore {
  @observable list = [];

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  async getDevices() {
    const list = await getDevices();
    runInAction(() => this.list = list || []);
  }
}