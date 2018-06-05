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
}