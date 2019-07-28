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
    const res = await Promise.race([
      adb.exec(null, `connect ${ip}`)
    ]);
    this.getDevices();
    return !/^failed/.test(res);
  }

  @action
  async disconnect(ip) {
    await adb.exec(null, `disconnect ${ip}`);
    this.getDevices();
  }
}