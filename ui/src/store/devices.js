import { observable, action } from 'mobx';
import { ipcRenderer } from 'electron';

export default class DevicesStore {
  @observable list = [];
  @observable current = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  getDevices() {
    this.list = ipcRenderer.sendSync('get-devices');
  }
}