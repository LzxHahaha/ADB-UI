import { observable, action, runInAction } from 'mobx';

import adb from "../lib/adb";

export default class DevicesStore {
  @observable list = [];

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  async getDevices() {
    const list = await adb.devices();
    runInAction(() => this.list = list || []);
  }

  @action
  async linkDevice(ip) {
    // const res = await adb.exec(null, `connect ${ip}`);
    runInAction(() => {
      this.list.push({
        serialNumber: ip,
        isWifi: true
      })
    });
  }

  @action
  async disconnect() {
    await adb.exec(null, 'disconnect');
    runInAction(() => {
      this.list = this.list.filter(el => !el.isWifi);
    });
  }
}